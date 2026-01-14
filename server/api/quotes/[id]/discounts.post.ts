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

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      lineItems: true,
      appliedDiscounts: true,
    },
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
      message: 'Can only apply discounts to draft quotes',
    })
  }

  let discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
  let discountValue: number
  let discountId: string | null = null
  let reason: string | null = body.reason || null

  // Check if applying a predefined discount or manual discount
  if (body.discountId) {
    const discount = await prisma.discount.findUnique({
      where: { id: body.discountId },
    })

    if (!discount) {
      throw createError({
        statusCode: 404,
        message: 'Discount not found',
      })
    }

    if (!discount.isActive) {
      throw createError({
        statusCode: 400,
        message: 'Discount is not active',
      })
    }

    // Check date validity
    const now = new Date()
    if (discount.validFrom && discount.validFrom > now) {
      throw createError({
        statusCode: 400,
        message: 'Discount is not yet valid',
      })
    }
    if (discount.validTo && discount.validTo < now) {
      throw createError({
        statusCode: 400,
        message: 'Discount has expired',
      })
    }

    // Check scope matches the target
    if (body.lineItemId && discount.scope !== 'LINE_ITEM') {
      throw createError({
        statusCode: 400,
        message: 'This discount can only be applied to the entire quote',
      })
    }
    if (!body.lineItemId && discount.scope === 'LINE_ITEM') {
      throw createError({
        statusCode: 400,
        message: 'This discount can only be applied to line items',
      })
    }

    // Check minimum order value if applicable
    if (discount.minOrderValue && Number(quote.subtotal) < Number(discount.minOrderValue)) {
      throw createError({
        statusCode: 400,
        message: `Minimum order value of ${discount.minOrderValue} not met`,
      })
    }

    // Check if discount is already applied (non-stackable)
    if (!discount.stackable) {
      const existingApplication = quote.appliedDiscounts.find(
        (ad) => ad.discountId === discount.id
      )
      if (existingApplication) {
        throw createError({
          statusCode: 400,
          message: 'This discount is already applied',
        })
      }
    }

    discountType = discount.type
    discountValue = Number(discount.value)
    discountId = discount.id
  } else if (body.type && body.value !== undefined) {
    // Manual discount
    discountType = body.type
    discountValue = Number(body.value)

    if (!reason) {
      throw createError({
        statusCode: 400,
        message: 'Reason is required for manual discounts',
      })
    }
  } else {
    throw createError({
      statusCode: 400,
      message: 'Either discountId or type/value must be provided',
    })
  }

  // Calculate the discount amount
  let calculatedAmount: number = 0
  let targetAmount: number = 0

  if (body.lineItemId) {
    const lineItem = quote.lineItems.find((li) => li.id === body.lineItemId)
    if (!lineItem) {
      throw createError({
        statusCode: 404,
        message: 'Line item not found',
      })
    }
    targetAmount = Number(lineItem.listPrice) * lineItem.quantity
  } else {
    targetAmount = Number(quote.subtotal)
  }

  if (discountType === 'PERCENTAGE') {
    calculatedAmount = (targetAmount * discountValue) / 100
  } else {
    calculatedAmount = discountValue
  }

  // Create the applied discount
  const appliedDiscount = await prisma.appliedDiscount.create({
    data: {
      quoteId,
      lineItemId: body.lineItemId || null,
      discountId,
      type: discountType,
      value: discountValue,
      calculatedAmount,
      reason,
      appliedBy: 'user',
    },
    include: {
      discount: {
        select: { id: true, name: true },
      },
    },
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
    appliedDiscount,
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
