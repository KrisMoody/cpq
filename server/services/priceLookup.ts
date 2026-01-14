import type { PriceBookEntry, PriceTier, TierType } from '../../app/generated/prisma'

export interface PriceBookEntryWithTiers extends PriceBookEntry {
  priceTiers: PriceTier[]
}

export interface PriceLookupResult {
  unitPrice: number
  tierApplied: boolean
  tierInfo?: {
    minQuantity: number
    maxQuantity: number | null
    tierPrice: number
    tierType: TierType
  }
  cost?: number
  margin?: number
}

/**
 * Look up the effective price for a product in a price book, considering quantity tiers
 */
export function lookupPrice(
  entry: PriceBookEntryWithTiers,
  quantity: number
): PriceLookupResult {
  const result: PriceLookupResult = {
    unitPrice: Number(entry.listPrice),
    tierApplied: false,
    cost: entry.cost ? Number(entry.cost) : undefined,
  }

  // Check if there are tiers
  if (entry.priceTiers && entry.priceTiers.length > 0) {
    // Find the applicable tier (tiers should be ordered by minQuantity)
    for (const tier of entry.priceTiers) {
      const minQty = tier.minQuantity
      const maxQty = tier.maxQuantity

      if (quantity >= minQty && (maxQty === null || quantity <= maxQty)) {
        result.tierApplied = true
        result.tierInfo = {
          minQuantity: minQty,
          maxQuantity: maxQty,
          tierPrice: Number(tier.tierPrice),
          tierType: tier.tierType,
        }

        if (tier.tierType === 'UNIT_PRICE') {
          result.unitPrice = Number(tier.tierPrice)
        } else {
          // FLAT_PRICE - the tier price is the total for any quantity in this tier
          result.unitPrice = Number(tier.tierPrice) / quantity
        }
        break
      }
    }
  }

  // Calculate margin if cost is available
  if (result.cost && result.cost > 0) {
    result.margin = ((result.unitPrice - result.cost) / result.unitPrice) * 100
  }

  return result
}

/**
 * Calculate the total price for a quantity, considering tiers
 */
export function calculateTotalPrice(
  entry: PriceBookEntryWithTiers,
  quantity: number
): number {
  const lookupResult = lookupPrice(entry, quantity)

  if (lookupResult.tierApplied && lookupResult.tierInfo?.tierType === 'FLAT_PRICE') {
    return lookupResult.tierInfo.tierPrice
  }

  return lookupResult.unitPrice * quantity
}
