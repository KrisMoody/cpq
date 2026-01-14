<script setup lang="ts">
import type { QuoteLayout } from '~/types/quote-layout'

const props = defineProps<{
  initialLayout?: QuoteLayout
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  save: [layout: QuoteLayout]
  cancel: []
}>()

const {
  layout,
  isDirty,
  previewQuote,
  initLayout,
  reset,
  addSection,
  removeSection,
  updateSection,
  reorderSections,
  toggleSection,
  expandedSections,
  updateSectionColumns,
  addColumnToSection,
  removeColumnFromSection,
  reorderColumns,
  updateSectionFilter,
  updateTheme,
  applyThemePreset,
  updateSummaryConfig,
  confirmLeave,
} = useLayoutBuilder()

// Initialize with existing layout if editing
onMounted(() => {
  initLayout(props.initialLayout)
})

// Watch for external layout changes
watch(
  () => props.initialLayout,
  (newLayout) => {
    if (newLayout) {
      initLayout(newLayout)
    }
  }
)

function handleSave() {
  emit('save', layout.value)
}

function handleCancel() {
  if (confirmLeave()) {
    emit('cancel')
  }
}

function handleReset() {
  if (confirm('Are you sure you want to reset all changes?')) {
    reset()
  }
}

// Preview scale
const previewScale = ref(0.75)
</script>

<template>
  <div class="quote-layout-builder h-full flex flex-col">
    <!-- Header -->
    <LayoutBuilderHeader
      v-model:name="layout.name"
      v-model:description="layout.description"
      v-model:is-template="layout.isTemplate"
      :is-dirty="isDirty"
      :mode="mode"
      @save="handleSave"
      @cancel="handleCancel"
      @reset="handleReset"
    />

    <!-- Main Content - Side by Side -->
    <div class="flex-1 flex gap-6 overflow-hidden p-6">
      <!-- Configuration Panel (Left) -->
      <div class="w-[400px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
        <!-- Sections Panel -->
        <LayoutBuilderSectionsPanel
          :sections="layout.sections"
          :expanded-sections="expandedSections"
          @add="addSection"
          @remove="removeSection"
          @update="updateSection"
          @reorder="reorderSections"
          @toggle="toggleSection"
          @update-columns="updateSectionColumns"
          @add-column="addColumnToSection"
          @remove-column="removeColumnFromSection"
          @reorder-columns="reorderColumns"
          @update-filter="updateSectionFilter"
        />

        <!-- Theme Editor -->
        <LayoutBuilderThemeEditor
          :theme="layout.theme"
          @update="updateTheme"
          @apply-preset="applyThemePreset"
        />

        <!-- Summary Config -->
        <LayoutBuilderSummaryConfig
          :config="layout.summaryConfig"
          @update="updateSummaryConfig"
        />
      </div>

      <!-- Preview Panel (Right) -->
      <div class="flex-1 flex flex-col min-w-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div class="flex items-center justify-between px-4 py-2 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</span>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-minus" class="w-4 h-4 text-gray-500" />
            <input
              v-model.number="previewScale"
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              class="w-24 h-1 accent-primary-500"
            >
            <UIcon name="i-heroicons-plus" class="w-4 h-4 text-gray-500" />
            <span class="text-xs text-gray-500 w-10">{{ Math.round(previewScale * 100) }}%</span>
          </div>
        </div>
        <div class="flex-1 overflow-auto p-4">
          <LayoutBuilderPreview
            :quote="previewQuote"
            :layout="layout"
            :scale="previewScale"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quote-layout-builder {
  background: var(--color-background);
}
</style>
