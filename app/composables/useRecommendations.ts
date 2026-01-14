import type { AffinityType, BillingFrequency } from '../generated/prisma/client.js'
import { getErrorMessage } from '../utils/errors.js'

export interface Recommendation {
  productId: string
  productName: string
  productSku: string
  reason: string
  affinityType: AffinityType
  priority: number
  price?: number
  contractPrice?: number
  hasContractPricing?: boolean
  billingFrequency: BillingFrequency
}

export interface RecommendationsResponse {
  quoteId: string
  recommendations: Recommendation[]
}

export function useRecommendations() {
  const loading = useState('recommendations-loading', () => false)
  const error = useState<string | null>('recommendations-error', () => null)

  async function fetchRecommendations(quoteId: string): Promise<Recommendation[]> {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<RecommendationsResponse>(`/api/recommendations/${quoteId}`)
      return data.recommendations
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to fetch recommendations')
      return []
    } finally {
      loading.value = false
    }
  }

  async function logRecommendationAction(
    quoteId: string,
    productId: string,
    action: 'SHOWN' | 'ACCEPTED' | 'DISMISSED',
    metadata?: Record<string, unknown>
  ): Promise<boolean> {
    try {
      await $fetch('/api/recommendations/log', {
        method: 'POST',
        body: {
          quoteId,
          productId,
          action,
          source: 'RULE_BASED',
          metadata,
        },
      })
      return true
    } catch (e: unknown) {
      console.error('Failed to log recommendation action:', getErrorMessage(e))
      return false
    }
  }

  return {
    loading,
    error,
    fetchRecommendations,
    logRecommendationAction,
  }
}
