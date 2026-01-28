<script setup lang="ts">
const { isNavPathVisible } = usePhaseContext()

const allLinks = [
  {
    icon: 'i-heroicons-adjustments-horizontal',
    title: 'Rules',
    description: 'Configure business rules for product configuration and pricing',
    to: '/rules',
  },
  {
    icon: 'i-heroicons-tag',
    title: 'Discounts',
    description: 'Set up discount structures and promotional pricing',
    to: '/discounts',
  },
  {
    icon: 'i-heroicons-receipt-percent',
    title: 'Tax Rates',
    description: 'Manage tax rates for different regions and product types',
    to: '/tax-rates',
  },
  {
    icon: 'i-heroicons-currency-dollar',
    title: 'Currencies',
    description: 'Configure supported currencies and exchange rates',
    to: '/currencies',
  },
  {
    icon: 'i-heroicons-link',
    title: 'Affinities',
    description: 'Define product relationships and recommendations',
    to: '/affinities',
  },
  {
    icon: 'i-heroicons-clipboard-document-list',
    title: 'Questionnaires',
    description: 'Create guided selling questionnaires',
    to: '/questionnaires',
  },
  {
    icon: 'i-heroicons-squares-2x2',
    title: 'Quote Layouts',
    description: 'Customize quote document layouts and templates',
    to: '/quote-layouts',
  },
]

const links = computed(() => allLinks.filter(link => isNavPathVisible(link.to)))
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">Configuration</h1>
      <p class="text-gray-500 mt-1">
        Configure rules, pricing, and system settings
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="link in links" :key="link.title">
        <div class="flex flex-col items-center text-center">
          <div
            class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4"
          >
            <UIcon :name="link.icon" class="w-6 h-6 text-primary-600" />
          </div>
          <h2 class="font-semibold text-lg">{{ link.title }}</h2>
          <p class="text-sm text-gray-500 mt-2">{{ link.description }}</p>
          <UButton :to="link.to" class="mt-4" variant="soft">
            View {{ link.title }}
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
