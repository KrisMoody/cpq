import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const productId = getRouterParam(event, 'id')
  const featureId = getRouterParam(event, 'featureId')

  if (!productId || !featureId) {
    throw createError({
      statusCode: 400,
      message: 'Product ID and Feature ID are required',
    })
  }

  // Check feature exists and belongs to this product
  const existing = await prisma.productFeature.findUnique({
    where: { id: featureId },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Feature not found',
    })
  }

  if (existing.productId !== productId) {
    throw createError({
      statusCode: 400,
      message: 'Feature does not belong to this product',
    })
  }

  // Delete feature (options will cascade delete)
  await prisma.productFeature.delete({
    where: { id: featureId },
  })

  return { success: true, id: featureId }
})
