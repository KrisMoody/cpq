import type { Currency } from './useCurrencies'

export interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  street: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  country: string | null
  priceBookId: string | null
  currencyId: string | null
  isTaxExempt: boolean
  taxExemptReason: string | null
  taxExemptCertificate: string | null
  taxExemptExpiry: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  priceBook: {
    id: string
    name: string
  } | null
  currency?: Currency | null
  quoteCount?: number
}

export interface CustomerWithQuotes extends Customer {
  quotes: {
    id: string
    name: string
    status: string
    total: string
    createdAt: string
  }[]
}

export function useCustomers() {
  const customers = useState<Customer[]>('customers', () => [])
  const loading = useState('customers-loading', () => false)
  const error = useState<string | null>('customers-error', () => null)

  async function fetchCustomers(includeInactive = false) {
    loading.value = true
    error.value = null
    try {
      const params = includeInactive ? '?includeInactive=true' : ''
      const data = await $fetch<Customer[]>(`/api/customers${params}`)
      customers.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch customers'
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomer(id: string): Promise<CustomerWithQuotes | null> {
    try {
      return await $fetch<CustomerWithQuotes>(`/api/customers/${id}`)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch customer'
      return null
    }
  }

  async function createCustomer(data: {
    name: string
    email?: string
    phone?: string
    company?: string
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    priceBookId?: string
    currencyId?: string
    isTaxExempt?: boolean
    taxExemptReason?: string
    taxExemptCertificate?: string
    taxExemptExpiry?: string
  }): Promise<Customer | null> {
    try {
      const customer = await $fetch<Customer>('/api/customers', {
        method: 'POST',
        body: data,
      })
      await fetchCustomers()
      return customer
    } catch (e: any) {
      error.value = e.message || 'Failed to create customer'
      return null
    }
  }

  async function updateCustomer(
    id: string,
    data: Partial<{
      name: string
      email: string | null
      phone: string | null
      company: string | null
      street: string | null
      city: string | null
      state: string | null
      postalCode: string | null
      country: string | null
      priceBookId: string | null
      currencyId: string | null
      isTaxExempt: boolean
      taxExemptReason: string | null
      taxExemptCertificate: string | null
      taxExemptExpiry: string | null
      isActive: boolean
    }>
  ): Promise<Customer | null> {
    try {
      const customer = await $fetch<Customer>(`/api/customers/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchCustomers()
      return customer
    } catch (e: any) {
      error.value = e.message || 'Failed to update customer'
      return null
    }
  }

  async function deleteCustomer(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      })
      await fetchCustomers()
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to delete customer'
      return false
    }
  }

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    fetchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  }
}
