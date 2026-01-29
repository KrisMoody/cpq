import { usePrisma } from '../../utils/prisma'
import { getPhase } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const body = await readBody(event)

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Rule name is required',
    })
  }

  if (!body.type || !['CONFIGURATION', 'PRICING'].includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: 'Valid rule type is required (CONFIGURATION or PRICING)',
    })
  }

  if (!body.trigger || !['ON_PRODUCT_ADD', 'ON_QUANTITY_CHANGE', 'ON_QUOTE_SAVE', 'ON_FINALIZE'].includes(body.trigger)) {
    throw createError({
      statusCode: 400,
      message: 'Valid rule trigger is required',
    })
  }

  if (!body.condition || typeof body.condition !== 'object') {
    throw createError({
      statusCode: 400,
      message: 'Rule condition is required and must be a valid JSON object',
    })
  }

  if (!body.action || typeof body.action !== 'object') {
    throw createError({
      statusCode: 400,
      message: 'Rule action is required and must be a valid JSON object',
    })
  }

  const rule = await prisma.rule.create({
    data: {
      name: body.name,
      description: body.description || null,
      type: body.type,
      trigger: body.trigger,
      priority: body.priority ?? 100,
      condition: body.condition,
      action: body.action,
      isActive: body.isActive ?? true,
      introducedInPhase: phase,
    },
  })

  return rule
})
