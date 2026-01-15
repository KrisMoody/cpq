import { getErrorMessage } from '../utils/errors'
export interface UnitOfMeasure {
  id: string
  name: string
  abbreviation: string
  baseUnitId: string | null
  conversionFactor: string | number
  isActive: boolean
  baseUnit?: {
    id: string
    name: string
    abbreviation: string
  } | null
}

export interface UnitOfMeasureWithDetails extends UnitOfMeasure {
  derived?: {
    id: string
    name: string
    abbreviation: string
    conversionFactor: string | number
  }[]
  productCount?: number
}

export function useUnits() {
  const units = useState<UnitOfMeasure[]>('units', () => [])
  const loading = useState('units-loading', () => false)
  const error = useState<string | null>('units-error', () => null)

  async function fetchUnits(includeInactive = false) {
    loading.value = true
    error.value = null
    try {
      const params = includeInactive ? '?includeInactive=true' : ''
      const data = await $fetch<UnitOfMeasure[]>(`/api/units${params}`)
      units.value = data
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to fetch units')
    } finally {
      loading.value = false
    }
  }

  async function fetchUnit(id: string): Promise<UnitOfMeasureWithDetails | null> {
    try {
      return await $fetch<UnitOfMeasureWithDetails>(`/api/units/${id}`)
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to fetch unit')
      return null
    }
  }

  async function createUnit(data: {
    name: string
    abbreviation: string
    baseUnitId?: string
    conversionFactor?: number
  }): Promise<UnitOfMeasure | null> {
    try {
      const unit = await $fetch<UnitOfMeasure>('/api/units', {
        method: 'POST',
        body: data,
      })
      await fetchUnits()
      return unit
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to create unit')
      return null
    }
  }

  async function updateUnit(
    id: string,
    data: Partial<{
      name: string
      abbreviation: string
      baseUnitId: string | null
      conversionFactor: number
      isActive: boolean
    }>
  ): Promise<UnitOfMeasure | null> {
    try {
      const unit = await $fetch<UnitOfMeasure>(`/api/units/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchUnits()
      return unit
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to update unit')
      return null
    }
  }

  async function deleteUnit(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/units/${id}`, {
        method: 'DELETE',
      })
      await fetchUnits()
      return true
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to delete unit')
      return false
    }
  }

  // Helper to format quantity with unit
  function formatQuantityWithUnit(quantity: number, unit?: UnitOfMeasure | null): string {
    if (!unit) return String(quantity)
    return `${quantity} ${unit.abbreviation}`
  }

  // Helper to format price with unit (e.g., "$50/hr")
  function formatPriceWithUnit(price: number | string, unit?: UnitOfMeasure | null): string {
    const priceNum = typeof price === 'string' ? parseFloat(price) : price
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceNum)

    if (!unit) return formattedPrice
    return `${formattedPrice}/${unit.abbreviation}`
  }

  // Helper to get unit by ID from loaded units
  function getUnitById(id: string): UnitOfMeasure | undefined {
    return units.value.find((u) => u.id === id)
  }

  return {
    units,
    loading,
    error,
    fetchUnits,
    fetchUnit,
    createUnit,
    updateUnit,
    deleteUnit,
    formatQuantityWithUnit,
    formatPriceWithUnit,
    getUnitById,
  }
}
