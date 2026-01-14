import { getErrorMessage } from '../utils/errors.js'

export type ContractStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED'

export interface ContractPriceEntry {
  id: string
  contractId: string
  productId: string
  fixedPrice: string
  product: {
    id: string
    name: string
    sku: string
  }
}

export interface Contract {
  id: string
  name: string
  customerId: string
  startDate: string
  endDate: string
  status: ContractStatus
  discountPercent: string | null
  createdAt: string
  updatedAt: string
  customer: {
    id: string
    name: string
    company: string | null
  }
  priceEntryCount?: number
}

export interface ContractWithPrices extends Contract {
  priceEntries: ContractPriceEntry[]
}

export function useContracts() {
  const contracts = useState<Contract[]>('contracts', () => [])
  const loading = useState('contracts-loading', () => false)
  const error = useState<string | null>('contracts-error', () => null)

  async function fetchContracts(filters?: { status?: ContractStatus; customerId?: string }) {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.set('status', filters.status)
      if (filters?.customerId) params.set('customerId', filters.customerId)
      const queryString = params.toString()
      const url = queryString ? `/api/contracts?${queryString}` : '/api/contracts'
      const data = await $fetch<Contract[]>(url)
      contracts.value = data
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to fetch contracts')
    } finally {
      loading.value = false
    }
  }

  async function fetchContract(id: string): Promise<ContractWithPrices | null> {
    try {
      return await $fetch<ContractWithPrices>(`/api/contracts/${id}`)
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to fetch contract')
      return null
    }
  }

  async function createContract(data: {
    name: string
    customerId: string
    startDate: string
    endDate: string
    status?: ContractStatus
    discountPercent?: number | null
  }): Promise<Contract | null> {
    try {
      const contract = await $fetch<Contract>('/api/contracts', {
        method: 'POST',
        body: data,
      })
      await fetchContracts()
      return contract
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to create contract')
      return null
    }
  }

  async function updateContract(
    id: string,
    data: Partial<{
      name: string
      customerId: string
      startDate: string
      endDate: string
      status: ContractStatus
      discountPercent: number | null
    }>
  ): Promise<ContractWithPrices | null> {
    try {
      const contract = await $fetch<ContractWithPrices>(`/api/contracts/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchContracts()
      return contract
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to update contract')
      return null
    }
  }

  async function deleteContract(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/contracts/${id}`, {
        method: 'DELETE',
      })
      await fetchContracts()
      return true
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to delete contract')
      return false
    }
  }

  async function addPriceEntry(
    contractId: string,
    data: { productId: string; fixedPrice: number }
  ): Promise<ContractPriceEntry | null> {
    try {
      return await $fetch<ContractPriceEntry>(`/api/contracts/${contractId}/prices`, {
        method: 'POST',
        body: data,
      })
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to add price entry')
      return null
    }
  }

  async function updatePriceEntry(
    contractId: string,
    entryId: string,
    data: { fixedPrice: number }
  ): Promise<ContractPriceEntry | null> {
    try {
      return await $fetch<ContractPriceEntry>(`/api/contracts/${contractId}/prices/${entryId}`, {
        method: 'PUT',
        body: data,
      })
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to update price entry')
      return null
    }
  }

  async function deletePriceEntry(contractId: string, entryId: string): Promise<boolean> {
    try {
      await $fetch(`/api/contracts/${contractId}/prices/${entryId}`, {
        method: 'DELETE',
      })
      return true
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to delete price entry')
      return false
    }
  }

  async function renewContract(
    contractId: string,
    data: {
      startDate: string
      endDate: string
      name?: string
      discountPercent?: number | null
      copyPrices?: boolean
    }
  ): Promise<ContractWithPrices | null> {
    try {
      const contract = await $fetch<ContractWithPrices>(`/api/contracts/${contractId}/renew`, {
        method: 'POST',
        body: data,
      })
      await fetchContracts()
      return contract
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to renew contract')
      return null
    }
  }

  function getStatusColor(status: ContractStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'DRAFT':
        return 'warning'
      case 'EXPIRED':
        return 'neutral'
      default:
        return 'neutral'
    }
  }

  function isContractActive(contract: Contract): boolean {
    if (contract.status !== 'ACTIVE') return false
    const now = new Date()
    const start = new Date(contract.startDate)
    const end = new Date(contract.endDate)
    return now >= start && now <= end
  }

  return {
    contracts,
    loading,
    error,
    fetchContracts,
    fetchContract,
    createContract,
    updateContract,
    deleteContract,
    addPriceEntry,
    updatePriceEntry,
    deletePriceEntry,
    renewContract,
    getStatusColor,
    isContractActive,
  }
}
