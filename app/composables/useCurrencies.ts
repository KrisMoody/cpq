export interface Currency {
  id: string
  code: string
  name: string
  symbol: string
  isBase: boolean
  isActive: boolean
  currentRate?: number
  createdAt: string
  updatedAt: string
}

export interface CurrencyWithCounts extends Currency {
  _count?: {
    priceBooks: number
    quotes: number
    customers: number
  }
}

export interface ExchangeRate {
  id: string
  currencyId: string
  rate: string
  effectiveDate: string
  createdAt: string
}

export function useCurrencies() {
  const currencies = useState<Currency[]>('currencies', () => [])
  const loading = useState('currencies-loading', () => false)
  const error = useState<string | null>('currencies-error', () => null)

  async function fetchCurrencies() {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Currency[]>('/api/currencies')
      currencies.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch currencies'
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrency(id: string): Promise<CurrencyWithCounts | null> {
    try {
      return await $fetch<CurrencyWithCounts>(`/api/currencies/${id}`)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch currency'
      return null
    }
  }

  async function createCurrency(data: {
    code: string
    name: string
    symbol: string
    isBase?: boolean
    exchangeRate?: number
  }): Promise<Currency | null> {
    loading.value = true
    error.value = null
    try {
      const currency = await $fetch<Currency>('/api/currencies', {
        method: 'POST',
        body: data,
      })
      await fetchCurrencies()
      return currency
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to create currency'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateCurrency(
    id: string,
    data: Partial<{
      name: string
      symbol: string
      isBase: boolean
      isActive: boolean
    }>
  ): Promise<Currency | null> {
    loading.value = true
    error.value = null
    try {
      const currency = await $fetch<Currency>(`/api/currencies/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchCurrencies()
      return currency
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to update currency'
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteCurrency(id: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/currencies/${id}`, {
        method: 'DELETE',
      })
      await fetchCurrencies()
      return true
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to delete currency'
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchExchangeRates(currencyId: string): Promise<ExchangeRate[]> {
    try {
      return await $fetch<ExchangeRate[]>(`/api/currencies/${currencyId}/rates`)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch exchange rates'
      return []
    }
  }

  async function addExchangeRate(
    currencyId: string,
    data: { rate: number; effectiveDate?: string }
  ): Promise<ExchangeRate | null> {
    error.value = null
    try {
      const rate = await $fetch<ExchangeRate>(`/api/currencies/${currencyId}/rates`, {
        method: 'POST',
        body: data,
      })
      await fetchCurrencies() // Refresh to get updated current rate
      return rate
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to add exchange rate'
      return null
    }
  }

  function getBaseCurrency(): Currency | undefined {
    return currencies.value.find((c) => c.isBase)
  }

  /**
   * Format a price with the specified currency
   * @param price - The price to format
   * @param currency - Currency object with code and symbol, or null for USD default
   */
  function formatPrice(
    price: string | number,
    currency?: { code: string; symbol: string } | null
  ): string {
    const num = typeof price === 'string' ? parseFloat(price) : price

    if (!currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(num)
    }

    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.code,
      }).format(num)
    } catch {
      // Fallback for unsupported currency codes
      return `${currency.symbol}${num.toFixed(2)}`
    }
  }

  return {
    currencies,
    loading,
    error,
    fetchCurrencies,
    fetchCurrency,
    createCurrency,
    updateCurrency,
    deleteCurrency,
    fetchExchangeRates,
    addExchangeRate,
    getBaseCurrency,
    formatPrice,
  }
}
