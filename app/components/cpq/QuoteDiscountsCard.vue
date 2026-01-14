<script setup lang="ts">
const props = defineProps<{
  appliedDiscounts: Array<{
    id: string
    type: string
    value: string | number
    calculatedAmount: string | number
    reason?: string | null
    discount?: {
      id: string
      name: string
    } | null
  }>
  editable?: boolean
}>()

const emit = defineEmits<{
  'apply-discount': []
  'apply-manual-discount': []
  'remove-discount': [appliedDiscountId: string]
}>()

const { formatPrice } = usePricing()

const totalDiscountAmount = computed(() => {
  return props.appliedDiscounts.reduce((sum, d) => {
    const amount = typeof d.calculatedAmount === 'string'
      ? parseFloat(d.calculatedAmount)
      : d.calculatedAmount
    return sum + amount
  }, 0)
})

function formatDiscountValue(discount: { type: string; value: string | number }) {
  const value = typeof discount.value === 'string' ? parseFloat(discount.value) : discount.value
  return discount.type === 'PERCENTAGE' ? `${value}%` : formatPrice(value)
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold">Discounts</h3>
        <div v-if="editable" class="flex items-center gap-1">
          <UButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-tag"
            @click="emit('apply-discount')"
          >
            Apply
          </UButton>
          <UButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-pencil-square"
            @click="emit('apply-manual-discount')"
          >
            Manual
          </UButton>
        </div>
      </div>
    </template>

    <div v-if="appliedDiscounts.length === 0" class="text-center py-4">
      <UIcon name="i-heroicons-tag" class="w-8 h-8 text-gray-300 mx-auto mb-2" />
      <p class="text-sm text-gray-500">No discounts applied</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="discount in appliedDiscounts"
        :key="discount.id"
        class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="font-medium text-sm truncate">
              {{ discount.discount?.name || 'Manual Discount' }}
            </p>
            <UBadge
              :color="discount.type === 'PERCENTAGE' ? 'info' : 'success'"
              variant="subtle"
              size="xs"
            >
              {{ formatDiscountValue(discount) }}
            </UBadge>
          </div>
          <p v-if="discount.reason" class="text-xs text-gray-500 truncate">
            {{ discount.reason }}
          </p>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-sm font-medium text-red-500">
            -{{ formatPrice(discount.calculatedAmount) }}
          </span>
          <UButton
            v-if="editable"
            variant="ghost"
            color="error"
            size="xs"
            icon="i-heroicons-trash"
            @click="emit('remove-discount', discount.id)"
          />
        </div>
      </div>

      <USeparator />

      <div class="flex justify-between text-sm font-medium">
        <span class="text-gray-500">Total Discount</span>
        <span class="text-red-500">-{{ formatPrice(totalDiscountAmount) }}</span>
      </div>
    </div>
  </UCard>
</template>
