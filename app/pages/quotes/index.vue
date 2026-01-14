<script setup lang="ts">
const { quotes, loading, error, fetchQuotes } = useQuotes()

const showCancelled = ref(false)

onMounted(() => {
  fetchQuotes()
})

watch(showCancelled, async () => {
  await $fetch('/api/quotes', {
    params: { includeCancelled: showCancelled.value }
  }).then((data) => {
    quotes.value = data as typeof quotes.value
  })
})

const statusFilter = ref<'ALL' | 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'>('ALL')

const filteredQuotes = computed(() => {
  if (statusFilter.value === 'ALL') return quotes.value
  return quotes.value.filter((q) => q.status === statusFilter.value)
})

const statusOptions = computed(() => [
  { label: 'All', value: 'ALL' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  ...(showCancelled.value ? [{ label: 'Cancelled', value: 'CANCELLED' }] : []),
])
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Quotes</h1>
        <p class="text-gray-500">Manage sales quotes</p>
      </div>

      <div class="flex items-center gap-2">
        <UButton to="/quote-layouts" variant="ghost" icon="i-heroicons-squares-2x2">
          Manage Layouts
        </UButton>
        <UButton to="/quotes/new" icon="i-heroicons-plus">
          New Quote
        </UButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4">
      <div class="inline-flex rounded-md shadow-sm">
        <UButton
          v-for="(option, index) in statusOptions"
          :key="option.value"
          :variant="statusFilter === option.value ? 'solid' : 'ghost'"
          size="sm"
          :class="[
            index === 0 ? 'rounded-r-none' : '',
            index === statusOptions.length - 1 ? 'rounded-l-none' : '',
            index !== 0 && index !== statusOptions.length - 1 ? 'rounded-none' : ''
          ]"
          @click="statusFilter = option.value as typeof statusFilter"
        >
          {{ option.label }}
        </UButton>
      </div>

      <span class="text-sm text-gray-500">
        {{ filteredQuotes.length }} quote{{ filteredQuotes.length !== 1 ? 's' : '' }}
      </span>

      <UCheckbox v-model="showCancelled" label="Show cancelled" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error State -->
    <UAlert v-else-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error loading quotes</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Empty State -->
    <div v-else-if="filteredQuotes.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 mb-4">No quotes found</p>
      <UButton to="/quotes/new" variant="soft">
        Create your first quote
      </UButton>
    </div>

    <!-- Quotes Table -->
    <TablesQuotesTable v-else :quotes="filteredQuotes" />
  </div>
</template>
