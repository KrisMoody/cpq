import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'
  const now = new Date()

  const discounts = await prisma.discount.findMany({
    where: {
      ...(includeInactive ? {} : {
        isActive: true,
        OR: [
          { validFrom: null },
          { validFrom: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { validTo: null },
              { validTo: { gte: now } },
            ],
          },
        ],
      }),
    },
    include: {
      tiers: {
        orderBy: { tierNumber: 'asc' },
      },
    },
    orderBy: [{ priority: 'asc' }, { name: 'asc' }],
  })

  return discounts
})
