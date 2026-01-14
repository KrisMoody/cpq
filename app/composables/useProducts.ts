import type { ProductType, BillingFrequency } from '../generated/prisma/client.js'
import type { UnitOfMeasure } from './useUnits'

export interface ProductCategory {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  sku: string
  type: ProductType
  billingFrequency: BillingFrequency
  customBillingMonths?: number | null
  defaultTermMonths?: number | null
  isActive: boolean
  createdAt: string
  unitOfMeasureId?: string | null
  unitOfMeasure?: UnitOfMeasure | null
  categories?: ProductCategory[]
}

export interface ProductOption {
  id: string
  featureId: string
  optionProductId: string
  isRequired: boolean
  isDefault: boolean
  minQty: number
  maxQty: number
  sortOrder: number
  product?: {
    id: string
    name: string
    description: string | null
    sku: string
    priceBookEntries: Array<{ listPrice: string }>
  }
}

export interface ProductFeature {
  id: string
  productId: string
  name: string
  minOptions: number
  maxOptions: number
  sortOrder: number
  options: ProductOption[]
}

export interface ProductWithFeatures extends Product {
  features: ProductFeature[]
  priceBookEntries: Array<{
    listPrice: string
    priceBook: {
      id: string
      name: string
      isDefault: boolean
    }
  }>
}

export type ProductWithDetails = ProductWithFeatures

export function useProducts() {
  const products = useState<Product[]>('products', () => [])
  const loading = useState('products-loading', () => false)
  const error = useState<string | null>('products-error', () => null)

  async function fetchProducts(includeInactive = false) {
    loading.value = true
    error.value = null
    try {
      const params = includeInactive ? '?includeInactive=true' : ''
      const data = await $fetch<Product[]>(`/api/products${params}`)
      products.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch products'
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id: string): Promise<ProductWithFeatures | null> {
    try {
      return await $fetch<ProductWithFeatures>(`/api/products/${id}`)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch product'
      return null
    }
  }

  async function createProduct(data: {
    name: string
    description?: string
    sku: string
    type?: ProductType
    billingFrequency?: BillingFrequency
    customBillingMonths?: number
    defaultTermMonths?: number
    unitOfMeasureId?: string
  }): Promise<Product | null> {
    try {
      const product = await $fetch<Product>('/api/products', {
        method: 'POST',
        body: data,
      })
      await fetchProducts()
      return product
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to create product'
      return null
    }
  }

  async function updateProduct(
    id: string,
    data: {
      name?: string
      description?: string | null
      sku?: string
      type?: ProductType
      billingFrequency?: BillingFrequency
      customBillingMonths?: number | null
      defaultTermMonths?: number | null
      isActive?: boolean
      unitOfMeasureId?: string | null
    }
  ): Promise<Product | null> {
    try {
      const product = await $fetch<Product>(`/api/products/${id}`, {
        method: 'PUT',
        body: data,
      })
      return product
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to update product'
      return null
    }
  }

  async function deleteProduct(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      await fetchProducts()
      return true
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to delete product'
      return false
    }
  }

  // Feature management
  async function createFeature(
    productId: string,
    data: {
      name: string
      minOptions?: number
      maxOptions?: number
      sortOrder?: number
    }
  ): Promise<ProductFeature | null> {
    try {
      return await $fetch<ProductFeature>(`/api/products/${productId}/features`, {
        method: 'POST',
        body: data,
      })
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to create feature'
      return null
    }
  }

  async function updateFeature(
    productId: string,
    featureId: string,
    data: {
      name?: string
      minOptions?: number
      maxOptions?: number
      sortOrder?: number
    }
  ): Promise<ProductFeature | null> {
    try {
      return await $fetch<ProductFeature>(`/api/products/${productId}/features/${featureId}`, {
        method: 'PUT',
        body: data,
      })
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to update feature'
      return null
    }
  }

  async function deleteFeature(productId: string, featureId: string): Promise<boolean> {
    try {
      await ($fetch as any)(`/api/products/${productId}/features/${featureId}`, {
        method: 'DELETE',
      })
      return true
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to delete feature'
      return false
    }
  }

  // Option management
  async function createOption(
    productId: string,
    featureId: string,
    data: {
      optionProductId: string
      isRequired?: boolean
      isDefault?: boolean
      minQty?: number
      maxQty?: number
      sortOrder?: number
    }
  ): Promise<ProductOption | null> {
    try {
      return await $fetch<ProductOption>(
        `/api/products/${productId}/features/${featureId}/options`,
        {
          method: 'POST',
          body: data,
        }
      )
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to create option'
      return null
    }
  }

  async function updateOption(
    productId: string,
    featureId: string,
    optionId: string,
    data: {
      optionProductId?: string
      isRequired?: boolean
      isDefault?: boolean
      minQty?: number
      maxQty?: number
      sortOrder?: number
    }
  ): Promise<ProductOption | null> {
    try {
      return await $fetch<ProductOption>(
        `/api/products/${productId}/features/${featureId}/options/${optionId}`,
        {
          method: 'PUT',
          body: data,
        }
      )
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to update option'
      return null
    }
  }

  async function deleteOption(
    productId: string,
    featureId: string,
    optionId: string
  ): Promise<boolean> {
    try {
      await ($fetch as any)(`/api/products/${productId}/features/${featureId}/options/${optionId}`, {
        method: 'DELETE',
      })
      return true
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to delete option'
      return false
    }
  }

  async function reorderFeatures(
    productId: string,
    featureIds: string[]
  ): Promise<boolean> {
    try {
      await $fetch(`/api/products/${productId}/features/reorder`, {
        method: 'PUT',
        body: { featureIds },
      })
      return true
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to reorder features'
      return false
    }
  }

  async function reorderOptions(
    productId: string,
    featureId: string,
    optionIds: string[]
  ): Promise<boolean> {
    try {
      await $fetch(`/api/products/${productId}/features/${featureId}/options/reorder`, {
        method: 'PUT',
        body: { optionIds },
      })
      return true
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to reorder options'
      return false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    createFeature,
    updateFeature,
    deleteFeature,
    createOption,
    updateOption,
    deleteOption,
    reorderFeatures,
    reorderOptions,
  }
}
