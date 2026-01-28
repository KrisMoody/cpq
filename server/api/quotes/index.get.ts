import { usePrisma } from '../../utils/prisma'
import { getPhase, phaseWhere } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const query = getQuery(event)
  const includeCancelled = query.includeCancelled === 'true'

  const quotes = await prisma.quote.findMany({
    where: {
      ...phaseWhere(phase),
      ...(includeCancelled ? {} : { status: { not: 'CANCELLED' } }),
    },
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
      mrr: true,
      arr: true,
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
      currency: {
        select: {
          id: true,
          code: true,
          symbol: true,
        },
      },
      _count: {
        select: { lineItems: true },
      },
    },
  })

  return quotes
})
