import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const productId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!productId) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    })
  }

  // Check product exists and is a bundle
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw createError({
      statusCode: 404,
      message: 'Product not found',
    })
  }

  if (product.type !== 'BUNDLE') {
    throw createError({
      statusCode: 400,
      message: 'Features can only be added to BUNDLE products',
    })
  }

  // Get the next sort order
  const maxSortOrder = await prisma.productFeature.aggregate({
    where: { productId },
    _max: { sortOrder: true },
  })

  const feature = await prisma.productFeature.create({
    data: {
      productId,
      name: body.name,
      minOptions: body.minOptions ?? 0,
      maxOptions: body.maxOptions ?? 1,
      sortOrder: body.sortOrder ?? (maxSortOrder._max.sortOrder ?? 0) + 1,
    },
    include: {
      options: true,
    },
  })

  return feature
})
