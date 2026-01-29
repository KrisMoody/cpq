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
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Contracts</h1>
        <p class="text-ga-gray-600">Manage customer pricing contracts</p>
      </div>
      <UButton to="/contracts/new" icon="i-heroicons-plus" class="w-full sm:w-auto">
        New Contract
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div class="flex flex-wrap gap-1 sm:gap-0 sm:inline-flex sm:rounded-md sm:shadow-sm">
        <UButton
          v-for="(option, index) in statusOptions"
          :key="option.value"
          :variant="statusFilter === option.value ? 'solid' : 'ghost'"
          size="sm"
          :class="[
            'sm:rounded-none',
            index === 0 ? 'sm:rounded-l-md' : '',
            index === statusOptions.length - 1 ? 'sm:rounded-r-md' : ''
          ]"
          @click="statusFilter = option.value"
        >
          {{ option.label }}
        </UButton>
      </div>
      <span class="text-sm text-ga-gray-600">
        {{ contracts.length }} contract{{ contracts.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-ga-navy-500" />
    </div>

    <!-- Error State -->
    <UAlert v-else-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error loading contracts</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Empty State -->
    <div v-else-if="contracts.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-ga-gray-400 mx-auto mb-4" />
      <p class="text-ga-gray-600 mb-4">No contracts found</p>
      <UButton to="/contracts/new" variant="soft">Create your first contract</UButton>
    </div>

    <!-- Contracts Table - Desktop -->
    <template v-else>
      <div class="hidden md:block overflow-x-auto rounded-lg border border-ga-gray-300">
        <table class="min-w-full divide-y divide-ga-gray-300">
          <thead class="bg-ga-gray-100">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-ga-gray-600 uppercase tracking-wider">Contract Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-ga-gray-600 uppercase tracking-wider">Customer</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-ga-gray-600 uppercase tracking-wider">Validity Period</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-ga-gray-600 uppercase tracking-wider">Discount</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-ga-gray-600 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3"/>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-ga-gray-300">
            <tr
              v-for="contract in contracts"
              :key="contract.id"
              class="hover:bg-ga-gray-200"
            >
              <td class="px-4 py-3">
                <NuxtLink :to="`/contracts/${contract.id}`" class="font-medium text-primary-600 hover:underline">
                  {{ contract.name }}
                </NuxtLink>
                <p v-if="contract.priceEntryCount" class="text-xs text-ga-gray-600">
                  {{ contract.priceEntryCount }} custom price{{ contract.priceEntryCount !== 1 ? 's' : '' }}
                </p>
              </td>
              <td class="px-4 py-3">
                <NuxtLink :to="`/customers/${contract.customer.id}`" class="hover:underline">
                  {{ contract.customer.name }}
                </NuxtLink>
                <p v-if="contract.customer.company" class="text-xs text-ga-gray-600">{{ contract.customer.company }}</p>
              </td>
              <td class="px-4 py-3 text-sm">
                {{ formatDate(contract.startDate) }} - {{ formatDate(contract.endDate) }}
              </td>
              <td class="px-4 py-3 text-sm">
                <span v-if="contract.discountPercent">
                  {{ contract.discountPercent }}%
                </span>
                <span v-else class="text-ga-gray-500">-</span>
              </td>
              <td class="px-4 py-3">
                <UBadge :color="getStatusColor(contract.status)" variant="subtle">
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

      <!-- Contracts Card List - Mobile -->
      <div class="md:hidden space-y-3">
        <div
          v-for="contract in contracts"
          :key="contract.id"
          class="rounded-lg border border-ga-gray-300 bg-white p-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <NuxtLink
                :to="`/contracts/${contract.id}`"
                class="text-ga-navy-600 hover:underline font-medium"
              >
                {{ contract.name }}
              </NuxtLink>
              <p class="text-sm text-ga-gray-600 mt-0.5">
                <NuxtLink :to="`/customers/${contract.customer.id}`" class="hover:underline">
                  {{ contract.customer.name }}
                </NuxtLink>
                <span v-if="contract.customer.company"> · {{ contract.customer.company }}</span>
              </p>
            </div>
            <div class="flex gap-1">
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
          </div>
          <div class="mt-3 text-sm text-ga-gray-700">
            <p>{{ formatDate(contract.startDate) }} - {{ formatDate(contract.endDate) }}</p>
            <p v-if="contract.discountPercent" class="mt-1">
              Discount: <span class="font-medium">{{ contract.discountPercent }}%</span>
            </p>
            <p v-if="contract.priceEntryCount" class="text-xs text-ga-gray-600 mt-1">
              {{ contract.priceEntryCount }} custom price{{ contract.priceEntryCount !== 1 ? 's' : '' }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2 mt-3">
            <UBadge :color="getStatusColor(contract.status)" variant="subtle">
              {{ contract.status }}
            </UBadge>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
