import { usePrisma } from '../../utils/prisma'
import { getPhase, phaseWhere } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'

  const customers = await prisma.customer.findMany({
    where: {
      ...phaseWhere(phase),
      ...(includeInactive ? {} : { isActive: true }),
    },
    orderBy: { name: 'asc' },
    include: {
      priceBook: {
        select: { id: true, name: true },
      },
      currency: {
        select: { id: true, code: true, name: true, symbol: true },
      },
      _count: {
        select: { quotes: true },
      },
    },
  })

  return customers.map((customer) => ({
    ...customer,
    quoteCount: customer._count.quotes,
    _count: undefined,
  }))
})
