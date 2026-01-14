import { usePrisma } from '../../../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const productId = getRouterParam(event, 'id')
  const featureId = getRouterParam(event, 'featureId')
  const body = await readBody(event)

  if (!productId || !featureId) {
    throw createError({
      statusCode: 400,
      message: 'Product ID and Feature ID are required',
    })
  }

  if (!body.optionProductId) {
    throw createError({
      statusCode: 400,
      message: 'Option product ID is required',
    })
  }

  // Check feature exists and belongs to this product
  const feature = await prisma.productFeature.findUnique({
    where: { id: featureId },
  })

  if (!feature) {
    throw createError({
      statusCode: 404,
      message: 'Feature not found',
    })
  }

  if (feature.productId !== productId) {
    throw createError({
      statusCode: 400,
      message: 'Feature does not belong to this product',
    })
  }

  // Verify the option product exists
  const optionProduct = await prisma.product.findUnique({
    where: { id: body.optionProductId },
  })

  if (!optionProduct) {
    throw createError({
      statusCode: 400,
      message: 'Option product not found',
    })
  }

  // Get the next sort order
  const maxSortOrder = await prisma.productOption.aggregate({
    where: { featureId },
    _max: { sortOrder: true },
  })

  const option = await prisma.productOption.create({
    data: {
      featureId,
      optionProductId: body.optionProductId,
      isRequired: body.isRequired ?? false,
      isDefault: body.isDefault ?? false,
      minQty: body.minQty ?? 1,
      maxQty: body.maxQty ?? 1,
      sortOrder: body.sortOrder ?? (maxSortOrder._max.sortOrder ?? 0) + 1,
    },
  })

  return option
})
