<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

export interface FeatureOption {
  id: string
  optionProductId: string
  isRequired: boolean
  isDefault: boolean
  minQty: number
  maxQty: number
  sortOrder: number
}

export interface Feature {
  id: string
  name: string
  minOptions: number
  maxOptions: number
  sortOrder: number
  options: FeatureOption[]
}

const props = defineProps<{
  modelValue: Feature[]
  availableProducts: Product[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Feature[]]
}>()

// Local state
const showFeatureModal = ref(false)
const showOptionModal = ref(false)
const editingFeatureIndex = ref<number | null>(null)
const editingOptionFeatureIndex = ref<number | null>(null)
const editingOptionIndex = ref<number | null>(null)

const featureForm = ref({
  name: '',
  minOptions: 0,
  maxOptions: 1,
})

const optionForm = ref({
  optionProductId: '',
  isRequired: false,
  isDefault: false,
  minQty: 1,
  maxQty: 1,
})

// Drag state
const draggedFeatureIndex = ref<number | null>(null)
const dragOverFeatureIndex = ref<number | null>(null)
const draggedOptionIndex = ref<number | null>(null)
const dragOverOptionIndex = ref<number | null>(null)

// Filter to active standalone products
const standaloneProducts = computed(() =>
  props.availableProducts.filter((p) => p.type === 'STANDALONE' && p.isActive)
)

const productOptions = computed(() =>
  standaloneProducts.value.map((p) => ({
    label: `${p.name} (${p.sku})`,
    value: p.id,
  }))
)

function generateId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Feature CRUD
function openAddFeature() {
  editingFeatureIndex.value = null
  featureForm.value = { name: '', minOptions: 0, maxOptions: 1 }
  showFeatureModal.value = true
}

function openEditFeature(index: number) {
  editingFeatureIndex.value = index
  const feature = props.modelValue[index]
  if (!feature) return
  featureForm.value = {
    name: feature.name,
    minOptions: feature.minOptions,
    maxOptions: feature.maxOptions,
  }
  showFeatureModal.value = true
}

function saveFeature() {
  if (!featureForm.value.name.trim()) return

  const features = [...props.modelValue]

  if (editingFeatureIndex.value !== null) {
    // Update existing
    const existing = features[editingFeatureIndex.value]
    if (existing) {
      features[editingFeatureIndex.value] = {
        ...existing,
        name: featureForm.value.name,
        minOptions: featureForm.value.minOptions,
        maxOptions: featureForm.value.maxOptions,
      }
    }
  } else {
    // Add new
    features.push({
      id: generateId(),
      name: featureForm.value.name,
      minOptions: featureForm.value.minOptions,
      maxOptions: featureForm.value.maxOptions,
      sortOrder: features.length,
      options: [],
    })
  }

  emit('update:modelValue', features)
  showFeatureModal.value = false
}

function deleteFeature(index: number) {
  if (!confirm('Delete this feature and all its options?')) return
  const features = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', features)
}

// Option CRUD
function openAddOption(featureIndex: number) {
  editingOptionFeatureIndex.value = featureIndex
  editingOptionIndex.value = null
  optionForm.value = {
    optionProductId: '',
    isRequired: false,
    isDefault: false,
    minQty: 1,
    maxQty: 1,
  }
  showOptionModal.value = true
}

function openEditOption(featureIndex: number, optionIndex: number) {
  editingOptionFeatureIndex.value = featureIndex
  editingOptionIndex.value = optionIndex
  const feature = props.modelValue[featureIndex]
  const option = feature?.options[optionIndex]
  if (!option) return
  optionForm.value = {
    optionProductId: option.optionProductId,
    isRequired: option.isRequired,
    isDefault: option.isDefault,
    minQty: option.minQty,
    maxQty: option.maxQty,
  }
  showOptionModal.value = true
}

function saveOption() {
  if (!optionForm.value.optionProductId) return
  if (editingOptionFeatureIndex.value === null) return

  const features = [...props.modelValue]
  const existingFeature = features[editingOptionFeatureIndex.value]
  if (!existingFeature) return

  const feature = { ...existingFeature }
  const options = [...(feature.options || [])]

  if (editingOptionIndex.value !== null) {
    // Update existing
    const existingOption = options[editingOptionIndex.value]
    if (existingOption) {
      options[editingOptionIndex.value] = {
        ...existingOption,
        ...optionForm.value,
      }
    }
  } else {
    // Add new
    options.push({
      id: generateId(),
      ...optionForm.value,
      sortOrder: options.length,
    })
  }

  feature.options = options
  features[editingOptionFeatureIndex.value] = feature
  emit('update:modelValue', features)
  showOptionModal.value = false
}

function deleteOption(featureIndex: number, optionIndex: number) {
  const features = [...props.modelValue]
  const existingFeature = features[featureIndex]
  if (!existingFeature) return
  const feature = { ...existingFeature }
  feature.options = (feature.options || []).filter((_, i) => i !== optionIndex)
  features[featureIndex] = feature
  emit('update:modelValue', features)
}

