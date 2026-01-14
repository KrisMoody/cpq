import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'

  const taxRates = await prisma.taxRate.findMany({
    where: includeInactive ? {} : { isActive: true },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
    orderBy: [{ country: 'asc' }, { state: 'asc' }, { name: 'asc' }],
  })

  return taxRates
})
