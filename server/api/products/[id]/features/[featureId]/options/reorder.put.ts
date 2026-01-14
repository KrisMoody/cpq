import { usePrisma } from '../../../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const productId = getRouterParam(event, 'id')
  const featureId = getRouterParam(event, 'featureId')

  if (!productId || !featureId) {
    throw createError({ statusCode: 400, message: 'Product ID and Feature ID are required' })
  }

  const body = await readBody(event)

  if (!Array.isArray(body.optionIds)) {
    throw createError({ statusCode: 400, message: 'optionIds array is required' })
  }

  // Verify feature exists and belongs to the product
  const feature = await prisma.productFeature.findFirst({
    where: { id: featureId, productId },
  })

  if (!feature) {
    throw createError({ statusCode: 404, message: 'Feature not found' })
  }

  // Update sortOrder for each option
  await prisma.$transaction(
    body.optionIds.map((optionId: string, index: number) =>
      prisma.productOption.update({
        where: { id: optionId },
        data: { sortOrder: index },
      })
    )
  )

  // Return updated feature with options
  return await prisma.productFeature.findUnique({
    where: { id: featureId },
    include: {
      options: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  })
})
