import { usePrisma } from '../../utils/prisma'

interface UpdateCurrencyBody {
  name?: string
  symbol?: string
  isBase?: boolean
  isActive?: boolean
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<UpdateCurrencyBody>(event)
  const prisma = usePrisma()

  const existing = await prisma.currency.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Currency not found',
    })
  }

  // If setting this as base currency, unset any existing base currency
  if (body.isBase && !existing.isBase) {
    await prisma.currency.updateMany({
      where: { isBase: true },
      data: { isBase: false },
    })
  }

  const currency = await prisma.currency.update({
    where: { id },
    data: {
      name: body.name,
      symbol: body.symbol,
      isBase: body.isBase,
      isActive: body.isActive,
    },
  })

  return currency
})
