import { z } from 'zod'
import { generateText, tool, stepCountIs } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { usePrisma } from '../utils/prisma'
import { calculateLinePrice, calculateQuoteTotal } from './pricingEngine'
import type { DiscountType, DiscountScope, QuoteStatus, AffinityType } from '../../app/generated/prisma/client'

// =============================================================================
// Configuration
// =============================================================================

let aiEnabled = false
let anthropicApiKey: string | null = null

/**
 * Initialize the AI service with configuration
 * Call this during server startup with runtime config
 */
export function initializeAIService(config: { anthropicApiKey?: string }) {
  anthropicApiKey = config.anthropicApiKey || null
  aiEnabled = Boolean(anthropicApiKey)

  if (!aiEnabled) {
    console.info('[AI Service] Disabled: ANTHROPIC_API_KEY not configured')
  } else {
    console.info('[AI Service] Initialized successfully')
  }
}

/**
 * Check if AI features are available
 */
export function isAIEnabled(): boolean {
  return aiEnabled
}

// =============================================================================
// Zod Schemas for AI Response Validation
// =============================================================================

const RecommendationSchema = z.object({
  type: z.enum(['ADD_PRODUCT', 'APPLY_DISCOUNT', 'ADJUST_QUANTITY', 'REMOVE_PRODUCT']),
  productId: z.string().optional(),
  productName: z.string().optional(),
  discountId: z.string().optional(),
  discountName: z.string().optional(),
  quantity: z.number().optional(),
  lineItemId: z.string().optional(),
  reason: z.string(),
  impact: z.object({
    revenueChange: z.number().optional(),
    marginChange: z.number().optional(),
    winProbabilityChange: z.number().optional(),
  }).optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  confidence: z.number().min(0).max(1),
})

const AnalysisSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  risks: z.array(z.string()),
})

export const OptimizationResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  recommendations: z.array(RecommendationSchema),
  analysis: AnalysisSchema,
  summary: z.string(),
})

export type OptimizationResponse = z.infer<typeof OptimizationResponseSchema>
export type Recommendation = z.infer<typeof RecommendationSchema>

// =============================================================================
// Error Handling
// =============================================================================

export class AIServiceError extends Error {
  constructor(
    message: string,
    public readonly code: 'NOT_CONFIGURED' | 'API_ERROR' | 'VALIDATION_ERROR' | 'RATE_LIMITED',
    public readonly cause?: Error
  ) {
    super(message)
    this.name = 'AIServiceError'
  }
}

function handleAIError(error: unknown): never {
  if (error instanceof AIServiceError) {
    throw error
  }

  if (error instanceof Error) {
    // Check for common API errors
    if (error.message.includes('rate limit')) {
      throw new AIServiceError('AI service rate limited', 'RATE_LIMITED', error)
    }
    if (error.message.includes('invalid_api_key') || error.message.includes('authentication')) {
      throw new AIServiceError('AI service authentication failed', 'API_ERROR', error)
    }
    throw new AIServiceError(`AI service error: ${error.message}`, 'API_ERROR', error)
  }

  throw new AIServiceError('Unknown AI service error', 'API_ERROR')
}

// =============================================================================
// Tool Input Schemas
// =============================================================================

const lookupCustomerInputSchema = z.object({
  customerId: z.string().describe('The customer ID to look up'),
})

const searchProductsInputSchema = z.object({
  query: z.string().optional().describe('Text search query for product name/description'),
  categoryId: z.string().optional().describe('Filter by category ID'),
  billingFrequency: z.enum(['ONE_TIME', 'MONTHLY', 'QUARTERLY', 'ANNUAL']).optional(),
  isActive: z.boolean().optional().default(true),
  limit: z.number().optional().default(20),
})

const getPricingInputSchema = z.object({
  productId: z.string().describe('The product ID'),
  priceBookId: z.string().describe('The price book ID'),
  quantity: z.number().optional().default(1).describe('Quantity for tier calculation'),
  customerId: z.string().optional().describe('Customer ID for contract pricing'),
})

