import { describe, it, expect } from 'vitest'
import { lookupPrice, calculateTotalPrice, type PriceBookEntryWithTiers } from './priceLookup'
import type { Decimal } from '@prisma/client/runtime/client'

/**
 * Tests for tier-based pricing calculations
 *
 * These tests verify the pricing formulas documented in the pricing spec:
 * - unitPrice = applicable tier price if quantity matches a tier, otherwise listPrice
 * - For UNIT_PRICE tiers: netPrice = tierPrice × quantity
 * - For FLAT_PRICE tiers: netPrice = tierPrice (flat for any qty in range)
 */

function createEntry(
  listPrice: number,
  tiers: Array<{
    minQuantity: number
    maxQuantity: number | null
    tierPrice: number
    tierType: 'UNIT_PRICE' | 'FLAT_PRICE'
  }> = [],
  cost?: number
): PriceBookEntryWithTiers {
  return {
    id: 'entry-1',
    priceBookId: 'pb-1',
    productId: 'prod-1',
    listPrice: listPrice as unknown as Decimal,
    cost: cost ? (cost as unknown as Decimal) : null,
    minMargin: null,
    priceTiers: tiers.map((t, i) => ({
      id: `tier-${i}`,
      priceBookEntryId: 'entry-1',
      minQuantity: t.minQuantity,
      maxQuantity: t.maxQuantity,
      tierPrice: t.tierPrice as unknown as Decimal,
      tierType: t.tierType,
    })),
  }
}

describe('lookupPrice', () => {
  describe('base price (no tiers)', () => {
    it('should return list price when no tiers exist', () => {
      const entry = createEntry(100)
      const result = lookupPrice(entry, 5)

      expect(result.unitPrice).toBe(100)
      expect(result.tierApplied).toBe(false)
      expect(result.tierInfo).toBeUndefined()
    })

    it('should return list price when quantity does not match any tier', () => {
      const entry = createEntry(100, [
        { minQuantity: 10, maxQuantity: 50, tierPrice: 80, tierType: 'UNIT_PRICE' },
      ])
      const result = lookupPrice(entry, 5) // Below tier minimum

      expect(result.unitPrice).toBe(100)
      expect(result.tierApplied).toBe(false)
    })
  })

  describe('UNIT_PRICE tiers', () => {
    it('should apply tier price when quantity is within tier range', () => {
      const entry = createEntry(100, [
        { minQuantity: 10, maxQuantity: 50, tierPrice: 80, tierType: 'UNIT_PRICE' },
      ])
      const result = lookupPrice(entry, 25)

      expect(result.unitPrice).toBe(80)
      expect(result.tierApplied).toBe(true)
      expect(result.tierInfo).toEqual({
        minQuantity: 10,
        maxQuantity: 50,
        tierPrice: 80,
        tierType: 'UNIT_PRICE',
      })
    })

    it('should apply tier at minimum quantity boundary', () => {
      const entry = createEntry(100, [
        { minQuantity: 10, maxQuantity: 50, tierPrice: 80, tierType: 'UNIT_PRICE' },
      ])
      const result = lookupPrice(entry, 10)

      expect(result.unitPrice).toBe(80)
      expect(result.tierApplied).toBe(true)
    })

    it('should apply tier at maximum quantity boundary', () => {
      const entry = createEntry(100, [
        { minQuantity: 10, maxQuantity: 50, tierPrice: 80, tierType: 'UNIT_PRICE' },
      ])
      const result = lookupPrice(entry, 50)

      expect(result.unitPrice).toBe(80)
      expect(result.tierApplied).toBe(true)
    })

    it('should handle null maxQuantity (unlimited tier)', () => {
      const entry = createEntry(100, [
        { minQuantity: 100, maxQuantity: null, tierPrice: 60, tierType: 'UNIT_PRICE' },
      ])
      const result = lookupPrice(entry, 500)

      expect(result.unitPrice).toBe(60)
      expect(result.tierApplied).toBe(true)
      expect(result.tierInfo?.maxQuantity).toBeNull()
    })

    it('should select correct tier from multiple tiers', () => {
      const entry = createEntry(100, [
        { minQuantity: 1, maxQuantity: 9, tierPrice: 100, tierType: 'UNIT_PRICE' },
        { minQuantity: 10, maxQuantity: 49, tierPrice: 90, tierType: 'UNIT_PRICE' },
        { minQuantity: 50, maxQuantity: 99, tierPrice: 80, tierType: 'UNIT_PRICE' },
        { minQuantity: 100, maxQuantity: null, tierPrice: 70, tierType: 'UNIT_PRICE' },
      ])

      expect(lookupPrice(entry, 5).unitPrice).toBe(100)
      expect(lookupPrice(entry, 25).unitPrice).toBe(90)
      expect(lookupPrice(entry, 75).unitPrice).toBe(80)
      expect(lookupPrice(entry, 150).unitPrice).toBe(70)
    })
  })

  describe('FLAT_PRICE tiers', () => {
    it('should calculate unit price as flat price divided by quantity', () => {
      const entry = createEntry(100, [
        { minQuantity: 10, maxQuantity: 50, tierPrice: 500, tierType: 'FLAT_PRICE' },
      ])
      const result = lookupPrice(entry, 25)

      expect(result.unitPrice).toBe(20) // 500 / 25
      expect(result.tierApplied).toBe(true)
      expect(result.tierInfo?.tierType).toBe('FLAT_PRICE')
    })

    it('should vary unit price based on quantity within same flat tier', () => {
      const entry = createEntry(100, [
        { minQuantity: 10, maxQuantity: 50, tierPrice: 500, tierType: 'FLAT_PRICE' },
      ])

      // Same flat price, different unit prices
      expect(lookupPrice(entry, 10).unitPrice).toBe(50) // 500 / 10
      expect(lookupPrice(entry, 25).unitPrice).toBe(20) // 500 / 25
      expect(lookupPrice(entry, 50).unitPrice).toBe(10) // 500 / 50
    })
  })

  describe('margin calculation', () => {
    it('should calculate margin when cost is provided', () => {
      const entry = createEntry(100, [], 60)
      const result = lookupPrice(entry, 1)

      expect(result.cost).toBe(60)
      expect(result.margin).toBe(40) // ((100 - 60) / 100) * 100
    })

    it('should not calculate margin when cost is not provided', () => {
      const entry = createEntry(100, [])
      const result = lookupPrice(entry, 1)

      expect(result.cost).toBeUndefined()
      expect(result.margin).toBeUndefined()
    })

    it('should calculate margin based on tier price when tier applies', () => {
      const entry = createEntry(100, [
        { minQuantity: 10, maxQuantity: 50, tierPrice: 80, tierType: 'UNIT_PRICE' },
      ], 40)
      const result = lookupPrice(entry, 25)

      expect(result.unitPrice).toBe(80)
      expect(result.cost).toBe(40)
      expect(result.margin).toBe(50) // ((80 - 40) / 80) * 100
    })
  })
})

