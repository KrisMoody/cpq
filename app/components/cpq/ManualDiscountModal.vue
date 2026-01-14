<script setup lang="ts">
const props = defineProps<{
  open: boolean
  quoteId: string
  lineItemId?: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'applied': []
}>()

const { formatPrice } = usePricing()

const applying = ref(false)
const error = ref<string | null>(null)

const discountType = ref<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE')
const discountValue = ref<number>(0)
const reason = ref('')

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

watch(isOpen, (newValue) => {
  if (newValue) {
    // Reset form when opening
    discountType.value = 'PERCENTAGE'
    discountValue.value = 0
    reason.value = ''
    error.value = null
  }
})

const typeOptions = [
  { label: 'Percentage (%)', value: 'PERCENTAGE' },
  { label: 'Fixed Amount ($)', value: 'FIXED_AMOUNT' },
]

const isValid = computed(() => {
  if (discountValue.value <= 0) return false
  if (!reason.value.trim()) return false
  if (discountType.value === 'PERCENTAGE' && discountValue.value > 100) return false
  return true
})

async function applyDiscount() {
  if (!isValid.value) return

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
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Failed to apply discount'
  } finally {
    applying.value = false
  }
}
</script>

<template>
  <UModal v-model:open="isOpen" :title="`Apply Manual ${lineItemId ? 'Line Item' : 'Quote'} Discount`">
    <template #content>
      <UCard class="min-w-[400px]">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">
              Apply Manual {{ lineItemId ? 'Line Item' : 'Quote' }} Discount
            </h3>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="isOpen = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UAlert
            v-if="error"
            color="error"
            icon="i-heroicons-exclamation-triangle"
            closable
            @close="error = null"
          >
            <template #description>{{ error }}</template>
          </UAlert>

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

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton variant="ghost" @click="isOpen = false">
              Cancel
            </UButton>
            <UButton
              :loading="applying"
              :disabled="!isValid"
              @click="applyDiscount"
            >
              Apply Discount
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
