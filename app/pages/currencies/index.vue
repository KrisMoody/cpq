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
        <p class="text-ga-gray-600 text-sm mt-1">Manage currencies and exchange rates</p>
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
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-ga-navy-500" />
      </div>

      <div v-else-if="filteredCurrencies.length === 0" class="text-center py-8 text-ga-gray-600">
        No currencies configured yet.
      </div>

      <TablesCurrenciesTable
        v-else
        :currencies="filteredCurrencies"
        @delete="handleDelete"
      />
    </UCard>
  </div>
</template>
