<script setup lang="ts">
import type { Customer as _Customer } from '~/composables/useCustomers'

defineProps<{
  customer: {
    id: string
    name: string
    company?: string | null
    email?: string | null
  } | null
  priceBook?: {
    id: string
    name: string
  } | null
  editable?: boolean
}>()

const emit = defineEmits<{
  'change-customer': []
}>()
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold">Customer</h3>
        <UButton
          v-if="editable"
          variant="ghost"
          size="xs"
          icon="i-heroicons-pencil"
          @click="emit('change-customer')"
        >
          {{ customer ? 'Change' : 'Select' }}
        </UButton>
      </div>
    </template>

    <div v-if="customer" class="space-y-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <UIcon name="i-heroicons-user" class="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <p class="font-medium">{{ customer.name }}</p>
          <p v-if="customer.company" class="text-sm text-gray-500">{{ customer.company }}</p>
        </div>
      </div>

      <div v-if="customer.email" class="flex items-center gap-2 text-sm text-gray-500">
        <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
        {{ customer.email }}
      </div>

      <div v-if="priceBook" class="flex items-center gap-2 text-sm text-gray-500">
        <UIcon name="i-heroicons-book-open" class="w-4 h-4" />
        Price Book: {{ priceBook.name }}
      </div>
    </div>

    <div v-else class="text-center py-4">
      <UIcon name="i-heroicons-user-plus" class="w-8 h-8 text-gray-300 mx-auto mb-2" />
      <p class="text-sm text-gray-500 mb-3">No customer selected</p>
      <UButton
        v-if="editable"
        variant="soft"
        size="sm"
        icon="i-heroicons-plus"
        @click="emit('change-customer')"
      >
        Select Customer
      </UButton>
    </div>
  </UCard>
</template>
