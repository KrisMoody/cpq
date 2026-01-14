import { usePrisma } from '../utils/prisma'
import { calculateQuoteTax, type TaxBreakdownItem } from './taxEngine'
import { lookupPrice, calculateTotalPrice, type PriceLookupResult } from './priceLookup'
import type { TierType } from '../../app/generated/prisma'

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
    },
  })

  if (!entry) {
    return null
  }

  const baseListPrice = Number(entry.listPrice)

  // Use the price lookup service to calculate tier-aware pricing
  const lookupResult = lookupPrice(entry, quantity)
  const totalPrice = calculateTotalPrice(entry, quantity)

  return {
    listPrice: baseListPrice,
    unitPrice: lookupResult.unitPrice,
    netPrice: totalPrice,
    tierApplied: lookupResult.tierApplied,
    tierInfo: lookupResult.tierInfo,
    cost: lookupResult.cost,
    margin: lookupResult.margin,
  }
}

/**
 * Calculate and update quote totals including tax
 *
 * Pricing Formula:
 * - subtotal = sum of all line item netPrices
 * - discountTotal = sum of all applied discounts (already reflected in line netPrices + quote-level)
 * - total = subtotal - quoteDiscount + taxAmount
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
  isTaxExempt: boolean
  exemptionExpired: boolean
}> {
  const prisma = usePrisma()
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      lineItems: true,
      appliedDiscounts: true,
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

  // Update quote
  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      subtotal,
      discountTotal,
      taxAmount: taxResult.taxAmount,
      taxBreakdown: taxResult.taxBreakdown as unknown as object,
      total,
    },
  })

  return {
    subtotal,
    discountTotal,
    taxAmount: taxResult.taxAmount,
    taxBreakdown: taxResult.taxBreakdown,
    total,
    isTaxExempt: taxResult.isTaxExempt,
    exemptionExpired: taxResult.exemptionExpired,
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
