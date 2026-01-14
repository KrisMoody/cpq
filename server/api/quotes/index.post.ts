import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const body = await readBody(event)

  // Default validity: 30 days from now
  const validTo = body.validTo ? new Date(body.validTo) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  // If customerId provided, fetch customer to get their price book and currency preference
  let priceBookId = body.priceBookId
  let currencyId = body.currencyId
  let customer = null

  if (body.customerId) {
    customer = await prisma.customer.findUnique({
      where: { id: body.customerId },
      select: { id: true, name: true, priceBookId: true, currencyId: true },
    })
    if (!customer) {
      throw createError({
        statusCode: 400,
        message: 'Customer not found',
      })
    }
    // Use customer's price book if not explicitly specified
    if (!priceBookId && customer.priceBookId) {
      priceBookId = customer.priceBookId
    }
    // Use customer's preferred currency if not explicitly specified
    if (!currencyId && customer.currencyId) {
      currencyId = customer.currencyId
    }
  }

  // If still no priceBookId, use the default price book
  if (!priceBookId) {
    const defaultPriceBook = await prisma.priceBook.findFirst({
      where: { isDefault: true, isActive: true },
    })
    if (!defaultPriceBook) {
      throw createError({
        statusCode: 400,
        message: 'No default price book found. Please specify a priceBookId.',
      })
    }
    priceBookId = defaultPriceBook.id
  }

  // If still no currencyId, use the price book's currency or base currency
  if (!currencyId) {
    const priceBook = await prisma.priceBook.findUnique({
      where: { id: priceBookId },
      select: { currencyId: true },
    })
    if (priceBook?.currencyId) {
      currencyId = priceBook.currencyId
    } else {
      // Fall back to base currency
      const baseCurrency = await prisma.currency.findFirst({
        where: { isBase: true, isActive: true },
      })
      if (baseCurrency) {
        currencyId = baseCurrency.id
      }
    }
  }

  const quote = await prisma.quote.create({
    data: {
      name: body.name,
      customerId: body.customerId || null,
      priceBookId,
      currencyId: currencyId || null,
      validTo,
    },
    include: {
      customer: {
        select: { id: true, name: true, company: true },
      },
      priceBook: {
        select: { id: true, name: true },
      },
      currency: {
        select: { id: true, code: true, name: true, symbol: true },
      },
    },
  })

  return quote
})
