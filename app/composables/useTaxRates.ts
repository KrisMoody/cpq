export interface TaxRate {
  id: string
  name: string
  rate: string // Decimal string
  country: string
  state: string | null
  categoryId: string | null
  validFrom: string | null
  validTo: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  category: { id: string; name: string } | null
}

export interface TaxBreakdownItem {
  name: string
  rate: number
  amount: number
}

export function useTaxRates() {
  const taxRates = useState<TaxRate[]>('tax-rates', () => [])
  const loading = useState('tax-rates-loading', () => false)
  const error = useState<string | null>('tax-rates-error', () => null)

  async function fetchTaxRates(includeInactive = false) {
    loading.value = true
    error.value = null
    try {
      const params = includeInactive ? '?includeInactive=true' : ''
      const data = await $fetch<TaxRate[]>(`/api/tax-rates${params}`)
      taxRates.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch tax rates'
    } finally {
      loading.value = false
    }
  }

  async function fetchTaxRate(id: string): Promise<TaxRate | null> {
    try {
      return await $fetch<TaxRate>(`/api/tax-rates/${id}`)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch tax rate'
      return null
    }
  }

  async function createTaxRate(data: {
    name: string
    rate: number
    country: string
    state?: string
    categoryId?: string
    validFrom?: string
    validTo?: string
  }): Promise<TaxRate | null> {
    try {
      const taxRate = await $fetch<TaxRate>('/api/tax-rates', {
        method: 'POST',
        body: data,
      })
      await fetchTaxRates()
      return taxRate
    } catch (e: any) {
      error.value = e.message || 'Failed to create tax rate'
      return null
    }
  }

  async function updateTaxRate(
    id: string,
    data: Partial<{
      name: string
      rate: number
      country: string
      state: string | null
      categoryId: string | null
      validFrom: string | null
      validTo: string | null
      isActive: boolean
    }>
  ): Promise<TaxRate | null> {
    try {
      const taxRate = await $fetch<TaxRate>(`/api/tax-rates/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchTaxRates()
      return taxRate
    } catch (e: any) {
      error.value = e.message || 'Failed to update tax rate'
      return null
    }
  }

  async function deleteTaxRate(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/tax-rates/${id}`, {
        method: 'DELETE',
      })
      await fetchTaxRates()
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to delete tax rate'
      return false
    }
  }

  function formatRate(rate: string | number): string {
    const rateNum = typeof rate === 'string' ? parseFloat(rate) : rate
    return `${(rateNum * 100).toFixed(2)}%`
  }

  return {
    taxRates,
    loading,
    error,
    fetchTaxRates,
    fetchTaxRate,
    createTaxRate,
    updateTaxRate,
    deleteTaxRate,
    formatRate,
  }
}
