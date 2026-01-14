<script setup lang="ts">
import type { LayoutColumn, ColumnField } from '~/types/quote-layout'

const props = defineProps<{
  columns: LayoutColumn[]
}>()

const emit = defineEmits<{
  update: [columns: LayoutColumn[]]
  add: [field: ColumnField]
  remove: [field: ColumnField]
  reorder: [fromIndex: number, toIndex: number]
}>()

// All available columns
const availableColumns: { field: ColumnField; label: string }[] = [
  { field: 'productName', label: 'Product Name' },
  { field: 'sku', label: 'SKU' },
  { field: 'description', label: 'Description' },
  { field: 'quantity', label: 'Quantity' },
  { field: 'unitPrice', label: 'Unit Price' },
  { field: 'discount', label: 'Discount' },
  { field: 'netPrice', label: 'Net Price' },
  { field: 'unit', label: 'Unit' },
]

const selectedFields = computed(() => new Set(props.columns.map((c) => c.field)))

const unusedColumns = computed(() =>
  availableColumns.filter((col) => !selectedFields.value.has(col.field))
)

// Drag and drop for column reordering
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function handleDragStart(e: DragEvent, index: number) {
  draggedIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

function handleDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  dragOverIndex.value = index
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

function getColumnLabel(field: ColumnField): string {
  const col = availableColumns.find((c) => c.field === field)
  return col?.label || field
}
</script>

<template>
  <div class="space-y-3">
    <!-- Selected Columns -->
    <div>
      <p class="text-xs font-medium text-gray-500 mb-2">Selected Columns (drag to reorder)</p>
      <div class="flex flex-wrap gap-1">
        <div
          v-for="(column, index) in columns"
          :key="column.field"
          class="flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-xs cursor-grab"
          :class="{
            'ring-2 ring-primary-500': dragOverIndex === index,
            'opacity-50': draggedIndex === index,
          }"
          draggable="true"
          @dragstart="handleDragStart($event, index)"
          @dragover="handleDragOver($event, index)"
          @drop="handleDrop($event, index)"
          @dragend="handleDragEnd"
        >
          <UIcon name="i-heroicons-bars-2" class="w-3 h-3 text-primary-400" />
          <span>{{ column.label || getColumnLabel(column.field) }}</span>
          <UButton
            variant="ghost"
            color="error"
            size="xs"
            icon="i-heroicons-x-mark"
            class="p-0 w-4 h-4"
            @click="emit('remove', column.field)"
          />
        </div>
      </div>
      <p v-if="columns.length === 0" class="text-xs text-gray-400 italic">
        No columns selected
      </p>
    </div>

    <!-- Available Columns to Add -->
    <div v-if="unusedColumns.length > 0">
      <p class="text-xs font-medium text-gray-500 mb-2">Add Column</p>
      <div class="flex flex-wrap gap-1">
        <UButton
          v-for="col in unusedColumns"
          :key="col.field"
          variant="outline"
          size="xs"
          icon="i-heroicons-plus"
          @click="emit('add', col.field)"
        >
          {{ col.label }}
        </UButton>
      </div>
    </div>
  </div>
</template>
