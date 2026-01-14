import type { DiscountType, DiscountScope } from '../generated/prisma/client.js'

export interface DiscountTier {
  id: string
  discountId: string
  tierNumber: number
  minQuantity: number
  maxQuantity: number | null
  value: string
}

export interface Discount {
  id: string
  name: string
  description: string | null
  type: DiscountType
  value: string
  scope: DiscountScope
  minQuantity: number | null
  maxQuantity: number | null
  minOrderValue: string | null
  validFrom: string | null
  validTo: string | null
  isActive: boolean
  stackable: boolean
  priority: number
  createdAt: string
  updatedAt: string
  tiers: DiscountTier[]
}

export function useDiscounts() {
  const discounts = useState<Discount[]>('discounts', () => [])
  const loading = useState('discounts-loading', () => false)
  const error = useState<string | null>('discounts-error', () => null)

  async function fetchDiscounts(includeInactive = false) {
    loading.value = true
    error.value = null
    try {
      const params = includeInactive ? '?includeInactive=true' : ''
      const data = await $fetch<Discount[]>(`/api/discounts${params}`)
      discounts.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch discounts'
    } finally {
      loading.value = false
    }
  }

  async function fetchDiscount(id: string): Promise<Discount | null> {
    try {
      return await $fetch<Discount>(`/api/discounts/${id}`)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch discount'
      return null
    }
  }

  async function createDiscount(data: {
    name: string
    description?: string
    type: DiscountType
    value: number
    scope: DiscountScope
    minQuantity?: number
    maxQuantity?: number
    minOrderValue?: number
    validFrom?: string
    validTo?: string
    isActive?: boolean
    stackable?: boolean
    priority?: number
    tiers?: { minQuantity: number; maxQuantity?: number | null; value: number }[]
  }): Promise<Discount | null> {
    try {
      const discount = await $fetch<Discount>('/api/discounts', {
        method: 'POST',
        body: data,
      })
      await fetchDiscounts()
      return discount
    } catch (e: any) {
      error.value = e.message || 'Failed to create discount'
      return null
    }
  }

  async function updateDiscount(
    id: string,
    data: Partial<{
      name: string
      description: string | null
      type: DiscountType
      value: number
      scope: DiscountScope
      minQuantity: number | null
      maxQuantity: number | null
      minOrderValue: number | null
      validFrom: string | null
      validTo: string | null
      isActive: boolean
      stackable: boolean
      priority: number
      tiers: { minQuantity: number; maxQuantity?: number | null; value: number }[]
    }>
  ): Promise<Discount | null> {
    try {
      const discount = await $fetch<Discount>(`/api/discounts/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchDiscounts()
      return discount
    } catch (e: any) {
      error.value = e.message || 'Failed to update discount'
      return null
    }
  }

  async function deleteDiscount(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/discounts/${id}`, {
        method: 'DELETE',
      })
      await fetchDiscounts()
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to delete discount'
      return false
    }
  }

  return {
    discounts,
    loading,
    error,
    fetchDiscounts,
    fetchDiscount,
    createDiscount,
    updateDiscount,
    deleteDiscount,
  }
}
