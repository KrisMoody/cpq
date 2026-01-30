import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'

  const taxProfiles = await prisma.taxProfile.findMany({
    where: {
      ...(includeInactive ? {} : { isActive: true }),
    },
    include: {
      _count: {
        select: { rates: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return taxProfiles.map((profile) => ({
    ...profile,
    ratesCount: profile._count.rates,
    _count: undefined,
  }))
})
