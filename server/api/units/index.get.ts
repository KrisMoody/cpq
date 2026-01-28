import { usePrisma } from '../../utils/prisma'
import { getPhase, phaseWhere } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'

  const units = await prisma.unitOfMeasure.findMany({
    where: {
      ...phaseWhere(phase),
      ...(includeInactive ? {} : { isActive: true }),
    },
    orderBy: { name: 'asc' },
    include: {
      baseUnit: {
        select: { id: true, name: true, abbreviation: true },
      },
    },
  })

  return units
})
