import { usePrisma } from '../utils/prisma'
import { calculateQuoteTax, type TaxBreakdownItem } from './taxEngine'
import { lookupPrice, calculateTotalPrice } from './priceLookup'
import { convertToBaseCurrency } from './currencyService'
import type { TierType, BillingFrequency } from '../../app/generated/prisma/client'

/**
 * Result of line price calculation with tier information
 */
export interface LinePriceResult {
  /** Base list price per unit (before tier pricing) */
  listPrice: number
  /** Effective unit price (may differ from listPrice if tier applies) */
  unitPrice: number
  /** Total price for the quantity (unitPrice × quantity, or flat price for FLAT_PRICE tiers) */
  netPrice: number
  /** Whether a price tier was applied */
  tierApplied: boolean
  /** Details about the applied tier, if any */
  tierInfo?: {
    minQuantity: number
    maxQuantity: number | null
    tierPrice: number
    tierType: TierType
  }
  /** Product cost for margin calculations */
  cost?: number
  /** Calculated margin percentage */
  margin?: number
  /** Billing frequency from product */
  billingFrequency: BillingFrequency
  /** Whether this is a recurring charge */
  isRecurring: boolean
  /** Monthly amount for recurring items */
  monthlyAmount?: number
}

/**
 * Convert billing frequency to months for calculations
 */
export function billingFrequencyToMonths(frequency: BillingFrequency, customMonths?: number | null): number {
  switch (frequency) {
    case 'ONE_TIME':
      return 0
    case 'MONTHLY':
      return 1
    case 'QUARTERLY':
      return 3
    case 'ANNUAL':
      return 12
    case 'CUSTOM':
      return customMonths || 1
    default:
      return 0
  }
}

/**
 * Calculate Monthly Recurring Revenue from a price and billing frequency
 */
export function calculateMRR(price: number, frequency: BillingFrequency, customMonths?: number | null): number {
  const months = billingFrequencyToMonths(frequency, customMonths)
  if (months === 0) return 0
  return price / months
}

/**
 * Calculate pro-rated amount for a subscription starting mid-period
 */
