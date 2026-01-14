import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const includeCancelled = query.includeCancelled === 'true'

  const quotes = await prisma.quote.findMany({
    where: includeCancelled ? {} : { status: { not: 'CANCELLED' } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      customerId: true,
      status: true,
      requiresApproval: true,
      validFrom: true,
      validTo: true,
      subtotal: true,
      discountTotal: true,
      total: true,
      createdAt: true,
      customer: {
        select: {
          id: true,
          name: true,
          company: true,
        },
      },
      priceBook: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: { lineItems: true },
      },
    },
  })

  return quotes
})
