<script setup lang="ts">
import type { SummaryConfig } from '~/types/quote-layout'

defineProps<{
  config: SummaryConfig
}>()

const emit = defineEmits<{
  update: [updates: Partial<SummaryConfig>]
}>()

const isExpanded = ref(true)
</script>

<template>
  <UCard :ui="{ root: 'overflow-visible' }">
    <template #header>
      <div
        class="flex items-center justify-between cursor-pointer"
        @click="isExpanded = !isExpanded"
      >
        <h3 class="font-semibold">Summary Display</h3>
        <UIcon
          :name="isExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          class="w-4 h-4 text-ga-gray-600"
        />
      </div>
    </template>

    <div
      class="grid transition-[grid-template-rows] duration-200"
      :class="isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div :class="isExpanded ? 'overflow-visible' : 'overflow-hidden'">
        <div class="space-y-3">
          <p class="text-xs text-ga-gray-600">Choose which summary items to display on the quote.</p>

          <div class="grid grid-cols-2 gap-3">
            <UCheckbox
              :model-value="config.showSubtotal"
              label="Show subtotal"
              @update:model-value="emit('update', { showSubtotal: $event === true })"
            />
            <UCheckbox
              :model-value="config.showDiscounts"
              label="Show discounts"
              @update:model-value="emit('update', { showDiscounts: $event === true })"
            />
            <UCheckbox
              :model-value="config.showTaxes"
              label="Show taxes"
              @update:model-value="emit('update', { showTaxes: $event === true })"
            />
            <UCheckbox
              :model-value="config.showTotal"
              label="Show total"
              @update:model-value="emit('update', { showTotal: $event === true })"
            />
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