const getQuoteHistoryInputSchema = z.object({
  customerId: z.string().describe('The customer ID'),
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'ACCEPTED', 'FINALIZED', 'CANCELLED']).optional(),
  limit: z.number().optional().default(20),
})

const getAffinitiesInputSchema = z.object({
  productIds: z.array(z.string()).describe('Product IDs currently in the quote'),
  categoryIds: z.array(z.string()).optional().describe('Category IDs of products in the quote'),
  types: z.array(z.enum(['CROSS_SELL', 'UPSELL', 'ACCESSORY', 'REQUIRED', 'FREQUENTLY_BOUGHT', 'SUBSCRIPTION_ADDON'])).optional(),
})

const getAvailableDiscountsInputSchema = z.object({
  subtotal: z.number().describe('Current quote subtotal'),
  lineItems: z.array(z.object({
    id: z.string(),
    productId: z.string(),
    quantity: z.number(),
    categoryIds: z.array(z.string()).optional(),
  })).describe('Line items in the quote'),
})

const addToQuoteInputSchema = z.object({
  quoteId: z.string().describe('The quote ID'),
  productId: z.string().describe('The product ID to add'),
  quantity: z.number().optional().default(1).describe('Quantity to add'),
})

const applyDiscountInputSchema = z.object({
  quoteId: z.string().describe('The quote ID'),
  discountId: z.string().optional().describe('The discount ID (for predefined discounts)'),
  lineItemId: z.string().optional().describe('Line item ID for line-level discounts'),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']).describe('Discount type'),
  value: z.number().describe('Discount value (percentage or amount)'),
  reason: z.string().optional().describe('Reason for applying the discount'),
})

const calculateMetricsInputSchema = z.object({
  quoteId: z.string().describe('The quote ID'),
})

// =============================================================================
// Tool Execute Functions
// =============================================================================

async function executeLookupCustomer(input: z.infer<typeof lookupCustomerInputSchema>) {
  const prisma = usePrisma()
  const { customerId } = input

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      priceBook: { select: { id: true, name: true } },
      currency: { select: { code: true, symbol: true } },
      contracts: {
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          discountPercent: true,
          priceEntries: { select: { productId: true, fixedPrice: true } },
        },
      },
      quotes: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          status: true,
          total: true,
          createdAt: true,
        },
      },
    },
  })

  if (!customer) {
    return { error: 'Customer not found' }
  }

  return {
    id: customer.id,
    name: customer.name,
    company: customer.company,
    email: customer.email,
    location: {
      city: customer.city,
      state: customer.state,
      country: customer.country,
    },
    priceBook: customer.priceBook,
    currency: customer.currency,
    isTaxExempt: customer.isTaxExempt,
    activeContracts: customer.contracts.map((c) => ({
      id: c.id,
      name: c.name,
      startDate: c.startDate,
      endDate: c.endDate,
      discountPercent: c.discountPercent ? Number(c.discountPercent) : null,
      productCount: c.priceEntries.length,
    })),
    recentQuotes: customer.quotes.map((q) => ({
      id: q.id,
      name: q.name,
      status: q.status,
      total: Number(q.total),
      createdAt: q.createdAt,
    })),
  }
}

async function executeSearchProducts(input: z.infer<typeof searchProductsInputSchema>) {
  const prisma = usePrisma()
  const { query, categoryId, billingFrequency, isActive, limit } = input

  const products = await prisma.product.findMany({
    where: {
      isActive,
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
        ],
      }),
      ...(categoryId && {
        categories: { some: { categoryId } },
      }),
      ...(billingFrequency && { billingFrequency }),
    },
    include: {
      categories: {
        include: { category: { select: { id: true, name: true } } },
      },
      priceBookEntries: {
        take: 1,
        select: { listPrice: true },
      },
    },
    take: limit,
  })

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    description: p.description,
    type: p.type,
    billingFrequency: p.billingFrequency,
    categories: p.categories.map((pc) => pc.category),
    basePrice: p.priceBookEntries[0] ? Number(p.priceBookEntries[0].listPrice) : null,
  }))
}

