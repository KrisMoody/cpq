import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const body = await readBody(event)

  // Default validity: 30 days from now
  const validTo = body.validTo ? new Date(body.validTo) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  // If customerId provided, fetch customer to get their price book preference
  let priceBookId = body.priceBookId
  let customer = null

  if (body.customerId) {
    customer = await prisma.customer.findUnique({
      where: { id: body.customerId },
      select: { id: true, name: true, priceBookId: true },
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

  const quote = await prisma.quote.create({
    data: {
      name: body.name,
      customerId: body.customerId || null,
      priceBookId,
      validTo,
    },
    include: {
      customer: {
        select: { id: true, name: true, company: true },
      },
      priceBook: {
        select: { id: true, name: true },
      },
    },
  })

  return quote
})
