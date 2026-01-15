import type {
  Product,
  ProductAffinity,
  AffinityType,
  BillingFrequency,
  RecommendationSource,
  RecommendationAction,
  Category,
  Contract,
  ContractPriceEntry,
} from '../../app/generated/prisma/client'

export interface ProductWithDetails extends Product {
  categories?: Array<{ category: Category }>
  priceBookEntries?: Array<{ listPrice: unknown; priceBookId: string }>
}

export interface AffinityWithRelations extends ProductAffinity {
  sourceProduct?: Product | null
  targetProduct?: ProductWithDetails | null
  sourceCategory?: Category | null
  targetCategory?: Category | null
}

export interface ContractWithPrices extends Contract {
  priceEntries: ContractPriceEntry[]
}

export interface Recommendation {
  product: ProductWithDetails
  reason: string
  affinityType: AffinityType
  priority: number
  affinityId: string
  price?: number
  contractPrice?: number
  hasContractPricing?: boolean
  billingFrequency: BillingFrequency
}

export interface RecommendationContext {
  quoteProductIds: string[]
  quoteProductBillingFrequencies: BillingFrequency[]
  quoteCategoryIds: string[]
  priceBookId: string
  contract?: ContractWithPrices | null
}

/**
 * Get product recommendations based on affinity rules
 */
export function getAffinityRecommendations(
  affinities: AffinityWithRelations[],
  context: RecommendationContext
): Recommendation[] {
  const recommendations: Recommendation[] = []
  const seenProductIds = new Set<string>(context.quoteProductIds)

  for (const affinity of affinities) {
    if (!affinity.isActive) continue

    // Check if this affinity applies to any product in the quote
    const matches = matchesAffinity(affinity, context)
    if (!matches) continue

    // Get target products
    const targetProducts = getTargetProducts(affinity)

    for (const product of targetProducts) {
      // Skip if product already in quote or already recommended
      if (seenProductIds.has(product.id)) continue

      // Check billing frequency filter
      if (affinity.targetBillingFrequency && product.billingFrequency !== affinity.targetBillingFrequency) {
        continue
      }

      // Check conditions if any
      if (affinity.conditions && !evaluateConditions(affinity.conditions, context)) {
        continue
      }

      // Calculate price if available
      const priceInfo = calculateRecommendationPrice(product, context)

      recommendations.push({
        product,
        reason: getRecommendationReason(affinity),
        affinityType: affinity.type,
        priority: affinity.priority,
        affinityId: affinity.id,
        price: priceInfo?.price,
        contractPrice: priceInfo?.contractPrice,
        hasContractPricing: priceInfo?.hasContractPricing,
        billingFrequency: product.billingFrequency,
      })

      seenProductIds.add(product.id)
    }
  }

  // Sort by priority (lower is higher priority) then by type
  return recommendations.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority
    return getTypeWeight(a.affinityType) - getTypeWeight(b.affinityType)
  })
}

/**
 * Check if affinity matches any product in the quote context
 */
function matchesAffinity(affinity: AffinityWithRelations, context: RecommendationContext): boolean {
  // Check source product match
  if (affinity.sourceProductId) {
    if (!context.quoteProductIds.includes(affinity.sourceProductId)) {
      return false
    }
  }

  // Check source category match
  if (affinity.sourceCategoryId) {
    if (!context.quoteCategoryIds.includes(affinity.sourceCategoryId)) {
      return false
    }
  }

  // Check source billing frequency filter
  if (affinity.sourceBillingFrequency) {
    if (!context.quoteProductBillingFrequencies.includes(affinity.sourceBillingFrequency)) {
      return false
    }
  }

  return true
}

/**
 * Get target products from affinity
 */
function getTargetProducts(affinity: AffinityWithRelations): ProductWithDetails[] {
  if (affinity.targetProduct) {
    return [affinity.targetProduct]
  }

  // Category-level affinities would need to be resolved by the caller
  // by including products in the targetCategory relation
  return []
}

/**
 * Evaluate conditions JSON against context
 */
function evaluateConditions(conditions: unknown, _context: RecommendationContext): boolean {
  if (!conditions || typeof conditions !== 'object') return true

  const cond = conditions as Record<string, unknown>

  // Example: { minQuantity: 5 } - would need quantity context
  // For now, return true as we don't have quantity in basic context
  if (cond.minQuantity) {
    // Would need quantity context to evaluate
    return true
  }

  return true
}

/**
 * Calculate recommendation price considering contract pricing
 */
