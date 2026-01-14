<script setup lang="ts">
const { currencies, loading, fetchCurrencies, deleteCurrency } = useCurrencies()

const showInactive = ref(false)

onMounted(async () => {
  await fetchCurrencies()
})

const filteredCurrencies = computed(() => {
  if (showInactive.value) return currencies.value
  return currencies.value.filter((c) => c.isActive)
})

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to deactivate this currency?')) return
  await deleteCurrency(id)
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Currencies</h1>
        <p class="text-gray-500 text-sm mt-1">Manage currencies and exchange rates</p>
      </div>
      <UButton to="/currencies/new" icon="i-heroicons-plus">
        Add Currency
      </UButton>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-medium">{{ filteredCurrencies.length }} Currenc{{ filteredCurrencies.length !== 1 ? 'ies' : 'y' }}</span>
          <UCheckbox v-model="showInactive" label="Show inactive" />
        </div>
      </template>

      <div v-if="loading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-primary-500" />
      </div>

      <div v-else-if="filteredCurrencies.length === 0" class="text-center py-8 text-gray-500">
        No currencies configured yet.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-3 px-4 font-medium text-gray-500">Code</th>
              <th class="text-left py-3 px-4 font-medium text-gray-500">Name</th>
              <th class="text-left py-3 px-4 font-medium text-gray-500">Symbol</th>
              <th class="text-right py-3 px-4 font-medium text-gray-500">Exchange Rate</th>
              <th class="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              <th class="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="currency in filteredCurrencies"
              :key="currency.id"
              class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td class="py-3 px-4">
                <NuxtLink
                  :to="`/currencies/${currency.id}`"
                  class="font-medium text-primary-600 hover:text-primary-700"
                >
                  {{ currency.code }}
                </NuxtLink>
              </td>
              <td class="py-3 px-4">
                {{ currency.name }}
              </td>
              <td class="py-3 px-4 font-mono">
                {{ currency.symbol }}
              </td>
              <td class="py-3 px-4 text-right font-mono">
                <template v-if="currency.isBase">
                  <UBadge color="primary" variant="subtle" size="xs">Base</UBadge>
                </template>
                <template v-else>
                  {{ currency.currentRate?.toFixed(4) ?? '—' }}
                </template>
              </td>
              <td class="py-3 px-4">
                <UBadge v-if="currency.isActive" color="success" variant="subtle">Active</UBadge>
                <UBadge v-else color="warning" variant="subtle">Inactive</UBadge>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex justify-end gap-2">
                  <UButton
                    :to="`/currencies/${currency.id}`"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-pencil"
                  />
                  <UButton
                    v-if="currency.isActive && !currency.isBase"
                    variant="ghost"
                    size="xs"
                    color="error"
                    icon="i-heroicons-trash"
                    @click="handleDelete(currency.id)"
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
