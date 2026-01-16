<script setup lang="ts">
import type { QuoteLineItem } from '~/composables/useQuotes'

defineProps<{
  lineItems: QuoteLineItem[]
}>()

const emit = defineEmits<{
  (e: 'remove', lineId: string): void
}>()

const { formatPrice } = usePricing()
</script>

<template>
  <div class="border rounded-lg overflow-hidden">
    <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b">
      <div class="flex items-center justify-between text-sm font-medium text-gray-500">
        <span class="flex-1">Product</span>
        <span class="w-16 text-center">Qty</span>
        <span class="w-24 text-right">Unit Price</span>
        <span class="w-24 text-right">Net Price</span>
        <span class="w-12"/>
      </div>
    </div>

    <div v-if="lineItems.length === 0" class="p-8 text-center text-gray-500">
      <UIcon name="i-heroicons-shopping-cart" class="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>No items in this quote yet</p>
      <p class="text-sm">Add products to get started</p>
    </div>

    <div v-else class="divide-y">
      <template v-for="lineItem in lineItems" :key="lineItem.id">
        <!-- Parent line item -->
        <div class="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50">
          <div class="flex-1 min-w-0">
            <p class="font-medium truncate" :title="lineItem.product.name">{{ lineItem.product.name }}</p>
            <p class="text-xs text-gray-500">{{ lineItem.product.sku }}</p>
            <UBadge
              v-if="lineItem.product.type === 'BUNDLE'"
              size="xs"
              variant="subtle"
              class="mt-1"
            >
              Bundle
            </UBadge>
          </div>
          <span class="w-16 text-center">{{ lineItem.quantity }}</span>
          <span class="w-24 text-right">{{ formatPrice(lineItem.listPrice) }}</span>
          <span class="w-24 text-right font-medium">{{ formatPrice(lineItem.netPrice) }}</span>
          <span class="w-12 text-right">
            <UButton
              variant="ghost"
              color="error"
              size="xs"
              icon="i-heroicons-trash"
              @click="emit('remove', lineItem.id)"
            />
          </span>
        </div>

        <!-- Child line items (bundle options) -->
        <template v-if="lineItem.childLines?.length">
          <div
            v-for="child in lineItem.childLines"
            :key="child.id"
            class="flex items-center px-4 py-2 pl-10 bg-gray-50/50 dark:bg-gray-800/30"
          >
            <div class="flex-1 flex items-center gap-2 min-w-0">
              <UIcon name="i-heroicons-arrow-turn-down-right" class="w-4 h-4 text-gray-400 shrink-0" />
              <div class="min-w-0">
                <p class="text-sm truncate" :title="child.product.name">{{ child.product.name }}</p>
                <p class="text-xs text-gray-400">{{ child.product.sku }}</p>
              </div>
            </div>
            <span class="w-16 text-center text-sm">{{ child.quantity }}</span>
            <span class="w-24 text-right text-sm">{{ formatPrice(child.listPrice) }}</span>
            <span class="w-24 text-right text-sm">{{ formatPrice(child.netPrice) }}</span>
            <span class="w-12"/>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
