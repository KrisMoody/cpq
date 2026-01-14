import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    })
  }

  // Check product exists
  const existing = await prisma.product.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Product not found',
    })
  }

  // Soft delete - set isActive to false
  const product = await prisma.product.update({
    where: { id },
    data: { isActive: false },
  })

  return { success: true, id: product.id }
})
