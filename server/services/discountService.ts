import type { Discount, DiscountTier, DiscountType } from '../../app/generated/prisma/client.js'

export interface DiscountWithTiers extends Discount {
  tiers: DiscountTier[]
}

export interface LineItemContext {
  id: string
  productId: string
  quantity: number
  listPrice: number
  discount: number
  netPrice: number
  categoryIds?: string[] // Product's category IDs for category-based discounts
}

export interface QuoteContext {
  subtotal: number
  customerId?: string
  lineItems: LineItemContext[]
}

export interface AppliedDiscountResult {
  discountId: string
  discountName: string
  lineItemId?: string
  type: DiscountType
  value: number
  calculatedAmount: number
  reason?: string
}

export interface DiscountCalculationResult {
  appliedDiscounts: AppliedDiscountResult[]
  totalDiscount: number
  lineItemDiscounts: Map<string, number>
}

/**
 * Check if a discount is applicable based on date validity
 */
function isDiscountValid(discount: Discount, now: Date = new Date()): boolean {
  if (!discount.isActive) return false
  if (discount.validFrom && discount.validFrom > now) return false
  if (discount.validTo && discount.validTo < now) return false
  return true
}

/**
 * Check if a discount applies based on quantity thresholds
 */
function meetsQuantityThreshold(discount: Discount, quantity: number): boolean {
  if (discount.minQuantity !== null && quantity < discount.minQuantity) return false
  if (discount.maxQuantity !== null && quantity > discount.maxQuantity) return false
  return true
}

/**
 * Check if a discount applies based on order value
 */
function meetsOrderValueThreshold(discount: Discount, orderValue: number): boolean {
  if (discount.minOrderValue !== null && orderValue < Number(discount.minOrderValue)) return false
  return true
}

/**
 * Check if a product belongs to a category (including parent categories)
 */
function productInCategory(productCategoryIds: string[], discountCategoryId: string | null): boolean {
  if (!discountCategoryId) return true // No category restriction
  if (!productCategoryIds || productCategoryIds.length === 0) return false
  return productCategoryIds.includes(discountCategoryId)
}

/**
 * Get the applicable tier value for a quantity
 */
function getTierValue(discount: DiscountWithTiers, quantity: number): number {
  if (!discount.tiers || discount.tiers.length === 0) {
    return Number(discount.value)
  }

  // Find the matching tier
  const applicableTier = discount.tiers.find((tier) => {
    if (quantity < tier.minQuantity) return false
    if (tier.maxQuantity !== null && quantity > tier.maxQuantity) return false
    return true
  })

  return applicableTier ? Number(applicableTier.value) : Number(discount.value)
}

/**
 * Calculate the discount amount for a given base and discount parameters
 */
function calculateDiscountAmount(
  baseAmount: number,
  discountType: DiscountType,
  discountValue: number
): number {
  if (discountType === 'PERCENTAGE') {
    return baseAmount * (discountValue / 100)
  }
  return Math.min(discountValue, baseAmount) // Don't discount more than the base amount
}

/**
 * Calculate all applicable discounts for a quote
 */
