<script setup lang="ts">
import type { Customer as _Customer } from '~/composables/useCustomers'

const props = defineProps<{
  customer: {
    id: string
    name: string
    company?: string | null
    email?: string | null
    isTaxExempt?: boolean
    taxExemptExpiry?: string | null
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

// Check if tax exemption is expired
const isTaxExemptionExpired = computed(() => {
  if (!props.customer?.isTaxExempt || !props.customer?.taxExemptExpiry) return false
  return new Date(props.customer.taxExemptExpiry) < new Date()
})

// Format expiry date
const taxExemptExpiryFormatted = computed(() => {
  if (!props.customer?.taxExemptExpiry) return null
  return new Date(props.customer.taxExemptExpiry).toLocaleDateString()
})
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

      <!-- Tax Exemption Status -->
      <div v-if="customer.isTaxExempt" class="flex items-center gap-2">
        <UBadge
          :color="isTaxExemptionExpired ? 'warning' : 'success'"
          variant="subtle"
          size="sm"
        >
          <UIcon name="i-heroicons-receipt-percent" class="w-3 h-3 mr-1" />
          Tax Exempt
          <span v-if="isTaxExemptionExpired" class="ml-1">(Expired)</span>
        </UBadge>
        <span v-if="taxExemptExpiryFormatted && !isTaxExemptionExpired" class="text-xs text-gray-500">
          Expires: {{ taxExemptExpiryFormatted }}
        </span>
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
