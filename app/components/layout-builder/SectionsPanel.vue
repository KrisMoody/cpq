<script setup lang="ts">
import type { QuoteLayoutSection, LayoutColumn, ColumnField, SectionFilter } from '~/types/quote-layout'

defineProps<{
  sections: QuoteLayoutSection[]
  expandedSections: Set<string>
}>()

const emit = defineEmits<{
  add: []
  remove: [sectionId: string]
  update: [sectionId: string, updates: Partial<QuoteLayoutSection>]
  reorder: [fromIndex: number, toIndex: number]
  toggle: [sectionId: string]
  updateColumns: [sectionId: string, columns: LayoutColumn[]]
  addColumn: [sectionId: string, field: ColumnField]
  removeColumn: [sectionId: string, field: ColumnField]
  reorderColumns: [sectionId: string, fromIndex: number, toIndex: number]
  updateFilter: [sectionId: string, filter: SectionFilter | undefined]
}>()

// Drag and drop state
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function handleDragStart(e: DragEvent, index: number) {
  draggedIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }
}

function handleDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
  dragOverIndex.value = index
}

function handleDragLeave() {
  dragOverIndex.value = null
}

function handleDrop(e: DragEvent, toIndex: number) {
  e.preventDefault()
  if (draggedIndex.value !== null && draggedIndex.value !== toIndex) {
    emit('reorder', draggedIndex.value, toIndex)
  }
  draggedIndex.value = null
  dragOverIndex.value = null
}

function handleDragEnd() {
  draggedIndex.value = null
  dragOverIndex.value = null
}
</script>

<template>
  <UCard :ui="{ root: 'overflow-visible' }">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold">Sections</h3>
        <UButton
          variant="soft"
          size="xs"
          icon="i-heroicons-plus"
          @click="emit('add')"
        >
          Add Section
        </UButton>
      </div>
    </template>

    <div class="space-y-2">
      <div
        v-for="(section, index) in sections"
        :key="section.id"
        class="border border-ga-gray-300 rounded-lg transition-all"
        :class="{
          'border-ga-navy-500 border-2': dragOverIndex === index,
          'opacity-50': draggedIndex === index,
        }"
        draggable="true"
        @dragstart="handleDragStart($event, index)"
        @dragover="handleDragOver($event, index)"
        @dragleave="handleDragLeave"
        @drop="handleDrop($event, index)"
        @dragend="handleDragEnd"
      >
        <LayoutBuilderSectionEditor
          :section="section"
          :is-expanded="expandedSections.has(section.id)"
          :can-remove="sections.length > 1"
          @toggle="emit('toggle', section.id)"
          @update="(updates) => emit('update', section.id, updates)"
          @remove="emit('remove', section.id)"
          @update-columns="(columns) => emit('updateColumns', section.id, columns)"
          @add-column="(field) => emit('addColumn', section.id, field)"
          @remove-column="(field) => emit('removeColumn', section.id, field)"
          @reorder-columns="(from, to) => emit('reorderColumns', section.id, from, to)"
          @update-filter="(filter) => emit('updateFilter', section.id, filter)"
        />
      </div>
    </div>

    <template v-if="sections.length === 0" #footer>
      <p class="text-center text-ga-gray-600 py-4">
        No sections yet. Add a section to get started.
      </p>
    </template>
  </UCard>
</template>
