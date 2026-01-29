<script setup lang="ts">
import type { Recommendation } from '~/composables/useRecommendations'

const props = defineProps<{
  quoteId: string
}>()

const emit = defineEmits<{
  'add-product': [productId: string]
}>()

const { fetchRecommendations, logRecommendationAction, loading } = useRecommendations()

const recommendations = ref<Recommendation[]>([])
const dismissedProductIds = ref<Set<string>>(new Set())
const showGuidedSelling = ref(false)

const visibleRecommendations = computed(() =>
  recommendations.value.filter((r) => !dismissedProductIds.value.has(r.productId))
)

async function loadRecommendations() {
  recommendations.value = await fetchRecommendations(props.quoteId)
  // Log that recommendations were shown
  for (const rec of recommendations.value) {
    await logRecommendationAction(props.quoteId, rec.productId, 'SHOWN', {
      affinityType: rec.affinityType,
    })
  }
}

async function handleAdd(productId: string) {
  await logRecommendationAction(props.quoteId, productId, 'ACCEPTED')
  emit('add-product', productId)
  // Remove from list after adding
  dismissedProductIds.value.add(productId)
}

async function handleDismiss(productId: string) {
  await logRecommendationAction(props.quoteId, productId, 'DISMISSED')
  dismissedProductIds.value.add(productId)
}

function refresh() {
  dismissedProductIds.value.clear()
  loadRecommendations()
}

// Load recommendations on mount and when quoteId changes
watch(
  () => props.quoteId,
  () => {
    loadRecommendations()
  },
  { immediate: true }
)

// Expose refresh method for parent to call after adding products
defineExpose({ refresh })
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-ga-yellow-500" />
          <h3 class="font-semibold">Recommendations</h3>
        </div>
        <div class="flex items-center gap-1">
          <UButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-arrow-path"
            :loading="loading"
            @click="refresh"
          />
          <UButton
            variant="soft"
            size="xs"
            icon="i-heroicons-sparkles"
            @click="showGuidedSelling = true"
          >
            Guided
          </UButton>
        </div>
      </div>
    </template>

    <div v-if="loading && recommendations.length === 0" class="text-center py-4">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 text-ga-gray-500 animate-spin mx-auto" />
      <p class="text-sm text-ga-gray-600 mt-2">Finding recommendations...</p>
    </div>

    <div v-else-if="visibleRecommendations.length === 0" class="text-center py-4">
      <UIcon name="i-heroicons-check-circle" class="w-8 h-8 text-ga-gray-400 mx-auto mb-2" />
      <p class="text-sm text-ga-gray-600">No recommendations available</p>
      <p class="text-xs text-ga-gray-500 mt-1">Add products to see suggestions</p>
    </div>

    <div v-else class="space-y-2">
      <CpqRecommendationCard
        v-for="rec in visibleRecommendations"
        :key="rec.productId"
        :recommendation="rec"
        @add="handleAdd"
        @dismiss="handleDismiss"
      />
    </div>

    <!-- Guided Selling Modal -->
    <UModal v-model:open="showGuidedSelling" title="Guided Selling">
      <template #content>
        <CpqGuidedSellingWizard
          :quote-id="quoteId"
          @close="showGuidedSelling = false"
          @add-products="(ids) => ids.forEach(id => emit('add-product', id))"
        />
      </template>
    </UModal>
  </UCard>
</template>
