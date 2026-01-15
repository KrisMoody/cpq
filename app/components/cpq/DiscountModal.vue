<script setup lang="ts">
import type { Discount } from '~/composables/useDiscounts'
import { getErrorMessage } from '~/utils/errors'

const props = defineProps<{
  open: boolean
  quoteId: string
  lineItemId?: string
  subtotal: number
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'applied': []
}>()

const { discounts, fetchDiscounts } = useDiscounts()
const { formatPrice } = usePricing()

const applying = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const activeTab = ref<'catalog' | 'manual'>('catalog')

// Manual discount form
const discountType = ref<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE')
const discountValue = ref<number>(0)
const reason = ref('')

onMounted(() => {
  fetchDiscounts()
})

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

watch(isOpen, (newValue) => {
  if (newValue) {
    // Reset form when opening
    activeTab.value = 'catalog'
    search.value = ''
    discountType.value = 'PERCENTAGE'
    discountValue.value = 0
    reason.value = ''
    error.value = null
  }
})

const targetLabel = computed(() => props.lineItemId ? 'Line Item' : 'Quote')

// Filter discounts based on scope and search
const filteredDiscounts = computed(() => {
  const now = new Date()
  const targetScope = props.lineItemId ? 'LINE_ITEM' : 'QUOTE'

  return discounts.value.filter((d) => {
    // Must be active
    if (!d.isActive) return false

    // Must match scope (or be applicable to both)
    if (d.scope !== targetScope && d.scope !== 'PRODUCT_CATEGORY') return false

    // Must be within valid date range
    if (d.validFrom && new Date(d.validFrom) > now) return false
    if (d.validTo && new Date(d.validTo) < now) return false

    // Check minimum order value for quote-level discounts
    if (!props.lineItemId && d.minOrderValue) {
      if (props.subtotal < Number(d.minOrderValue)) return false
    }

    // Search filter
    if (search.value) {
      const searchLower = search.value.toLowerCase()
      return (
        d.name.toLowerCase().includes(searchLower) ||
        d.description?.toLowerCase().includes(searchLower)
      )
    }

    return true
  })
})

const typeOptions = [
  { label: 'Percentage (%)', value: 'PERCENTAGE' },
  { label: 'Fixed Amount ($)', value: 'FIXED_AMOUNT' },
]

const isManualValid = computed(() => {
  if (discountValue.value <= 0) return false
  if (!reason.value.trim()) return false
  if (discountType.value === 'PERCENTAGE' && discountValue.value > 100) return false
  return true
})

function formatDiscountValue(discount: Discount) {
  return discount.type === 'PERCENTAGE'
    ? `${Number(discount.value)}%`
    : formatPrice(Number(discount.value))
}

function calculateEstimatedSavings(discount: Discount) {
  const value = Number(discount.value)
  if (discount.type === 'PERCENTAGE') {
    return (props.subtotal * value) / 100
  }
  return value
}

async function applyCatalogDiscount(discountId: string) {
  applying.value = true
  error.value = null

  try {
    await $fetch(`/api/quotes/${props.quoteId}/discounts`, {
      method: 'POST',
      body: {
        discountId,
        lineItemId: props.lineItemId,
      },
    })

    emit('applied')
    isOpen.value = false
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to apply discount')
  } finally {
    applying.value = false
  }
}

async function applyManualDiscount() {
  if (!isManualValid.value) return

  applying.value = true
  error.value = null

  try {
    await $fetch(`/api/quotes/${props.quoteId}/discounts`, {
      method: 'POST',
      body: {
        type: discountType.value,
        value: discountValue.value,
        reason: reason.value,
        lineItemId: props.lineItemId,
      },
    })

    emit('applied')
    isOpen.value = false
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to apply discount')
  } finally {
    applying.value = false
  }
}
</script>

<template>
  <UModal v-model:open="isOpen" :title="`Apply ${targetLabel} Discount`">
    <template #content>
      <UCard class="min-w-[450px]">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">
              Apply {{ targetLabel }} Discount
            </h3>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="isOpen = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <!-- Tabs -->
          <div class="flex border-b border-gray-200 dark:border-gray-700">
            <button
              class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
              :class="activeTab === 'catalog'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
              @click="activeTab = 'catalog'"
            >
              Catalog
            </button>
            <button
              class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
              :class="activeTab === 'manual'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
              @click="activeTab = 'manual'"
            >
              Manual
            </button>
          </div>

          <UAlert
            v-if="error"
            color="error"
            icon="i-heroicons-exclamation-triangle"
            closable
            @close="error = null"
          >
            <template #description>{{ error }}</template>
          </UAlert>

          <!-- Catalog Tab -->
          <div v-if="activeTab === 'catalog'" class="space-y-4">
            <UInput
              v-model="search"
              placeholder="Search discounts..."
              icon="i-heroicons-magnifying-glass"
            />

            <div v-if="filteredDiscounts.length === 0" class="text-center py-6 text-gray-500">
              <UIcon name="i-heroicons-tag" class="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No applicable discounts found</p>
              <p class="text-sm mt-1">Try the Manual tab to create a custom discount</p>
            </div>

            <div v-else class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="discount in filteredDiscounts"
                :key="discount.id"
                class="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                @click="applyCatalogDiscount(discount.id)"
              >
                <div class="flex items-start justify-between">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <p class="font-medium">{{ discount.name }}</p>
                      <UBadge
                        :color="discount.type === 'PERCENTAGE' ? 'info' : 'success'"
                        variant="subtle"
                        size="xs"
                      >
                        {{ formatDiscountValue(discount) }}
                      </UBadge>
                    </div>
                    <p v-if="discount.description" class="text-sm text-gray-500 mt-1">
                      {{ discount.description }}
                    </p>
                  </div>

                  <div class="text-right flex-shrink-0 ml-4">
                    <p class="text-sm text-gray-500">Est. savings</p>
                    <p class="font-medium text-red-500">
                      -{{ formatPrice(calculateEstimatedSavings(discount)) }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span v-if="discount.minOrderValue">
                    Min order: {{ formatPrice(discount.minOrderValue) }}
                  </span>
                  <span v-if="discount.validTo">
                    Expires: {{ new Date(discount.validTo).toLocaleDateString() }}
                  </span>
                  <span v-if="discount.stackable" class="text-green-600">Stackable</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Manual Tab -->
          <div v-if="activeTab === 'manual'" class="space-y-4">
            <UFormField label="Discount Type">
              <USelectMenu
                v-model="discountType"
                :items="typeOptions"
                value-key="value"
              />
            </UFormField>

            <UFormField
              :label="discountType === 'PERCENTAGE' ? 'Percentage (%)' : 'Amount ($)'"
            >
              <UInput
                v-model.number="discountValue"
                type="number"
                :min="0"
                :max="discountType === 'PERCENTAGE' ? 100 : undefined"
                step="0.01"
              />
              <template #hint>
                <span v-if="discountType === 'PERCENTAGE' && discountValue > 100" class="text-red-500">
                  Percentage cannot exceed 100%
                </span>
              </template>
            </UFormField>

            <UFormField label="Reason" required>
              <UTextarea
                v-model="reason"
                placeholder="Enter the reason for this discount (required)..."
                :rows="3"
              />
              <template #hint>
                <span v-if="!reason.trim()" class="text-amber-500">
                  Reason is required for manual discounts
                </span>
              </template>
            </UFormField>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton variant="ghost" @click="isOpen = false">
              Cancel
            </UButton>
            <UButton
              v-if="activeTab === 'manual'"
              :loading="applying"
              :disabled="!isManualValid"
              @click="applyManualDiscount"
            >
              Apply Discount
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