function calculateRecommendationPrice(
  product: ProductWithDetails,
  context: RecommendationContext
): { price?: number; contractPrice?: number; hasContractPricing?: boolean } | null {
  // Find price book entry for this product
  const entry = product.priceBookEntries?.find(
    (e) => e.priceBookId === context.priceBookId
  )

  if (!entry) return null

  const basePrice = Number(entry.listPrice)

  // Check for contract pricing
  if (context.contract && context.contract.status === 'ACTIVE') {
    const now = new Date()
    const startDate = new Date(context.contract.startDate)
    const endDate = new Date(context.contract.endDate)

    if (now >= startDate && now <= endDate) {
      // Check for product-specific contract price
      const contractEntry = context.contract.priceEntries.find(
        (e) => e.productId === product.id
      )

      if (contractEntry) {
        return {
          price: basePrice,
          contractPrice: Number(contractEntry.fixedPrice),
          hasContractPricing: true,
        }
      }

      // Check for percentage discount
      if (context.contract.discountPercent && Number(context.contract.discountPercent) > 0) {
        const discountPercent = Number(context.contract.discountPercent)
        const contractPrice = basePrice * (1 - discountPercent / 100)
        return {
          price: basePrice,
          contractPrice,
          hasContractPricing: true,
        }
      }
    }
  }

  return { price: basePrice }
}

/**
 * Get human-readable reason for recommendation
 */
function getRecommendationReason(affinity: AffinityWithRelations): string {
  const sourceName = affinity.sourceProduct?.name || affinity.sourceCategory?.name || 'selected product'

  switch (affinity.type) {
    case 'CROSS_SELL':
      return `Complements ${sourceName}`
    case 'UPSELL':
      return `Upgrade from ${sourceName}`
    case 'ACCESSORY':
      return `Accessory for ${sourceName}`
    case 'REQUIRED':
      return `Required with ${sourceName}`
    case 'FREQUENTLY_BOUGHT':
      return `Frequently bought with ${sourceName}`
    case 'SUBSCRIPTION_ADDON':
      return `Add-on for ${sourceName} subscription`
    default:
      return `Related to ${sourceName}`
  }
}

/**
 * Get type weight for sorting (lower is higher priority)
 */
function getTypeWeight(type: AffinityType): number {
  const weights: Record<AffinityType, number> = {
    REQUIRED: 0,
    UPSELL: 1,
    CROSS_SELL: 2,
    ACCESSORY: 3,
    SUBSCRIPTION_ADDON: 4,
    FREQUENTLY_BOUGHT: 5,
  }
  return weights[type] ?? 10
}

/**
 * Generate subscription cross-sell recommendations
 * Suggests one-time products when recurring products are in the quote
 */
export function getSubscriptionCrossSellRecommendations(
  products: ProductWithDetails[],
  context: RecommendationContext
): Recommendation[] {
  const recommendations: Recommendation[] = []
  const seenProductIds = new Set<string>(context.quoteProductIds)

  // Check if quote has any recurring products
  const hasRecurring = context.quoteProductBillingFrequencies.some(
    (f) => f !== 'ONE_TIME'
  )

  if (!hasRecurring) return []

  // Find one-time products that could complement subscriptions
  for (const product of products) {
    if (seenProductIds.has(product.id)) continue
    if (product.billingFrequency !== 'ONE_TIME') continue
    if (!product.isActive) continue

    // Look for implementation/training/setup type products
    const name = product.name.toLowerCase()
    const isServiceProduct =
      name.includes('implementation') ||
      name.includes('training') ||
      name.includes('setup') ||
      name.includes('onboarding') ||
      name.includes('consulting')

    if (isServiceProduct) {
      const priceInfo = calculateRecommendationPrice(product, context)

      recommendations.push({
        product,
        reason: 'Recommended with your subscription',
        affinityType: 'SUBSCRIPTION_ADDON',
        priority: 200,
        affinityId: 'auto-subscription-crosssell',
        price: priceInfo?.price,
        contractPrice: priceInfo?.contractPrice,
        hasContractPricing: priceInfo?.hasContractPricing,
        billingFrequency: product.billingFrequency,
      })

      seenProductIds.add(product.id)
    }
  }

  return recommendations
}

/**
 * Boost recommendations for products in customer's active contract
 */
export function boostContractProducts(
  recommendations: Recommendation[],
  context: RecommendationContext
): Recommendation[] {
  if (!context.contract || context.contract.status !== 'ACTIVE') {
    return recommendations
  }

  const contractProductIds = new Set(
    context.contract.priceEntries.map((e) => e.productId)
  )

  return recommendations.map((rec) => {
    if (contractProductIds.has(rec.product.id)) {
      return {
        ...rec,
        priority: Math.max(1, rec.priority - 50), // Boost priority
        reason: rec.reason + ' (Contract pricing available)',
      }
    }
    return rec
  }).sort((a, b) => a.priority - b.priority)
}

/**
 * Log a recommendation action
 */
export interface LogRecommendationParams {
  quoteId: string
  productId: string
  source: RecommendationSource
  action: RecommendationAction
  metadata?: Record<string, unknown>
}

export function createRecommendationLogData(params: LogRecommendationParams) {
  return {
    quoteId: params.quoteId,
    productId: params.productId,
    source: params.source,
    action: params.action,
    metadata: params.metadata || null,
  }
}
