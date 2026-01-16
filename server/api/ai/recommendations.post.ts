import { z } from 'zod'
import { generateText, stepCountIs } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { usePrisma } from '../../utils/prisma'
import { isAIEnabled, AIServiceError, aiTools } from '../../services/aiQuoteService'

const requestSchema = z.object({
  quoteId: z.string().optional().describe('Quote ID for context'),
  customerId: z.string().optional().describe('Customer ID for personalized recommendations'),
  productIds: z.array(z.string()).optional().describe('Current product IDs in consideration'),
  context: z.string().optional().describe('Additional context for recommendations'),
})

const recommendationSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  type: z.enum(['CROSS_SELL', 'UPSELL', 'ACCESSORY', 'BUNDLE', 'ALTERNATIVE']),
  reason: z.string(),
  confidence: z.number().min(0).max(1),
  estimatedValue: z.number().optional(),
})

const recommendationsResponseSchema = z.object({
  recommendations: z.array(recommendationSchema),
  summary: z.string(),
})

export default defineEventHandler(async (event) => {
  if (!isAIEnabled()) {
    throw createError({
      statusCode: 503,
      message: 'AI service not configured',
    })
  }

  const body = await readBody(event)
  const parsed = requestSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: `Invalid request: ${parsed.error.message}`,
    })
  }

  const { quoteId, customerId, productIds, context } = parsed.data
  const prisma = usePrisma()

  try {
    // Build context from provided information
    let quoteContext = ''
    let customerContext = ''
    let productContext = ''

    if (quoteId) {
      const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
        include: {
          customer: { select: { id: true, name: true, company: true } },
          lineItems: {
            include: {
              product: { select: { id: true, name: true, billingFrequency: true } },
            },
          },
        },
      })

      if (quote) {
        quoteContext = `\nCurrent quote contains:
${quote.lineItems.map((li) => `- ${li.product.name} (Qty: ${li.quantity})`).join('\n')}
Total: $${Number(quote.total).toFixed(2)}`

        if (quote.customer) {
          customerContext = `\nCustomer: ${quote.customer.name || quote.customer.company}`
        }
      }
    }

    if (productIds && productIds.length > 0) {
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, billingFrequency: true },
      })
      productContext = `\nProducts under consideration:
${products.map((p) => `- ${p.name} (${p.billingFrequency})`).join('\n')}`
    }

    const systemPrompt = `You are a CPQ (Configure, Price, Quote) recommendation assistant. Your task is to suggest relevant products based on the customer's context and current selections.

You have access to tools for:
- Searching products by name, category, or attributes
- Getting product affinities (cross-sell, upsell relationships)
- Looking up customer purchase history
- Getting pricing information

Types of recommendations to consider:
- CROSS_SELL: Complementary products that work well together
- UPSELL: Higher-tier or premium alternatives
- ACCESSORY: Supporting products or add-ons
- BUNDLE: Product bundles that offer value
- ALTERNATIVE: Similar products at different price points

Guidelines:
- Prioritize relevance and value to the customer
- Consider purchase history and patterns
- Explain the reasoning for each recommendation
- Include confidence scores based on relevance`

    const userPrompt = `Generate product recommendations based on this context:
${quoteContext}${customerContext}${productContext}
${context ? `\nAdditional context: ${context}` : ''}

Use the available tools to find relevant products and affinities, then provide recommendations in JSON format with:
- recommendations: Array of {productId, productName, type, reason, confidence, estimatedValue}
- summary: Brief overview of the recommendation strategy`

    const result = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      prompt: userPrompt,
      tools: {
        searchProducts: aiTools.searchProducts,
        getAffinities: aiTools.getAffinities,
        getPricing: aiTools.getPricing,
        ...(customerId && {
          lookupCustomer: aiTools.lookupCustomer,
          getQuoteHistory: aiTools.getQuoteHistory,
        }),
      },
      stopWhen: stepCountIs(5),
    })

    const responseText = result.text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return {
        recommendations: [],
        summary: responseText,
      }
    }

    try {
      const parsed = JSON.parse(jsonMatch[0])
      const validated = recommendationsResponseSchema.parse(parsed)
      return validated
    } catch {
      return {
        recommendations: [],
        summary: responseText,
      }
    }
  } catch (error) {
    console.error('[AI Recommendations] Error:', error)

    if (error instanceof AIServiceError) {
      throw createError({
        statusCode: error.code === 'RATE_LIMITED' ? 429 : 500,
        message: error.message,
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to generate recommendations',
    })
  }
})
