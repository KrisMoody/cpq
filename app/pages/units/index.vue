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
  await deleteUnit(id)
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Units of Measure</h1>
        <p class="text-ga-gray-600 text-sm mt-1">Configure units for product pricing and quantities</p>
      </div>
      <UButton to="/units/new" icon="i-heroicons-plus">
        Add Unit
      </UButton>
    </div>

    <div class="mb-4 flex items-center justify-between">
      <span class="text-sm text-ga-gray-600">{{ units.length }} unit{{ units.length !== 1 ? 's' : '' }}</span>
      <UCheckbox v-model="showInactive" label="Show inactive" />
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-primary-500" />
    </div>

    <TablesUnitsTable
      v-else
      :units="units"
      @delete="handleDelete"
    />
  </div>
</template>
