<script setup lang="ts">
const { contracts, loading, error, fetchContracts, deleteContract, getStatusColor } = useContracts()

const statusFilter = ref<'ALL' | 'DRAFT' | 'ACTIVE' | 'EXPIRED'>('ALL')

const statusOptions = [
  { label: 'All', value: 'ALL' as const },
  { label: 'Draft', value: 'DRAFT' as const },
  { label: 'Active', value: 'ACTIVE' as const },
  { label: 'Expired', value: 'EXPIRED' as const },
]

onMounted(() => {
  fetchContracts()
})

watch(statusFilter, (value) => {
  fetchContracts(value !== 'ALL' ? { status: value } : undefined)
})

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this contract?')) return
  await deleteContract(id)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Contracts</h1>
        <p class="text-gray-500">Manage customer pricing contracts</p>
      </div>
      <UButton to="/contracts/new" icon="i-heroicons-plus">
        New Contract
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4">
      <div class="inline-flex rounded-md shadow-sm">
        <UButton
          v-for="(option, index) in statusOptions"
          :key="option.value"
          :variant="statusFilter === option.value ? 'solid' : 'ghost'"
          size="sm"
          :class="[
            index === 0 ? 'rounded-r-none' : '',
            index === statusOptions.length - 1 ? 'rounded-l-none' : '',
            index !== 0 && index !== statusOptions.length - 1 ? 'rounded-none' : ''
          ]"
          @click="statusFilter = option.value"
        >
          {{ option.label }}
        </UButton>
      </div>
      <span class="text-sm text-gray-500">
        {{ contracts.length }} contract{{ contracts.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error State -->
    <UAlert v-else-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error loading contracts</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Empty State -->
    <div v-else-if="contracts.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 mb-4">No contracts found</p>
      <UButton to="/contracts/new" variant="soft">Create your first contract</UButton>
    </div>

    <!-- Contracts Table -->
    <UCard v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contract Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Validity Period</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Discount</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
            <tr
              v-for="contract in contracts"
              :key="contract.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td class="px-4 py-3">
                <NuxtLink :to="`/contracts/${contract.id}`" class="font-medium text-primary-600 hover:underline">
                  {{ contract.name }}
                </NuxtLink>
                <p v-if="contract.priceEntryCount" class="text-xs text-gray-500">
                  {{ contract.priceEntryCount }} custom price{{ contract.priceEntryCount !== 1 ? 's' : '' }}
                </p>
              </td>
              <td class="px-4 py-3">
                <NuxtLink :to="`/customers/${contract.customer.id}`" class="hover:underline">
                  {{ contract.customer.name }}
                </NuxtLink>
                <p v-if="contract.customer.company" class="text-xs text-gray-500">{{ contract.customer.company }}</p>
              </td>
              <td class="px-4 py-3 text-sm">
                {{ formatDate(contract.startDate) }} - {{ formatDate(contract.endDate) }}
              </td>
              <td class="px-4 py-3 text-sm">
                <span v-if="contract.discountPercent">
                  {{ contract.discountPercent }}%
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-4 py-3">
                <UBadge :color="getStatusColor(contract.status) as any" variant="subtle">
                  {{ contract.status }}
                </UBadge>
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <UButton
                    :to="`/contracts/${contract.id}`"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-pencil"
                  />
                  <UButton
                    variant="ghost"
                    size="xs"
                    color="error"
                    icon="i-heroicons-trash"
                    @click="handleDelete(contract.id)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>
