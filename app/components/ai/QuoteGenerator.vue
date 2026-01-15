<script setup lang="ts">
import type { GenerateQuoteResponse } from '~/composables/useAIQuoteOptimizer'

const props = defineProps<{
  customerId?: string
  priceBookId?: string
}>()

const emit = defineEmits<{
  create: [data: GenerateQuoteResponse]
}>()

const { generateQuote, loading, error } = useAIQuoteOptimizer()
const { formatPrice } = usePricing()

const description = ref('')
const generatedQuote = ref<GenerateQuoteResponse | null>(null)

async function handleGenerate() {
  if (!description.value.trim()) return

  const result = await generateQuote(description.value, {
    customerId: props.customerId,
    priceBookId: props.priceBookId,
  })

  if (result) {
    generatedQuote.value = result
  }
}

function handleCreate() {
  if (generatedQuote.value) {
    emit('create', generatedQuote.value)
  }
}

function handleClear() {
  generatedQuote.value = null
  description.value = ''
}
</script>

<template>
  <div class="space-y-4">
    <!-- Input Form -->
    <div v-if="!generatedQuote" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Describe what you need
        </label>
        <UTextarea
          v-model="description"
          placeholder="E.g., 'I need a cloud infrastructure setup for a medium-sized e-commerce company with 50,000 monthly visitors, including CDN, storage, and monitoring...'"
          :rows="4"
          :disabled="loading"
        />
      </div>

      <UButton
        :loading="loading"
        :disabled="!description.trim()"
        block
        icon="i-heroicons-sparkles"
        @click="handleGenerate"
      >
        Generate Quote
      </UButton>

      <UAlert
        v-if="error"
        color="error"
        icon="i-heroicons-exclamation-triangle"
      >
        <template #description>{{ error }}</template>
      </UAlert>
    </div>

    <!-- Generated Quote Preview -->
    <div v-else class="space-y-4">
      <UAlert color="success" variant="subtle" icon="i-heroicons-check-circle">
        <template #title>Quote Generated</template>
        <template #description>Review the suggested quote below</template>
      </UAlert>

      <!-- Quote Name -->
      <div>
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Suggested Name
        </label>
        <p class="font-medium">{{ generatedQuote.suggestedName }}</p>
      </div>

      <!-- Summary -->
      <div>
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Summary
        </label>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ generatedQuote.summary }}</p>
      </div>

      <!-- Line Items -->
      <div>
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          Suggested Products ({{ generatedQuote.lineItems.length }})
        </label>
        <div class="space-y-2">
          <div
            v-for="(item, index) in generatedQuote.lineItems"
            :key="index"
            class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-sm">{{ item.productName }}</p>
                <p v-if="item.reason" class="text-xs text-gray-500 mt-1">{{ item.reason }}</p>
              </div>
              <UBadge color="neutral" variant="subtle">
                Qty: {{ item.quantity }}
              </UBadge>
            </div>
          </div>
        </div>
      </div>

      <!-- Estimated Total -->
      <div v-if="generatedQuote.estimatedTotal" class="pt-3 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600 dark:text-gray-400">Estimated Total</span>
          <span class="font-semibold">{{ formatPrice(generatedQuote.estimatedTotal) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 pt-2">
        <UButton
          variant="ghost"
          @click="handleClear"
        >
          Start Over
        </UButton>
        <UButton
          class="flex-1"
          icon="i-heroicons-plus"
          @click="handleCreate"
        >
          Create Quote
        </UButton>
      </div>
    </div>
  </div>
</template>