describe('calculateTotalPrice', () => {
  describe('base price (no tiers)', () => {
    it('should calculate total as listPrice × quantity', () => {
      const entry = createEntry(100)

      expect(calculateTotalPrice(entry, 1)).toBe(100)
      expect(calculateTotalPrice(entry, 5)).toBe(500)
      expect(calculateTotalPrice(entry, 10)).toBe(1000)
    })
  })

  describe('UNIT_PRICE tiers', () => {
    it('should calculate total as tierPrice × quantity', () => {
      const entry = createEntry(100, [
        { minQuantity: 10, maxQuantity: 50, tierPrice: 80, tierType: 'UNIT_PRICE' },
      ])

      // Below tier - uses list price
      expect(calculateTotalPrice(entry, 5)).toBe(500) // 100 × 5

      // Within tier - uses tier price
      expect(calculateTotalPrice(entry, 25)).toBe(2000) // 80 × 25
    })

    it('should match spec scenario: tier pricing at qty 25', () => {
      // From spec: product has tier: qty 10-50 at $80/unit, quantity is 25
      // Expected: unitPrice = $80, netPrice = $2000
      const entry = createEntry(100, [
        { minQuantity: 10, maxQuantity: 50, tierPrice: 80, tierType: 'UNIT_PRICE' },
      ])

      const lookupResult = lookupPrice(entry, 25)
      const totalPrice = calculateTotalPrice(entry, 25)

      expect(lookupResult.unitPrice).toBe(80)
      expect(totalPrice).toBe(2000)
    })
  })

  describe('FLAT_PRICE tiers', () => {
    it('should return flat price regardless of quantity within tier', () => {
      const entry = createEntry(100, [
        { minQuantity: 10, maxQuantity: 50, tierPrice: 500, tierType: 'FLAT_PRICE' },
      ])

      // All quantities within tier should return the same flat price
      expect(calculateTotalPrice(entry, 10)).toBe(500)
      expect(calculateTotalPrice(entry, 25)).toBe(500)
      expect(calculateTotalPrice(entry, 50)).toBe(500)
    })

    it('should use list price × quantity when below flat tier', () => {
      const entry = createEntry(100, [
        { minQuantity: 10, maxQuantity: 50, tierPrice: 500, tierType: 'FLAT_PRICE' },
      ])

      expect(calculateTotalPrice(entry, 5)).toBe(500) // 100 × 5
    })
  })

  describe('spec scenarios', () => {
    it('scenario: calculate line item with base price (no tiers)', () => {
      // From spec: product listPrice is $100, quantity is 5, no discounts
      // Expected: unitPrice = $100, netPrice = $500
      const entry = createEntry(100)

      const lookupResult = lookupPrice(entry, 5)
      const totalPrice = calculateTotalPrice(entry, 5)

      expect(lookupResult.unitPrice).toBe(100)
      expect(totalPrice).toBe(500)
    })

    it('scenario: calculate line item with tier pricing', () => {
      // From spec: product has tier qty 10-50 at $80/unit, quantity is 25
      // Expected: unitPrice = $80 (tier price), netPrice = $2000
      const entry = createEntry(100, [
        { minQuantity: 10, maxQuantity: 50, tierPrice: 80, tierType: 'UNIT_PRICE' },
      ])

      const lookupResult = lookupPrice(entry, 25)
      const totalPrice = calculateTotalPrice(entry, 25)

      expect(lookupResult.unitPrice).toBe(80)
      expect(lookupResult.tierApplied).toBe(true)
      expect(totalPrice).toBe(2000)
    })
  })
})
