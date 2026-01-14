import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const categoryId = getRouterParam(event, 'id')
  const productId = getRouterParam(event, 'productId')

  if (!categoryId) {
    throw createError({
      statusCode: 400,
      message: 'Category ID is required',
    })
  }

  if (!productId) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    })
  }

  const productCategory = await prisma.productCategory.findUnique({
    where: {
      productId_categoryId: {
        productId: productId,
        categoryId: categoryId,
      },
    },
  })

  if (!productCategory) {
    throw createError({
      statusCode: 404,
      message: 'Product is not in this category',
    })
  }

  await prisma.productCategory.delete({
    where: {
      productId_categoryId: {
        productId: productId,
        categoryId: categoryId,
      },
    },
  })

  return {
    success: true,
    message: 'Product removed from category',
  }
})
