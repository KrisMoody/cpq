import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Rule ID is required',
    })
  }

  const existing = await prisma.rule.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Rule not found',
    })
  }

  // Validate type if provided
  if (body.type && !['CONFIGURATION', 'PRICING'].includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid rule type',
    })
  }

  // Validate trigger if provided
  if (body.trigger && !['ON_PRODUCT_ADD', 'ON_QUANTITY_CHANGE', 'ON_QUOTE_SAVE', 'ON_FINALIZE'].includes(body.trigger)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid rule trigger',
    })
  }

  const rule = await prisma.rule.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      description: body.description !== undefined ? body.description : existing.description,
      type: body.type ?? existing.type,
      trigger: body.trigger ?? existing.trigger,
      priority: body.priority ?? existing.priority,
      condition: body.condition ?? existing.condition,
      action: body.action ?? existing.action,
      isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
    },
  })

  return rule
})
