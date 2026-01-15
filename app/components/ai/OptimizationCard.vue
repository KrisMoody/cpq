<script setup lang="ts">
import type { AIRecommendation } from '~/composables/useAIQuoteOptimizer'

const props = defineProps<{
  recommendation: AIRecommendation
  requiresConfirmation: boolean
}>()

const emit = defineEmits<{
  apply: [recommendation: AIRecommendation]
  dismiss: [recommendation: AIRecommendation]
}>()

const { formatPrice } = usePricing()

const showConfirmDialog = ref(false)

const priorityColor = computed(() => {
  switch (props.recommendation.priority) {
    case 'HIGH':
      return 'error'
    case 'MEDIUM':
      return 'warning'
    case 'LOW':
      return 'info'
    default:
      return 'neutral'
  }
})

const typeIcon = computed(() => {
  switch (props.recommendation.type) {
    case 'ADD_PRODUCT':
      return 'i-heroicons-plus-circle'
    case 'APPLY_DISCOUNT':
      return 'i-heroicons-receipt-percent'
    case 'ADJUST_QUANTITY':
      return 'i-heroicons-arrows-up-down'
    case 'REMOVE_PRODUCT':
      return 'i-heroicons-minus-circle'
    default:
      return 'i-heroicons-light-bulb'
  }
})

const typeLabel = computed(() => {
  switch (props.recommendation.type) {
    case 'ADD_PRODUCT':
      return 'Add Product'
    case 'APPLY_DISCOUNT':
      return 'Apply Discount'
    case 'ADJUST_QUANTITY':
      return 'Adjust Quantity'
    case 'REMOVE_PRODUCT':
      return 'Remove Product'
    default:
      return 'Suggestion'
  }
})

const typeColor = computed(() => {
  switch (props.recommendation.type) {
    case 'ADD_PRODUCT':
      return 'success'
    case 'APPLY_DISCOUNT':
      return 'primary'
    case 'ADJUST_QUANTITY':
      return 'warning'
    case 'REMOVE_PRODUCT':
      return 'error'
    default:
      return 'neutral'
  }
})

const confidencePercent = computed(() => {
  return Math.round(props.recommendation.confidence * 100)
})

const hasImpact = computed(() => {
  const impact = props.recommendation.impact
  return impact && (impact.revenueChange || impact.marginChange || impact.winProbabilityChange)
})

function handleApply() {
  if (props.requiresConfirmation) {
    showConfirmDialog.value = true
  } else {
    emit('apply', props.recommendation)
  }
}

function confirmApply() {
  showConfirmDialog.value = false
  emit('apply', props.recommendation)
}
</script>

<template>
  <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <!-- Header -->
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-3 min-w-0 flex-1">
        <div
          class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          :class="{
            'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400': recommendation.type === 'ADD_PRODUCT',
            'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400': recommendation.type === 'APPLY_DISCOUNT',
            'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400': recommendation.type === 'ADJUST_QUANTITY',
            'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400': recommendation.type === 'REMOVE_PRODUCT',
          }"
        >
          <UIcon :name="typeIcon" class="w-5 h-5" />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <UBadge :color="typeColor" variant="subtle" size="xs">
              {{ typeLabel }}
            </UBadge>
            <UBadge :color="priorityColor" variant="outline" size="xs">
              {{ recommendation.priority }}
            </UBadge>
            <span class="text-xs text-gray-500">
              {{ confidencePercent }}% confidence
            </span>
          </div>

          <!-- Product/Discount name -->
          <p v-if="recommendation.productName" class="font-medium text-sm mt-1">
            {{ recommendation.productName }}
            <span v-if="recommendation.quantity" class="text-gray-500">
              (Qty: {{ recommendation.quantity }})
            </span>
          </p>
          <p v-if="recommendation.discountName" class="font-medium text-sm mt-1">
            {{ recommendation.discountName }}
          </p>

          <!-- Reason -->
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ recommendation.reason }}
          </p>

          <!-- Impact -->
          <div v-if="hasImpact" class="flex items-center gap-4 mt-2 text-xs">
            <span
              v-if="recommendation.impact?.revenueChange"
              class="flex items-center gap-1"
              :class="recommendation.impact.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              <UIcon
                :name="recommendation.impact.revenueChange >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'"
                class="w-4 h-4"
              />
              {{ recommendation.impact.revenueChange >= 0 ? '+' : '' }}{{ formatPrice(recommendation.impact.revenueChange) }} revenue
            </span>
            <span
              v-if="recommendation.impact?.marginChange"
              class="flex items-center gap-1"
              :class="recommendation.impact.marginChange >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              <UIcon
                :name="recommendation.impact.marginChange >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'"
                class="w-4 h-4"
              />
              {{ recommendation.impact.marginChange >= 0 ? '+' : '' }}{{ recommendation.impact.marginChange.toFixed(1) }}% margin
            </span>
            <span
              v-if="recommendation.impact?.winProbabilityChange"
              class="flex items-center gap-1"
              :class="recommendation.impact.winProbabilityChange >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              <UIcon
                :name="recommendation.impact.winProbabilityChange >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'"
                class="w-4 h-4"
              />
              {{ recommendation.impact.winProbabilityChange >= 0 ? '+' : '' }}{{ recommendation.impact.winProbabilityChange.toFixed(0) }}% win rate
            </span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 flex-shrink-0">
        <UButton
          variant="soft"
          color="primary"
          size="xs"
          icon="i-heroicons-check"
          @click="handleApply"
        >
          Apply
        </UButton>
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="i-heroicons-x-mark"
          @click="emit('dismiss', recommendation)"
        />
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <UModal v-model:open="showConfirmDialog" title="Confirm Action">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">Confirm Action</h3>
              <UButton
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="showConfirmDialog = false"
              />
            </div>
          </template>

          <div class="space-y-4">
            <p>
              Are you sure you want to <strong>{{ typeLabel.toLowerCase() }}</strong>?
            </p>
            <p v-if="recommendation.productName" class="text-gray-600">
              Product: {{ recommendation.productName }}
            </p>
            <p v-if="recommendation.discountName" class="text-gray-600">
              Discount: {{ recommendation.discountName }}
            </p>
            <p class="text-sm text-gray-500">{{ recommendation.reason }}</p>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" @click="showConfirmDialog = false">
                Cancel
              </UButton>
              <UButton color="primary" @click="confirmApply">
                Confirm
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
