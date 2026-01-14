import { usePrisma } from '../../../../utils/prisma'

interface CreateExchangeRateBody {
  rate: number
  effectiveDate?: string
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<CreateExchangeRateBody>(event)
  const prisma = usePrisma()

  if (!body.rate || body.rate <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Exchange rate must be a positive number',
    })
  }

  const currency = await prisma.currency.findUnique({
    where: { id },
  })

  if (!currency) {
    throw createError({
      statusCode: 404,
      message: 'Currency not found',
    })
  }

  if (currency.isBase) {
    throw createError({
      statusCode: 400,
      message: 'Cannot set exchange rate for base currency',
    })
  }

  const exchangeRate = await prisma.exchangeRate.create({
    data: {
      currencyId: id!,
      rate: body.rate,
      effectiveDate: body.effectiveDate ? new Date(body.effectiveDate) : new Date(),
    },
  })

  return exchangeRate
})
