import type { Currency } from './useCurrencies'
import { getErrorMessage } from '../utils/errors.js'

export interface PriceBook {
  id: string
  name: string
  currencyId: string | null
  isDefault: boolean
  isActive: boolean
  validFrom: string | null
  validTo: string | null
  currency?: Currency | null
  _count: {
    entries: number
  }
}

export interface PriceBookEntry {
  id: string
  priceBookId: string
  productId: string
  listPrice: string
  cost: string | null
  product: {
    id: string
    name: string
    sku: string
    type: string
  }
}

export interface PriceBookWithEntries extends PriceBook {
  entries: PriceBookEntry[]
}

export interface CreatePriceBookInput {
  name: string
  currencyId?: string | null
  isDefault?: boolean
  isActive?: boolean
  validFrom?: string | null
  validTo?: string | null
}

export interface UpdatePriceBookInput {
  name?: string
  currencyId?: string | null
  isDefault?: boolean
  isActive?: boolean
  validFrom?: string | null
  validTo?: string | null
}

export interface CreatePriceBookEntryInput {
  productId: string
  listPrice: number
  cost?: number | null
}

export interface PriceTierInput {
  minQuantity: number
  maxQuantity?: number | null
  tierPrice: number
  tierType?: string
}

export interface UpdatePriceBookEntryInput {
  listPrice?: number
  cost?: number | null
  tiers?: PriceTierInput[]
}

export function usePricing() {
  const priceBooks = useState<PriceBook[]>('priceBooks', () => [])
  const loading = useState('pricing-loading', () => false)
  const error = useState<string | null>('pricing-error', () => null)

  async function fetchPriceBooks() {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<PriceBook[]>('/api/price-books')
      priceBooks.value = data
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to fetch price books')
    } finally {
      loading.value = false
    }
  }

  async function fetchPriceBook(id: string): Promise<PriceBook | null> {
    try {
      return await $fetch<PriceBook>(`/api/price-books/${id}`)
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to fetch price book')
      return null
    }
  }

  async function fetchPriceBookPrices(id: string): Promise<PriceBookWithEntries | null> {
    try {
      return await $fetch<PriceBookWithEntries>(`/api/price-books/${id}/prices`)
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to fetch prices')
      return null
    }
  }

  async function createPriceBook(input: CreatePriceBookInput): Promise<PriceBook | null> {
    loading.value = true
    error.value = null
    try {
      const priceBook = await $fetch<PriceBook>('/api/price-books', {
        method: 'POST',
        body: input,
      })
      await fetchPriceBooks()
      return priceBook
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to create price book')
      return null
    } finally {
      loading.value = false
    }
  }

  async function updatePriceBook(id: string, input: UpdatePriceBookInput): Promise<PriceBook | null> {
    loading.value = true
    error.value = null
    try {
      const priceBook = await $fetch<PriceBook>(`/api/price-books/${id}`, {
        method: 'PUT',
        body: input,
      })
      await fetchPriceBooks()
      return priceBook
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to update price book')
      return null
    } finally {
      loading.value = false
    }
  }

  async function deletePriceBook(id: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/price-books/${id}` as string, {
        method: 'DELETE',
      })
      await fetchPriceBooks()
      return true
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to delete price book')
      return false
    } finally {
      loading.value = false
    }
  }

  async function addPriceBookEntry(priceBookId: string, input: CreatePriceBookEntryInput): Promise<PriceBookEntry | null> {
    error.value = null
    try {
      return await $fetch<PriceBookEntry>(`/api/price-books/${priceBookId}/entries`, {
        method: 'POST',
        body: input,
      })
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to add price book entry')
      return null
    }
  }

  async function updatePriceBookEntry(priceBookId: string, entryId: string, input: UpdatePriceBookEntryInput): Promise<PriceBookEntry | null> {
    error.value = null
    try {
      return await $fetch<PriceBookEntry>(`/api/price-books/${priceBookId}/entries/${entryId}`, {
        method: 'PUT',
        body: input,
      })
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to update price book entry')
      return null
    }
  }

  async function deletePriceBookEntry(priceBookId: string, entryId: string): Promise<boolean> {
    error.value = null
    try {
      await $fetch(`/api/price-books/${priceBookId}/entries/${entryId}`, {
        method: 'DELETE',
      })
      return true
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to delete price book entry')
      return false
    }
  }

  function getDefaultPriceBook(): PriceBook | undefined {
    return priceBooks.value.find((pb) => pb.isDefault)
  }

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
    priceBooks,
    loading,
    error,
    fetchPriceBooks,
    fetchPriceBook,
    fetchPriceBookPrices,
    createPriceBook,
    updatePriceBook,
    deletePriceBook,
    addPriceBookEntry,
    updatePriceBookEntry,
    deletePriceBookEntry,
    getDefaultPriceBook,
    formatPrice,
  }
}
