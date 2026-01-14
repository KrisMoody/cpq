import { usePrisma } from '../../utils/prisma'

interface CreateCurrencyBody {
  code: string
  name: string
  symbol: string
  isBase?: boolean
  exchangeRate?: number
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateCurrencyBody>(event)
  const prisma = usePrisma()

  if (!body.code || !body.name || !body.symbol) {
    throw createError({
      statusCode: 400,
      message: 'Code, name, and symbol are required',
    })
  }

  // Validate currency code format (ISO 4217 - 3 uppercase letters)
  if (!/^[A-Z]{3}$/.test(body.code)) {
    throw createError({
      statusCode: 400,
      message: 'Currency code must be 3 uppercase letters (ISO 4217 format)',
    })
  }

  // Check for duplicate code
  const existing = await prisma.currency.findUnique({
    where: { code: body.code },
  })

  if (existing) {
    throw createError({
      statusCode: 400,
      message: `Currency with code ${body.code} already exists`,
    })
  }

  // If this is set as base currency, unset any existing base currency
  if (body.isBase) {
    await prisma.currency.updateMany({
      where: { isBase: true },
      data: { isBase: false },
    })
  }

  const currency = await prisma.currency.create({
    data: {
      code: body.code.toUpperCase(),
      name: body.name,
      symbol: body.symbol,
      isBase: body.isBase || false,
    },
  })

  // If exchange rate provided, create initial rate
  if (body.exchangeRate && !body.isBase) {
    await prisma.exchangeRate.create({
      data: {
        currencyId: currency.id,
        rate: body.exchangeRate,
        effectiveDate: new Date(),
      },
    })
  }

  return currency
})
