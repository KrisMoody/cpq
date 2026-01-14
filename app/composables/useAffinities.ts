import type { AffinityType, BillingFrequency } from '../generated/prisma/client.js'
import type { ProductSummary, CategorySummary } from '../types/cpq'

export interface ProductAffinity {
  id: string
  sourceProductId: string | null
  targetProductId: string | null
  sourceCategoryId: string | null
  targetCategoryId: string | null
  type: AffinityType
  priority: number
  conditions: Record<string, unknown> | null
  sourceBillingFrequency: BillingFrequency | null
  targetBillingFrequency: BillingFrequency | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  sourceProduct: ProductSummary | null
  targetProduct: ProductSummary | null
  sourceCategory: CategorySummary | null
  targetCategory: CategorySummary | null
}

export function useAffinities() {
  const affinities = useState<ProductAffinity[]>('affinities', () => [])
  const loading = useState('affinities-loading', () => false)
  const error = useState<string | null>('affinities-error', () => null)

  async function fetchAffinities(options?: { includeInactive?: boolean; type?: AffinityType }) {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (options?.includeInactive) params.set('includeInactive', 'true')
      if (options?.type) params.set('type', options.type)
      const query = params.toString() ? `?${params.toString()}` : ''
      const data = await $fetch<ProductAffinity[]>(`/api/affinities${query}`)
      affinities.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch affinities'
    } finally {
      loading.value = false
    }
  }

  async function fetchAffinity(id: string): Promise<ProductAffinity | null> {
    try {
      return await $fetch<ProductAffinity>(`/api/affinities/${id}`)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch affinity'
      return null
    }
  }

  async function createAffinity(data: {
    sourceProductId?: string
    targetProductId?: string
    sourceCategoryId?: string
    targetCategoryId?: string
    type: AffinityType
    priority?: number
    conditions?: Record<string, unknown>
    sourceBillingFrequency?: BillingFrequency
    targetBillingFrequency?: BillingFrequency
    isActive?: boolean
  }): Promise<ProductAffinity | null> {
    try {
      const affinity = await $fetch<ProductAffinity>('/api/affinities', {
        method: 'POST',
        body: data,
      })
      await fetchAffinities()
      return affinity
    } catch (e: any) {
      error.value = e.message || 'Failed to create affinity'
      return null
    }
  }

  async function updateAffinity(
    id: string,
    data: Partial<{
      sourceProductId: string | null
      targetProductId: string | null
      sourceCategoryId: string | null
      targetCategoryId: string | null
      type: AffinityType
      priority: number
      conditions: Record<string, unknown> | null
      sourceBillingFrequency: BillingFrequency | null
      targetBillingFrequency: BillingFrequency | null
      isActive: boolean
    }>
  ): Promise<ProductAffinity | null> {
    try {
      const affinity = await $fetch<ProductAffinity>(`/api/affinities/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchAffinities()
      return affinity
    } catch (e: any) {
      error.value = e.message || 'Failed to update affinity'
      return null
    }
  }

  async function deleteAffinity(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/affinities/${id}`, {
        method: 'DELETE',
      })
      await fetchAffinities()
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to delete affinity'
      return false
    }
  }

  return {
    affinities,
    loading,
    error,
    fetchAffinities,
    fetchAffinity,
    createAffinity,
    updateAffinity,
    deleteAffinity,
  }
}