export function calculateDiscounts(
  discounts: DiscountWithTiers[],
  quote: QuoteContext,
  now: Date = new Date()
): DiscountCalculationResult {
  const result: DiscountCalculationResult = {
    appliedDiscounts: [],
    totalDiscount: 0,
    lineItemDiscounts: new Map(),
  }

  // Filter to valid discounts
  const validDiscounts = discounts.filter((d) => isDiscountValid(d, now))

  // Separate stackable and non-stackable discounts
  const stackableDiscounts = validDiscounts.filter((d) => d.stackable)
  const nonStackableDiscounts = validDiscounts.filter((d) => !d.stackable)

  // Sort by priority (lower first)
  stackableDiscounts.sort((a, b) => a.priority - b.priority)
  nonStackableDiscounts.sort((a, b) => a.priority - b.priority)

  // Track best non-stackable discount per scope
  const _bestNonStackableQuote: AppliedDiscountResult | null = null
  const bestNonStackableLine = new Map<string, AppliedDiscountResult>()

  // Process LINE_ITEM and PRODUCT_CATEGORY scope discounts
  for (const lineItem of quote.lineItems) {
    const lineTotal = lineItem.listPrice * lineItem.quantity
    let lineDiscountTotal = 0

    // Process stackable line item discounts (LINE_ITEM and PRODUCT_CATEGORY)
    for (const discount of stackableDiscounts) {
      if (discount.scope !== 'LINE_ITEM' && discount.scope !== 'PRODUCT_CATEGORY') continue
      if (!meetsQuantityThreshold(discount, lineItem.quantity)) continue

      // For PRODUCT_CATEGORY scope, check if product is in the category
      if (discount.scope === 'PRODUCT_CATEGORY') {
        if (!productInCategory(lineItem.categoryIds || [], discount.categoryId)) continue
      }

      const discountValue = getTierValue(discount, lineItem.quantity)
      const discountAmount = calculateDiscountAmount(lineTotal - lineDiscountTotal, discount.type, discountValue)

      if (discountAmount > 0) {
        result.appliedDiscounts.push({
          discountId: discount.id,
          discountName: discount.name,
          lineItemId: lineItem.id,
          type: discount.type,
          value: discountValue,
          calculatedAmount: discountAmount,
          reason: discount.scope === 'PRODUCT_CATEGORY' ? `Category discount` : undefined,
        })
        lineDiscountTotal += discountAmount
      }
    }

    // Find best non-stackable line item discount (LINE_ITEM and PRODUCT_CATEGORY)
    for (const discount of nonStackableDiscounts) {
      if (discount.scope !== 'LINE_ITEM' && discount.scope !== 'PRODUCT_CATEGORY') continue
      if (!meetsQuantityThreshold(discount, lineItem.quantity)) continue

      // For PRODUCT_CATEGORY scope, check if product is in the category
      if (discount.scope === 'PRODUCT_CATEGORY') {
        if (!productInCategory(lineItem.categoryIds || [], discount.categoryId)) continue
      }

      const discountValue = getTierValue(discount, lineItem.quantity)
      const discountAmount = calculateDiscountAmount(lineTotal, discount.type, discountValue)

      const existing = bestNonStackableLine.get(lineItem.id)
      if (!existing || discountAmount > existing.calculatedAmount) {
        bestNonStackableLine.set(lineItem.id, {
          discountId: discount.id,
          discountName: discount.name,
          lineItemId: lineItem.id,
          type: discount.type,
          value: discountValue,
          calculatedAmount: discountAmount,
        })
      }
    }

    // Apply best non-stackable if better than stackable total
    const bestNonStackable = bestNonStackableLine.get(lineItem.id)
    if (bestNonStackable) {
      // For non-stackable, we take the better of (stackable total) or (best non-stackable)
      if (bestNonStackable.calculatedAmount > lineDiscountTotal) {
        // Remove stackable discounts for this line and use non-stackable
        result.appliedDiscounts = result.appliedDiscounts.filter(
          (d) => d.lineItemId !== lineItem.id
        )
        result.appliedDiscounts.push(bestNonStackable)
        lineDiscountTotal = bestNonStackable.calculatedAmount
      }
    }

    result.lineItemDiscounts.set(lineItem.id, lineDiscountTotal)
    result.totalDiscount += lineDiscountTotal
  }

  // Process QUOTE scope discounts
  let remainingSubtotal = quote.subtotal - result.totalDiscount

  // Stackable quote discounts
  for (const discount of stackableDiscounts) {
    if (discount.scope !== 'QUOTE') continue
    if (!meetsOrderValueThreshold(discount, quote.subtotal)) continue

    const discountValue = Number(discount.value)
    const discountAmount = calculateDiscountAmount(remainingSubtotal, discount.type, discountValue)

    if (discountAmount > 0) {
      result.appliedDiscounts.push({
        discountId: discount.id,
        discountName: discount.name,
        type: discount.type,
        value: discountValue,
        calculatedAmount: discountAmount,
      })
      remainingSubtotal -= discountAmount
      result.totalDiscount += discountAmount
    }
  }

  // Best non-stackable quote discount
  let bestQuoteDiscount: AppliedDiscountResult | null = null
  for (const discount of nonStackableDiscounts) {
    if (discount.scope !== 'QUOTE') continue
    if (!meetsOrderValueThreshold(discount, quote.subtotal)) continue

    const discountValue = Number(discount.value)
    const discountAmount = calculateDiscountAmount(quote.subtotal, discount.type, discountValue)

    if (!bestQuoteDiscount || discountAmount > bestQuoteDiscount.calculatedAmount) {
      bestQuoteDiscount = {
        discountId: discount.id,
        discountName: discount.name,
        type: discount.type,
        value: discountValue,
        calculatedAmount: discountAmount,
      }
    }
  }

  // Apply best non-stackable quote discount if provided
  if (bestQuoteDiscount) {
    const stackableQuoteTotal = result.appliedDiscounts
      .filter((d) => !d.lineItemId)
      .reduce((sum, d) => sum + d.calculatedAmount, 0)

    if (bestQuoteDiscount.calculatedAmount > stackableQuoteTotal) {
      // Remove stackable quote discounts
      result.appliedDiscounts = result.appliedDiscounts.filter((d) => d.lineItemId !== undefined)
      result.appliedDiscounts.push(bestQuoteDiscount)
      result.totalDiscount = result.totalDiscount - stackableQuoteTotal + bestQuoteDiscount.calculatedAmount
    }
  }

  return result
}
