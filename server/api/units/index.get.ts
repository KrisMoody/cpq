import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const includeInactive = query.includeInactive === 'true'

  const units = await prisma.unitOfMeasure.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { name: 'asc' },
    include: {
      baseUnit: {
        select: { id: true, name: true, abbreviation: true },
      },
    },
  })

  return units
})