async function executeGetPricing(input: z.infer<typeof getPricingInputSchema>) {
  const prisma = usePrisma()
  const { productId, priceBookId, quantity, customerId } = input

  const entry = await prisma.priceBookEntry.findUnique({
    where: {
      priceBookId_productId: { priceBookId, productId },
    },
    include: {
      priceTiers: { orderBy: { minQuantity: 'asc' } },
      product: { select: { name: true, billingFrequency: true } },
    },
  })

  if (!entry) {
    return { error: 'Product not in price book' }
  }

  const linePrice = await calculateLinePrice(productId, quantity, priceBookId)

  let contractPricing = null
  if (customerId) {
    const contract = await prisma.contract.findFirst({
      where: {
        customerId,
        status: 'ACTIVE',
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      include: {
        priceEntries: { where: { productId } },
      },
    })

    if (contract) {
      const fixedEntry = contract.priceEntries[0]
      contractPricing = {
        contractId: contract.id,
        contractName: contract.name,
        fixedPrice: fixedEntry ? Number(fixedEntry.fixedPrice) : null,
        discountPercent: contract.discountPercent ? Number(contract.discountPercent) : null,
      }
    }
  }

  return {
    productId,
    productName: entry.product.name,
    billingFrequency: entry.product.billingFrequency,
    listPrice: Number(entry.listPrice),
    cost: entry.cost ? Number(entry.cost) : null,
    minMargin: entry.minMargin ? Number(entry.minMargin) : null,
    priceTiers: entry.priceTiers.map((t) => ({
      minQuantity: t.minQuantity,
      maxQuantity: t.maxQuantity,
      tierPrice: Number(t.tierPrice),
      tierType: t.tierType,
    })),
    calculatedPrice: linePrice
      ? {
          unitPrice: linePrice.unitPrice,
          netPrice: linePrice.netPrice,
          tierApplied: linePrice.tierApplied,
          margin: linePrice.margin,
        }
      : null,
    contractPricing,
  }
}

async function executeGetQuoteHistory(input: z.infer<typeof getQuoteHistoryInputSchema>) {
  const prisma = usePrisma()
  const { customerId, status, limit } = input

  const quotes = await prisma.quote.findMany({
    where: {
      customerId,
      ...(status && { status: status as QuoteStatus }),
    },
    include: {
      lineItems: {
        include: {
          product: { select: { id: true, name: true, billingFrequency: true } },
        },
      },
      appliedDiscounts: {
        select: { type: true, value: true, calculatedAmount: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  // Aggregate product frequency
  const productFrequency = new Map<string, { name: string; count: number; totalValue: number }>()

  for (const quote of quotes) {
    if (quote.status === 'FINALIZED' || quote.status === 'ACCEPTED') {
      for (const item of quote.lineItems) {
        const existing = productFrequency.get(item.productId) || {
          name: item.product.name,
          count: 0,
          totalValue: 0,
        }
        existing.count++
        existing.totalValue += Number(item.netPrice)
        productFrequency.set(item.productId, existing)
      }
    }
  }

  // Calculate average discount
  const discountedQuotes = quotes.filter((q) => q.appliedDiscounts.length > 0)
  const avgDiscountPercent =
    discountedQuotes.length > 0
      ? discountedQuotes.reduce((sum, q) => {
          const total = Number(q.subtotal)
          const discount = Number(q.discountTotal)
          return sum + (total > 0 ? (discount / total) * 100 : 0)
        }, 0) / discountedQuotes.length
      : 0

  return {
    totalQuotes: quotes.length,
    quotes: quotes.map((q) => ({
      id: q.id,
      name: q.name,
      status: q.status,
      subtotal: Number(q.subtotal),
      discountTotal: Number(q.discountTotal),
      total: Number(q.total),
      mrr: Number(q.mrr),
      arr: Number(q.arr),
      createdAt: q.createdAt,
      lineItemCount: q.lineItems.length,
    })),
    frequentProducts: Array.from(productFrequency.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([id, data]) => ({
        productId: id,
        productName: data.name,
        purchaseCount: data.count,
        totalValue: data.totalValue,
      })),
    averageDiscountPercent: Math.round(avgDiscountPercent * 100) / 100,
  }
}

async function executeGetAffinities(input: z.infer<typeof getAffinitiesInputSchema>) {
  const prisma = usePrisma()
  const { productIds, categoryIds, types } = input

  const affinities = await prisma.productAffinity.findMany({
    where: {
      isActive: true,
      OR: [
        { sourceProductId: { in: productIds } },
        ...(categoryIds?.length ? [{ sourceCategoryId: { in: categoryIds } }] : []),
      ],
      ...(types?.length && { type: { in: types as AffinityType[] } }),
      // Exclude products already in quote
      targetProductId: { notIn: productIds },
    },
    include: {
      sourceProduct: { select: { id: true, name: true } },
      targetProduct: {
        select: {
          id: true,
          name: true,
          sku: true,
          billingFrequency: true,
          priceBookEntries: { take: 1, select: { listPrice: true } },
        },
      },
      sourceCategory: { select: { id: true, name: true } },
      targetCategory: { select: { id: true, name: true } },
    },
    orderBy: { priority: 'asc' },
  })

  return affinities.map((a) => ({
    id: a.id,
    type: a.type,
    priority: a.priority,
    source: a.sourceProduct
      ? { type: 'product', id: a.sourceProduct.id, name: a.sourceProduct.name }
      : { type: 'category', id: a.sourceCategory?.id, name: a.sourceCategory?.name },
    target: a.targetProduct
      ? {
          type: 'product',
          id: a.targetProduct.id,
          name: a.targetProduct.name,
          sku: a.targetProduct.sku,
          billingFrequency: a.targetProduct.billingFrequency,
          price: a.targetProduct.priceBookEntries[0]
            ? Number(a.targetProduct.priceBookEntries[0].listPrice)
            : null,
        }
      : { type: 'category', id: a.targetCategory?.id, name: a.targetCategory?.name },
    conditions: a.conditions,
  }))
}

async function executeGetAvailableDiscounts(input: z.infer<typeof getAvailableDiscountsInputSchema>) {
  const prisma = usePrisma()
  const { subtotal, lineItems } = input
  const now = new Date()

  const discounts = await prisma.discount.findMany({
    where: {
      isActive: true,
      OR: [{ validFrom: null }, { validFrom: { lte: now } }],
      AND: [
        { OR: [{ validTo: null }, { validTo: { gte: now } }] },
      ],
    },
    include: {
      tiers: { orderBy: { tierNumber: 'asc' } },
      category: { select: { id: true, name: true } },
    },
  })

  // Filter to applicable discounts
  const applicable = discounts.filter((d) => {
    // Check min order value
    if (d.minOrderValue && Number(d.minOrderValue) > subtotal) return false

    // For line item/category scope, check if any line item qualifies
    if (d.scope === 'LINE_ITEM' || d.scope === 'PRODUCT_CATEGORY') {
      return lineItems.some((item) => {
        if (d.minQuantity && item.quantity < d.minQuantity) return false
        if (d.maxQuantity && item.quantity > d.maxQuantity) return false
        if (d.scope === 'PRODUCT_CATEGORY' && d.categoryId) {
          return item.categoryIds?.includes(d.categoryId)
        }
        return true
      })
    }

    return true
  })

  return applicable.map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    type: d.type as DiscountType,
    value: Number(d.value),
    scope: d.scope as DiscountScope,
    category: d.category,
    stackable: d.stackable,
    priority: d.priority,
    constraints: {
      minQuantity: d.minQuantity,
      maxQuantity: d.maxQuantity,
      minOrderValue: d.minOrderValue ? Number(d.minOrderValue) : null,
    },
    tiers: d.tiers.map((t) => ({
      tierNumber: t.tierNumber,
      minQuantity: t.minQuantity,
      maxQuantity: t.maxQuantity,
      value: Number(t.value),
    })),
  }))
}

async function executeAddToQuote(input: z.infer<typeof addToQuoteInputSchema>) {
  const prisma = usePrisma()
  const { quoteId, productId, quantity } = input

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { priceBookId: true, status: true },
  })

  if (!quote) {
    return { error: 'Quote not found' }
  }

  if (quote.status !== 'DRAFT') {
    return { error: 'Cannot modify non-draft quote' }
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, type: true },
  })

  if (!product) {
    return { error: 'Product not found' }
  }

  const pricing = await calculateLinePrice(productId, quantity, quote.priceBookId)
  if (!pricing) {
    return { error: 'Product not in price book' }
  }

  const lastLine = await prisma.quoteLineItem.findFirst({
    where: { quoteId },
    orderBy: { sortOrder: 'desc' },
  })

  const lineItem = await prisma.quoteLineItem.create({
    data: {
      quoteId,
      productId,
      quantity,
      listPrice: pricing.listPrice,
      discount: 0,
      netPrice: product.type === 'BUNDLE' ? 0 : pricing.netPrice,
      sortOrder: (lastLine?.sortOrder || 0) + 1,
    },
  })

  await calculateQuoteTotal(quoteId)

  return {
    success: true,
    lineItemId: lineItem.id,
    productName: product.name,
    quantity,
    unitPrice: pricing.unitPrice,
    netPrice: pricing.netPrice,
    tierApplied: pricing.tierApplied,
  }
}

