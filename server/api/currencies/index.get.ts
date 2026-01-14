import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const prisma = usePrisma()
  const currencies = await prisma.currency.findMany({
    where: { isActive: true },
    orderBy: [{ isBase: 'desc' }, { code: 'asc' }],
    include: {
      exchangeRates: {
        orderBy: { effectiveDate: 'desc' },
        take: 1,
      },
    },
  })

  return currencies.map((currency) => ({
    ...currency,
    currentRate: currency.isBase ? 1 : Number(currency.exchangeRates[0]?.rate ?? 1),
    exchangeRates: undefined,
  }))
})
