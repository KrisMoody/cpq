<script setup lang="ts">
import type { SectionFilter, SectionFilterType } from '~/types/quote-layout'

const props = defineProps<{
  filter?: SectionFilter
}>()

const emit = defineEmits<{
  update: [filter: SectionFilter | undefined]
}>()

const filterTypeOptions = [
  { label: 'Show All Items', value: 'all' },
  { label: 'Filter by Product Type', value: 'productType' },
  { label: 'Filter by Category', value: 'category' },
]

const productTypeOptions = [
  { label: 'License', value: 'LICENSE' },
  { label: 'Service', value: 'SERVICE' },
  { label: 'Addon', value: 'ADDON' },
  { label: 'Bundle', value: 'BUNDLE' },
  { label: 'Physical', value: 'PHYSICAL' },
]

const localFilterType = computed({
  get: () => props.filter?.type || 'all',
  set: (value: string) => {
    if (value === 'all') {
      emit('update', undefined)
    } else {
      emit('update', {
        type: value as SectionFilterType,
        productTypes: value === 'productType' ? [] : undefined,
        categoryIds: value === 'category' ? [] : undefined,
      })
    }
  },
})

const selectedProductTypes = computed({
  get: () => props.filter?.productTypes || [],
  set: (value: string[]) => {
    emit('update', {
      ...props.filter,
      type: 'productType',
      productTypes: value,
    })
  },
})

function toggleProductType(type: string) {
  const current = selectedProductTypes.value
  if (current.includes(type)) {
    selectedProductTypes.value = current.filter((t) => t !== type)
  } else {
    selectedProductTypes.value = [...current, type]
  }
}
</script>

<template>
  <div class="space-y-3">
    <UFormField label="Filter Type">
      <USelectMenu
        v-model="localFilterType"
        :items="filterTypeOptions"
        value-key="value"
        size="sm"
      />
    </UFormField>

    <!-- Product Type Filter -->
    <div v-if="localFilterType === 'productType'" class="space-y-2">
      <p class="text-xs font-medium text-gray-500">Show items of type:</p>
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="opt in productTypeOptions"
          :key="opt.value"
          :variant="selectedProductTypes.includes(opt.value) ? 'soft' : 'outline'"
          size="xs"
          @click="toggleProductType(opt.value)"
        >
          {{ opt.label }}
        </UButton>
      </div>
      <p v-if="selectedProductTypes.length === 0" class="text-xs text-amber-600">
        No types selected - section will be empty
      </p>
    </div>

    <!-- Category Filter (simplified - would need category fetching) -->
    <div v-if="localFilterType === 'category'" class="space-y-2">
      <p class="text-xs text-gray-500 italic">
        Category filtering will be available in a future update.
      </p>
    </div>

    <p v-if="localFilterType === 'all'" class="text-xs text-gray-500">
      All line items will be displayed in this section.
    </p>
  </div>
</template>
