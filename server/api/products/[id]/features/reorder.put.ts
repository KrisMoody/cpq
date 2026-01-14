import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const productId = getRouterParam(event, 'id')
  if (!productId) {
    throw createError({ statusCode: 400, message: 'Product ID is required' })
  }

  const body = await readBody(event)

  if (!Array.isArray(body.featureIds)) {
    throw createError({ statusCode: 400, message: 'featureIds array is required' })
  }

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw createError({ statusCode: 404, message: 'Product not found' })
  }

  // Update sortOrder for each feature
  await prisma.$transaction(
    body.featureIds.map((featureId: string, index: number) =>
      prisma.productFeature.update({
        where: { id: featureId },
        data: { sortOrder: index },
      })
    )
  )

  // Return updated product with features
  return await prisma.product.findUnique({
    where: { id: productId },
    include: {
      features: {
        orderBy: { sortOrder: 'asc' },
        include: {
          options: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  })
})
