<script setup lang="ts">
const { taxProfiles, loading, fetchTaxProfiles, deleteTaxProfile } = useTaxProfiles()

const showInactive = ref(false)

onMounted(async () => {
  await fetchTaxProfiles(showInactive.value)
})

watch(showInactive, async (value) => {
  await fetchTaxProfiles(value)
})

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to deactivate this tax profile?')) return
  await deleteTaxProfile(id)
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Tax Profiles</h1>
        <p class="text-ga-gray-600 text-sm mt-1">Group tax rates into regional profiles for price books</p>
      </div>
      <UButton to="/tax-profiles/new" icon="i-heroicons-plus">
        Add Tax Profile
      </UButton>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-medium">{{ taxProfiles.length }} Tax Profile{{ taxProfiles.length !== 1 ? 's' : '' }}</span>
          <UCheckbox v-model="showInactive" label="Show inactive" />
        </div>
      </template>

      <div v-if="loading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-primary-500" />
      </div>

      <div v-else-if="taxProfiles.length === 0" class="text-center py-8 text-ga-gray-600">
        No tax profiles configured yet.
      </div>

      <TablesTaxProfilesTable
        v-else
        :tax-profiles="taxProfiles"
        @delete="handleDelete"
      />
    </UCard>
  </div>
</template>
