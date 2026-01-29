<script setup lang="ts">
import type { QuoteLayoutSection, LayoutColumn, ColumnField, SectionFilter } from '~/types/quote-layout'

defineProps<{
  section: QuoteLayoutSection
  isExpanded: boolean
  canRemove: boolean
}>()

const emit = defineEmits<{
  toggle: []
  update: [updates: Partial<QuoteLayoutSection>]
  remove: []
  updateColumns: [columns: LayoutColumn[]]
  addColumn: [field: ColumnField]
  removeColumn: [field: ColumnField]
  reorderColumns: [fromIndex: number, toIndex: number]
  updateFilter: [filter: SectionFilter | undefined]
}>()

// Tabs for section configuration
const activeTab = ref<'columns' | 'filter'>('columns')
</script>

<template>
  <div>
    <!-- Section Header (always visible) -->
    <div
      class="flex items-center gap-2 p-3 cursor-pointer hover:bg-ga-gray-200 rounded-t-lg"
      @click="emit('toggle')"
    >
      <UIcon
        name="i-heroicons-bars-3"
        class="w-4 h-4 text-ga-gray-500 cursor-grab"
        @click.stop
      />
      <UIcon
        :name="isExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
        class="w-4 h-4 text-ga-gray-600 transition-transform"
      />
      <span class="flex-1 font-medium">{{ section.name }}</span>
      <UBadge size="xs" variant="subtle" color="neutral">
        {{ section.columns.length }} cols
      </UBadge>
      <UButton
        v-if="canRemove"
        variant="ghost"
        color="error"
        size="xs"
        icon="i-heroicons-trash"
        @click.stop="emit('remove')"
      />
    </div>

    <!-- Expanded Content -->
    <div
      class="grid transition-[grid-template-rows] duration-200"
      :class="isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div :class="isExpanded ? 'overflow-visible' : 'overflow-hidden'">
        <div class="px-3 pb-3 border-t border-ga-gray-200">
          <!-- Basic Info -->
          <div class="space-y-3 py-3">
            <UFormField label="Section Name">
              <UInput
                :model-value="section.name"
                placeholder="e.g., Products, Services"
                size="sm"
                @update:model-value="emit('update', { name: $event })"
              />
            </UFormField>

            <UFormField label="Description">
              <UInput
                :model-value="section.description || ''"
                placeholder="Optional description"
                size="sm"
                @update:model-value="emit('update', { description: $event || undefined })"
              />
            </UFormField>

            <UCheckbox
              :model-value="section.showSubtotal"
              label="Show section subtotal"
              @update:model-value="emit('update', { showSubtotal: $event === true })"
            />
          </div>

          <!-- Tabs for Columns/Filter -->
          <div class="border-t border-ga-gray-200 pt-3">
            <div class="flex gap-2 mb-3">
              <UButton
                :variant="activeTab === 'columns' ? 'soft' : 'ghost'"
                size="xs"
                @click="activeTab = 'columns'"
              >
                Columns
              </UButton>
              <UButton
                :variant="activeTab === 'filter' ? 'soft' : 'ghost'"
                size="xs"
                @click="activeTab = 'filter'"
              >
                Filter
              </UButton>
            </div>

            <!-- Columns Tab -->
            <div v-if="activeTab === 'columns'">
              <LayoutBuilderColumnPicker
                :columns="section.columns"
                @update="emit('updateColumns', $event)"
                @add="emit('addColumn', $event)"
                @remove="emit('removeColumn', $event)"
                @reorder="(from, to) => emit('reorderColumns', from, to)"
              />
            </div>

            <!-- Filter Tab -->
            <div v-else-if="activeTab === 'filter'">
              <LayoutBuilderFilterConfig
                :filter="section.filter"
                @update="emit('updateFilter', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