// Get product name for display
function getProductName(productId: string): string {
  const product = standaloneProducts.value.find((p) => p.id === productId)
  return product?.name || 'Unknown'
}

function getProductSku(productId: string): string {
  const product = standaloneProducts.value.find((p) => p.id === productId)
  return product?.sku || ''
}

// Feature drag-and-drop
function handleFeatureDragStart(e: DragEvent, index: number) {
  draggedFeatureIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

function handleFeatureDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  if (draggedFeatureIndex.value !== null && draggedFeatureIndex.value !== index) {
    dragOverFeatureIndex.value = index
  }
}

function handleFeatureDragLeave() {
  dragOverFeatureIndex.value = null
}

function handleFeatureDrop(e: DragEvent, targetIndex: number) {
  e.preventDefault()
  dragOverFeatureIndex.value = null

  if (draggedFeatureIndex.value === null || draggedFeatureIndex.value === targetIndex) return

  const features = [...props.modelValue]
  const draggedFeature = features[draggedFeatureIndex.value]
  if (!draggedFeature) return

  features.splice(draggedFeatureIndex.value, 1)
  features.splice(targetIndex, 0, draggedFeature)

  // Update sortOrder
  features.forEach((f, i) => {
    f.sortOrder = i
  })

  emit('update:modelValue', features)
  draggedFeatureIndex.value = null
}

function handleFeatureDragEnd() {
  draggedFeatureIndex.value = null
  dragOverFeatureIndex.value = null
}

