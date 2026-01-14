import { usePrisma } from '../../../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const productId = getRouterParam(event, 'id')
  const featureId = getRouterParam(event, 'featureId')
  const optionId = getRouterParam(event, 'optionId')

  if (!productId || !featureId || !optionId) {
    throw createError({
      statusCode: 400,
      message: 'Product ID, Feature ID, and Option ID are required',
    })
  }

  // Check option exists and belongs to this feature
  const existing = await prisma.productOption.findUnique({
    where: { id: optionId },
    include: { feature: true },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Option not found',
    })
  }

  if (existing.featureId !== featureId) {
    throw createError({
      statusCode: 400,
      message: 'Option does not belong to this feature',
    })
  }

  if (existing.feature.productId !== productId) {
    throw createError({
      statusCode: 400,
      message: 'Feature does not belong to this product',
    })
  }

  await prisma.productOption.delete({
    where: { id: optionId },
  })

  return { success: true, id: optionId }
})
