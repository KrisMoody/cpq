<script setup lang="ts">
const { units, loading, fetchUnits, deleteUnit } = useUnits()

const showInactive = ref(false)

onMounted(async () => {
  await fetchUnits(showInactive.value)
})

watch(showInactive, async (value) => {
  await fetchUnits(value)
})

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to deactivate this unit?')) return
  await deleteUnit(id)
}

function formatConversion(unit: { baseUnit?: { name: string; abbreviation: string } | null; conversionFactor: string | number }) {
  if (!unit.baseUnit) return '-'
  const factor = typeof unit.conversionFactor === 'string' ? parseFloat(unit.conversionFactor) : unit.conversionFactor
  return `1 = ${factor} ${unit.baseUnit.abbreviation}`
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Units of Measure</h1>
        <p class="text-gray-500 text-sm mt-1">Configure units for product pricing and quantities</p>
      </div>
      <UButton to="/units/new" icon="i-heroicons-plus">
        Add Unit
      </UButton>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-medium">{{ units.length }} Unit{{ units.length !== 1 ? 's' : '' }}</span>
          <UCheckbox v-model="showInactive" label="Show inactive" />
        </div>
      </template>

      <div v-if="loading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-primary-500" />
      </div>

      <div v-else-if="units.length === 0" class="text-center py-8 text-gray-500">
        No units of measure configured yet.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-3 px-4 font-medium text-gray-500">Name</th>
              <th class="text-left py-3 px-4 font-medium text-gray-500">Abbreviation</th>
              <th class="text-left py-3 px-4 font-medium text-gray-500">Base Unit Conversion</th>
              <th class="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              <th class="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="unit in units"
              :key="unit.id"
              class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td class="py-3 px-4">
                <NuxtLink
                  :to="`/units/${unit.id}`"
                  class="font-medium text-primary-600 hover:text-primary-700"
                >
                  {{ unit.name }}
                </NuxtLink>
              </td>
              <td class="py-3 px-4 font-mono">
                {{ unit.abbreviation }}
              </td>
              <td class="py-3 px-4">
                {{ formatConversion(unit) }}
              </td>
              <td class="py-3 px-4">
                <UBadge v-if="unit.isActive" color="success" variant="subtle">Active</UBadge>
                <UBadge v-else color="warning" variant="subtle">Inactive</UBadge>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex justify-end gap-2">
                  <UButton
                    :to="`/units/${unit.id}`"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-pencil"
                  />
                  <UButton
                    v-if="unit.isActive"
                    variant="ghost"
                    size="xs"
                    color="error"
                    icon="i-heroicons-trash"
                    @click="handleDelete(unit.id)"
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
