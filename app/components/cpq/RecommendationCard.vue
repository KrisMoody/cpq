<script setup lang="ts">
import type { Recommendation } from '~/composables/useRecommendations'

const props = defineProps<{
  recommendation: Recommendation
}>()

const emit = defineEmits<{
  add: [productId: string]
  dismiss: [productId: string]
}>()

const { formatPrice } = usePricing()

const billingLabel = computed(() => {
  const freq = props.recommendation.billingFrequency
  if (freq === 'ONE_TIME') return ''
  if (freq === 'MONTHLY') return '/mo'
  if (freq === 'QUARTERLY') return '/qtr'
  if (freq === 'ANNUAL') return '/yr'
  return ''
})

const affinityTypeColor = computed(() => {
  switch (props.recommendation.affinityType) {
    case 'REQUIRED':
      return 'error'
    case 'UPSELL':
      return 'success'
    case 'CROSS_SELL':
      return 'info'
    case 'ACCESSORY':
      return 'warning'
    case 'SUBSCRIPTION_ADDON':
      return 'primary'
    default:
      return 'neutral'
  }
})

const affinityTypeLabel = computed(() => {
  switch (props.recommendation.affinityType) {
    case 'REQUIRED':
      return 'Required'
    case 'UPSELL':
      return 'Upgrade'
    case 'CROSS_SELL':
      return 'Cross-sell'
    case 'ACCESSORY':
      return 'Accessory'
    case 'SUBSCRIPTION_ADDON':
      return 'Add-on'
    case 'FREQUENTLY_BOUGHT':
      return 'Popular'
    default:
      return 'Suggested'
  }
})

const displayPrice = computed(() => {
  if (props.recommendation.hasContractPricing && props.recommendation.contractPrice !== undefined) {
    return props.recommendation.contractPrice
  }
  return props.recommendation.price
})
</script>

<template>
  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-medium text-sm truncate">{{ recommendation.productName }}</span>
          <UBadge :color="affinityTypeColor" variant="subtle" size="xs">
            {{ affinityTypeLabel }}
          </UBadge>
          <UBadge
            v-if="recommendation.billingFrequency !== 'ONE_TIME'"
            color="primary"
            variant="outline"
            size="xs"
          >
            {{ recommendation.billingFrequency }}
          </UBadge>
        </div>
        <p class="text-xs text-gray-500 mt-1">{{ recommendation.reason }}</p>
        <div v-if="displayPrice !== undefined" class="mt-1">
          <span
            v-if="recommendation.hasContractPricing && recommendation.price !== undefined"
            class="text-xs line-through text-gray-400 mr-1"
          >
            {{ formatPrice(recommendation.price) }}
          </span>
          <span class="text-sm font-medium">
            {{ formatPrice(displayPrice) }}{{ billingLabel }}
          </span>
          <UBadge
            v-if="recommendation.hasContractPricing"
            color="success"
            variant="subtle"
            size="xs"
            class="ml-1"
          >
            Contract
          </UBadge>
        </div>
      </div>
      <div class="flex items-center gap-1 flex-shrink-0">
        <UButton
          variant="soft"
          color="primary"
          size="xs"
          icon="i-heroicons-plus"
          @click="emit('add', recommendation.productId)"
        >
          Add
        </UButton>
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="i-heroicons-x-mark"
          @click="emit('dismiss', recommendation.productId)"
        />
      </div>
    </div>
  </div>
</template>
