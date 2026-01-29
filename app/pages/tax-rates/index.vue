<script setup lang="ts">
const { taxRates, loading, fetchTaxRates, deleteTaxRate } = useTaxRates()

const showInactive = ref(false)

onMounted(async () => {
  await fetchTaxRates(showInactive.value)
})

watch(showInactive, async (value) => {
  await fetchTaxRates(value)
})

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to deactivate this tax rate?')) return
  await deleteTaxRate(id)
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Tax Rates</h1>
        <p class="text-ga-gray-600 text-sm mt-1">Configure tax rates for different jurisdictions</p>
      </div>
      <UButton to="/tax-rates/new" icon="i-heroicons-plus">
        Add Tax Rate
      </UButton>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-medium">{{ taxRates.length }} Tax Rate{{ taxRates.length !== 1 ? 's' : '' }}</span>
          <UCheckbox v-model="showInactive" label="Show inactive" />
        </div>
      </template>

      <div v-if="loading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-primary-500" />
      </div>

      <div v-else-if="taxRates.length === 0" class="text-center py-8 text-ga-gray-600">
        No tax rates configured yet.
      </div>

      <TablesTaxRatesTable
        v-else
        :tax-rates="taxRates"
        @delete="handleDelete"
      />
    </UCard>
  </div>
</template>
