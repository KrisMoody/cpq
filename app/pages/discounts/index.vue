<script setup lang="ts">
const { discounts, loading, error, fetchDiscounts, deleteDiscount } = useDiscounts()

const showInactive = ref(false)

onMounted(() => {
  fetchDiscounts(showInactive.value)
})

watch(showInactive, (value) => {
  fetchDiscounts(value)
})

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this discount?')) return
  await deleteDiscount(id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Discounts</h1>
        <p class="text-gray-500">Manage pricing discounts and promotions</p>
      </div>
      <UButton to="/discounts/new" icon="i-heroicons-plus">
        New Discount
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4">
      <UCheckbox v-model="showInactive" label="Show expired/inactive" />
      <span class="text-sm text-gray-500">
        {{ discounts.length }} discount{{ discounts.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error State -->
    <UAlert v-else-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error loading discounts</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Empty State -->
    <div v-else-if="discounts.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-receipt-percent" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 mb-4">No discounts found</p>
      <UButton to="/discounts/new" variant="soft">Create your first discount</UButton>
    </div>

    <!-- Discounts Table -->
    <TablesDiscountsTable v-else :discounts="discounts" @delete="handleDelete" />
  </div>
</template>
