import { getErrorMessage } from '../utils/errors'
import type { TaxRate } from './useTaxRates'

export interface TaxProfile {
  id: string
  name: string
  description: string | null
  country: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  ratesCount?: number
  rates?: TaxRate[]
}

export function useTaxProfiles() {
  const taxProfiles = useState<TaxProfile[]>('tax-profiles', () => [])
  const loading = useState('tax-profiles-loading', () => false)
  const error = useState<string | null>('tax-profiles-error', () => null)

  async function fetchTaxProfiles(includeInactive = false) {
    loading.value = true
    error.value = null
    try {
      const params = includeInactive ? '?includeInactive=true' : ''
      const data = await $fetch<TaxProfile[]>(`/api/tax-profiles${params}`)
      taxProfiles.value = data
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to fetch tax profiles')
    } finally {
      loading.value = false
    }
  }

  async function fetchTaxProfile(id: string): Promise<TaxProfile | null> {
    try {
      return await $fetch<TaxProfile>(`/api/tax-profiles/${id}`)
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to fetch tax profile')
      return null
    }
  }

  async function createTaxProfile(data: {
    name: string
    description?: string
    country: string
  }): Promise<TaxProfile | null> {
    try {
      const taxProfile = await $fetch<TaxProfile>('/api/tax-profiles', {
        method: 'POST',
        body: data,
      })
      await fetchTaxProfiles()
      return taxProfile
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to create tax profile')
      return null
    }
  }

  async function updateTaxProfile(
    id: string,
    data: Partial<{
      name: string
      description: string | null
      country: string
      isActive: boolean
    }>
  ): Promise<TaxProfile | null> {
    try {
      const taxProfile = await $fetch<TaxProfile>(`/api/tax-profiles/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchTaxProfiles()
      return taxProfile
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to update tax profile')
      return null
    }
  }

  async function deleteTaxProfile(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/tax-profiles/${id}`, {
        method: 'DELETE',
      })
      await fetchTaxProfiles()
      return true
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to delete tax profile')
      return false
    }
  }

  async function assignRateToProfile(profileId: string, taxRateId: string): Promise<TaxProfile | null> {
    try {
      const profile = await $fetch<TaxProfile>(`/api/tax-profiles/${profileId}/rates`, {
        method: 'POST',
        body: { taxRateId },
      })
      return profile
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to assign tax rate')
      return null
    }
  }

  async function removeRateFromProfile(profileId: string, taxRateId: string): Promise<TaxProfile | null> {
    try {
      const profile = await $fetch<TaxProfile>(`/api/tax-profiles/${profileId}/rates/${taxRateId}`, {
        method: 'DELETE',
      })
      return profile
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to remove tax rate')
      return null
    }
  }

  return {
    taxProfiles,
    loading,
    error,
    fetchTaxProfiles,
    fetchTaxProfile,
    createTaxProfile,
    updateTaxProfile,
    deleteTaxProfile,
    assignRateToProfile,
    removeRateFromProfile,
  }
}
