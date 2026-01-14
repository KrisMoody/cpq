<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

const props = defineProps<{
  product: Product
}>()

const { formatPrice } = usePricing()

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
      <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
        {{ product.description || 'No description' }}
      </p>
      <div class="flex items-center gap-2 text-xs text-gray-400">
        <UIcon name="i-heroicons-tag" />
        <span>SKU: {{ product.sku }}</span>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center">
        <UBadge v-if="!product.isActive" color="warning" variant="subtle" size="xs">
          Inactive
        </UBadge>
        <span v-else class="text-xs text-gray-400">Active</span>
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
