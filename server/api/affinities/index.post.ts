import { usePrisma } from '../../utils/prisma'
import { getPhase } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const body = await readBody(event)

  const validTypes = ['CROSS_SELL', 'UPSELL', 'ACCESSORY', 'REQUIRED', 'FREQUENTLY_BOUGHT', 'SUBSCRIPTION_ADDON']
  if (!body.type || !validTypes.includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: `type is required and must be one of: ${validTypes.join(', ')}`,
    })
  }

  // Must have either source product or source category
  if (!body.sourceProductId && !body.sourceCategoryId) {
    throw createError({
      statusCode: 400,
      message: 'Either sourceProductId or sourceCategoryId is required',
    })
  }

  // Must have either target product or target category
  if (!body.targetProductId && !body.targetCategoryId) {
    throw createError({
      statusCode: 400,
      message: 'Either targetProductId or targetCategoryId is required',
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

  const affinity = await prisma.productAffinity.create({
    data: {
      sourceProductId: body.sourceProductId || null,
      targetProductId: body.targetProductId || null,
      sourceCategoryId: body.sourceCategoryId || null,
      targetCategoryId: body.targetCategoryId || null,
      type: body.type,
      priority: body.priority ?? 100,
      conditions: body.conditions || null,
      sourceBillingFrequency: body.sourceBillingFrequency || null,
      targetBillingFrequency: body.targetBillingFrequency || null,
      isActive: body.isActive ?? true,
      introducedInPhase: phase,
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
