import { usePrisma } from '../../../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const productId = getRouterParam(event, 'id')
  const featureId = getRouterParam(event, 'featureId')
  const optionId = getRouterParam(event, 'optionId')
  const body = await readBody(event)

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

  // If changing the option product, verify it exists
  if (body.optionProductId && body.optionProductId !== existing.optionProductId) {
    const optionProduct = await prisma.product.findUnique({
      where: { id: body.optionProductId },
    })
    if (!optionProduct) {
      throw createError({
        statusCode: 400,
        message: 'Option product not found',
      })
    }
  }

  const option = await prisma.productOption.update({
    where: { id: optionId },
    data: {
      optionProductId: body.optionProductId ?? existing.optionProductId,
      isRequired: body.isRequired ?? existing.isRequired,
      isDefault: body.isDefault ?? existing.isDefault,
      minQty: body.minQty ?? existing.minQty,
      maxQty: body.maxQty ?? existing.maxQty,
      sortOrder: body.sortOrder ?? existing.sortOrder,
    },
  })

  return option
})
