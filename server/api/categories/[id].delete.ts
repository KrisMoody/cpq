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
      _count: {
        select: { products: true, children: true },
      },
    },
  })

  if (!category) {
    throw createError({
      statusCode: 404,
      message: 'Category not found',
    })
  }

  // Soft delete by deactivating
  const updated = await prisma.category.update({
    where: { id },
    data: { isActive: false },
  })

  return {
    success: true,
    message: 'Category deactivated',
    category: updated,
  }
})
