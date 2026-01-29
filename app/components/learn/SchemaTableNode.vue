<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'
import type { ParsedField, ParsedRelation } from '~/composables/usePrismaSchema'

interface NodeData {
  label: string
  fields: ParsedField[]
  relations: ParsedRelation[]
  color: string
  isExpanded?: boolean
}

// Accept all Vue Flow node props
const props = defineProps<NodeProps<NodeData>>()

const isExpanded = ref(props.data.isExpanded ?? false)

// Sync with parent's expand/collapse all
watch(
  () => props.data.isExpanded,
  (newVal) => {
    if (newVal !== undefined) {
      isExpanded.value = newVal
    }
  },
)

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

function getFieldIcon(field: ParsedField) {
  if (field.isPrimaryKey) return 'i-heroicons-key'
  if (field.isForeignKey) return 'i-heroicons-link'
  if (field.isUnique) return 'i-heroicons-finger-print'
  return 'i-heroicons-minus'
}

function getFieldIconColor(field: ParsedField) {
  if (field.isPrimaryKey) return 'text-yellow-500'
  if (field.isForeignKey) return 'text-blue-500'
  if (field.isUnique) return 'text-purple-500'
  return 'text-ga-gray-500'
}

function formatType(type: string) {
  // Shorten common types for display
  const typeMap: Record<string, string> = {
    String: 'str',
    Int: 'int',
    Float: 'float',
    Boolean: 'bool',
    DateTime: 'datetime',
    Decimal: 'decimal',
    Json: 'json',
  }
  return typeMap[type] || type.toLowerCase()
}
</script>

<template>
  <div
    class="schema-table-node rounded-lg shadow-lg border overflow-hidden min-w-[180px] max-w-[240px]"
    :class="[
      'bg-white',
      'border-ga-gray-300',
    ]"
  >
    <!-- Header -->
    <div
      class="px-3 py-2 cursor-pointer flex items-center justify-between"
      :style="{ backgroundColor: data.color }"
      @click="toggleExpanded"
    >
      <span class="font-semibold text-white text-sm truncate">{{ data.label }}</span>
      <UIcon
        :name="isExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        class="w-4 h-4 text-white/80 flex-shrink-0 ml-2"
      />
    </div>

    <!-- Field list (collapsed) -->
    <div v-if="!isExpanded" class="px-3 py-2 text-xs text-ga-gray-600">
      {{ data.fields.length }} fields, {{ data.relations.length }} relations
    </div>

    <!-- Field list (expanded) -->
    <div
      v-else
      class="px-2 py-1.5 space-y-0.5 max-h-[300px] overflow-y-auto"
    >
      <div
        v-for="field in data.fields"
        :key="field.name"
        class="flex items-center gap-1.5 text-xs py-0.5 px-1 rounded hover:bg-ga-gray-200"
      >
        <UIcon
          :name="getFieldIcon(field)"
          class="w-3 h-3 flex-shrink-0"
          :class="getFieldIconColor(field)"
        />
        <span class="text-ga-gray-800 truncate">
          {{ field.name }}
        </span>
        <span v-if="!field.isRequired" class="text-ga-gray-500 ml-auto">?</span>
        <span class="text-ga-gray-500 ml-auto text-[10px]">
          {{ formatType(field.type) }}
        </span>
      </div>

      <!-- Relations section -->
      <div v-if="data.relations.length" class="mt-2 pt-2 border-t border-ga-gray-300">
        <div class="text-[10px] text-ga-gray-500 uppercase tracking-wide mb-1 px-1">Relations</div>
        <div
          v-for="rel in data.relations"
          :key="rel.fieldName"
          class="flex items-center gap-1.5 text-xs py-0.5 px-1"
        >
          <UIcon name="i-heroicons-arrow-right" class="w-3 h-3 text-blue-400 flex-shrink-0" />
          <span class="text-ga-gray-700 truncate">{{ rel.relatedModel }}</span>
          <span class="text-ga-gray-500 text-[10px] ml-auto">{{ rel.relationType }}</span>
        </div>
      </div>
    </div>

    <!-- Connection handles -->
    <Handle
      type="target"
      :position="Position.Left"
      class="!w-2 !h-2 !bg-ga-gray-500 !border-2 !border-white"
    />
    <Handle
      type="source"
      :position="Position.Right"
      class="!w-2 !h-2 !bg-ga-gray-500 !border-2 !border-white"
    />
  </div>
</template>

<style scoped>
.schema-table-node {
  font-family: inherit;
}
</style>
