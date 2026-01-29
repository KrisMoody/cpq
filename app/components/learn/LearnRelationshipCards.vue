<script setup lang="ts">
interface RelationshipCard {
  id: string
  title: string
  question: string
  icon: string
  mermaid: string
  explanation: string[]
}

const cards: RelationshipCard[] = [
  {
    id: 'contract-pricing',
    title: 'Contract Pricing Flow',
    question: 'When does contract pricing apply?',
    icon: 'i-heroicons-document-text',
    mermaid: `flowchart TD
    A[Quote has Customer] --> B{Active Contract?}
    B -->|No| C[Use Price Book]
    B -->|Yes| D{Price Entry exists?}
    D -->|Yes| E[Use Fixed Price]
    D -->|No| F{Discount %?}
    F -->|Yes| G[Apply % to PB]
    F -->|No| C`,
    explanation: [
      'Contract pricing only applies when a customer is assigned to the quote',
      'The contract must be in ACTIVE status (not DRAFT or EXPIRED)',
      'Contract Price Entries take precedence over percentage discounts',
      'If no contract pricing exists, standard price book pricing is used',
    ],
  },
  {
    id: 'discount-flow',
    title: 'Discount Stacking Flow',
    question: 'How do multiple discounts combine?',
    icon: 'i-heroicons-receipt-percent',
    mermaid: `flowchart TD
    A[Line Discounts] --> B{Stackable?}
    B -->|Yes| C[Sum All]
    B -->|No| D[Best Only]
    C --> E[Apply to Line]
    D --> E
    E --> F[Quote Discounts]
    F --> G[Apply to Subtotal]`,
    explanation: [
      'Line-level discounts are evaluated and applied first',
      'Stackable discounts accumulate (e.g., 10% + 5% = 15%)',
      'Non-stackable (exclusive) discounts: only the best one applies',
      'Quote-level discounts apply after all line discounts',
      'Priority determines evaluation order when discounts conflict',
    ],
  },
  {
    id: 'affinity-flow',
    title: 'Product Affinity Flow',
    question: 'How do affinities trigger recommendations?',
    icon: 'i-heroicons-sparkles',
    mermaid: `flowchart TD
    A[Product Added] --> B[Find Affinities]
    B --> C{Conditions Met?}
    C -->|Yes| D[Add to Recommendations]
    C -->|No| E[Skip]
    D --> F[Sort by Priority]
    F --> G[Display by Type]
    G --> H[User Action]
    H --> I[Log Result]`,
    explanation: [
      'When a source product is added, system finds matching affinities',
      'Affinity conditions (quantity, billing frequency) are checked',
      'Recommendations are sorted by priority and grouped by type',
      'Types: CROSS_SELL, UPSELL, ACCESSORY, REQUIRED, etc.',
      'User actions (ACCEPTED, DISMISSED) are logged for analytics',
    ],
  },
  {
    id: 'questionnaire-flow',
    title: 'Questionnaire Scoring',
    question: 'How do answers map to products?',
    icon: 'i-heroicons-clipboard-document-list',
    mermaid: `flowchart TD
    A[User Answers] --> B[Map to Products]
    B --> C[Sum Scores]
    C --> D[Rank Products]
    D --> E[Top N Shown]
    E --> F[User Selection]
    F --> G[Add to Quote]`,
    explanation: [
      'Each question can map answers to products via QuestionProductMapping',
      'Each mapping has a relevance score (0-100)',
      'Scores are summed across all answered questions',
      'Products are ranked by total relevance score',
      'Top-scoring products are recommended to the user',
      'Branching logic can skip irrelevant questions based on answers',
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div
      v-for="card in cards"
      :key="card.id"
      class="border border-ga-gray-300 rounded-lg overflow-hidden"
    >
      <!-- Card Header -->
      <div class="p-4 bg-ga-gray-100 border-b border-ga-gray-300">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-ga-navy-100">
            <UIcon :name="card.icon" class="w-5 h-5 text-ga-navy-600" />
          </div>
          <div>
            <h3 class="font-medium">{{ card.title }}</h3>
            <p class="text-sm text-ga-gray-600">{{ card.question }}</p>
          </div>
        </div>
      </div>

      <!-- Card Content -->
      <div class="p-4 space-y-4">
        <!-- Mermaid Diagram -->
        <div class="bg-white rounded-lg p-3 border border-ga-gray-200">
          <ClientOnly>
            <LearnMermaidDiagram :id="`rel-${card.id}`" :chart="card.mermaid" />
          </ClientOnly>
        </div>

        <!-- Explanation -->
        <ul class="space-y-1.5 text-sm">
          <li
            v-for="(point, i) in card.explanation"
            :key="i"
            class="flex items-start gap-2 text-ga-gray-700"
          >
            <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>{{ point }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
