import { usePrisma } from '../../utils/prisma'
import { getPhase, phaseWhere } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'

  const taxRates = await prisma.taxRate.findMany({
    where: {
      ...phaseWhere(phase),
      ...(includeInactive ? {} : { isActive: true }),
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
    orderBy: [{ country: 'asc' }, { state: 'asc' }, { name: 'asc' }],
  })

  return taxRates
})
