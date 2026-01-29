<script setup lang="ts">
import type { ProductWithFeatures, ProductOption } from '~/composables/useProducts'

const props = defineProps<{
  product: ProductWithFeatures
}>()

const emit = defineEmits<{
  (e: 'configure', options: Array<{ optionId: string; quantity: number }>): void
}>()

const { formatPrice } = usePricing()

// Track selected options per feature
const selectedOptions = ref<Record<string, Set<string>>>({})

// Initialize with default options
onMounted(() => {
  props.product.features.forEach((feature) => {
    const featureSet = new Set<string>()
    feature.options.forEach((option) => {
      if (option.isDefault) {
        featureSet.add(option.id)
      }
    })
    selectedOptions.value[feature.id] = featureSet
  })
})

function toggleOption(featureId: string, optionId: string, maxOptions: number) {
  const current = selectedOptions.value[featureId]
  if (!current) return

  if (current.has(optionId)) {
    current.delete(optionId)
  } else {
    if (maxOptions === 1) {
      // Single select - clear others
      current.clear()
    } else if (current.size >= maxOptions) {
      // Max reached - don't add
      return
    }
    current.add(optionId)
  }
}

function isSelected(featureId: string, optionId: string): boolean {
  return selectedOptions.value[featureId]?.has(optionId) ?? false
}

function getValidationStatus(feature: typeof props.product.features[0]): {
  valid: boolean
  message: string
} {
  const count = selectedOptions.value[feature.id]?.size ?? 0

  if (count < feature.minOptions) {
    return {
      valid: false,
      message: `Select at least ${feature.minOptions} option(s)`,
    }
  }

  return { valid: true, message: '' }
}

function getOptionPrice(option: ProductOption): string {
  const price = option.product?.priceBookEntries?.[0]?.listPrice
  if (!price || parseFloat(price) === 0) return 'Included'
  return `+${formatPrice(price)}`
}

const isValid = computed(() => {
  return props.product.features.every((f) => getValidationStatus(f).valid)
})

const totalAdditionalPrice = computed(() => {
  let total = 0
  props.product.features.forEach((feature) => {
    feature.options.forEach((option) => {
      if (isSelected(feature.id, option.id)) {
        const price = option.product?.priceBookEntries?.[0]?.listPrice
        if (price) {
          total += parseFloat(price)
        }
      }
    })
  })
  return total
})

function handleConfigure() {
  const options: Array<{ optionId: string; quantity: number }> = []

  Object.entries(selectedOptions.value).forEach(([_featureId, optionIds]) => {
    optionIds.forEach((optionId) => {
      options.push({ optionId, quantity: 1 })
    })
  })

  emit('configure', options)
}
</script>

<template>
  <div class="space-y-6">
    <div v-for="feature in product.features" :key="feature.id" class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="font-medium">{{ feature.name }}</h4>
        <span class="text-xs text-ga-gray-500">
          Select {{ feature.minOptions === feature.maxOptions
            ? feature.minOptions
            : `${feature.minOptions}-${feature.maxOptions}`
          }}
        </span>
      </div>

      <div class="grid gap-2">
        <div
          v-for="option in feature.options"
          :key="option.id"
          :class="[
            'p-3 border rounded-lg cursor-pointer transition-all',
            isSelected(feature.id, option.id)
              ? 'border-ga-navy-500 bg-ga-navy-50'
              : 'border-ga-gray-300 hover:border-ga-gray-400'
          ]"
          @click="toggleOption(feature.id, option.id, feature.maxOptions)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'w-5 h-5 rounded flex items-center justify-center',
                  feature.maxOptions === 1 ? 'rounded-full' : 'rounded',
                  isSelected(feature.id, option.id)
                    ? 'bg-ga-navy-500 text-white'
                    : 'border-2 border-ga-gray-400'
                ]"
              >
                <UIcon
                  v-if="isSelected(feature.id, option.id)"
                  name="i-heroicons-check"
                  class="w-3 h-3"
                />
              </div>
              <div>
                <p class="font-medium text-sm">{{ option.product?.name || 'Unknown' }}</p>
                <p class="text-xs text-ga-gray-600">{{ option.product?.sku }}</p>
              </div>
            </div>
            <span class="text-sm font-medium text-ga-navy-500">
              {{ getOptionPrice(option) }}
            </span>
          </div>
        </div>
      </div>

      <p
        v-if="!getValidationStatus(feature).valid"
        class="text-xs text-ga-red-500"
      >
        {{ getValidationStatus(feature).message }}
      </p>
    </div>

    <USeparator />

    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-ga-gray-600">Additional options:</p>
        <p class="text-lg font-semibold">{{ formatPrice(totalAdditionalPrice) }}</p>
      </div>
      <UButton
        :disabled="!isValid"
        size="lg"
        @click="handleConfigure"
      >
        Add to Quote
      </UButton>
    </div>
  </div>
</template>
