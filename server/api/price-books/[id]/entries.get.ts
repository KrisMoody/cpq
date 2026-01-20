import { usePrisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Price book ID is required',
    })
  }

  const entries = await prisma.priceBookEntry.findMany({
    where: { priceBookId: id },
    select: {
      id: true,
      productId: true,
      listPrice: true,
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
  })

  return entries
})
