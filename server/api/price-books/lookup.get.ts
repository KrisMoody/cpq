import { usePrisma } from '../../utils/prisma'
import { lookupPrice, lookupPriceWithCurrency } from '../../services/priceLookup'
import { getExchangeRate } from '../../services/currencyService'

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)

  const productId = query.productId as string
  const priceBookId = query.priceBookId as string
  const quantity = parseInt(query.quantity as string) || 1
  const currencyId = query.currencyId as string | undefined

  if (!productId) {
    throw createError({
      statusCode: 400,
      message: 'productId is required',
    })
  }

  if (!priceBookId) {
    throw createError({
      statusCode: 400,
      message: 'priceBookId is required',
    })
  }

  // Find the price book entry with currency prices
  const entry = await prisma.priceBookEntry.findUnique({
    where: {
      priceBookId_productId: {
        priceBookId,
        productId,
      },
    },
    include: {
      priceTiers: {
        orderBy: { minQuantity: 'asc' },
      },
      currencyPrices: {
        include: {
          currency: {
            select: {
              id: true,
              code: true,
              name: true,
              symbol: true,
            },
          },
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
        },
      },
      priceBook: {
        select: {
          currencyId: true,
          currency: {
            select: {
              id: true,
              code: true,
            },
          },
        },
      },
    },
  })

  if (!entry) {
    throw createError({
      statusCode: 404,
      message: 'Price not found for this product in the specified price book',
    })
  }

  // If no currency specified, use standard lookup
  if (!currencyId) {
    const result = lookupPrice(entry, quantity)
    return {
      product: entry.product,
      priceBookId,
      quantity,
      listPrice: Number(entry.listPrice),
      ...result,
      totalPrice: result.unitPrice * quantity,
    }
  }

  // Get target currency info
  const targetCurrency = await prisma.currency.findUnique({
    where: { id: currencyId },
  })

  if (!targetCurrency) {
    throw createError({
      statusCode: 400,
      message: 'Currency not found',
    })
  }

  // Get exchange rate for conversion fallback
  const priceBookCurrencyId = entry.priceBook.currencyId
  let exchangeRate: number | undefined
  let rateEffectiveDate: Date | undefined

  if (priceBookCurrencyId && currencyId !== priceBookCurrencyId) {
    // Get rate from price book currency to target currency
    const fromRate = await getExchangeRate(priceBookCurrencyId)
    const toRate = await getExchangeRate(currencyId)
    exchangeRate = fromRate / toRate
    rateEffectiveDate = new Date()
  }

  const result = lookupPriceWithCurrency(entry, quantity, {
    targetCurrencyId: currencyId,
    targetCurrencyCode: targetCurrency.code,
    priceBookCurrencyId,
    exchangeRate,
    rateEffectiveDate,
  })

  return {
    product: entry.product,
    priceBookId,
    quantity,
    listPrice: Number(entry.listPrice),
    ...result,
    totalPrice: result.unitPrice * quantity,
  }
})
