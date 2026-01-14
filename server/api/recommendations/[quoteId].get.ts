import { usePrisma } from '../../utils/prisma'
import {
  getAffinityRecommendations,
  getSubscriptionCrossSellRecommendations,
  boostContractProducts,
  type RecommendationContext,
} from '../../services/recommendationEngine'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const quoteId = getRouterParam(event, 'quoteId')

  if (!quoteId) {
    throw createError({
      statusCode: 400,
      message: 'Quote ID is required',
    })
  }

  // Fetch quote with line items and customer contract
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      lineItems: {
        include: {
          product: {
            include: {
              categories: {
                include: { category: true },
              },
            },
          },
        },
      },
      customer: {
        include: {
          contracts: {
            where: { status: 'ACTIVE' },
            include: { priceEntries: true },
          },
        },
      },
    },
  })

  if (!quote) {
    throw createError({
      statusCode: 404,
      message: 'Quote not found',
    })
  }

  // Build recommendation context
  const quoteProductIds = quote.lineItems.map((li) => li.productId)
  const quoteProductBillingFrequencies = quote.lineItems.map((li) => li.product.billingFrequency)
  const quoteCategoryIds = quote.lineItems.flatMap((li) =>
    li.product.categories?.map((pc) => pc.categoryId) || []
  )

  // Find active contract for customer
  const activeContract = quote.customer?.contracts?.find((c) => {
    const now = new Date()
    return c.status === 'ACTIVE' && new Date(c.startDate) <= now && new Date(c.endDate) >= now
  })

  const context: RecommendationContext = {
    quoteProductIds,
    quoteProductBillingFrequencies,
    quoteCategoryIds: [...new Set(quoteCategoryIds)],
    priceBookId: quote.priceBookId,
    contract: activeContract,
  }

  // Fetch applicable affinities
  const affinities = await prisma.productAffinity.findMany({
    where: {
      isActive: true,
      OR: [
        { sourceProductId: { in: quoteProductIds } },
        { sourceCategoryId: { in: context.quoteCategoryIds } },
        // Also get affinities that match by billing frequency
        {
          sourceBillingFrequency: { in: quoteProductBillingFrequencies },
        },
      ],
    },
    include: {
      sourceProduct: true,
      targetProduct: {
        include: {
          categories: { include: { category: true } },
          priceBookEntries: {
            where: { priceBookId: quote.priceBookId },
          },
        },
      },
      sourceCategory: true,
      targetCategory: true,
    },
    orderBy: { priority: 'asc' },
  })

  // Get affinity-based recommendations
  let recommendations = getAffinityRecommendations(affinities, context)

  // Get subscription cross-sell recommendations
  const allProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      billingFrequency: 'ONE_TIME',
      id: { notIn: quoteProductIds },
    },
    include: {
      categories: { include: { category: true } },
      priceBookEntries: {
        where: { priceBookId: quote.priceBookId },
      },
    },
    take: 50,
  })

  const subscriptionRecs = getSubscriptionCrossSellRecommendations(allProducts, context)
  recommendations = [...recommendations, ...subscriptionRecs]

  // Boost products in customer's contract
  recommendations = boostContractProducts(recommendations, context)

  // Limit to top recommendations
  const topRecommendations = recommendations.slice(0, 10)

  return {
    quoteId,
    recommendations: topRecommendations.map((rec) => ({
      productId: rec.product.id,
      productName: rec.product.name,
      productSku: rec.product.sku,
      reason: rec.reason,
      affinityType: rec.affinityType,
      priority: rec.priority,
      price: rec.price,
      contractPrice: rec.contractPrice,
      hasContractPricing: rec.hasContractPricing,
      billingFrequency: rec.billingFrequency,
    })),
  }
})
