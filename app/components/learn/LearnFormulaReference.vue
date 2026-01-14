<script setup lang="ts">
const toast = useToast()

interface FormulaGroup {
  title: string
  formulas: {
    name: string
    formula: string
    description: string
  }[]
}

const formulaGroups: FormulaGroup[] = [
  {
    title: 'Line Item Pricing',
    formulas: [
      {
        name: 'Unit Price',
        formula: 'unitPrice = matchingTier?.tierPrice ?? listPrice',
        description: 'If quantity falls within a price tier, use tier price; otherwise use list price',
      },
      {
        name: 'Line Total',
        formula: 'lineTotal = unitPrice × quantity',
        description: 'Extended price before discounts',
      },
      {
        name: 'Net Price',
        formula: 'netPrice = lineTotal - lineDiscounts',
        description: 'Final line price after all line-level discounts',
      },
    ],
  },
  {
    title: 'Quote Totals',
    formulas: [
      {
        name: 'Subtotal',
        formula: 'subtotal = Σ(lineItems.netPrice)',
        description: 'Sum of all line item net prices',
      },
      {
        name: 'Total',
        formula: 'total = subtotal - quoteDiscounts + taxAmount',
        description: 'Final quote amount after quote-level discounts and tax',
      },
      {
        name: 'Base Amount',
        formula: 'baseAmount = total × exchangeRate',
        description: 'Converted to base currency for reporting',
      },
    ],
  },
  {
    title: 'Recurring Revenue',
    formulas: [
      {
        name: 'MRR (Monthly Recurring)',
        formula: 'MRR = Σ(recurringLines normalized to monthly)',
        description: 'Annual ÷ 12, Quarterly ÷ 3, Monthly × 1, One-time = 0',
      },
      {
        name: 'ARR (Annual Recurring)',
        formula: 'ARR = MRR × 12',
        description: 'Annualized recurring revenue run-rate',
      },
      {
        name: 'TCV (Total Contract Value)',
        formula: 'TCV = oneTimeTotal + (MRR × termMonths)',
        description: 'Total deal value including one-time and full term recurring',
      },
    ],
  },
  {
    title: 'Special Calculations',
    formulas: [
      {
        name: 'Proration',
        formula: 'proratedAmount = (monthlyPrice / daysInMonth) × remainingDays',
        description: 'Partial period billing for mid-month starts',
      },
      {
        name: 'Currency Conversion',
        formula: 'baseAmount = localAmount × exchangeRate',
        description: 'Convert transaction currency to base currency',
      },
      {
        name: 'Tax Amount',
        formula: 'taxAmount = taxableSubtotal × taxRate',
        description: 'Applicable tax based on customer jurisdiction',
      },
    ],
  },
]

async function copyFormula(formula: string) {
  await navigator.clipboard.writeText(formula)
  toast.add({
    title: 'Copied!',
    description: 'Formula copied to clipboard',
    icon: 'i-heroicons-clipboard-document-check',
  })
}
</script>

<template>
  <div class="space-y-6">
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Click any formula to copy it to your clipboard.
    </p>

    <div
      v-for="group in formulaGroups"
      :key="group.title"
      class="space-y-3"
    >
      <h3 class="font-medium text-gray-700 dark:text-gray-300">{{ group.title }}</h3>
      <div class="space-y-2">
        <button
          v-for="f in group.formulas"
          :key="f.name"
          class="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
          @click="copyFormula(f.formula)"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-medium">{{ f.name }}</span>
                <UIcon
                  name="i-heroicons-clipboard-document"
                  class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <code class="text-sm font-mono text-primary-600 dark:text-primary-400 block mb-1">
                {{ f.formula }}
              </code>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ f.description }}</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
