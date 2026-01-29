import { usePrisma } from '../../utils/prisma'
import { getPhase, phaseWhere } from '../../utils/phase'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const priceBooks = await prisma.priceBook.findMany({
    where: {
      ...phaseWhere(phase),
      isActive: true,
    },
    orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      currencyId: true,
      isDefault: true,
      isActive: true,
      validFrom: true,
      validTo: true,
      currency: {
        select: {
          id: true,
          code: true,
          name: true,
          symbol: true,
        },
      },
      _count: {
        select: { entries: true },
      },
    },
  })

  return priceBooks
})
