<script setup lang="ts">
const { isPhaseVisible } = usePhaseContext()

// Map item names to their required phases
const itemPhases: Record<string, number> = {
  'Products': 1,
  'Categories': 1,
  'Price Books': 1,
  'Attributes': 4,
  'Units': 2,
  'Rules': 4,
  'Discounts': 2,
  'Tax Rates': 3,
  'Currencies': 1,
  'Affinities': 5,
  'Questionnaires': 5,
  'Quote Layouts': 5,
}

const allSections = [
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

// Filter items within each section based on current phase
const sections = computed(() => allSections.map(section => ({
  ...section,
  items: section.items.filter(item => isPhaseVisible(itemPhases[item] ?? 1))
})))
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">Admin</h1>
      <p class="text-ga-gray-600 mt-1">
        Configure your CPQ system settings and catalog
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard v-for="section in sections" :key="section.title">
        <div class="flex flex-col">
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-12 h-12 rounded-lg bg-ga-navy-100 flex items-center justify-center flex-shrink-0"
            >
              <UIcon :name="section.icon" class="w-6 h-6 text-ga-navy-600" />
            </div>
            <div>
              <h2 class="font-semibold text-lg">{{ section.title }}</h2>
              <p class="text-sm text-ga-gray-600">{{ section.description }}</p>
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
