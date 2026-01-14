import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const quoteId = getRouterParam(event, 'id')
  const lineId = getRouterParam(event, 'lineId')
  const body = await readBody(event)

  if (!quoteId || !lineId) {
    throw createError({
      statusCode: 400,
      message: 'Quote ID and Line ID are required',
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
      message: 'Can only update line items on draft quotes',
    })
  }

  const lineItem = await prisma.quoteLineItem.findUnique({
    where: { id: lineId },
    include: {
      appliedDiscounts: true,
    },
  })

  if (!lineItem) {
    throw createError({
      statusCode: 404,
      message: 'Line item not found',
    })
  }

  if (lineItem.quoteId !== quoteId) {
    throw createError({
      statusCode: 400,
      message: 'Line item does not belong to this quote',
    })
  }

  const quantity = body.quantity
  if (quantity === undefined || quantity < 1) {
    throw createError({
      statusCode: 400,
      message: 'Quantity must be at least 1',
    })
  }

  // Check for price tiers
  const priceEntry = await prisma.priceBookEntry.findUnique({
    where: {
      priceBookId_productId: {
        priceBookId: quote.priceBookId,
        productId: lineItem.productId,
      },
    },
    include: {
      priceTiers: {
        orderBy: { minQuantity: 'asc' },
      },
    },
  })

  let listPrice = Number(lineItem.listPrice)

  if (priceEntry) {
    // Check if there's a tier for this quantity
    const applicableTier = priceEntry.priceTiers.find(
      (tier) =>
        quantity >= tier.minQuantity &&
        (tier.maxQuantity === null || quantity <= tier.maxQuantity)
    )

    if (applicableTier) {
      listPrice = Number(applicableTier.tierPrice)
    } else {
      listPrice = Number(priceEntry.listPrice)
    }
  }

  // Recalculate line item discount amounts for percentage discounts
  for (const discount of lineItem.appliedDiscounts) {
    if (discount.type === 'PERCENTAGE') {
      const newCalculatedAmount = (listPrice * quantity * Number(discount.value)) / 100
      await prisma.appliedDiscount.update({
        where: { id: discount.id },
        data: { calculatedAmount: newCalculatedAmount },
      })
    }
  }

  // Get updated discounts
  const updatedDiscounts = await prisma.appliedDiscount.findMany({
    where: { lineItemId: lineId },
  })

  const lineDiscountAmount = updatedDiscounts.reduce(
    (sum, ad) => sum + Number(ad.calculatedAmount),
    0
  )

  const netPrice = listPrice * quantity - lineDiscountAmount

  // Update the line item
  const updatedLineItem = await prisma.quoteLineItem.update({
    where: { id: lineId },
    data: {
      quantity,
      listPrice,
      discount: lineDiscountAmount,
      netPrice: Math.max(0, netPrice),
      termMonths: body.termMonths !== undefined ? body.termMonths : lineItem.termMonths,
      isProrated: body.isProrated !== undefined ? body.isProrated : lineItem.isProrated,
      proratedAmount: body.proratedAmount !== undefined ? body.proratedAmount : lineItem.proratedAmount,
    },
    include: {
      product: {
        select: { id: true, name: true, sku: true, type: true, billingFrequency: true, defaultTermMonths: true },
      },
      appliedDiscounts: {
        include: {
          discount: { select: { id: true, name: true } },
        },
      },
    },
  })

  // Recalculate quote totals
  const allLineItems = await prisma.quoteLineItem.findMany({
    where: { quoteId },
  })

  const subtotal = allLineItems.reduce((sum, item) => sum + Number(item.netPrice), 0)

  // Get quote-level discounts and recalculate if percentage-based
  const quoteDiscounts = await prisma.appliedDiscount.findMany({
    where: { quoteId, lineItemId: null },
  })

  for (const discount of quoteDiscounts) {
    if (discount.type === 'PERCENTAGE') {
      const newCalculatedAmount = (subtotal * Number(discount.value)) / 100
      await prisma.appliedDiscount.update({
        where: { id: discount.id },
        data: { calculatedAmount: newCalculatedAmount },
      })
    }
  }

  // Get updated quote discounts
  const updatedQuoteDiscounts = await prisma.appliedDiscount.findMany({
    where: { quoteId, lineItemId: null },
  })

  const discountTotal = updatedQuoteDiscounts.reduce(
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

  // Return updated quote
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
    lineItem: updatedLineItem,
  }
})
