import { z } from 'zod'
import { streamText, stepCountIs } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { usePrisma } from '../../utils/prisma'
import { isAIEnabled, AIServiceError, aiTools } from '../../services/aiQuoteService'

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1),
  quoteId: z.string().optional().describe('Quote ID for context'),
  customerId: z.string().optional().describe('Customer ID for context'),
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

  const { messages, quoteId, customerId } = parsed.data
  const prisma = usePrisma()

  try {
    // Build context from provided information
    const contextParts: string[] = []

    if (quoteId) {
      const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
        include: {
          customer: { select: { id: true, name: true, company: true } },
          lineItems: {
            include: {
              product: { select: { id: true, name: true, sku: true, billingFrequency: true } },
            },
          },
          priceBook: { select: { id: true, name: true } },
        },
      })

      if (quote) {
        contextParts.push(`Current Quote (ID: ${quoteId}):
- Name: ${quote.name}
- Status: ${quote.status}
- Price Book: ${quote.priceBook?.name || 'Default'}
- Subtotal: $${Number(quote.subtotal).toFixed(2)}
- Discount: $${Number(quote.discountTotal).toFixed(2)}
- Total: $${Number(quote.total).toFixed(2)}
- MRR: $${Number(quote.mrr).toFixed(2)}
- ARR: $${Number(quote.arr).toFixed(2)}

Line Items:
${quote.lineItems.map((li) => `- ${li.product.name} (${li.product.sku}): Qty ${li.quantity}, $${Number(li.netPrice).toFixed(2)}`).join('\n')}`)

        if (quote.customer) {
          contextParts.push(`Customer: ${quote.customer.name || quote.customer.company} (ID: ${quote.customer.id})`)
        }
      }
    }

    if (customerId && !quoteId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { id: true, name: true, company: true },
      })

      if (customer) {
        contextParts.push(`Customer: ${customer.name || customer.company} (ID: ${customer.id})`)
      }
    }

    const systemPrompt = `You are a helpful CPQ (Configure, Price, Quote) assistant. You help sales teams create, configure, and optimize quotes for customers.

You have access to tools that allow you to:
- Look up customer information and purchase history
- Search for products and get pricing details
- Find product affinities and recommendations
- Get available discounts
- Add products to quotes
- Apply discounts to quotes
- Calculate quote metrics

${contextParts.length > 0 ? `Current Context:\n${contextParts.join('\n\n')}` : ''}

Guidelines:
- Be helpful and concise
- Use tools to look up accurate information rather than guessing
- Explain your reasoning when making recommendations
- Ask clarifying questions when the request is ambiguous
- Focus on helping the user achieve their goals efficiently`

    // Convert messages to the format expected by the AI SDK
    const formattedMessages = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      messages: formattedMessages,
      tools: {
        lookupCustomer: aiTools.lookupCustomer,
        searchProducts: aiTools.searchProducts,
        getPricing: aiTools.getPricing,
        getQuoteHistory: aiTools.getQuoteHistory,
        getAffinities: aiTools.getAffinities,
        getAvailableDiscounts: aiTools.getAvailableDiscounts,
        addToQuote: aiTools.addToQuote,
        applyDiscount: aiTools.applyDiscount,
        calculateMetrics: aiTools.calculateMetrics,
      },
      stopWhen: stepCountIs(10),
    })

    // Return plain text streaming response
    return result.toTextStreamResponse()
  } catch (error) {
    console.error('[AI Chat] Error:', error)

    if (error instanceof AIServiceError) {
      throw createError({
        statusCode: error.code === 'RATE_LIMITED' ? 429 : 500,
        message: error.message,
      })
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: 500,
      message: `Failed to process chat request: ${errorMessage}`,
    })
  }
})
