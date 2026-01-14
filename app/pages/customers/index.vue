<script setup lang="ts">
const { customers, loading, error, fetchCustomers } = useCustomers()

const showInactive = ref(false)

onMounted(() => {
  fetchCustomers(showInactive.value)
})

watch(showInactive, (value) => {
  fetchCustomers(value)
})

const filteredCustomers = computed(() => {
  if (showInactive.value) return customers.value
  return customers.value.filter((c) => c.isActive)
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Customers</h1>
        <p class="text-gray-500">Manage your customer accounts</p>
      </div>
      <UButton to="/customers/new" icon="i-heroicons-plus">
        New Customer
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4">
      <UCheckbox v-model="showInactive" label="Show inactive" />
      <span class="text-sm text-gray-500">
        {{ filteredCustomers.length }} customer{{ filteredCustomers.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error State -->
    <UAlert v-else-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error loading customers</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Empty State -->
    <div v-else-if="filteredCustomers.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 mb-4">No customers found</p>
      <UButton to="/customers/new" variant="soft">Create your first customer</UButton>
    </div>

    <!-- Customers Table -->
    <TablesCustomersTable v-else :customers="filteredCustomers" />
  </div>
</template>
