import { z } from 'zod'
import { optimizeQuote, isAIEnabled, AIServiceError, type OptimizationResponse } from '../../services/aiQuoteService'

const requestSchema = z.object({
  quoteId: z.string().min(1).describe('The quote ID to analyze and optimize'),
  goals: z.array(z.enum(['maximize_revenue', 'maximize_margin', 'increase_win_probability'])).optional(),
  constraints: z.object({
    maxDiscount: z.number().min(0).max(100).optional(),
    minMargin: z.number().min(0).max(100).optional(),
  }).optional(),
})

export default defineEventHandler(async (event): Promise<OptimizationResponse> => {
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

  const { quoteId, goals, constraints } = parsed.data

  try {
    const result = await optimizeQuote({
      quoteId,
      goals,
      constraints,
    })

    return result
  } catch (error) {
    console.error('[AI Optimize Quote] Error:', error)

    if (error instanceof AIServiceError) {
      const statusMap: Record<string, number> = {
        NOT_CONFIGURED: 503,
        RATE_LIMITED: 429,
        VALIDATION_ERROR: 400,
        API_ERROR: 500,
      }

      throw createError({
        statusCode: statusMap[error.code] || 500,
        message: error.message,
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to optimize quote',
    })
  }
})
