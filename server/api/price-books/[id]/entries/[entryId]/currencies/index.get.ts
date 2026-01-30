import { usePrisma } from '../../../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const entryId = getRouterParam(event, 'entryId')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Price book ID is required',
    })
  }

  if (!entryId) {
    throw createError({
      statusCode: 400,
      message: 'Entry ID is required',
    })
  }

  // Check entry exists and belongs to price book
  const entry = await prisma.priceBookEntry.findFirst({
    where: {
      id: entryId,
      priceBookId: id,
    },
  })

  if (!entry) {
    throw createError({
      statusCode: 404,
      message: 'Price book entry not found',
    })
  }

  const currencyPrices = await prisma.priceBookEntryCurrency.findMany({
    where: { entryId },
    include: {
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
  })

  return currencyPrices
})
