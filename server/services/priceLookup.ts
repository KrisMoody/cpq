import type { PriceBookEntry, PriceTier, TierType, Contract, ContractPriceEntry } from '../../app/generated/prisma/client.js'

export interface PriceBookEntryWithTiers extends PriceBookEntry {
  priceTiers: PriceTier[]
}

export interface ContractWithPrices extends Contract {
  priceEntries: ContractPriceEntry[]
}

export interface ContractPriceInfo {
  contractId: string
  contractName: string
  priceType: 'fixed' | 'percentage'
  originalPrice: number
  discountPercent?: number
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
  contractApplied?: boolean
  contractInfo?: ContractPriceInfo
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

/**
 * Look up contract-specific pricing for a product
 * Returns null if no contract pricing applies
 */
export function lookupContractPrice(
  contract: ContractWithPrices,
  productId: string,
  basePrice: number
): { price: number; info: ContractPriceInfo } | null {
  const now = new Date()

  // Contract must be active and within validity period
  if (contract.status !== 'ACTIVE') {
    return null
  }

  if (now < new Date(contract.startDate) || now > new Date(contract.endDate)) {
    return null
  }

  // Check for product-specific fixed price first
  const fixedEntry = contract.priceEntries.find((e) => e.productId === productId)

  if (fixedEntry) {
    return {
      price: Number(fixedEntry.fixedPrice),
      info: {
        contractId: contract.id,
        contractName: contract.name,
        priceType: 'fixed',
        originalPrice: basePrice,
      },
    }
  }

  // Check for percentage discount
  if (contract.discountPercent && Number(contract.discountPercent) > 0) {
    const discountPercent = Number(contract.discountPercent)
    const discountedPrice = basePrice * (1 - discountPercent / 100)

    return {
      price: discountedPrice,
      info: {
        contractId: contract.id,
        contractName: contract.name,
        priceType: 'percentage',
        originalPrice: basePrice,
        discountPercent,
      },
    }
  }

  return null
}

/**
 * Look up price with contract pricing considered
 * Contract pricing takes precedence over price book pricing
 */
export function lookupPriceWithContract(
  entry: PriceBookEntryWithTiers,
  quantity: number,
  contract?: ContractWithPrices | null
): PriceLookupResult {
  // First get the standard price book price
  const result = lookupPrice(entry, quantity)

  // If no contract, return standard result
  if (!contract) {
    return result
  }

  // Check for contract pricing
  const contractPrice = lookupContractPrice(contract, entry.productId, result.unitPrice)

  if (contractPrice) {
    result.unitPrice = contractPrice.price
    result.contractApplied = true
    result.contractInfo = contractPrice.info

    // Recalculate margin with contract price
    if (result.cost && result.cost > 0) {
      result.margin = ((result.unitPrice - result.cost) / result.unitPrice) * 100
    }
  }

  return result
}