// Option drag-and-drop
function handleOptionDragStart(e: DragEvent, featureIndex: number, optionIndex: number) {
  draggedOptionIndex.value = optionIndex
  editingOptionFeatureIndex.value = featureIndex
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

function handleOptionDragOver(e: DragEvent, optionIndex: number) {
  e.preventDefault()
  if (draggedOptionIndex.value !== null && draggedOptionIndex.value !== optionIndex) {
    dragOverOptionIndex.value = optionIndex
  }
}

function handleOptionDragLeave() {
  dragOverOptionIndex.value = null
}

function handleOptionDrop(e: DragEvent, featureIndex: number, targetIndex: number) {
  e.preventDefault()
  dragOverOptionIndex.value = null

  if (
    draggedOptionIndex.value === null ||
    editingOptionFeatureIndex.value !== featureIndex ||
    draggedOptionIndex.value === targetIndex
  )
    return

  const features = [...props.modelValue]
  const existingFeature = features[featureIndex]
  if (!existingFeature) return

  const feature = { ...existingFeature }
  const options = [...(feature.options || [])]

  const draggedOption = options[draggedOptionIndex.value]
  if (!draggedOption) return

  options.splice(draggedOptionIndex.value, 1)
  options.splice(targetIndex, 0, draggedOption)

  // Update sortOrder
  options.forEach((o, i) => {
    o.sortOrder = i
  })

  feature.options = options
  features[featureIndex] = feature
  emit('update:modelValue', features)
  draggedOptionIndex.value = null
  editingOptionFeatureIndex.value = null
}

function handleOptionDragEnd() {
  draggedOptionIndex.value = null
  dragOverOptionIndex.value = null
  editingOptionFeatureIndex.value = null
}
</script>

<template>
  <div class="space-y-4">
    <!-- Empty state -->
    <div
      v-if="modelValue.length === 0"
      class="text-center py-8 border-2 border-dashed rounded-lg dark:border-gray-700"
    >
      <UIcon name="i-heroicons-squares-2x2" class="w-10 h-10 mx-auto mb-2 text-gray-300" />
      <p class="text-gray-500">No features defined yet.</p>
      <p class="text-sm text-gray-400 mb-4">Add features to make this bundle configurable.</p>
      <UButton icon="i-heroicons-plus" @click="openAddFeature">
        Add Feature
      </UButton>
    </div>

    <!-- Features list -->
    <div v-else class="space-y-4">
      <div
        v-for="(feature, featureIndex) in modelValue"
        :key="feature.id"
        draggable="true"
        class="border rounded-lg p-4 dark:border-gray-700 transition-all"
        :class="{
          'opacity-50': draggedFeatureIndex === featureIndex,
          'border-primary-500 border-2': dragOverFeatureIndex === featureIndex,
        }"
        @dragstart="handleFeatureDragStart($event, featureIndex)"
        @dragover="handleFeatureDragOver($event, featureIndex)"
        @dragleave="handleFeatureDragLeave"
        @drop="handleFeatureDrop($event, featureIndex)"
        @dragend="handleFeatureDragEnd"
      >
        <!-- Feature header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2 cursor-move">
            <UIcon name="i-heroicons-bars-3" class="w-4 h-4 text-gray-400" />
            <div>
              <h3 class="font-medium">{{ feature.name }}</h3>
              <p class="text-sm text-gray-500">
                Select {{ feature.minOptions }}-{{ feature.maxOptions }} option(s)
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <UButton
              size="xs"
              variant="ghost"
              icon="i-heroicons-pencil"
              @click="openEditFeature(featureIndex)"
            />
            <UButton
              size="xs"
              variant="ghost"
              color="error"
              icon="i-heroicons-trash"
              @click="deleteFeature(featureIndex)"
            />
          </div>
        </div>

        <!-- Options -->
        <div class="space-y-2">
          <div
            v-for="(option, optionIndex) in feature.options"
            :key="option.id"
            draggable="true"
            class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded cursor-move transition-all"
            :class="{
              'opacity-50': draggedOptionIndex === optionIndex && editingOptionFeatureIndex === featureIndex,
              'ring-2 ring-primary-500': dragOverOptionIndex === optionIndex && editingOptionFeatureIndex === featureIndex,
            }"
            @dragstart.stop="handleOptionDragStart($event, featureIndex, optionIndex)"
            @dragover.stop="handleOptionDragOver($event, optionIndex)"
            @dragleave.stop="handleOptionDragLeave"
            @drop.stop="handleOptionDrop($event, featureIndex, optionIndex)"
            @dragend.stop="handleOptionDragEnd"
          >
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-bars-2" class="w-3 h-3 text-gray-400" />
              <div>
                <span class="font-medium text-sm">{{ getProductName(option.optionProductId) }}</span>
                <span class="text-xs text-gray-500 ml-2">{{ getProductSku(option.optionProductId) }}</span>
              </div>
              <UBadge v-if="option.isDefault" size="xs" color="primary" variant="subtle">
                Default
              </UBadge>
              <UBadge v-if="option.isRequired" size="xs" color="warning" variant="subtle">
                Required
              </UBadge>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">Qty: {{ option.minQty }}-{{ option.maxQty }}</span>
              <UButton
                size="xs"
                variant="ghost"
                icon="i-heroicons-pencil"
                @click="openEditOption(featureIndex, optionIndex)"
              />
              <UButton
                size="xs"
                variant="ghost"
                color="error"
                icon="i-heroicons-trash"
                @click="deleteOption(featureIndex, optionIndex)"
              />
            </div>
          </div>

          <UButton
            size="xs"
            variant="soft"
            icon="i-heroicons-plus"
            @click="openAddOption(featureIndex)"
          >
            Add Option
          </UButton>
        </div>
      </div>

      <!-- Add feature button -->
      <UButton variant="outline" icon="i-heroicons-plus" @click="openAddFeature">
        Add Feature
      </UButton>
    </div>

    <!-- Feature Modal -->
    <UModal v-model:open="showFeatureModal">
      <template #content>
        <UCard class="w-[400px]">
          <template #header>
            <h3 class="font-semibold">
              {{ editingFeatureIndex !== null ? 'Edit Feature' : 'Add Feature' }}
            </h3>
          </template>

          <form class="space-y-4" @submit.prevent="saveFeature">
            <UFormField label="Feature Name" required>
              <UInput
                v-model="featureForm.name"
                placeholder="e.g., Storage, Color, Processor"
              />
            </UFormField>

            <div class="flex gap-4">
              <UFormField label="Min Options" class="w-28">
                <UInput v-model.number="featureForm.minOptions" type="number" min="0" />
              </UFormField>
              <UFormField label="Max Options" class="w-28">
                <UInput v-model.number="featureForm.maxOptions" type="number" min="1" />
              </UFormField>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <UButton variant="ghost" @click="showFeatureModal = false">Cancel</UButton>
              <UButton type="submit" :disabled="!featureForm.name.trim()">
                {{ editingFeatureIndex !== null ? 'Save' : 'Add Feature' }}
              </UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>

    <!-- Option Modal -->
    <UModal v-model:open="showOptionModal">
      <template #content>
        <UCard class="w-[450px]">
          <template #header>
            <h3 class="font-semibold">
              {{ editingOptionIndex !== null ? 'Edit Option' : 'Add Option' }}
            </h3>
          </template>

          <form class="space-y-4" @submit.prevent="saveOption">
            <UFormField label="Product" required>
              <USelect
                v-model="optionForm.optionProductId"
                :items="productOptions"
                placeholder="Select a product"
                value-key="value"
                searchable
              />
            </UFormField>

            <div class="flex gap-4">
              <UFormField label="Min Quantity" class="w-28">
                <UInput v-model.number="optionForm.minQty" type="number" min="1" />
              </UFormField>
              <UFormField label="Max Quantity" class="w-28">
                <UInput v-model.number="optionForm.maxQty" type="number" min="1" />
              </UFormField>
            </div>

            <div class="flex gap-4">
              <UCheckbox v-model="optionForm.isDefault" label="Default selection" />
              <UCheckbox v-model="optionForm.isRequired" label="Required" />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <UButton variant="ghost" @click="showOptionModal = false">Cancel</UButton>
              <UButton type="submit" :disabled="!optionForm.optionProductId">
                {{ editingOptionIndex !== null ? 'Save' : 'Add Option' }}
              </UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
