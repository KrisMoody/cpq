import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Category ID is required',
    })
  }

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      parent: {
        select: { id: true, name: true },
      },
      children: {
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        select: { id: true, name: true, description: true },
      },
      products: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              type: true,
              isActive: true,
            },
          },
        },
      },
    },
  })

  if (!category) {
    throw createError({
      statusCode: 404,
      message: 'Category not found',
    })
  }

  return {
    ...category,
    products: category.products.map((pc) => pc.product),
  }
})
