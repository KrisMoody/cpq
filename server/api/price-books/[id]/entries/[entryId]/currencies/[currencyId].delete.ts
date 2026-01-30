import { usePrisma } from '../../../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const entryId = getRouterParam(event, 'entryId')
  const currencyId = getRouterParam(event, 'currencyId')

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

  if (!currencyId) {
    throw createError({
      statusCode: 400,
      message: 'Currency ID is required',
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

  // Check currency price exists
  const existing = await prisma.priceBookEntryCurrency.findUnique({
    where: {
      entryId_currencyId: {
        entryId,
        currencyId,
      },
    },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Currency price not found',
    })
  }

  await prisma.priceBookEntryCurrency.delete({
    where: {
      entryId_currencyId: {
        entryId,
        currencyId,
      },
    },
  })

  return { success: true }
})
