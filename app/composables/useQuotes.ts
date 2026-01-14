import type { QuoteStatus } from '../generated/prisma'
import type { TaxBreakdownItem } from './useTaxRates'

export interface AppliedDiscount {
  id: string
  type: string
  value: string
  calculatedAmount: string
  reason?: string
  discount?: {
    id: string
    name: string
  }
}

export interface QuoteLineItem {
  id: string
  quoteId: string
  productId: string
  parentLineId: string | null
  quantity: number
  listPrice: string
  discount: string
  netPrice: string
  sortOrder: number
  product: {
    id: string
    name: string
    sku: string
    type: string
  }
  childLines?: QuoteLineItem[]
  appliedDiscounts?: AppliedDiscount[]
}

export interface Quote {
  id: string
  name: string
  customerId: string | null
  status: QuoteStatus
  requiresApproval: boolean
  priceBookId: string
  validFrom: string
  validTo: string
  subtotal: string
  discountTotal: string
  taxAmount: string
  taxBreakdown: TaxBreakdownItem[] | null
  total: string
  approvedBy?: string
  approvedAt?: string
  createdAt: string
  customer?: {
    id: string
    name: string
    company?: string
    isTaxExempt?: boolean
    taxExemptReason?: string | null
    taxExemptExpiry?: string | null
  }
  priceBook: {
    id: string
    name: string
  }
  _count?: {
    lineItems: number
  }
}

export interface RuleEvaluationResult {
  ruleId: string
  ruleName: string
  ruleType: string
  triggered: boolean
  actions: Array<{
    type: string
    message?: string
  }>
}

export interface EvaluationSummary {
  rules: RuleEvaluationResult[]
  warnings: string[]
  errors: string[]
  requiresApproval: boolean
  approvalReasons: string[]
}

export interface QuoteWithLineItems extends Quote {
  lineItems: QuoteLineItem[]
  appliedDiscounts?: AppliedDiscount[]
}

export interface CalculateQuoteResponse {
  quote: QuoteWithLineItems
  evaluation: EvaluationSummary
}

export interface ApplyDiscountRequest {
  discountId?: string
  lineItemId?: string
  type?: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value?: number
  reason?: string
}

