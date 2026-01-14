<script setup lang="ts">
import type { TaxBreakdownItem } from '~/composables/useTaxRates'

const props = defineProps<{
  subtotal: string | number
  discountTotal: string | number
  taxAmount?: string | number
  taxBreakdown?: TaxBreakdownItem[] | null
  total: string | number
  oneTimeTotal?: string | number
  mrr?: string | number
  arr?: string | number
  tcv?: string | number
  appliedDiscounts?: Array<{
    id: string
    type: string
    value: string | number
    calculatedAmount: string | number
    discount?: { id: string; name: string } | null
  }>
  isTaxExempt?: boolean
  editable?: boolean
}>()

const emit = defineEmits<{
  'apply-discount': []
}>()

const { formatPrice } = usePricing()

const subtotalNum = computed(() =>
  typeof props.subtotal === 'string' ? parseFloat(props.subtotal) : props.subtotal
)

const discountNum = computed(() => {
  const value = props.discountTotal
  return typeof value === 'string' ? parseFloat(value) : value
})

const totalNum = computed(() =>
  typeof props.total === 'string' ? parseFloat(props.total) : props.total
)

const savingsPercentage = computed(() => {
  if (subtotalNum.value === 0) return 0
  return ((discountNum.value / subtotalNum.value) * 100).toFixed(1)
})

const taxAmountNum = computed(() => {
  if (!props.taxAmount) return 0
  return typeof props.taxAmount === 'string' ? parseFloat(props.taxAmount) : props.taxAmount
})

const oneTimeTotalNum = computed(() => {
  if (!props.oneTimeTotal) return 0
  return typeof props.oneTimeTotal === 'string' ? parseFloat(props.oneTimeTotal) : props.oneTimeTotal
})

const mrrNum = computed(() => {
  if (!props.mrr) return 0
  return typeof props.mrr === 'string' ? parseFloat(props.mrr) : props.mrr
})

const arrNum = computed(() => {
  if (!props.arr) return 0
  return typeof props.arr === 'string' ? parseFloat(props.arr) : props.arr
})

const tcvNum = computed(() => {
  if (!props.tcv) return 0
  return typeof props.tcv === 'string' ? parseFloat(props.tcv) : props.tcv
})

const hasRecurringItems = computed(() => mrrNum.value > 0)

function formatTaxRate(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold">Quote Summary</h3>
        <UButton
          v-if="editable && (!appliedDiscounts || appliedDiscounts.length === 0)"
          variant="ghost"
          size="xs"
          icon="i-heroicons-tag"
          @click="emit('apply-discount')"
        >
          Add Discount
        </UButton>
      </div>
    </template>

    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-gray-500 flex items-center gap-1">
          Subtotal
          <UTooltip text="Sum of all line item net prices (after line-level discounts)">
            <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-gray-400" />
          </UTooltip>
        </span>
        <span class="font-medium">{{ formatPrice(subtotalNum) }}</span>
      </div>

      <!-- Discount Breakdown -->
      <div v-if="appliedDiscounts && appliedDiscounts.length > 0" class="space-y-2">
        <div
          v-for="discount in appliedDiscounts"
          :key="discount.id"
          class="flex justify-between text-sm"
        >
          <span class="text-gray-500 truncate max-w-[60%]">
            {{ discount.discount?.name || 'Manual Discount' }}
            <span class="text-xs">
              ({{ discount.type === 'PERCENTAGE' ? `${discount.value}%` : 'Fixed' }})
            </span>
          </span>
          <span class="text-red-500">-{{ formatPrice(discount.calculatedAmount) }}</span>
        </div>
      </div>

      <div v-else-if="discountNum > 0" class="flex justify-between text-red-500">
        <span>Discount</span>
        <span class="font-medium">-{{ formatPrice(discountNum) }}</span>
      </div>

      <!-- Savings Badge -->
      <div v-if="discountNum > 0" class="flex justify-end">
        <UBadge color="success" variant="subtle" size="xs">
          You save {{ savingsPercentage }}%
        </UBadge>
      </div>

      <!-- Tax Section -->
      <div v-if="isTaxExempt" class="flex justify-between text-green-600 dark:text-green-400">
        <span class="flex items-center gap-1">
          <UIcon name="i-heroicons-check-badge" class="w-4 h-4" />
          Tax Exempt
        </span>
        <span class="font-medium">$0.00</span>
      </div>

      <div v-else-if="taxBreakdown && taxBreakdown.length > 0" class="space-y-2">
        <div
          v-for="(tax, index) in taxBreakdown"
          :key="index"
          class="flex justify-between text-sm"
        >
          <span class="text-gray-500">
            {{ tax.name }}
            <span class="text-xs">({{ formatTaxRate(tax.rate) }})</span>
          </span>
          <span class="text-gray-700 dark:text-gray-300">{{ formatPrice(tax.amount) }}</span>
        </div>
      </div>

      <div v-else-if="taxAmountNum > 0" class="flex justify-between">
        <span class="text-gray-500">Tax</span>
        <span class="font-medium">{{ formatPrice(taxAmountNum) }}</span>
      </div>

      <USeparator />

      <div class="flex justify-between text-lg items-center">
        <span class="font-semibold flex items-center gap-1">
          Total
          <UTooltip text="Subtotal - Quote Discounts + Tax">
            <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-gray-400" />
          </UTooltip>
        </span>
        <span class="font-bold text-primary-600">{{ formatPrice(totalNum) }}</span>
      </div>

      <!-- Recurring Revenue Metrics -->
      <template v-if="hasRecurringItems">
        <USeparator />

        <div class="space-y-2 pt-2">
          <h4 class="text-xs font-medium text-gray-400 uppercase tracking-wide">Recurring Revenue</h4>

          <div v-if="oneTimeTotalNum > 0" class="flex justify-between text-sm">
            <span class="text-gray-500">One-Time Charges</span>
            <span class="font-medium">{{ formatPrice(oneTimeTotalNum) }}</span>
          </div>

          <div class="flex justify-between text-sm">
            <span class="text-gray-500 flex items-center gap-1">
              MRR
              <UTooltip text="Monthly Recurring Revenue">
                <UIcon name="i-heroicons-information-circle" class="w-3 h-3 text-gray-400" />
              </UTooltip>
            </span>
            <span class="font-medium text-blue-600">{{ formatPrice(mrrNum) }}<span class="text-xs text-gray-400">/mo</span></span>
          </div>

          <div class="flex justify-between text-sm">
            <span class="text-gray-500 flex items-center gap-1">
              ARR
              <UTooltip text="Annual Recurring Revenue (MRR × 12)">
                <UIcon name="i-heroicons-information-circle" class="w-3 h-3 text-gray-400" />
              </UTooltip>
            </span>
            <span class="font-medium text-blue-600">{{ formatPrice(arrNum) }}<span class="text-xs text-gray-400">/yr</span></span>
          </div>

          <div class="flex justify-between text-sm">
            <span class="text-gray-500 flex items-center gap-1">
              TCV
              <UTooltip text="Total Contract Value (MRR × term + one-time)">
                <UIcon name="i-heroicons-information-circle" class="w-3 h-3 text-gray-400" />
              </UTooltip>
            </span>
            <span class="font-semibold text-green-600">{{ formatPrice(tcvNum) }}</span>
          </div>
        </div>
      </template>
    </div>
  </UCard>
</template>
