import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const quoteId = getRouterParam(event, 'id')
  const lineId = getRouterParam(event, 'lineId')

  if (!quoteId || !lineId) {
    throw createError({
      statusCode: 400,
      message: 'Quote ID and Line ID are required',
    })
  }

  // First delete any child line items
  await prisma.quoteLineItem.deleteMany({
    where: { parentLineId: lineId },
  })

  // Then delete the line item itself
  await prisma.quoteLineItem.delete({
    where: { id: lineId },
  })

  // Recalculate quote totals
  const lineItems = await prisma.quoteLineItem.findMany({
    where: { quoteId },
  })

  const subtotal = lineItems.reduce((sum, item) => sum + Number(item.netPrice), 0)

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { discountTotal: true },
  })

  const total = subtotal - Number(quote?.discountTotal || 0)

  await prisma.quote.update({
    where: { id: quoteId },
    data: { subtotal, total },
  })

  return { success: true }
})