async function executeApplyDiscount(input: z.infer<typeof applyDiscountInputSchema>) {
  const prisma = usePrisma()
  const { quoteId, discountId, lineItemId, type, value, reason } = input

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      lineItems: lineItemId ? { where: { id: lineItemId } } : false,
    },
  })

  if (!quote) {
    return { error: 'Quote not found' }
  }

  if (quote.status !== 'DRAFT') {
    return { error: 'Cannot modify non-draft quote' }
  }

  // Calculate discount amount
  let baseAmount: number
  if (lineItemId && quote.lineItems && quote.lineItems.length > 0) {
    baseAmount = Number(quote.lineItems[0].netPrice)
  } else {
    baseAmount = Number(quote.subtotal)
  }

  const calculatedAmount = type === 'PERCENTAGE' ? baseAmount * (value / 100) : Math.min(value, baseAmount)

  const appliedDiscount = await prisma.appliedDiscount.create({
    data: {
      quoteId,
      lineItemId,
      discountId,
      type: type as DiscountType,
      value,
      calculatedAmount,
      reason,
      appliedBy: 'AI_SERVICE',
    },
  })

  // If line-level discount, update line item
  if (lineItemId) {
    await prisma.quoteLineItem.update({
      where: { id: lineItemId },
      data: {
        discount: { increment: calculatedAmount },
        netPrice: { decrement: calculatedAmount },
      },
    })
  }

  await calculateQuoteTotal(quoteId)

  return {
    success: true,
    appliedDiscountId: appliedDiscount.id,
    type,
    value,
    calculatedAmount,
    appliedTo: lineItemId ? 'line_item' : 'quote',
  }
}

