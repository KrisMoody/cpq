import { usePrisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Price Book ID is required',
    })
  }

  const priceBook = await prisma.priceBook.findUnique({
    where: { id },
    include: {
      entries: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              type: true,
            },
          },
          priceTiers: {
            orderBy: { minQuantity: 'asc' },
          },
        },
        orderBy: {
          product: { name: 'asc' },
        },
      },
    },
  })

  if (!priceBook) {
    throw createError({
      statusCode: 404,
      message: 'Price Book not found',
    })
  }

  return priceBook
})
