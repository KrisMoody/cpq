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

  const priceBook = await prisma.priceBook.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      currencyId: true,
      taxProfileId: true,
      isDefault: true,
      isActive: true,
      validFrom: true,
      validTo: true,
      currency: {
        select: {
          id: true,
          code: true,
          name: true,
          symbol: true,
        },
      },
      taxProfile: {
        select: {
          id: true,
          name: true,
          country: true,
        },
      },
      _count: {
        select: { entries: true },
      },
    },
  })

  if (!priceBook) {
    throw createError({
      statusCode: 404,
      message: 'Price book not found',
    })
  }

  return priceBook
})
