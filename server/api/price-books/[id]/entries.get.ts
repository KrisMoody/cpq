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
      currencyPrices: {
        select: {
          id: true,
          currencyId: true,
          listPrice: true,
          cost: true,
          currency: {
            select: {
              id: true,
              code: true,
              name: true,
              symbol: true,
            },
          },
        },
        orderBy: { currency: { code: 'asc' } },
      },
    },
  })

  return entries
})
