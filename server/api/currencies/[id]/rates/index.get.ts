import { usePrisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const prisma = usePrisma()

  const currency = await prisma.currency.findUnique({
    where: { id },
  })

  if (!currency) {
    throw createError({
      statusCode: 404,
      message: 'Currency not found',
    })
  }

  // Base currency always has rate of 1
  if (currency.isBase) {
    return [
      {
        id: 'base',
        currencyId: id,
        rate: '1',
        effectiveDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ]
  }

  const rates = await prisma.exchangeRate.findMany({
    where: { currencyId: id },
    orderBy: { effectiveDate: 'desc' },
    take: 100,
  })

  return rates
})
