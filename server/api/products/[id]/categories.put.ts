import { usePrisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    })
  }

  // Validate product exists
  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!product) {
    throw createError({
      statusCode: 404,
      message: 'Product not found',
    })
  }

  const categoryIds: string[] = body.categoryIds || []

  // Validate categories exist if provided
  if (categoryIds.length > 0) {
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true },
    })
    const existingIds = new Set(categories.map((c) => c.id))
    const missingIds = categoryIds.filter((cid) => !existingIds.has(cid))
    if (missingIds.length > 0) {
      throw createError({
        statusCode: 400,
        message: `Categories not found: ${missingIds.join(', ')}`,
      })
    }
  }

  // Update categories in a transaction
  await prisma.$transaction(async (tx) => {
    // Delete existing category associations
    await tx.productCategory.deleteMany({
      where: { productId: id },
    })

    // Create new category associations
    if (categoryIds.length > 0) {
      await tx.productCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          productId: id,
          categoryId,
        })),
      })
    }
  })

  // Return updated categories
  const updatedCategories = await prisma.productCategory.findMany({
    where: { productId: id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          parentId: true,
          parent: {
            select: { id: true, name: true },
          },
        },
      },
    },
  })

  return updatedCategories.map((pc) => pc.category)
})
