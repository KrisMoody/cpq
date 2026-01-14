import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const prisma = usePrisma()

  const currency = await prisma.currency.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          priceBooks: true,
          quotes: true,
          customers: true,
        },
      },
    },
  })

  if (!currency) {
    throw createError({
      statusCode: 404,
      message: 'Currency not found',
    })
  }

  if (currency.isBase) {
    throw createError({
      statusCode: 400,
      message: 'Cannot delete the base currency',
    })
  }

  // Check for active usage
  const totalUsage =
    currency._count.priceBooks + currency._count.quotes + currency._count.customers

  if (totalUsage > 0) {
    // Soft delete - deactivate instead of delete
    await prisma.currency.update({
      where: { id },
      data: { isActive: false },
    })
    return { success: true, deactivated: true }
  }

  // Hard delete if not in use
  await prisma.currency.delete({
    where: { id },
  })

  return { success: true, deleted: true }
})
