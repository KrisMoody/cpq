import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Affinity ID is required',
    })
  }

  const existing = await prisma.productAffinity.findUnique({ where: { id } })
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Affinity not found',
    })
  }

  const validTypes = ['CROSS_SELL', 'UPSELL', 'ACCESSORY', 'REQUIRED', 'FREQUENTLY_BOUGHT', 'SUBSCRIPTION_ADDON']
  if (body.type && !validTypes.includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: `type must be one of: ${validTypes.join(', ')}`,
    })
  }

  const validBillingFrequencies = ['ONE_TIME', 'MONTHLY', 'QUARTERLY', 'ANNUAL', 'CUSTOM']

  if (body.sourceBillingFrequency && !validBillingFrequencies.includes(body.sourceBillingFrequency)) {
    throw createError({
      statusCode: 400,
      message: `sourceBillingFrequency must be one of: ${validBillingFrequencies.join(', ')}`,
    })
  }

  if (body.targetBillingFrequency && !validBillingFrequencies.includes(body.targetBillingFrequency)) {
    throw createError({
      statusCode: 400,
      message: `targetBillingFrequency must be one of: ${validBillingFrequencies.join(', ')}`,
    })
  }

  const affinity = await prisma.productAffinity.update({
    where: { id },
    data: {
      ...(body.sourceProductId !== undefined && { sourceProductId: body.sourceProductId || null }),
      ...(body.targetProductId !== undefined && { targetProductId: body.targetProductId || null }),
      ...(body.sourceCategoryId !== undefined && { sourceCategoryId: body.sourceCategoryId || null }),
      ...(body.targetCategoryId !== undefined && { targetCategoryId: body.targetCategoryId || null }),
      ...(body.type && { type: body.type }),
      ...(body.priority !== undefined && { priority: body.priority }),
      ...(body.conditions !== undefined && { conditions: body.conditions }),
      ...(body.sourceBillingFrequency !== undefined && { sourceBillingFrequency: body.sourceBillingFrequency || null }),
      ...(body.targetBillingFrequency !== undefined && { targetBillingFrequency: body.targetBillingFrequency || null }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    },
    include: {
      sourceProduct: { select: { id: true, name: true, sku: true } },
      targetProduct: { select: { id: true, name: true, sku: true } },
      sourceCategory: { select: { id: true, name: true } },
      targetCategory: { select: { id: true, name: true } },
    },
  })

  return affinity
})
