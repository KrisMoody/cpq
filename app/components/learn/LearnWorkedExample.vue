<script setup lang="ts">
interface ExampleStep {
  title: string
  description: string
  data: Record<string, string | number>
  calculation?: string
}

const steps: ExampleStep[] = [
  {
    title: 'Setup Quote',
    description: 'Create a new quote with customer and price book',
    data: {
      'Quote ID': 'Q-2024-0042',
      'Customer': 'Acme Corp',
      'Price Book': 'Partner (EUR)',
      'Contract': 'Acme 2024 (ACTIVE, 15% discount)',
      'Currency': 'EUR (€)',
    },
  },
  {
    title: 'Add Product',
    description: 'Add a bundle product to the quote',
    data: {
      'Product': 'Laptop Pro Bundle',
      'SKU': 'LAP-PRO',
      'Type': 'BUNDLE',
      'List Price': '€1,299',
      'Billing': 'ONE_TIME',
    },
  },
  {
    title: 'Configure Bundle',
    description: 'Select options for each feature',
    data: {
      'Processor': 'i7 (+€0)',
      'RAM': '32GB (+€200)',
      'Storage': '512GB SSD (+€100)',
      'Configured Price': '€1,299 + €200 + €100 = €1,599',
    },
    calculation: 'bundlePrice = listPrice + Σ(optionAdjustments)',
  },
  {
    title: 'Apply Contract Pricing',
    description: 'Contract price entry overrides configured price',
    data: {
      'Contract': 'Acme 2024',
      'Contract Price Entry': '€1,099 (fixed)',
      'Override Applied': 'Yes',
      'Price Used': '€1,099',
    },
    calculation: 'Has Contract Price Entry → Use €1,099 instead of €1,599',
  },
  {
    title: 'Apply Discounts',
    description: 'Contract percentage discount applied',
    data: {
      'Contract Discount': '15%',
      'Discount Amount': '€1,099 × 0.15 = €164.85',
      'Net Price': '€1,099 - €164.85 = €934.15',
    },
    calculation: 'netPrice = contractPrice - (contractPrice × discountRate)',
  },
  {
    title: 'Calculate Tax',
    description: 'Apply tax based on customer jurisdiction',
    data: {
      'Customer Country': 'Germany (DE)',
      'Tax Rate': '19% VAT',
      'Taxable Amount': '€934.15',
      'Tax': '€934.15 × 0.19 = €177.49',
    },
    calculation: 'taxAmount = netPrice × taxRate',
  },
  {
    title: 'Final Totals',
    description: 'Complete quote summary with all calculations',
    data: {
      'Subtotal': '€934.15',
      'Tax': '€177.49',
      'Total': '€1,111.64',
      'Base Amount (USD)': '$1,200.57 (@1.08)',
      'MRR': '€0 (one-time product)',
      'ARR': '€0',
      'TCV': '€1,111.64',
    },
    calculation: 'total = subtotal + taxAmount; baseAmount = total × exchangeRate',
  },
]

const currentStep = ref(0)

const currentStepData = computed(() => steps[currentStep.value]!)

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Walk through a complete quote from creation to finalization.
    </p>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Step Navigation - Hidden on mobile, shown on lg+ -->
      <div class="hidden lg:block lg:w-56 flex-shrink-0">
        <div class="flex flex-col gap-2">
          <button
            v-for="(step, i) in steps"
            :key="i"
            class="relative flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left cursor-pointer"
            :class="i === currentStep
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
              : i < currentStep
                ? 'text-green-600 dark:text-green-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'"
            @click="currentStep = i"
          >
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              :class="i < currentStep
                ? 'bg-green-500 text-white'
                : i === currentStep
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'"
            >
              <UIcon v-if="i < currentStep" name="i-heroicons-check" class="w-4 h-4" />
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span class="text-sm font-medium">{{ step.title }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile Step Indicator -->
      <div class="lg:hidden flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
        <span class="text-sm font-medium">Step {{ currentStep + 1 }} of {{ steps.length }}</span>
        <div class="flex gap-1">
          <button
            v-for="(_, i) in steps"
            :key="i"
            class="w-2 h-2 rounded-full transition-colors"
            :class="i === currentStep
              ? 'bg-primary-500'
              : i < currentStep
                ? 'bg-green-500'
                : 'bg-gray-300 dark:bg-gray-600'"
            @click="currentStep = i"
          />
        </div>
      </div>

      <!-- Step Content -->
      <div class="flex-1">
        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-200"
          leave-active-class="transition-all duration-200"
          enter-from-class="opacity-0 translate-y-2"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div :key="currentStep" class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold">{{ currentStepData.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ currentStepData.description }}</p>
            </div>

            <!-- Data Display -->
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="(value, key) in currentStepData.data"
                  :key="key"
                  class="flex flex-col"
                >
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ key }}</span>
                  <span class="font-medium">{{ value }}</span>
                </div>
              </div>
            </div>

            <!-- Calculation -->
            <div v-if="currentStepData.calculation" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 overflow-hidden">
              <div class="flex items-start gap-2 text-blue-700 dark:text-blue-300">
                <UIcon name="i-heroicons-calculator" class="w-4 h-4 flex-shrink-0 mt-0.5" />
                <code class="text-sm font-mono break-words overflow-wrap-anywhere">{{ currentStepData.calculation }}</code>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between pt-4">
              <UButton
                variant="ghost"
                :disabled="currentStep === 0"
                @click="prevStep"
              >
                <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 mr-1" />
                Previous
              </UButton>
              <UButton
                v-if="currentStep < steps.length - 1"
                @click="nextStep"
              >
                Next
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
              </UButton>
              <UButton
                v-else
                color="success"
                @click="currentStep = 0"
              >
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-1" />
                Restart
              </UButton>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
