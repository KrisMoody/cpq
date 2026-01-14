import { usePrisma } from '../../../utils/prisma'
import { QuoteStatus } from '../../../../app/generated/prisma/client.js'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const quoteId = getRouterParam(event, 'id')

  if (!quoteId) {
    throw createError({
      statusCode: 400,
      message: 'Quote ID is required',
    })
  }

  // Get the original quote with all line items
  const originalQuote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      lineItems: {
        include: {
          product: {
            select: {
              billingFrequency: true,
            },
          },
        },
      },
    },
  })

  if (!originalQuote) {
    throw createError({
      statusCode: 404,
      message: 'Quote not found',
    })
  }

  // Only allow renewal from finalized or accepted quotes
  if (!['FINALIZED', 'ACCEPTED'].includes(originalQuote.status)) {
    throw createError({
      statusCode: 400,
      message: 'Can only create renewal from finalized or accepted quotes',
    })
  }

  // Filter to only recurring line items
  const recurringLineItems = originalQuote.lineItems.filter(
    (item) => item.product.billingFrequency !== 'ONE_TIME'
  )

  if (recurringLineItems.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No recurring items found on this quote to renew',
    })
  }

  // Calculate new validity period (start from original validTo)
  const validFrom = new Date(originalQuote.validTo)
  const validTo = new Date(validFrom)
  validTo.setFullYear(validTo.getFullYear() + 1)

  // Create renewal quote
  const renewalQuote = await prisma.quote.create({
    data: {
      name: `${originalQuote.name} - Renewal`,
      customerId: originalQuote.customerId,
      status: QuoteStatus.DRAFT,
      priceBookId: originalQuote.priceBookId,
      validFrom,
      validTo,
      lineItems: {
        create: recurringLineItems.map((item, index) => ({
          productId: item.productId,
          quantity: item.quantity,
          listPrice: item.listPrice,
          discount: item.discount,
          netPrice: item.netPrice,
          termMonths: item.termMonths,
          isProrated: false, // Renewals are not prorated
          sortOrder: index,
        })),
      },
    },
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
            select: {
              id: true,
              name: true,
              sku: true,
              type: true,
              billingFrequency: true,
              defaultTermMonths: true,
            },
          },
        },
      },
    },
  })

  return {
    quote: renewalQuote,
    originalQuoteId: quoteId,
    message: `Renewal quote created with ${recurringLineItems.length} recurring item(s)`,
  }
})
