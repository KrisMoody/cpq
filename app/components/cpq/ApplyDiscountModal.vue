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

const _loading = ref(false)
const applying = ref(false)
const error = ref<string | null>(null)
const search = ref('')

onMounted(() => {
  fetchDiscounts()
})

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

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

async function applyDiscount(discountId: string) {
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
</script>

<template>
  <UModal v-model:open="isOpen" :title="`Apply ${lineItemId ? 'Line Item' : 'Quote'} Discount`">
    <template #content>
      <UCard class="min-w-[400px]">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">
              Apply {{ lineItemId ? 'Line Item' : 'Quote' }} Discount
            </h3>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="isOpen = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UInput
            v-model="search"
            placeholder="Search discounts..."
            icon="i-heroicons-magnifying-glass"
          />

          <UAlert
            v-if="error"
            color="error"
            icon="i-heroicons-exclamation-triangle"
            closable
            @close="error = null"
          >
            <template #description>{{ error }}</template>
          </UAlert>

          <div v-if="filteredDiscounts.length === 0" class="text-center py-6 text-gray-500">
            <UIcon name="i-heroicons-tag" class="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No applicable discounts found</p>
          </div>

          <div v-else class="space-y-2 max-h-80 overflow-y-auto">
            <div
              v-for="discount in filteredDiscounts"
              :key="discount.id"
              class="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              @click="applyDiscount(discount.id)"
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

        <template #footer>
          <div class="flex justify-end">
            <UButton variant="ghost" @click="isOpen = false">
              Cancel
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
