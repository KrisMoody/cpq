<script setup lang="ts">
const sections = [
  {
    icon: 'i-heroicons-squares-2x2',
    title: 'Catalog',
    description: 'Manage products, categories, price books, attributes, and units',
    to: '/admin/catalog',
    items: ['Products', 'Categories', 'Price Books', 'Attributes', 'Units'],
  },
  {
    icon: 'i-heroicons-cog-6-tooth',
    title: 'Configuration',
    description: 'Configure rules, discounts, tax rates, currencies, and more',
    to: '/admin/configuration',
    items: ['Rules', 'Discounts', 'Tax Rates', 'Currencies', 'Affinities', 'Questionnaires', 'Quote Layouts'],
  },
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">Admin</h1>
      <p class="text-gray-500 mt-1">
        Configure your CPQ system settings and catalog
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard v-for="section in sections" :key="section.title">
        <div class="flex flex-col">
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0"
            >
              <UIcon :name="section.icon" class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 class="font-semibold text-lg">{{ section.title }}</h2>
              <p class="text-sm text-gray-500">{{ section.description }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mb-4">
            <UBadge v-for="item in section.items" :key="item" variant="subtle" color="neutral">
              {{ item }}
            </UBadge>
          </div>
          <UButton :to="section.to" variant="soft" class="self-start">
            View {{ section.title }}
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
