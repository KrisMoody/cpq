import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const quoteId = getRouterParam(event, 'id')
  const appliedDiscountId = getRouterParam(event, 'appliedDiscountId')

  if (!quoteId || !appliedDiscountId) {
    throw createError({
      statusCode: 400,
      message: 'Quote ID and Applied Discount ID are required',
    })
  }

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
  })

  if (!quote) {
    throw createError({
      statusCode: 404,
      message: 'Quote not found',
    })
  }

  if (quote.status !== 'DRAFT') {
    throw createError({
      statusCode: 400,
      message: 'Can only remove discounts from draft quotes',
    })
  }

  const appliedDiscount = await prisma.appliedDiscount.findUnique({
    where: { id: appliedDiscountId },
  })

  if (!appliedDiscount) {
    throw createError({
      statusCode: 404,
      message: 'Applied discount not found',
    })
  }

  if (appliedDiscount.quoteId !== quoteId) {
    throw createError({
      statusCode: 400,
      message: 'Applied discount does not belong to this quote',
    })
  }

  // Delete the applied discount
  await prisma.appliedDiscount.delete({
    where: { id: appliedDiscountId },
  })

  // Recalculate quote totals
  await recalculateQuoteTotals(prisma, quoteId)

  // Return the updated quote
  const updatedQuote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      customer: {
        select: { id: true, name: true, company: true, email: true },
      },
      priceBook: {
        select: { id: true, name: true },
      },
      lineItems: {
        orderBy: { sortOrder: 'asc' },
        include: {
          product: {
            select: { id: true, name: true, sku: true, type: true },
          },
          appliedDiscounts: {
            include: {
              discount: { select: { id: true, name: true } },
            },
          },
        },
      },
      appliedDiscounts: {
        where: { lineItemId: null },
        include: {
          discount: { select: { id: true, name: true } },
        },
      },
    },
  })

  return {
    quote: updatedQuote,
    success: true,
  }
})

async function recalculateQuoteTotals(prisma: ReturnType<typeof usePrisma>, quoteId: string) {
  // Get all line items
  const lineItems = await prisma.quoteLineItem.findMany({
    where: { quoteId },
    include: {
      appliedDiscounts: true,
    },
  })

  // Calculate line item net prices including line-level discounts
  for (const lineItem of lineItems) {
    const lineDiscountAmount = lineItem.appliedDiscounts.reduce(
      (sum, ad) => sum + Number(ad.calculatedAmount),
      0
    )
    const netPrice = Number(lineItem.listPrice) * lineItem.quantity - lineDiscountAmount

    await prisma.quoteLineItem.update({
      where: { id: lineItem.id },
      data: {
        discount: lineDiscountAmount,
        netPrice: Math.max(0, netPrice),
      },
    })
  }

  // Get updated line items
  const updatedLineItems = await prisma.quoteLineItem.findMany({
    where: { quoteId },
  })

  const subtotal = updatedLineItems.reduce((sum, item) => sum + Number(item.netPrice), 0)

  // Get quote-level discounts
  const quoteDiscounts = await prisma.appliedDiscount.findMany({
    where: { quoteId, lineItemId: null },
  })

  const discountTotal = quoteDiscounts.reduce(
    (sum, ad) => sum + Number(ad.calculatedAmount),
    0
  )

  const total = Math.max(0, subtotal - discountTotal)

  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      subtotal,
      discountTotal,
      total,
    },
  })
}