export function useQuotes() {
  const quotes = useState<Quote[]>('quotes', () => [])
  const loading = useState('quotes-loading', () => false)
  const error = useState<string | null>('quotes-error', () => null)

  async function fetchQuotes() {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Quote[]>('/api/quotes')
      quotes.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch quotes'
    } finally {
      loading.value = false
    }
  }

  async function fetchQuote(id: string): Promise<QuoteWithLineItems | null> {
    try {
      return await $fetch<QuoteWithLineItems>(`/api/quotes/${id}`)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch quote'
      return null
    }
  }

  async function createQuote(data: {
    name: string
    customerId?: string
    priceBookId?: string
    validTo?: string
  }): Promise<Quote | null> {
    try {
      const quote = await $fetch<Quote>('/api/quotes', {
        method: 'POST',
        body: data,
      })
      await fetchQuotes()
      return quote
    } catch (e: any) {
      error.value = e.message || 'Failed to create quote'
      return null
    }
  }

  async function updateQuote(
    id: string,
    data: Partial<{
      name: string
      customerId: string | null
      status: QuoteStatus
      validTo: string
    }>
  ): Promise<Quote | null> {
    try {
      const quote = await $fetch<Quote>(`/api/quotes/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchQuotes()
      return quote
    } catch (e: any) {
      error.value = e.message || 'Failed to update quote'
      return null
    }
  }

  async function addLineItem(
    quoteId: string,
    data: {
      productId: string
      quantity?: number
      parentLineId?: string
      discount?: number
    }
  ): Promise<QuoteLineItem | null> {
    try {
      return await $fetch<QuoteLineItem>(`/api/quotes/${quoteId}/lines`, {
        method: 'POST',
        body: data,
      })
    } catch (e: any) {
      error.value = e.message || 'Failed to add line item'
      return null
    }
  }

  async function removeLineItem(quoteId: string, lineId: string): Promise<boolean> {
    try {
      await $fetch(`/api/quotes/${quoteId}/lines/${lineId}`, {
        method: 'DELETE',
      })
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to remove line item'
      return false
    }
  }

  async function calculateQuote(quoteId: string): Promise<CalculateQuoteResponse | null> {
    try {
      return await $fetch<CalculateQuoteResponse>(`/api/quotes/${quoteId}/calculate`, {
        method: 'POST',
      })
    } catch (e: any) {
      error.value = e.message || 'Failed to calculate quote'
      return null
    }
  }

  async function applyDiscount(
    quoteId: string,
    discountId: string,
    lineItemId?: string
  ): Promise<QuoteWithLineItems | null> {
    try {
      const result = await $fetch<{ quote: QuoteWithLineItems }>(`/api/quotes/${quoteId}/discounts`, {
        method: 'POST',
        body: { discountId, lineItemId },
      })
      return result.quote
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to apply discount'
      return null
    }
  }

  async function applyManualDiscount(
    quoteId: string,
    data: { type: 'PERCENTAGE' | 'FIXED_AMOUNT'; value: number; reason: string; lineItemId?: string }
  ): Promise<QuoteWithLineItems | null> {
    try {
      const result = await $fetch<{ quote: QuoteWithLineItems }>(`/api/quotes/${quoteId}/discounts`, {
        method: 'POST',
        body: data,
      })
      return result.quote
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to apply manual discount'
      return null
    }
  }

  async function removeDiscount(
    quoteId: string,
    appliedDiscountId: string
  ): Promise<QuoteWithLineItems | null> {
    try {
      const result = await $fetch<{ quote: QuoteWithLineItems }>(
        `/api/quotes/${quoteId}/discounts/${appliedDiscountId}`,
        { method: 'DELETE' }
      )
      return result.quote
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to remove discount'
      return null
    }
  }

  async function updateLineItem(
    quoteId: string,
    lineId: string,
    data: { quantity: number }
  ): Promise<QuoteWithLineItems | null> {
    try {
      const result = await $fetch<{ quote: QuoteWithLineItems }>(
        `/api/quotes/${quoteId}/lines/${lineId}`,
        {
          method: 'PUT',
          body: data,
        }
      )
      return result.quote
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to update line item'
      return null
    }
  }

  async function submitQuote(quoteId: string): Promise<Quote | null> {
    try {
      const quote = await $fetch<Quote>(`/api/quotes/${quoteId}/submit`, {
        method: 'POST',
      })
      await fetchQuotes()
      return quote
    } catch (e: any) {
      error.value = e.message || 'Failed to submit quote'
      return null
    }
  }

  async function approveQuote(quoteId: string, approvedBy?: string): Promise<Quote | null> {
    try {
      const quote = await $fetch<Quote>(`/api/quotes/${quoteId}/approve`, {
        method: 'POST',
        body: { approvedBy },
      })
      await fetchQuotes()
      return quote
    } catch (e: any) {
      error.value = e.message || 'Failed to approve quote'
      return null
    }
  }

  async function rejectQuote(quoteId: string): Promise<Quote | null> {
    try {
      const quote = await $fetch<Quote>(`/api/quotes/${quoteId}/reject`, {
        method: 'POST',
      })
      await fetchQuotes()
      return quote
    } catch (e: any) {
      error.value = e.message || 'Failed to reject quote'
      return null
    }
  }

  async function deleteQuote(quoteId: string): Promise<boolean> {
    try {
      await $fetch(`/api/quotes/${quoteId}`, {
        method: 'DELETE',
      })
      await fetchQuotes()
      return true
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to delete quote'
      return false
    }
  }

  return {
    quotes,
    loading,
    error,
    fetchQuotes,
    fetchQuote,
    createQuote,
    updateQuote,
    addLineItem,
    removeLineItem,
    updateLineItem,
    calculateQuote,
    applyDiscount,
    applyManualDiscount,
    removeDiscount,
    submitQuote,
    approveQuote,
    rejectQuote,
    deleteQuote,
  }
}
