export interface Category {
  id: string
  name: string
  description: string | null
  parentId: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  parent: {
    id: string
    name: string
  } | null
  productCount?: number
  childCount?: number
  children?: Category[]
}

export interface CategoryAttribute {
  id: string
  categoryId: string
  attributeId: string
  attribute: {
    id: string
    name: string
    code: string
    type: string
    isRequired: boolean
  }
}

export interface CategoryWithProducts extends Category {
  products: {
    id: string
    name: string
    sku: string
    type: string
    isActive: boolean
  }[]
  children: {
    id: string
    name: string
    description: string | null
  }[]
  categoryAttributes?: CategoryAttribute[]
}

export function useCategories() {
  const categories = useState<Category[]>('categories', () => [])
  const loading = useState('categories-loading', () => false)
  const error = useState<string | null>('categories-error', () => null)

  async function fetchCategories(options: { includeInactive?: boolean; flat?: boolean } = {}) {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (options.includeInactive) params.set('includeInactive', 'true')
      if (options.flat) params.set('flat', 'true')
      const query = params.toString() ? `?${params.toString()}` : ''
      const data = await $fetch<Category[]>(`/api/categories${query}`)
      categories.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch categories'
    } finally {
      loading.value = false
    }
  }

  async function fetchCategory(id: string): Promise<CategoryWithProducts | null> {
    try {
      return await $fetch<CategoryWithProducts>(`/api/categories/${id}`)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch category'
      return null
    }
  }

  async function createCategory(data: {
    name: string
    description?: string
    parentId?: string
    sortOrder?: number
  }): Promise<Category | null> {
    try {
      const category = await $fetch<Category>('/api/categories', {
        method: 'POST',
        body: data,
      })
      await fetchCategories()
      return category
    } catch (e: any) {
      error.value = e.message || 'Failed to create category'
      return null
    }
  }

  async function updateCategory(
    id: string,
    data: Partial<{
      name: string
      description: string | null
      parentId: string | null
      sortOrder: number
      isActive: boolean
    }>
  ): Promise<Category | null> {
    try {
      const category = await $fetch<Category>(`/api/categories/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchCategories()
      return category
    } catch (e: any) {
      error.value = e.message || 'Failed to update category'
      return null
    }
  }

  async function deleteCategory(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      await fetchCategories()
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to delete category'
      return false
    }
  }

  async function addProductToCategory(categoryId: string, productId: string): Promise<boolean> {
    try {
      await $fetch(`/api/categories/${categoryId}/products`, {
        method: 'POST',
        body: { productId },
      })
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to add product to category'
      return false
    }
  }

  async function removeProductFromCategory(categoryId: string, productId: string): Promise<boolean> {
    try {
      await $fetch(`/api/categories/${categoryId}/products/${productId}`, {
        method: 'DELETE',
      })
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to remove product from category'
      return false
    }
  }

  async function fetchCategoryAttributes(categoryId: string): Promise<CategoryAttribute[]> {
    try {
      return await $fetch<CategoryAttribute[]>(`/api/categories/${categoryId}/attributes`)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch category attributes'
      return []
    }
  }

  async function addAttributeToCategory(categoryId: string, attributeId: string): Promise<boolean> {
    try {
      await $fetch(`/api/categories/${categoryId}/attributes`, {
        method: 'POST',
        body: { attributeId },
      })
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to add attribute to category'
      return false
    }
  }

  async function removeAttributeFromCategory(categoryId: string, attributeId: string): Promise<boolean> {
    try {
      await $fetch(`/api/categories/${categoryId}/attributes/${attributeId}`, {
        method: 'DELETE',
      })
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to remove attribute from category'
      return false
    }
  }

  // Helper to flatten tree for select dropdowns
  function flattenCategories(cats: Category[], depth = 0): (Category & { depth: number })[] {
    const result: (Category & { depth: number })[] = []
    for (const cat of cats) {
      result.push({ ...cat, depth })
      if (cat.children && cat.children.length > 0) {
        result.push(...flattenCategories(cat.children, depth + 1))
      }
    }
    return result
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    addProductToCategory,
    removeProductFromCategory,
    fetchCategoryAttributes,
    addAttributeToCategory,
    removeAttributeFromCategory,
    flattenCategories,
  }
}
