import type {
  QuoteLayout,
  CreateQuoteLayoutInput,
  UpdateQuoteLayoutInput,
} from '~/types/quote-layout'

export function useQuoteLayouts() {
  const layouts = useState<QuoteLayout[]>('quote-layouts', () => [])
  const loading = useState('quote-layouts-loading', () => false)
  const error = useState<string | null>('quote-layouts-error', () => null)

  async function fetchLayouts(options?: { template?: boolean; entityId?: string }) {
    loading.value = true
    error.value = null
    try {
      const query = new URLSearchParams()
      if (options?.template !== undefined) {
        query.set('template', String(options.template))
      }
      if (options?.entityId) {
        query.set('entityId', options.entityId)
      }

      const queryString = query.toString()
      const url = queryString ? `/api/quote-layouts?${queryString}` : '/api/quote-layouts'
      const data = await $fetch<QuoteLayout[]>(url)
      layouts.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch layouts'
    } finally {
      loading.value = false
    }
  }

  async function fetchLayout(id: string): Promise<QuoteLayout | null> {
    try {
      return await $fetch<QuoteLayout>(`/api/quote-layouts/${id}`)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch layout'
      return null
    }
  }

  async function createLayout(data: CreateQuoteLayoutInput): Promise<QuoteLayout | null> {
    try {
      const layout = await $fetch<QuoteLayout>('/api/quote-layouts', {
        method: 'POST',
        body: data,
      })
      await fetchLayouts()
      return layout
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to create layout'
      return null
    }
  }

  async function updateLayout(id: string, data: UpdateQuoteLayoutInput): Promise<QuoteLayout | null> {
    try {
      const layout = await $fetch<QuoteLayout>(`/api/quote-layouts/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchLayouts()
      return layout
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to update layout'
      return null
    }
  }

  async function deleteLayout(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/quote-layouts/${id}`, {
        method: 'DELETE',
      })
      await fetchLayouts()
      return true
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to delete layout'
      return false
    }
  }

  async function cloneLayout(id: string, name?: string): Promise<QuoteLayout | null> {
    try {
      const layout = await $fetch<QuoteLayout>(`/api/quote-layouts/${id}/clone`, {
        method: 'POST',
        body: name ? { name } : undefined,
      })
      await fetchLayouts()
      return layout
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to clone layout'
      return null
    }
  }

  // Find the best applicable layout for a given entity
  async function findLayoutForEntity(entityId: string): Promise<QuoteLayout | null> {
    try {
      // First try to find entity-specific templates
      const entityLayouts = await $fetch<QuoteLayout[]>(
        `/api/quote-layouts?entityId=${entityId}&template=true`
      )
      if (entityLayouts.length > 0) {
        return entityLayouts[0] ?? null
      }

      // Fall back to default entity templates
      const defaultLayouts = await $fetch<QuoteLayout[]>(
        `/api/quote-layouts?entityId=default&template=true`
      )
      if (defaultLayouts.length > 0) {
        return defaultLayouts[0] ?? null
      }

      return null
    } catch (e: any) {
      error.value = e.message || 'Failed to find layout'
      return null
    }
  }

  // Get template layouts for selection
  const templateLayouts = computed(() => {
    return layouts.value.filter((l) => l.isTemplate)
  })

  return {
    layouts,
    templateLayouts,
    loading,
    error,
    fetchLayouts,
    fetchLayout,
    createLayout,
    updateLayout,
    deleteLayout,
    cloneLayout,
    findLayoutForEntity,
  }
}
