import { usePrisma } from '../../utils/prisma'
import { getPhase, phaseWhere } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'
  const now = new Date()

  const discounts = await prisma.discount.findMany({
    where: {
      ...phaseWhere(phase),
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
