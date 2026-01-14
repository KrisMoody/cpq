import { usePrisma } from '../utils/prisma'
import type { Currency, ExchangeRate } from '../../app/generated/prisma'

export interface CurrencyWithRate extends Currency {
  currentRate?: number
}

/**
 * Get the exchange rate for a currency at a specific date
 * Returns the most recent rate at or before the given date
 */
export async function getExchangeRate(
  currencyId: string,
  date: Date = new Date()
): Promise<number> {
  const prisma = usePrisma()

  // Check if this is the base currency
  const currency = await prisma.currency.findUnique({
    where: { id: currencyId },
  })

  if (!currency) {
    throw new Error(`Currency not found: ${currencyId}`)
  }

  // Base currency always has rate of 1
  if (currency.isBase) {
    return 1
  }

  // Find the most recent exchange rate at or before the given date
  const rate = await prisma.exchangeRate.findFirst({
    where: {
      currencyId,
      effectiveDate: {
        lte: date,
      },
    },
    orderBy: {
      effectiveDate: 'desc',
    },
  })

  if (!rate) {
    // No rate found, return 1 as default (assume parity with base)
    console.warn(`No exchange rate found for currency ${currencyId}, using default rate of 1`)
    return 1
  }

  return Number(rate.rate)
}

/**
 * Get the base currency
 */
export async function getBaseCurrency(): Promise<Currency | null> {
  const prisma = usePrisma()
  return prisma.currency.findFirst({
    where: { isBase: true, isActive: true },
  })
}

/**
 * Convert an amount from one currency to another
 * Uses the base currency as an intermediary
 */
export async function convertAmount(
  amount: number,
  fromCurrencyId: string,
  toCurrencyId: string,
  date: Date = new Date()
): Promise<number> {
  // Same currency, no conversion needed
  if (fromCurrencyId === toCurrencyId) {
    return amount
  }

  // Get rates for both currencies
  const fromRate = await getExchangeRate(fromCurrencyId, date)
  const toRate = await getExchangeRate(toCurrencyId, date)

  // Convert: amount -> base currency -> target currency
  // fromRate is "how many base currency units per 1 fromCurrency"
  // toRate is "how many base currency units per 1 toCurrency"
  const baseAmount = amount * fromRate
  const targetAmount = baseAmount / toRate

  return Math.round(targetAmount * 100) / 100
}

/**
 * Convert an amount to base currency
 */
export async function convertToBaseCurrency(
  amount: number,
  fromCurrencyId: string,
  date: Date = new Date()
): Promise<number> {
  const baseCurrency = await getBaseCurrency()
  if (!baseCurrency) {
    return amount // No base currency defined, return original
  }

  return convertAmount(amount, fromCurrencyId, baseCurrency.id, date)
}

/**
 * Format an amount with the appropriate currency symbol
 */
export async function formatCurrency(
  amount: number,
  currencyId: string
): Promise<string> {
  const prisma = usePrisma()
  const currency = await prisma.currency.findUnique({
    where: { id: currencyId },
  })

  if (!currency) {
    // Fallback to USD formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
  }).format(amount)
}

/**
 * Format currency synchronously when currency object is already available
 */
export function formatCurrencySync(
  amount: number,
  currency: { code: string; symbol: string } | null | undefined
): string {
  if (!currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
    }).format(amount)
  } catch {
    // Fallback for unsupported currency codes
    return `${currency.symbol}${amount.toFixed(2)}`
  }
}

/**
 * Get all active currencies with their current exchange rates
 */
export async function getCurrenciesWithRates(): Promise<CurrencyWithRate[]> {
  const prisma = usePrisma()
  const currencies = await prisma.currency.findMany({
    where: { isActive: true },
    orderBy: [{ isBase: 'desc' }, { code: 'asc' }],
  })

  const now = new Date()
  const result: CurrencyWithRate[] = []

  for (const currency of currencies) {
    const rate = await getExchangeRate(currency.id, now)
    result.push({
      ...currency,
      currentRate: rate,
    })
  }

  return result
}
