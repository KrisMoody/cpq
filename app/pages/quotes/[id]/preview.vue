<script setup lang="ts">
import type { QuoteWithLineItems } from '~/composables/useQuotes'
import type { QuoteLayout } from '~/types/quote-layout'

definePageMeta({
  layout: 'blank',
})

const route = useRoute()
const { fetchLayouts, templateLayouts } = useQuoteLayouts()

const { data: quote, status, error } = await useFetch<QuoteWithLineItems>(
  `/api/quotes/${route.params.id}`
)

const loading = computed(() => status.value === 'pending')

// Layout selection
const selectedLayoutId = ref<string>('')
const selectedLayout = ref<QuoteLayout | null>(null)

// Fetch layouts on mount
onMounted(async () => {
  await fetchLayouts({ template: true })
})

// Update selected layout when selection changes
watch(selectedLayoutId, async (newId) => {
  if (!newId) {
    selectedLayout.value = null
    return
  }

  const layout = templateLayouts.value.find((l) => l.id === newId)
  if (layout) {
    selectedLayout.value = layout
  }
})

// Layout options for dropdown
const layoutOptions = computed(() => {
  return [
    { label: 'Default Layout', value: '' },
    ...templateLayouts.value.map((l) => ({
      label: l.name,
      value: l.id,
    })),
  ]
})

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-950">
    <!-- Navigation Bar (hidden when printing) -->
    <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 print:hidden">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <UButton
          :to="`/quotes/${route.params.id}`"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          Back to Editor
        </UButton>

        <div class="flex items-center gap-3">
          <!-- Layout Selector -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Layout:</span>
            <USelectMenu
              v-model="selectedLayoutId"
              :items="layoutOptions"
              placeholder="Select layout"
              class="w-40"
              value-key="value"
            />
          </div>

          <UButton
            variant="soft"
            icon="i-heroicons-printer"
            @click="handlePrint"
          >
            Print / Save PDF
          </UButton>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-8">
      <UAlert color="error" icon="i-heroicons-exclamation-triangle">
        <template #title>Error</template>
        <template #description>{{ error.message || 'Failed to load quote' }}</template>
      </UAlert>
    </div>

    <!-- Quote Preview with Layout -->
    <div v-else-if="quote" class="py-8 print:py-0">
      <div class="shadow-lg print:shadow-none">
        <CpqQuoteRenderer :quote="quote" :layout="selectedLayout" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  /* Remove page margins and padding for full-page print */
  .min-h-screen {
    min-height: auto;
    background: white !important;
  }
}
</style>
