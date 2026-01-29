<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

const props = defineProps<{
  product: Product
}>()

const { formatPrice: _formatPrice } = usePricing()

const typeLabel = computed(() => {
  return props.product.type === 'BUNDLE' ? 'Configurable Bundle' : 'Standalone'
})

const typeColor = computed(() => {
  return props.product.type === 'BUNDLE' ? 'primary' : 'neutral'
})
</script>

<template>
  <UCard class="hover:ring-2 hover:ring-primary-500 transition-all cursor-pointer">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-lg truncate">{{ product.name }}</h3>
        <UBadge :color="typeColor" variant="subtle">
          {{ typeLabel }}
        </UBadge>
      </div>
    </template>

    <div class="space-y-2">
      <p class="text-sm text-ga-gray-600 line-clamp-2">
        {{ product.description || 'No description' }}
      </p>
      <div class="flex items-center gap-2 text-xs text-ga-gray-500">
        <UIcon name="i-heroicons-tag" />
        <span>SKU: {{ product.sku }}</span>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <UBadge v-if="!product.isActive" color="warning" variant="subtle" size="xs">
            Inactive
          </UBadge>
          <span v-else class="text-xs text-ga-gray-500">Active</span>
          <UBadge v-if="!product.isTaxable" color="info" variant="subtle" size="xs">
            Non-Taxable
          </UBadge>
        </div>
        <UButton
          :to="`/products/${product.id}`"
          size="sm"
          variant="ghost"
          trailing-icon="i-heroicons-arrow-right"
        >
          View
        </UButton>
      </div>
    </template>
  </UCard>
</template>
