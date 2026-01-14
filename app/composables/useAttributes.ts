import type { AttributeType } from '../generated/prisma/client.js'

export interface AttributeGroup {
  id: string
  name: string
  sortOrder: number
  attributes?: Attribute[]
}

export interface Attribute {
  id: string
  name: string
  code: string
  type: AttributeType
  groupId: string | null
  options: Array<{ label: string; value: string }> | null
  constraints: Record<string, any> | null
  isRequired: boolean
  sortOrder: number
  group?: {
    id: string
    name: string
  } | null
  _count?: {
    productAttributes: number
    categoryAttributes: number
  }
}

export interface ProductAttribute {
  id: string
  productId: string
  attributeId: string
  value: any
  attribute: Attribute
}

export function useAttributes() {
  const attributes = useState<Attribute[]>('attributes', () => [])
  const groups = useState<AttributeGroup[]>('attribute-groups', () => [])
  const loading = useState('attributes-loading', () => false)
  const error = useState<string | null>('attributes-error', () => null)

  async function fetchAttributes(options?: { groupId?: string; includeGroup?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (options?.groupId) params.set('groupId', options.groupId)
      if (options?.includeGroup) params.set('includeGroup', 'true')
      const queryString = params.toString()
      const data = await $fetch<Attribute[]>(`/api/attributes${queryString ? `?${queryString}` : ''}`)
      attributes.value = data
      return data
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to fetch attributes'
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchAttribute(id: string): Promise<Attribute | null> {
    try {
      return await $fetch<Attribute>(`/api/attributes/${id}`)
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to fetch attribute'
      return null
    }
  }

  async function createAttribute(data: {
    name: string
    code: string
    type: AttributeType
    groupId?: string | null
    options?: Array<{ label: string; value: string }>
    constraints?: Record<string, any>
    isRequired?: boolean
    sortOrder?: number
  }): Promise<Attribute | null> {
    try {
      const attribute = await $fetch<Attribute>('/api/attributes', {
        method: 'POST',
        body: data,
      })
      await fetchAttributes({ includeGroup: true })
      return attribute
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to create attribute'
      return null
    }
  }

  async function updateAttribute(
    id: string,
    data: Partial<{
      name: string
      code: string
      type: AttributeType
      groupId: string | null
      options: Array<{ label: string; value: string }>
      constraints: Record<string, any>
      isRequired: boolean
      sortOrder: number
    }>
  ): Promise<Attribute | null> {
    try {
      const attribute = await $fetch<Attribute>(`/api/attributes/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchAttributes({ includeGroup: true })
      return attribute
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to update attribute'
      return null
    }
  }

  async function deleteAttribute(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/attributes/${id}`, {
        method: 'DELETE',
      })
      await fetchAttributes({ includeGroup: true })
      return true
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to delete attribute'
      return false
    }
  }

  // Attribute Groups
  async function fetchGroups(options?: { includeAttributes?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (options?.includeAttributes) params.set('includeAttributes', 'true')
      const queryString = params.toString()
      const data = await $fetch<AttributeGroup[]>(
        `/api/attribute-groups${queryString ? `?${queryString}` : ''}`
      )
      groups.value = data
      return data
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to fetch attribute groups'
      return []
    } finally {
      loading.value = false
    }
  }

  async function createGroup(data: { name: string; sortOrder?: number }): Promise<AttributeGroup | null> {
    try {
      const group = await $fetch<AttributeGroup>('/api/attribute-groups', {
        method: 'POST',
        body: data,
      })
      await fetchGroups()
      return group
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to create attribute group'
      return null
    }
  }

  async function updateGroup(
    id: string,
    data: Partial<{ name: string; sortOrder: number }>
  ): Promise<AttributeGroup | null> {
    try {
      const group = await $fetch<AttributeGroup>(`/api/attribute-groups/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchGroups()
      return group
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to update attribute group'
      return null
    }
  }

  async function deleteGroup(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/attribute-groups/${id}`, {
        method: 'DELETE',
      })
      await fetchGroups()
      return true
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to delete attribute group'
      return false
    }
  }

  // Product Attributes
  async function setProductAttributes(
    productId: string,
    attrValues: Array<{ attributeId: string; value: any }>
  ): Promise<any> {
    try {
      return await $fetch(`/api/products/${productId}/attributes`, {
        method: 'PUT',
        body: { attributes: attrValues },
      })
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to set product attributes'
      return null
    }
  }

  // Helper: Group attributes by group
  function groupAttributesByGroup(attrs: Attribute[]): Map<string | null, Attribute[]> {
    const grouped = new Map<string | null, Attribute[]>()
    for (const attr of attrs) {
      const groupId = attr.groupId
      if (!grouped.has(groupId)) {
        grouped.set(groupId, [])
      }
      grouped.get(groupId)!.push(attr)
    }
    return grouped
  }

  return {
    attributes,
    groups,
    loading,
    error,
    fetchAttributes,
    fetchAttribute,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    setProductAttributes,
    groupAttributesByGroup,
  }
}
