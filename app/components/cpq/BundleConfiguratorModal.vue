<script setup lang="ts">
interface OptionProduct {
  id: string
  name: string
  description?: string | null
  sku: string
  listPrice: string | number | null
  hasPrice: boolean
  isActive?: boolean
  availableInPriceBooks?: Array<{ id: string; name: string }>
}

interface ProductOption {
  id: string
  optionProductId: string
  isRequired: boolean
  isDefault: boolean
  minQty: number
  maxQty: number
  sortOrder: number
  product: OptionProduct | null
}

interface ProductFeature {
  id: string
  name: string
  minOptions: number
  maxOptions: number
  sortOrder: number
  options: ProductOption[]
}

interface BundleProduct {
  id: string
  name: string
  sku: string
  description?: string | null
  type: string
  features: ProductFeature[]
}

const props = defineProps<{
  product: BundleProduct | null
  bundlePrice: number
  quantity: number
  open: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': [selections: Array<{ optionId: string; quantity: number }>]
  'cancel': []
}>()

const { formatPrice } = usePricing()

// Computed property for two-way binding with parent
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

// Track selected options: Map<optionId, quantity>
const selectedOptions = ref<Map<string, number>>(new Map())

// Check if an option product is available (has price and is active)
function isOptionAvailable(option: ProductOption): boolean {
  return !!option.product?.hasPrice && option.product?.isActive !== false
}

// Initialize with default and required options
function initializeSelections() {
  if (!props.product) return

  const selections = new Map<string, number>()

  for (const feature of props.product.features) {
    for (const option of feature.options) {
      if ((option.isDefault || option.isRequired) && isOptionAvailable(option)) {
        selections.set(option.id, option.minQty || 1)
      }
    }
  }

  selectedOptions.value = selections
}

// Initialize on mount and when product changes
watch(() => props.product, initializeSelections, { immediate: true })
watch(isOpen, (value) => {
  if (value) initializeSelections()
})

// Check if an option is selected
function isOptionSelected(optionId: string): boolean {
  return selectedOptions.value.has(optionId)
}

// Get quantity for an option
function getOptionQuantity(optionId: string): number {
  return selectedOptions.value.get(optionId) || 1
}

// Toggle option selection
function toggleOption(feature: ProductFeature, option: ProductOption) {
  if (!isOptionAvailable(option)) return
  if (option.isRequired) return // Can't deselect required options

  const newSelections = new Map(selectedOptions.value)

  if (feature.maxOptions === 1) {
    // Radio behavior - deselect other options in this feature
    for (const opt of feature.options) {
      if (opt.id !== option.id && !opt.isRequired) {
        newSelections.delete(opt.id)
      }
    }
    // Toggle this option
    if (newSelections.has(option.id)) {
      // Only allow deselect if minOptions is 0
      if (feature.minOptions === 0) {
        newSelections.delete(option.id)
      }
    } else {
      newSelections.set(option.id, option.minQty || 1)
    }
  } else {
    // Checkbox behavior
    if (newSelections.has(option.id)) {
      newSelections.delete(option.id)
    } else {
      // Check if we can add more
      const currentCount = feature.options.filter(o => newSelections.has(o.id)).length
      if (currentCount < feature.maxOptions) {
        newSelections.set(option.id, option.minQty || 1)
      }
    }
  }

  selectedOptions.value = newSelections
}

// Update option quantity
function updateOptionQuantity(optionId: string, quantity: number, option: ProductOption) {
  if (quantity < option.minQty) quantity = option.minQty
  if (quantity > option.maxQty) quantity = option.maxQty

  const newSelections = new Map(selectedOptions.value)
  newSelections.set(optionId, quantity)
  selectedOptions.value = newSelections
}

// Calculate selected options total
const optionsTotal = computed(() => {
  if (!props.product) return 0
  let total = 0
  for (const [optionId, quantity] of selectedOptions.value) {
    const option = findOption(optionId)
    if (option?.product?.listPrice) {
      total += Number(option.product.listPrice) * quantity * props.quantity
    }
  }
  return total
})

// Calculate grand total
const grandTotal = computed(() => {
  return (props.bundlePrice * props.quantity) + optionsTotal.value
})

// Find option by ID
function findOption(optionId: string): ProductOption | undefined {
  if (!props.product) return undefined
  for (const feature of props.product.features) {
    const option = feature.options.find(o => o.id === optionId)
    if (option) return option
  }
  return undefined
}

// Validate feature constraints
function getFeatureValidation(feature: ProductFeature): { valid: boolean; message: string } {
  const selectedCount = feature.options.filter(o => selectedOptions.value.has(o.id)).length

  if (selectedCount < feature.minOptions) {
    return {
      valid: false,
      message: `Select at least ${feature.minOptions} option${feature.minOptions > 1 ? 's' : ''}`,
    }
  }

  return { valid: true, message: '' }
}

