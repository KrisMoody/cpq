<script setup lang="ts">
import type { ProductCategory } from '~/composables/useProducts'

const { products, loading, error, fetchProducts } = useProducts()
const { categories, fetchCategories, flattenCategories } = useCategories()

const showInactive = ref(false)
const filterType = ref<'ALL' | 'STANDALONE' | 'BUNDLE'>('ALL')
const filterCategoryId = ref<string | undefined>(undefined)

onMounted(() => {
  fetchProducts(showInactive.value)
  fetchCategories()
})

watch(showInactive, (value) => {
  fetchProducts(value)
})

const filteredProducts = computed(() => {
  let result = products.value
  if (filterType.value !== 'ALL') {
    result = result.filter((p) => p.type === filterType.value)
  }
  if (filterCategoryId.value) {
    result = result.filter((p) =>
      p.categories?.some((c: ProductCategory) => c.id === filterCategoryId.value)
    )
  }
  return result
})

const filterOptions = [
  { label: 'All Products', value: 'ALL' },
  { label: 'Standalone', value: 'STANDALONE' },
  { label: 'Bundles', value: 'BUNDLE' },
]

const categoryOptions = computed(() => {
  const flat = flattenCategories(categories.value)
  return [
    { label: 'All Categories', value: undefined },
    ...flat.map((c) => ({
      label: '\u00A0'.repeat(c.depth * 2) + c.name,
      value: c.id,
    })),
  ]
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Products</h1>
        <p class="text-gray-500">Manage your product catalog</p>
      </div>
      <UButton to="/products/new" icon="i-heroicons-plus">
        New Product
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4 flex-wrap">
      <div class="inline-flex rounded-md shadow-sm">
        <UButton
          v-for="(option, index) in filterOptions"
          :key="option.value"
          :variant="filterType === option.value ? 'solid' : 'ghost'"
          size="sm"
          :class="[
            index === 0 ? 'rounded-r-none' : '',
            index === filterOptions.length - 1 ? 'rounded-l-none' : '',
            index !== 0 && index !== filterOptions.length - 1 ? 'rounded-none' : ''
          ]"
          @click="filterType = option.value as typeof filterType"
        >
          {{ option.label }}
        </UButton>
      </div>

      <USelect
        v-model="filterCategoryId"
        :items="categoryOptions"
        placeholder="Filter by category"
        class="w-48"
        value-key="value"
      />

      <UCheckbox v-model="showInactive" label="Show inactive" />

      <span class="text-sm text-gray-500">
        {{ filteredProducts.length }} product{{ filteredProducts.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error State -->
    <UAlert v-else-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error loading products</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-cube" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 mb-4">No products found</p>
      <UButton to="/products/new" variant="soft">Create your first product</UButton>
    </div>

    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="product in filteredProducts"
        :key="product.id"
        :to="`/products/${product.id}`"
      >
        <CpqProductCard :product="product" />
      </NuxtLink>
    </div>
  </div>
</template>
