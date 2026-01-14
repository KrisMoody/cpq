import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'

  const customers = await prisma.customer.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { name: 'asc' },
    include: {
      priceBook: {
        select: { id: true, name: true },
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
