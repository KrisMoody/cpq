<script setup lang="ts">
import type { Customer } from '~/composables/useCustomers'

defineProps<{
  modelValue: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'select': [customer: Customer | null]
}>()

const { customers, fetchCustomers } = useCustomers()
const search = ref('')

onMounted(() => {
  fetchCustomers()
})

const filteredCustomers = computed(() => {
  // Only show active customers
  const activeCustomers = customers.value.filter((c) => c.isActive)
  if (!search.value) return activeCustomers.slice(0, 10)
  const searchLower = search.value.toLowerCase()
  return activeCustomers
    .filter((c) =>
      c.name.toLowerCase().includes(searchLower) ||
      c.company?.toLowerCase().includes(searchLower) ||
      c.email?.toLowerCase().includes(searchLower)
    )
    .slice(0, 10)
})

function selectCustomer(customer: Customer | null) {
  emit('update:modelValue', customer?.id ?? null)
  emit('select', customer)
}

function clearSelection() {
  selectCustomer(null)
}
</script>

<template>
  <div class="space-y-3">
    <!-- Search Input -->
    <UInput
      v-model="search"
      placeholder="Search customers..."
      icon="i-heroicons-magnifying-glass"
    />

    <!-- Customer List -->
    <div class="border border-ga-gray-300 rounded-lg max-h-64 overflow-auto">
      <div
        v-for="customer in filteredCustomers"
        :key="customer.id"
        class="p-3 hover:bg-ga-gray-200 cursor-pointer border-b border-ga-gray-300 last:border-b-0"
        :class="{ 'bg-ga-navy-50': customer.id === modelValue }"
        @click="selectCustomer(customer)"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">{{ customer.name }}</p>
            <p v-if="customer.company" class="text-sm text-ga-gray-600">{{ customer.company }}</p>
          </div>
          <UIcon
            v-if="customer.id === modelValue"
            name="i-heroicons-check"
            class="w-5 h-5 text-ga-navy-500"
          />
        </div>
      </div>

      <div v-if="filteredCustomers.length === 0" class="p-3 text-center text-ga-gray-600">
        No customers found
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <UButton
        v-if="modelValue"
        variant="soft"
        color="error"
        size="sm"
        icon="i-heroicons-x-mark"
        @click="clearSelection"
      >
        Remove Customer
      </UButton>
      <UButton
        to="/customers/new"
        variant="ghost"
        size="sm"
        icon="i-heroicons-plus"
      >
        Create New Customer
      </UButton>
    </div>
  </div>
</template>
