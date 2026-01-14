import { usePrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const prisma = usePrisma()

  const currency = await prisma.currency.findUnique({
    where: { id },
    include: {
      exchangeRates: {
        orderBy: { effectiveDate: 'desc' },
        take: 10,
      },
      _count: {
        select: {
          priceBooks: true,
          quotes: true,
          customers: true,
        },
      },
    },
  })

  if (!currency) {
    throw createError({
      statusCode: 404,
      message: 'Currency not found',
    })
  }

  return {
    ...currency,
    currentRate: currency.isBase ? 1 : Number(currency.exchangeRates[0]?.rate ?? 1),
  }
})
