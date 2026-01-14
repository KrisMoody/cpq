import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const categoryId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!categoryId) {
    throw createError({
      statusCode: 400,
      message: 'Category ID is required',
    })
  }

  if (!body.productId) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    })
  }

  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  })

  if (!category) {
    throw createError({
      statusCode: 404,
      message: 'Category not found',
    })
  }

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: body.productId },
  })

  if (!product) {
    throw createError({
      statusCode: 404,
      message: 'Product not found',
    })
  }

  // Check if already assigned
  const existing = await prisma.productCategory.findUnique({
    where: {
      productId_categoryId: {
        productId: body.productId,
        categoryId: categoryId,
      },
    },
  })

  if (existing) {
    throw createError({
      statusCode: 400,
      message: 'Product is already in this category',
    })
  }

  const productCategory = await prisma.productCategory.create({
    data: {
      productId: body.productId,
      categoryId: categoryId,
    },
    include: {
      product: {
        select: { id: true, name: true, sku: true },
      },
      category: {
        select: { id: true, name: true },
      },
    },
  })

  return productCategory
})
