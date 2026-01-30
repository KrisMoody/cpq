import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Quote ID is required',
    })
  }

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          company: true,
          email: true,
          isTaxExempt: true,
          taxExemptReason: true,
          taxExemptExpiry: true,
          country: true,
          state: true,
        },
      },
      priceBook: {
        select: {
          id: true,
          name: true,
          currencyId: true,
        },
      },
      currency: {
        select: { id: true, code: true, name: true, symbol: true },
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
              isActive: true,
              isTaxable: true,
              billingFrequency: true,
              customBillingMonths: true,
              defaultTermMonths: true,
              unitOfMeasure: {
                select: { id: true, name: true, abbreviation: true },
              },
              attributes: {
                select: {
                  value: true,
                  attribute: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                      type: true,
                      options: true,
                    },
                  },
                },
                orderBy: {
                  attribute: { sortOrder: 'asc' },
                },
              },
            },
          },
          appliedDiscounts: {
            include: {
              discount: {
                select: { id: true, name: true },
              },
            },
          },
        },
      },
      appliedDiscounts: {
        where: { lineItemId: null },
        include: {
          discount: {
            select: { id: true, name: true },
          },
        },
      },
    },
  })

  if (!quote) {
    throw createError({
      statusCode: 404,
      message: 'Quote not found',
    })
  }

  // Organize line items into parent/child hierarchy
  const parentLines = quote.lineItems.filter((li) => !li.parentLineId)
  const childLinesMap = new Map<string, typeof quote.lineItems>()

  quote.lineItems.forEach((li) => {
    if (li.parentLineId) {
      const children = childLinesMap.get(li.parentLineId) || []
      children.push(li)
      childLinesMap.set(li.parentLineId, children)
    }
  })

  const hierarchicalLineItems = parentLines.map((parent) => ({
    ...parent,
    childLines: childLinesMap.get(parent.id) || [],
  }))

  return {
    ...quote,
    lineItems: hierarchicalLineItems,
  }
})