async function executeCalculateMetrics(input: z.infer<typeof calculateMetricsInputSchema>) {
  const prisma = usePrisma()
  const { quoteId } = input

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      lineItems: {
        include: {
          product: {
            include: {
              priceBookEntries: {
                take: 1,
                select: { cost: true, minMargin: true },
              },
            },
          },
        },
      },
      customer: { select: { name: true, company: true } },
    },
  })

  if (!quote) {
    return { error: 'Quote not found' }
  }

  // Calculate costs and margins
  let totalCost = 0
  let itemsWithCost = 0

  for (const item of quote.lineItems) {
    const entry = item.product.priceBookEntries[0]
    if (entry?.cost) {
      totalCost += Number(entry.cost) * item.quantity
      itemsWithCost++
    }
  }

  const subtotal = Number(quote.subtotal)
  const grossMargin = subtotal > 0 ? ((subtotal - totalCost) / subtotal) * 100 : 0

  // Recalculate totals
  const totals = await calculateQuoteTotal(quoteId)

  return {
    quoteId,
    customerName: quote.customer?.name || quote.customer?.company || 'No customer',
    status: quote.status,
    lineItemCount: quote.lineItems.length,
    financials: {
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
      taxAmount: totals.taxAmount,
      total: totals.total,
    },
    recurring: {
      oneTimeTotal: totals.oneTimeTotal,
      mrr: totals.mrr,
      arr: totals.arr,
      tcv: totals.tcv,
    },
    margins: {
      totalCost,
      grossMargin: Math.round(grossMargin * 100) / 100,
      itemsWithCostData: itemsWithCost,
      itemsWithoutCostData: quote.lineItems.length - itemsWithCost,
    },
  }
}

