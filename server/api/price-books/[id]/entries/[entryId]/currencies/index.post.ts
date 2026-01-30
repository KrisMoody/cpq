import { usePrisma } from '../../../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')
  const entryId = getRouterParam(event, 'entryId')
  const body = await readBody(event)

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

  if (!body.currencyId) {
    throw createError({
      statusCode: 400,
      message: 'Currency ID is required',
    })
  }

  if (body.listPrice === undefined || body.listPrice === null) {
    throw createError({
      statusCode: 400,
      message: 'List price is required',
    })
  }

  // Check entry exists and belongs to price book
  const entry = await prisma.priceBookEntry.findFirst({
    where: {
      id: entryId,
      priceBookId: id,
    },
    include: {
      priceBook: {
        select: { currencyId: true },
      },
    },
  })

  if (!entry) {
    throw createError({
      statusCode: 404,
      message: 'Price book entry not found',
    })
  }

  // Check currency exists and is active
  const currency = await prisma.currency.findUnique({
    where: { id: body.currencyId },
  })

  if (!currency) {
    throw createError({
      statusCode: 400,
      message: 'Currency not found',
    })
  }

  if (!currency.isActive) {
    throw createError({
      statusCode: 400,
      message: 'Currency is not active',
    })
  }

  // Prevent adding price for the price book's default currency
  if (entry.priceBook.currencyId === body.currencyId) {
    throw createError({
      statusCode: 400,
      message: 'Cannot add currency price for the price book\'s default currency. Update the entry\'s list price instead.',
    })
  }

  // Check for duplicate
  const existing = await prisma.priceBookEntryCurrency.findUnique({
    where: {
      entryId_currencyId: {
        entryId,
        currencyId: body.currencyId,
      },
    },
  })

  if (existing) {
    throw createError({
      statusCode: 409,
      message: 'Currency price already exists for this entry',
    })
  }

  const currencyPrice = await prisma.priceBookEntryCurrency.create({
    data: {
      entryId,
      currencyId: body.currencyId,
      listPrice: body.listPrice,
      cost: body.cost ?? null,
    },
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
  })

  return currencyPrice
})
