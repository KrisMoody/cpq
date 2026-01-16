import { z } from 'zod'
import { generateText, Output, stepCountIs } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { usePrisma } from '../../utils/prisma'
import { isAIEnabled, AIServiceError, aiTools } from '../../services/aiQuoteService'

const requestSchema = z.object({
  description: z.string().min(1).describe('Natural language description of the desired quote'),
  customerId: z.string().optional().describe('Optional customer ID for context'),
  priceBookId: z.string().optional().describe('Optional price book ID'),
})

const generatedLineItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().min(1),
  reason: z.string().optional(),
})

const generateQuoteResponseSchema = z.object({
  suggestedName: z.string(),
  lineItems: z.array(generatedLineItemSchema),
  summary: z.string(),
  estimatedTotal: z.number().optional(),
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

  const { description, customerId, priceBookId: _priceBookId } = parsed.data
  const prisma = usePrisma()

  try {
    // Fetch customer context if provided
    let customerContext = ''
    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { name: true, company: true },
      })
      if (customer) {
        customerContext = `\nCustomer: ${customer.name || customer.company}`
      }
    }

    // Fetch available product categories for context
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      take: 20,
    })

    const systemPrompt = `You are a CPQ (Configure, Price, Quote) assistant. Your task is to interpret natural language requests and generate appropriate quote line items.

You have access to tools for searching products and getting pricing information. Use these tools to find the most suitable products for the customer's needs.

Available product categories: ${categories.map((c) => c.name).join(', ')}

Guidelines:
- Search for products that match the customer's description
- Consider product types (one-time, subscription, etc.)
- Suggest appropriate quantities based on context
- Provide clear reasoning for each product selection

Return your response as a JSON object with:
- suggestedName: A descriptive name for the quote
- lineItems: Array of products with productId, productName, quantity, and reason
- summary: Brief explanation of the generated quote
- estimatedTotal: Rough estimate if pricing data is available`

    const userPrompt = `Generate a quote based on this request:

"${description}"${customerContext}

Use the search tools to find appropriate products, then provide your response in the specified JSON format.`

    const result = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      prompt: userPrompt,
      tools: {
        searchProducts: aiTools.searchProducts,
        getPricing: aiTools.getPricing,
        ...(customerId && { lookupCustomer: aiTools.lookupCustomer }),
      },
      output: Output.object({ schema: generateQuoteResponseSchema }),
      stopWhen: stepCountIs(6), // +1 for structured output step
    })

    return result.output
  } catch (error) {
    console.error('[AI Generate Quote] Error:', error)

    if (error instanceof AIServiceError) {
      throw createError({
        statusCode: error.code === 'RATE_LIMITED' ? 429 : 500,
        message: error.message,
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to generate quote',
    })
  }
})
