import { usePrisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const quoteId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!quoteId) {
    throw createError({
      statusCode: 400,
      message: 'Quote ID is required',
    })
  }

  // Get the quote to find its price book
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { priceBookId: true },
  })

  if (!quote) {
    throw createError({
      statusCode: 404,
      message: 'Quote not found',
    })
  }

  // Look up the price from the quote's price book
  const priceEntry = await prisma.priceBookEntry.findUnique({
    where: {
      priceBookId_productId: {
        priceBookId: quote.priceBookId,
        productId: body.productId,
      },
    },
  })

  if (!priceEntry) {
    throw createError({
      statusCode: 400,
      message: 'Product not found in price book',
    })
  }

  const quantity = body.quantity || 1
  const listPrice = Number(priceEntry.listPrice)
  const discount = body.discount || 0
  const netPrice = (listPrice * quantity) - discount

  // Get the next sort order
  const lastLine = await prisma.quoteLineItem.findFirst({
    where: { quoteId },
    orderBy: { sortOrder: 'desc' },
  })
  const sortOrder = (lastLine?.sortOrder || 0) + 1

  const lineItem = await prisma.quoteLineItem.create({
    data: {
      quoteId,
      productId: body.productId,
      parentLineId: body.parentLineId,
      quantity,
      listPrice,
      discount,
      netPrice,
      sortOrder,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          type: true,
        },
      },
    },
  })

  // Recalculate quote totals
  const lineItems = await prisma.quoteLineItem.findMany({
    where: { quoteId },
  })

  const subtotal = lineItems.reduce((sum, item) => sum + Number(item.netPrice), 0)

  const quoteData = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { discountTotal: true },
  })

  const total = subtotal - Number(quoteData?.discountTotal || 0)

  await prisma.quote.update({
    where: { id: quoteId },
    data: { subtotal, total },
  })

  return lineItem
})
