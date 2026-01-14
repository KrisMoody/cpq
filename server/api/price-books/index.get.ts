import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const prisma = usePrisma()
  const priceBooks = await prisma.priceBook.findMany({
    where: { isActive: true },
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
