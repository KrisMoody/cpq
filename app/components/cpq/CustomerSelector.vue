<script setup lang="ts">
import type { Customer } from '~/composables/useCustomers'

const props = defineProps<{
  modelValue: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'select': [customer: Customer | null]
}>()

const { customers, fetchCustomers } = useCustomers()
const search = ref('')
const isOpen = ref(false)

onMounted(() => {
  fetchCustomers()
})

const filteredCustomers = computed(() => {
  if (!search.value) return customers.value.slice(0, 10)
  const searchLower = search.value.toLowerCase()
  return customers.value
    .filter((c) =>
      c.name.toLowerCase().includes(searchLower) ||
      c.company?.toLowerCase().includes(searchLower) ||
      c.email?.toLowerCase().includes(searchLower)
    )
    .slice(0, 10)
})

const selectedCustomer = computed(() => {
  if (!props.modelValue) return null
  return customers.value.find((c) => c.id === props.modelValue)
})

function selectCustomer(customer: Customer | null) {
  emit('update:modelValue', customer?.id ?? null)
  emit('select', customer)
  search.value = ''
  isOpen.value = false
}

function clearSelection() {
  selectCustomer(null)
}
</script>

<template>
  <div class="relative">
    <!-- Selected Customer Display -->
    <div
      v-if="selectedCustomer"
      class="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
    >
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-user-circle" class="w-8 h-8 text-gray-400" />
        <div>
          <p class="font-medium">{{ selectedCustomer.name }}</p>
          <p v-if="selectedCustomer.company" class="text-sm text-gray-500">
            {{ selectedCustomer.company }}
          </p>
        </div>
      </div>
      <UButton
        variant="ghost"
        size="xs"
        icon="i-heroicons-x-mark"
        @click="clearSelection"
      />
    </div>

    <!-- Search Input -->
    <div v-else>
      <UInput
        v-model="search"
        placeholder="Search customers..."
        icon="i-heroicons-magnifying-glass"
        @focus="isOpen = true"
      />

      <!-- Dropdown -->
      <div
        v-if="isOpen"
        class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border rounded-lg shadow-lg max-h-60 overflow-auto"
      >
        <div
          v-for="customer in filteredCustomers"
          :key="customer.id"
          class="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          @click="selectCustomer(customer)"
        >
          <p class="font-medium">{{ customer.name }}</p>
          <p v-if="customer.company" class="text-sm text-gray-500">{{ customer.company }}</p>
        </div>

        <div v-if="filteredCustomers.length === 0" class="p-3 text-center text-gray-500">
          No customers found
        </div>

        <div class="border-t p-2">
          <UButton
            to="/customers/new"
            variant="ghost"
            size="sm"
            icon="i-heroicons-plus"
            block
          >
            Create New Customer
          </UButton>
        </div>
      </div>
    </div>

    <!-- Click outside to close -->
    <div
      v-if="isOpen && !selectedCustomer"
      class="fixed inset-0 z-0"
      @click="isOpen = false"
    />
  </div>
</template>
