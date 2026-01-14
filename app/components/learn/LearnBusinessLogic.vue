<script setup lang="ts">
interface LogicCard {
  id: string
  title: string
  icon: string
  summary: string
  formula?: string
  mermaid?: string
  example: {
    title: string
    steps: string[]
  }
}

const cards: LogicCard[] = [
  {
    id: 'pricing',
    title: 'Pricing Calculation',
    icon: 'i-heroicons-calculator',
    summary: 'How line item prices are calculated from list prices, tiers, and adjustments.',
    formula: `unitPrice = matchingTier?.tierPrice ?? listPrice
lineTotal = unitPrice × quantity
netPrice = lineTotal - lineDiscounts`,
    example: {
      title: 'USB-C Cable, Qty: 25',
      steps: [
        'List Price: $12/unit',
        'Check tiers: Qty 25 matches "10-49" tier @ $10/unit',
        'unitPrice = $10 (tier match)',
        'lineTotal = $10 × 25 = $250',
        'No line discounts applied',
        'netPrice = $250',
      ],
    },
  },
  {
    id: 'discount-stacking',
    title: 'Discount Stacking',
    icon: 'i-heroicons-receipt-percent',
    summary: 'How multiple discounts combine: line-level first, then quote-level.',
    mermaid: `flowchart TD
    A[Calculate Line Total] --> B[Find Applicable Discounts]
    B --> C{Line-Level Discounts?}
    C -->|Yes| D[Sort by Priority]
    D --> E{Stackable?}
    E -->|Yes| F[Sum All Stackable]
    E -->|No| G[Take Best Non-Stackable]
    F --> H[Apply to Line]
    G --> H
    C -->|No| H
    H --> I{Quote-Level Discounts?}
    I -->|Yes| J[Apply to Subtotal]
    I -->|No| K[Final Total]
    J --> K`,
    example: {
      title: 'Multiple discounts on same order',
      steps: [
        'Line total: $1,000',
        'Line discount A (stackable): 10% = $100',
        'Line discount B (stackable): 5% = $50',
        'Total line discount: $150 (stacked)',
        'Net line: $850',
        'Quote discount: $50 fixed',
        'Final: $800',
      ],
    },
  },
  {
    id: 'contract-pricing',
    title: 'Contract Pricing Override',
    icon: 'i-heroicons-document-text',
    summary: 'When contract prices override standard price book pricing.',
    mermaid: `flowchart TD
    A[Quote Created] --> B{Customer Selected?}
    B -->|No| C[Use Price Book Price]
    B -->|Yes| D{Has Active Contract?}
    D -->|No| C
    D -->|Yes| E{Contract Price Entry?}
    E -->|No| F{Contract Discount %?}
    F -->|No| C
    F -->|Yes| G[Apply % to PB Price]
    E -->|Yes| H[Use Fixed Price]`,
    example: {
      title: 'Acme Corp with active contract',
      steps: [
        'Product: Laptop Pro, List Price: $1,299',
        'Customer: Acme Corp',
        'Contract: "Acme 2024" (ACTIVE)',
        'Contract Price Entry: $1,099',
        'Final price: $1,099 (overrides list)',
      ],
    },
  },
  {
    id: 'tax-calculation',
    title: 'Tax Calculation',
    icon: 'i-heroicons-banknotes',
    summary: 'How tax rates are resolved from customer location and applied.',
    formula: `taxRate = findRate(customer.country, customer.state)
taxableAmount = subtotal (excluding tax-exempt items)
taxAmount = taxableAmount × taxRate`,
    example: {
      title: 'California customer',
      steps: [
        'Subtotal: $1,000',
        'Customer location: US, California',
        'Tax rate: CA State Tax = 7.25%',
        'Tax amount: $1,000 × 0.0725 = $72.50',
        'Total: $1,072.50',
      ],
    },
  },
  {
    id: 'subscription-metrics',
    title: 'Subscription Metrics',
    icon: 'i-heroicons-arrow-path',
    summary: 'How MRR, ARR, and TCV are calculated for recurring revenue.',
    formula: `MRR = Σ(recurringLines normalized to monthly)
  - Annual ÷ 12, Quarterly ÷ 3, Monthly × 1

ARR = MRR × 12

TCV = oneTimeTotal + (MRR × termMonths)`,
    example: {
      title: 'Mixed quote with recurring items',
      steps: [
        'Setup fee: $500 (one-time)',
        'Annual license: $1,200/year → $100/month MRR',
        'Monthly support: $50/month → $50 MRR',
        'Total MRR: $150',
        'ARR: $150 × 12 = $1,800',
        'TCV (12mo): $500 + $1,800 = $2,300',
      ],
    },
  },
]

const expandedCards = ref<string[]>(['pricing'])

function toggleCard(id: string) {
  const index = expandedCards.value.indexOf(id)
  if (index === -1) {
    expandedCards.value.push(id)
  }
  else {
    expandedCards.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
      Click on each card to expand and see the detailed logic, formulas, and examples.
    </p>

    <div
      v-for="card in cards"
      :key="card.id"
      class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      <!-- Card Header -->
      <button
        class="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        @click="toggleCard(card.id)"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
            <UIcon :name="card.icon" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div class="text-left">
            <h3 class="font-medium">{{ card.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ card.summary }}</p>
          </div>
        </div>
        <UIcon
          :name="expandedCards.includes(card.id) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          class="w-5 h-5 text-gray-400"
        />
      </button>

      <!-- Card Content -->
      <div
        class="grid transition-[grid-template-rows] duration-300"
        :class="expandedCards.includes(card.id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="overflow-hidden">
          <div class="p-4 pt-0 space-y-4 border-t border-gray-200 dark:border-gray-700">
            <!-- Formula -->
            <div v-if="card.formula" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Formula</h4>
              <pre class="text-sm font-mono whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ card.formula }}</pre>
            </div>

            <!-- Mermaid Diagram -->
            <div v-if="card.mermaid" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Flow</h4>
              <ClientOnly>
                <LearnMermaidDiagram :id="`mermaid-${card.id}`" :chart="card.mermaid" />
              </ClientOnly>
            </div>

            <!-- Example -->
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 class="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                Example: {{ card.example.title }}
              </h4>
              <ol class="text-sm space-y-1">
                <li
                  v-for="(step, i) in card.example.steps"
                  :key="i"
                  class="flex items-start gap-2 text-blue-600 dark:text-blue-400"
                >
                  <span class="font-mono text-xs mt-0.5">{{ i + 1 }}.</span>
                  <span>{{ step }}</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