// =============================================================================
// Data Lookup Tools
// =============================================================================

const lookupCustomerTool = tool({
  description: 'Look up customer information including profile, contracts, and purchase history',
  inputSchema: lookupCustomerInputSchema,
  execute: executeLookupCustomer,
})

const searchProductsTool = tool({
  description: 'Search for products by name, category, or attributes',
  inputSchema: searchProductsInputSchema,
  execute: executeSearchProducts,
})

const getPricingTool = tool({
  description: 'Get pricing information for a product including volume tiers and contract rates',
  inputSchema: getPricingInputSchema,
  execute: executeGetPricing,
})

const getQuoteHistoryTool = tool({
  description: 'Get historical quotes and purchase patterns for a customer',
  inputSchema: getQuoteHistoryInputSchema,
  execute: executeGetQuoteHistory,
})

const getAffinitiesTool = tool({
  description: 'Get product affinities (cross-sell, upsell, accessories) for products in a quote',
  inputSchema: getAffinitiesInputSchema,
  execute: executeGetAffinities,
})

const getAvailableDiscountsTool = tool({
  description: 'Get discounts that can be applied to the quote',
  inputSchema: getAvailableDiscountsInputSchema,
  execute: executeGetAvailableDiscounts,
})

// =============================================================================
// Action Tools
// =============================================================================

const addToQuoteTool = tool({
  description: 'Add a product to the quote',
  inputSchema: addToQuoteInputSchema,
  execute: executeAddToQuote,
})

const applyDiscountTool = tool({
  description: 'Apply a discount to the quote or a line item',
  inputSchema: applyDiscountInputSchema,
  execute: executeApplyDiscount,
})

const calculateMetricsTool = tool({
  description: 'Calculate and return quote metrics including totals, margins, and revenue',
  inputSchema: calculateMetricsInputSchema,
  execute: executeCalculateMetrics,
})

// =============================================================================
// Main Optimization Function
// =============================================================================

export interface OptimizeQuoteOptions {
  quoteId: string
  customerId?: string
  goals?: ('maximize_revenue' | 'maximize_margin' | 'increase_win_probability')[]
  constraints?: {
    maxDiscount?: number
    minMargin?: number
  }
}

/**
 * Optimize a quote using AI analysis
 * Returns recommendations for improving the quote
 */