// Check if all features are valid
const isValid = computed(() => {
  if (!props.product) return false
  return props.product.features.every(f => getFeatureValidation(f).valid)
})

// Count unavailable options (no pricing or inactive)
const unavailableOptions = computed(() => {
  if (!props.product) return []
  const missing: Array<{ featureName: string; productName: string; isRequired: boolean; reason: 'no-price' | 'inactive' }> = []
  for (const feature of props.product.features) {
    for (const option of feature.options) {
      if (option.product?.isActive === false) {
        missing.push({
          featureName: feature.name,
          productName: option.product?.name || 'Unknown',
          isRequired: option.isRequired,
          reason: 'inactive',
        })
      } else if (!option.product?.hasPrice) {
        missing.push({
          featureName: feature.name,
          productName: option.product?.name || 'Unknown',
          isRequired: option.isRequired,
          reason: 'no-price',
        })
      }
    }
  }
  return missing
})

// Check if any required options are unavailable
const hasRequiredUnavailable = computed(() => {
  return unavailableOptions.value.some(o => o.isRequired)
})

// Get selection count for a feature
function getFeatureSelectionCount(feature: ProductFeature): number {
  return feature.options.filter(o => selectedOptions.value.has(o.id)).length
}

// Handle confirm
function handleConfirm() {
  const selections = Array.from(selectedOptions.value.entries()).map(([optionId, quantity]) => ({
    optionId,
    quantity,
  }))
  emit('confirm', selections)
}

// Handle cancel
function handleCancel() {
  emit('cancel')
  isOpen.value = false
}
</script>

