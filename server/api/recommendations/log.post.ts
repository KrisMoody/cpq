import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const body = await readBody(event)

  if (!body.quoteId || !body.productId || !body.action) {
    throw createError({
      statusCode: 400,
      message: 'quoteId, productId, and action are required',
    })
  }

  const validActions = ['SHOWN', 'ACCEPTED', 'DISMISSED']
  if (!validActions.includes(body.action)) {
    throw createError({
      statusCode: 400,
      message: `action must be one of: ${validActions.join(', ')}`,
    })
  }

  const validSources = ['RULE_BASED', 'AI_GENERATED', 'QUESTIONNAIRE', 'MANUAL']
  const source = body.source || 'RULE_BASED'
  if (!validSources.includes(source)) {
    throw createError({
      statusCode: 400,
      message: `source must be one of: ${validSources.join(', ')}`,
    })
  }

  const log = await prisma.recommendationLog.create({
    data: {
      quoteId: body.quoteId,
      productId: body.productId,
      source,
      action: body.action,
      metadata: body.metadata || null,
    },
  })

  return log
})
