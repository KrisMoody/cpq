<script setup lang="ts">
const { priceBooks, loading, error, fetchPriceBooks } = usePricing()

const showInactive = useState('price-books-show-inactive', () => false)

onMounted(() => {
  fetchPriceBooks()
})

const filteredPriceBooks = computed(() => {
  if (showInactive.value) return priceBooks.value
  return priceBooks.value.filter((pb) => pb.isActive)
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Price Books</h1>
        <p class="text-ga-gray-600">Manage pricing for your products</p>
      </div>
      <UButton to="/price-books/new" icon="i-heroicons-plus">
        New Price Book
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4">
      <UCheckbox v-model="showInactive" label="Show inactive" />
      <span class="text-sm text-ga-gray-600">
        {{ filteredPriceBooks.length }} price book{{ filteredPriceBooks.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error State -->
    <UAlert v-else-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error loading price books</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Empty State -->
    <div v-else-if="filteredPriceBooks.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-currency-dollar" class="w-12 h-12 text-ga-gray-400 mx-auto mb-4" />
      <p class="text-ga-gray-600 mb-4">No price books found</p>
      <UButton to="/price-books/new" variant="soft">Create your first price book</UButton>
    </div>

    <!-- Price Books Table -->
    <TablesPriceBooksTable v-else :price-books="filteredPriceBooks" />
  </div>
</template>