<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <UCard v-if="product" class="w-full max-w-3xl">
        <template #header>
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-lg font-semibold">Configure Bundle</h3>
              <p class="text-sm text-ga-gray-600 mt-1">{{ product.name }}</p>
              <p class="text-xs text-ga-gray-500">{{ product.sku }}</p>
            </div>
            <div class="flex items-start gap-4">
              <div class="text-right">
                <p class="text-sm text-ga-gray-600">Base Price</p>
                <p class="text-lg font-semibold">{{ formatPrice(bundlePrice) }}</p>
                <p v-if="quantity > 1" class="text-xs text-ga-gray-500">x {{ quantity }}</p>
              </div>
              <UButton
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="handleCancel"
              />
            </div>
          </div>
        </template>

        <div class="space-y-6 max-h-[60vh] overflow-y-auto">
          <!-- Warning for unavailable options -->
          <UAlert
            v-if="hasRequiredUnavailable"
            color="error"
            icon="i-heroicons-exclamation-triangle"
          >
            <template #title>Required Options Unavailable</template>
            <template #description>
              <p>The following required options cannot be added:</p>
              <ul class="mt-2 list-disc list-inside text-sm">
                <li v-for="opt in unavailableOptions.filter(o => o.isRequired)" :key="`${opt.featureName}-${opt.productName}`">
                  {{ opt.featureName }}: {{ opt.productName }}
                  <span class="text-ga-gray-600">({{ opt.reason === 'inactive' ? 'inactive' : 'not in price book' }})</span>
                </li>
              </ul>
            </template>
          </UAlert>

          <UAlert
            v-else-if="unavailableOptions.length > 0"
            color="warning"
            icon="i-heroicons-exclamation-triangle"
            variant="subtle"
          >
            <template #description>
              {{ unavailableOptions.length }} option(s) are unavailable and cannot be selected.
            </template>
          </UAlert>

          <!-- Features -->
          <div v-for="feature in product.features" :key="feature.id" class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium">{{ feature.name }}</h4>
                <p class="text-xs text-ga-gray-600">
                  <span v-if="feature.minOptions === feature.maxOptions">
                    Select {{ feature.minOptions }}
                  </span>
                  <span v-else-if="feature.minOptions === 0">
                    Select up to {{ feature.maxOptions }}
                  </span>
                  <span v-else>
                    Select {{ feature.minOptions }}-{{ feature.maxOptions }}
                  </span>
                </p>
              </div>
              <div class="flex items-center gap-2">
                <UBadge
                  v-if="!getFeatureValidation(feature).valid"
                  color="warning"
                  variant="subtle"
                  size="xs"
                >
                  {{ getFeatureValidation(feature).message }}
                </UBadge>
                <UBadge v-else color="success" variant="subtle" size="xs">
                  {{ getFeatureSelectionCount(feature) }} selected
                </UBadge>
              </div>
            </div>

            <!-- Options -->
            <div class="space-y-2">
              <div
                v-for="option in feature.options"
                :key="option.id"
                :class="[
                  'p-3 rounded-lg border transition-colors',
                  !isOptionAvailable(option) ? 'opacity-50 cursor-not-allowed bg-ga-gray-100' : 'cursor-pointer',
                  isOptionSelected(option.id)
                    ? 'border-ga-navy-500 bg-ga-navy-50'
                    : 'border-ga-gray-300 hover:border-ga-gray-400',
                ]"
                @click="toggleOption(feature, option)"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3 min-w-0 flex-1">
                    <!-- Selection indicator -->
                    <div class="flex-shrink-0">
                      <div
                        :class="[
                          'w-5 h-5 flex items-center justify-center border-2',
                          feature.maxOptions === 1 ? 'rounded-full' : 'rounded',
                          isOptionSelected(option.id)
                            ? 'bg-ga-navy-500 border-ga-navy-500 text-white'
                            : 'border-ga-gray-400'
                        ]"
                      >
                        <UIcon
                          v-if="isOptionSelected(option.id)"
                          name="i-heroicons-check"
                          class="w-3 h-3"
                        />
                      </div>
                    </div>

                    <!-- Option details -->
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="font-medium truncate">{{ option.product?.name || 'Unknown Product' }}</span>
                        <UBadge v-if="option.isRequired" color="error" variant="subtle" size="xs">
                          Required
                        </UBadge>
                        <UBadge v-else-if="option.isDefault" color="info" variant="subtle" size="xs">
                          Default
                        </UBadge>
                        <UBadge v-if="option.product?.isActive === false" color="error" variant="subtle" size="xs">
                          Inactive
                        </UBadge>
                        <UTooltip
                          v-else-if="!option.product?.hasPrice"
                          :text="option.product?.availableInPriceBooks?.length
                            ? `Available in: ${option.product.availableInPriceBooks.map(pb => pb.name).join(', ')}`
                            : 'Not available in any price book'"
                        >
                          <UBadge color="warning" variant="subtle" size="xs">
                            Not in price book
                          </UBadge>
                        </UTooltip>
                      </div>
                      <p class="text-xs text-ga-gray-600 truncate">{{ option.product?.sku }}</p>
                      <!-- Show available price books info -->
                      <p
                        v-if="!option.product?.hasPrice && option.product?.availableInPriceBooks?.length"
                        class="text-xs text-ga-yellow-600 mt-0.5 truncate"
                      >
                        Available in: {{ option.product.availableInPriceBooks.map(pb => pb.name).join(', ') }}
                      </p>
                    </div>
                  </div>

                  <!-- Price and quantity -->
                  <div class="flex items-center gap-4 flex-shrink-0">
                    <!-- Quantity control -->
                    <div
                      v-if="isOptionSelected(option.id) && option.maxQty > 1"
                      class="flex items-center gap-2"
                      @click.stop
                    >
                      <UButton
                        size="xs"
                        variant="ghost"
                        icon="i-heroicons-minus"
                        :disabled="getOptionQuantity(option.id) <= option.minQty"
                        @click="updateOptionQuantity(option.id, getOptionQuantity(option.id) - 1, option)"
                      />
                      <span class="w-8 text-center text-sm">{{ getOptionQuantity(option.id) }}</span>
                      <UButton
                        size="xs"
                        variant="ghost"
                        icon="i-heroicons-plus"
                        :disabled="getOptionQuantity(option.id) >= option.maxQty"
                        @click="updateOptionQuantity(option.id, getOptionQuantity(option.id) + 1, option)"
                      />
                    </div>

                    <!-- Price -->
                    <div class="text-right min-w-[80px] whitespace-nowrap">
                      <template v-if="option.product?.hasPrice">
                        <span
                          v-if="Number(option.product.listPrice) === 0"
                          class="text-sm text-ga-green-600 font-medium"
                        >
                          Included
                        </span>
                        <span v-else class="text-sm font-medium">
                          +{{ formatPrice(option.product.listPrice ?? 0) }}
                        </span>
                      </template>
                      <span v-else class="text-sm text-ga-gray-500">-</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="product.features.length === 0" class="text-center py-8 text-ga-gray-600">
            This bundle has no configurable options.
          </div>
        </div>

        <!-- Summary -->
        <div class="mt-6 pt-4 border-t border-ga-gray-300">
          <div class="space-y-1">
            <div class="flex justify-between text-sm">
              <span class="text-ga-gray-600">Bundle base:</span>
              <span>{{ formatPrice(bundlePrice * quantity) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-ga-gray-600">Options:</span>
              <span>+{{ formatPrice(optionsTotal) }}</span>
            </div>
            <div class="flex justify-between font-semibold text-lg pt-2 border-t border-ga-gray-200">
              <span>Total:</span>
              <span class="text-ga-navy-500">{{ formatPrice(grandTotal) }}</span>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton variant="ghost" @click="handleCancel">
              Cancel
            </UButton>
            <UButton
              :disabled="!isValid || hasRequiredUnavailable"
              :loading="loading"
              @click="handleConfirm"
            >
              Add to Quote
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