export function calculateProration(
  fullPrice: number,
  frequency: BillingFrequency,
  startDate: Date,
  customMonths?: number | null
): { proratedAmount: number; daysRemaining: number; totalDays: number } {
  const billingMonths = billingFrequencyToMonths(frequency, customMonths)
  if (billingMonths === 0) {
    return { proratedAmount: fullPrice, daysRemaining: 0, totalDays: 0 }
  }

  // Calculate billing period end date
  const periodEnd = new Date(startDate)
  periodEnd.setMonth(periodEnd.getMonth() + billingMonths)

  // Calculate days in period and days remaining
  const totalDays = Math.ceil((periodEnd.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const now = new Date()
  const daysRemaining = Math.max(0, Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  const proratedAmount = (fullPrice / totalDays) * daysRemaining

  return { proratedAmount: Math.round(proratedAmount * 100) / 100, daysRemaining, totalDays }
}

/**
 * Look up the price for a product in a specific price book, considering quantity tiers
 *
 * Pricing Formula:
 * - If no tier applies: unitPrice = listPrice, netPrice = listPrice × quantity
 * - If UNIT_PRICE tier applies: unitPrice = tierPrice, netPrice = tierPrice × quantity
 * - If FLAT_PRICE tier applies: unitPrice = tierPrice / quantity, netPrice = tierPrice
 */
export async function calculateLinePrice(
  productId: string,
  quantity: number,
  priceBookId: string
): Promise<LinePriceResult | null> {
  const prisma = usePrisma()

  // Fetch entry with price tiers for tier-based pricing
  const entry = await prisma.priceBookEntry.findUnique({
    where: {
      priceBookId_productId: {
        priceBookId,
        productId,
      },
    },
    include: {
      priceTiers: {
        orderBy: { minQuantity: 'asc' },
      },
      product: {
        select: {
          billingFrequency: true,
          customBillingMonths: true,
        },
      },
    },
  })

  if (!entry) {
    return null
  }

  const baseListPrice = Number(entry.listPrice)
  const billingFrequency = entry.product.billingFrequency
  const isRecurring = billingFrequency !== 'ONE_TIME'

  // Use the price lookup service to calculate tier-aware pricing
  const lookupResult = lookupPrice(entry, quantity)
  const totalPrice = calculateTotalPrice(entry, quantity)

  // Calculate monthly amount for recurring items
  const monthlyAmount = isRecurring
    ? calculateMRR(totalPrice, billingFrequency, entry.product.customBillingMonths)
    : undefined

  return {
    listPrice: baseListPrice,
    unitPrice: lookupResult.unitPrice,
    netPrice: totalPrice,
    tierApplied: lookupResult.tierApplied,
    tierInfo: lookupResult.tierInfo,
    cost: lookupResult.cost,
    margin: lookupResult.margin,
    billingFrequency,
    isRecurring,
    monthlyAmount,
  }
}

/**
 * Calculate and update quote totals including tax and recurring metrics
 *
 * Pricing Formula:
 * - subtotal = sum of all line item netPrices
 * - discountTotal = sum of all applied discounts (already reflected in line netPrices + quote-level)
 * - total = subtotal - quoteDiscount + taxAmount
 * - oneTimeTotal = sum of one-time line items
 * - mrr = sum of monthly recurring revenue across all recurring items
 * - arr = mrr × 12
 * - tcv = sum of (mrr × termMonths) for each recurring item + oneTimeTotal
 *
 * Note: Line-level discounts are already deducted from each line's netPrice,
 * so we only need to apply quote-level discounts from discountTotal here.
 */
export async function calculateQuoteTotal(quoteId: string): Promise<{
  subtotal: number
  discountTotal: number
  taxAmount: number
  taxBreakdown: TaxBreakdownItem[]
  total: number
  baseAmount: number
  oneTimeTotal: number
  mrr: number
  arr: number
  tcv: number
  isTaxExempt: boolean
  exemptionExpired: boolean
  currencyCode?: string
}> {
  const prisma = usePrisma()
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      lineItems: {
        include: {
          product: {
            select: {
              billingFrequency: true,
              customBillingMonths: true,
              defaultTermMonths: true,
            },
          },
        },
      },
      appliedDiscounts: true,
      currency: {
        select: { id: true, code: true },
      },
    },
  })

  if (!quote) {
    throw new Error('Quote not found')
  }

  // Sum all line item net prices (line discounts already applied in netPrice)
  const subtotal = quote.lineItems.reduce(
    (sum, item) => sum + Number(item.netPrice),
    0
  )

  // Calculate one-time vs recurring totals
  let oneTimeTotal = 0
  let mrr = 0
  let tcv = 0

  for (const item of quote.lineItems) {
    const netPrice = Number(item.netPrice)
    const billingFrequency = item.product.billingFrequency
    const isRecurring = billingFrequency !== 'ONE_TIME'

    if (isRecurring) {
      // Calculate MRR for this item
      const itemMRR = calculateMRR(netPrice, billingFrequency, item.product.customBillingMonths)
      mrr += itemMRR

      // Use line item term or product default term
      const termMonths = item.termMonths ?? item.product.defaultTermMonths ?? 12
      tcv += itemMRR * termMonths
    } else {
      oneTimeTotal += netPrice
      tcv += netPrice // One-time items contribute to TCV directly
    }
  }

  const arr = mrr * 12

  // Calculate quote-level discount from applied discounts (those without lineItemId)
  const quoteDiscount = quote.appliedDiscounts
    .filter((d) => !d.lineItemId)
    .reduce((sum, d) => sum + Number(d.calculatedAmount), 0)

  // Calculate total discount (for display purposes)
  const discountTotal = quote.appliedDiscounts.reduce(
    (sum, d) => sum + Number(d.calculatedAmount),
    0
  )

  const subtotalAfterDiscount = subtotal - quoteDiscount

  // Calculate tax on the discounted subtotal
  const taxResult = await calculateQuoteTax(quoteId, subtotalAfterDiscount)

  // Grand total = subtotal - quote discount + tax
  const total = subtotalAfterDiscount + taxResult.taxAmount

  // Calculate base currency amount for reporting
  let baseAmount = total
  if (quote.currencyId) {
    baseAmount = await convertToBaseCurrency(total, quote.currencyId)
  }

  // Update quote with all totals including recurring metrics and base amount
  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      subtotal,
      discountTotal,
      taxAmount: taxResult.taxAmount,
      // ASSERTION: Prisma JSON fields require casting to InputJsonValue
      taxBreakdown: taxResult.taxBreakdown as unknown as object,
      total,
      baseAmount,
      oneTimeTotal,
      mrr,
      arr,
      tcv,
    },
  })

  return {
    subtotal,
    discountTotal,
    taxAmount: taxResult.taxAmount,
    taxBreakdown: taxResult.taxBreakdown,
    total,
    baseAmount,
    oneTimeTotal,
    mrr,
    arr,
    tcv,
    isTaxExempt: taxResult.isTaxExempt,
    exemptionExpired: taxResult.exemptionExpired,
    currencyCode: quote.currency?.code,
  }
}

/**
 * Get price for a product from the default price book
 */
export async function getDefaultPrice(productId: string): Promise<number | null> {
  const prisma = usePrisma()
  const defaultPriceBook = await prisma.priceBook.findFirst({
    where: { isDefault: true, isActive: true },
  })

  if (!defaultPriceBook) {
    return null
  }

  const entry = await prisma.priceBookEntry.findUnique({
    where: {
      priceBookId_productId: {
        priceBookId: defaultPriceBook.id,
        productId,
      },
    },
  })

  return entry ? Number(entry.listPrice) : null
}
