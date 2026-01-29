<script setup lang="ts">
const { isNavPathVisible } = usePhaseContext()

const allLinks = [
  {
    icon: 'i-heroicons-cube',
    title: 'Products',
    description: 'Manage your product catalog with configurable options',
    to: '/products',
  },
  {
    icon: 'i-heroicons-folder',
    title: 'Categories',
    description: 'Organize products into hierarchical categories',
    to: '/categories',
  },
  {
    icon: 'i-heroicons-book-open',
    title: 'Price Books',
    description: 'Define pricing structures for different markets or customers',
    to: '/price-books',
  },
  {
    icon: 'i-heroicons-tag',
    title: 'Attributes',
    description: 'Create custom attributes for product configuration',
    to: '/attributes',
  },
  {
    icon: 'i-heroicons-scale',
    title: 'Units',
    description: 'Define units of measure for products and pricing',
    to: '/units',
  },
]

const links = computed(() => allLinks.filter(link => isNavPathVisible(link.to)))
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">Catalog</h1>
      <p class="text-ga-gray-600 mt-1">
        Manage your product catalog, categories, and pricing
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="link in links" :key="link.title">
        <div class="flex flex-col items-center text-center">
          <div
            class="w-12 h-12 rounded-lg bg-ga-navy-100 flex items-center justify-center mb-4"
          >
            <UIcon :name="link.icon" class="w-6 h-6 text-ga-navy-600" />
          </div>
          <h2 class="font-semibold text-lg">{{ link.title }}</h2>
          <p class="text-sm text-ga-gray-600 mt-2">{{ link.description }}</p>
          <UButton :to="link.to" class="mt-4" variant="soft">
            View {{ link.title }}
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
