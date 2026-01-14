<script setup lang="ts">
const { taxRates, loading, fetchTaxRates, deleteTaxRate, formatRate } = useTaxRates()

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

function formatJurisdiction(taxRate: { country: string; state: string | null }) {
  return taxRate.state ? `${taxRate.state}, ${taxRate.country}` : taxRate.country
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Tax Rates</h1>
        <p class="text-gray-500 text-sm mt-1">Configure tax rates for different jurisdictions</p>
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

      <div v-else-if="taxRates.length === 0" class="text-center py-8 text-gray-500">
        No tax rates configured yet.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-3 px-4 font-medium text-gray-500">Name</th>
              <th class="text-left py-3 px-4 font-medium text-gray-500">Rate</th>
              <th class="text-left py-3 px-4 font-medium text-gray-500">Jurisdiction</th>
              <th class="text-left py-3 px-4 font-medium text-gray-500">Category</th>
              <th class="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              <th class="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="taxRate in taxRates"
              :key="taxRate.id"
              class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td class="py-3 px-4">
                <NuxtLink
                  :to="`/tax-rates/${taxRate.id}`"
                  class="font-medium text-primary-600 hover:text-primary-700"
                >
                  {{ taxRate.name }}
                </NuxtLink>
              </td>
              <td class="py-3 px-4 font-mono">
                {{ formatRate(taxRate.rate) }}
              </td>
              <td class="py-3 px-4">
                {{ formatJurisdiction(taxRate) }}
              </td>
              <td class="py-3 px-4">
                <span v-if="taxRate.category" class="text-sm">
                  {{ taxRate.category.name }}
                </span>
                <span v-else class="text-gray-400 text-sm">All products</span>
              </td>
              <td class="py-3 px-4">
                <UBadge v-if="taxRate.isActive" color="success" variant="subtle">Active</UBadge>
                <UBadge v-else color="warning" variant="subtle">Inactive</UBadge>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex justify-end gap-2">
                  <UButton
                    :to="`/tax-rates/${taxRate.id}`"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-pencil"
                  />
                  <UButton
                    v-if="taxRate.isActive"
                    variant="ghost"
                    size="xs"
                    color="error"
                    icon="i-heroicons-trash"
                    @click="handleDelete(taxRate.id)"
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