export async function optimizeQuote(options: OptimizeQuoteOptions): Promise<OptimizationResponse> {
  if (!aiEnabled || !anthropicApiKey) {
    throw new AIServiceError('AI service not configured', 'NOT_CONFIGURED')
  }

  const { quoteId, customerId, goals = ['maximize_revenue'], constraints } = options

  try {
    const prisma = usePrisma()

    // Fetch quote details for context
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        customer: { select: { id: true, name: true, company: true } },
        lineItems: {
          include: {
            product: { select: { id: true, name: true, billingFrequency: true } },
          },
        },
        appliedDiscounts: true,
      },
    })

    if (!quote) {
      throw new AIServiceError('Quote not found', 'VALIDATION_ERROR')
    }

    const systemPrompt = `You are a CPQ (Configure, Price, Quote) optimization assistant. Your goal is to analyze quotes and provide actionable recommendations to improve them.

You have access to tools for:
- Looking up customer information and purchase history
- Searching products and getting pricing details
- Finding product affinities (cross-sell, upsell opportunities)
- Getting available discounts
- Adding products to quotes
- Applying discounts
- Calculating quote metrics

Current optimization goals: ${goals.join(', ')}
${constraints?.maxDiscount ? `Maximum discount allowed: ${constraints.maxDiscount}%` : ''}
${constraints?.minMargin ? `Minimum margin required: ${constraints.minMargin}%` : ''}

Analyze the quote thoroughly using the available tools, then provide your optimization response.`

    const userPrompt = `Analyze and optimize this quote:

Quote ID: ${quoteId}
Customer: ${quote.customer?.name || quote.customer?.company || 'No customer assigned'}
${customerId ? `Customer ID: ${customerId}` : ''}

Current line items:
${quote.lineItems.map((item) => `- ${item.product.name}: Qty ${item.quantity}, Net $${Number(item.netPrice).toFixed(2)}`).join('\n')}

Current totals:
- Subtotal: $${Number(quote.subtotal).toFixed(2)}
- Discount: $${Number(quote.discountTotal).toFixed(2)}
- Total: $${Number(quote.total).toFixed(2)}
- MRR: $${Number(quote.mrr).toFixed(2)}
- ARR: $${Number(quote.arr).toFixed(2)}

Please:
1. Use the lookup tools to gather relevant context (customer history, pricing, affinities, available discounts)
2. Analyze strengths, weaknesses, opportunities, and risks
3. Provide specific, actionable recommendations to optimize this quote

Return your analysis in the specified JSON format.`

    const result = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      prompt: userPrompt,
      tools: {
        lookupCustomer: lookupCustomerTool,
        searchProducts: searchProductsTool,
        getPricing: getPricingTool,
        getQuoteHistory: getQuoteHistoryTool,
        getAffinities: getAffinitiesTool,
        getAvailableDiscounts: getAvailableDiscountsTool,
        addToQuote: addToQuoteTool,
        applyDiscount: applyDiscountTool,
        calculateMetrics: calculateMetricsTool,
      },
      stopWhen: stepCountIs(10),
    })

    // Parse and validate the response
    const responseText = result.text

    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      // If no JSON found, construct a basic response from the text
      return {
        overallScore: 50,
        recommendations: [],
        analysis: {
          strengths: [],
          weaknesses: [],
          opportunities: [],
          risks: [],
        },
        summary: responseText,
      }
    }

    try {
      const parsed = JSON.parse(jsonMatch[0])
      const validated = OptimizationResponseSchema.parse(parsed)
      return validated
    } catch {
      console.warn('[AI Service] Could not parse structured response, returning summary')
      return {
        overallScore: 50,
        recommendations: [],
        analysis: {
          strengths: [],
          weaknesses: [],
          opportunities: [],
          risks: [],
        },
        summary: responseText,
      }
    }
  } catch (error) {
    console.error('[AI Service] Error optimizing quote:', error)
    handleAIError(error)
  }
}

// =============================================================================
// Exported Tool Definitions (for use in API routes)
// =============================================================================

export const aiTools = {
  lookupCustomer: lookupCustomerTool,
  searchProducts: searchProductsTool,
  getPricing: getPricingTool,
  getQuoteHistory: getQuoteHistoryTool,
  getAffinities: getAffinitiesTool,
  getAvailableDiscounts: getAvailableDiscountsTool,
  addToQuote: addToQuoteTool,
  applyDiscount: applyDiscountTool,
  calculateMetrics: calculateMetricsTool,
}
