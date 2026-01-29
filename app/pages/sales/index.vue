<script setup lang="ts">
const { isNavPathVisible } = usePhaseContext()

const allLinks = [
  {
    icon: 'i-heroicons-document-text',
    title: 'Quotes',
    description: 'Create and manage sales quotes for customers',
    to: '/quotes',
  },
  {
    icon: 'i-heroicons-users',
    title: 'Customers',
    description: 'Manage customer accounts and contact information',
    to: '/customers',
  },
  {
    icon: 'i-heroicons-document-check',
    title: 'Contracts',
    description: 'View and manage customer contracts',
    to: '/contracts',
  },
]

const links = computed(() => allLinks.filter(link => isNavPathVisible(link.to)))
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">Sales</h1>
      <p class="text-gray-500 mt-1">
        Manage quotes, customers, and contracts
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
