<script setup lang="ts">
// Tips data
const tips = [
  {
    icon: 'i-heroicons-light-bulb',
    iconColor: 'text-yellow-500',
    title: 'Start with Products',
    description: 'Browse the product catalog to understand what\'s available. Pay attention to the difference between standalone products and configurable bundles.',
  },
  {
    icon: 'i-heroicons-light-bulb',
    iconColor: 'text-yellow-500',
    title: 'Configure Bundles Carefully',
    description: 'When adding a bundle to a quote, review each feature and its options. Some options have price adjustments that affect the final price.',
  },
  {
    icon: 'i-heroicons-sparkles',
    iconColor: 'text-indigo-500',
    title: 'Use Guided Selling',
    description: 'Set up product affinities for cross-sell and upsell opportunities. Use REQUIRED affinity type for mandatory companion products. Questionnaires help discover customer needs.',
  },
  {
    icon: 'i-heroicons-clipboard-document-list',
    iconColor: 'text-indigo-500',
    title: 'Design Effective Questionnaires',
    description: 'Use branching logic to skip irrelevant questions. Set relevance scores to rank product recommendations. Track acceptance rates to improve suggestions over time.',
  },
  {
    icon: 'i-heroicons-user-group',
    iconColor: 'text-purple-500',
    title: 'Assign Customers to Quotes',
    description: 'Link quotes to customer records for tracking and reporting. Customers can have assigned price books for automatic customer-specific pricing.',
  },
  {
    icon: 'i-heroicons-cog-6-tooth',
    iconColor: 'text-pink-500',
    title: 'Configuration Rules',
    description: 'Rules can enforce product dependencies (e.g., "32GB RAM requires SSD") and validate configurations automatically when products are added or changed.',
  },
  {
    icon: 'i-heroicons-receipt-percent',
    iconColor: 'text-red-500',
    title: 'Discount Stacking',
    description: 'Check if discounts are stackable before applying multiple. Non-stackable discounts are exclusive; stackable discounts combine. Priority determines application order.',
  },
  {
    icon: 'i-heroicons-document-text',
    iconColor: 'text-indigo-500',
    title: 'Contract Pricing',
    description: 'Create contracts with customers for negotiated pricing. Contract Price Entries override standard price book prices. Only active contracts (not draft or expired) affect pricing.',
  },
  {
    icon: 'i-heroicons-currency-dollar',
    iconColor: 'text-emerald-500',
    title: 'Multi-Currency Support',
    description: 'Configure currencies with exchange rates for international sales. Quote totals are automatically converted to the base currency for consistent reporting across regions.',
  },
  {
    icon: 'i-heroicons-arrow-path',
    iconColor: 'text-violet-500',
    title: 'Recurring Revenue',
    description: 'Products with billing frequencies (monthly, quarterly, annual) automatically calculate MRR, ARR, and TCV metrics on quotes. Use proration for mid-period subscription starts.',
  },
]
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="tip in tips"
      :key="tip.title"
      class="flex gap-3"
    >
      <UIcon :name="tip.icon" :class="['w-5 h-5 flex-shrink-0 mt-0.5', tip.iconColor]" />
      <div>
        <p class="font-medium">{{ tip.title }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ tip.description }}
        </p>
      </div>
    </div>
  </div>
</template>
