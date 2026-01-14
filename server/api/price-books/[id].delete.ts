import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Price book ID is required',
    })
  }

  const existing = await prisma.priceBook.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Price book not found',
    })
  }

  // Soft delete by setting isActive to false
  const priceBook = await prisma.priceBook.update({
    where: { id },
    data: { isActive: false },
    select: {
      id: true,
      name: true,
      isDefault: true,
      isActive: true,
      validFrom: true,
      validTo: true,
    },
  })

  return priceBook
})
