<script setup lang="ts">
const ApexChart = defineAsyncComponent(() =>
  import('vue3-apexcharts').then((m) => m.default)
)

const chartOptions = ref({
  chart: {
    type: 'treemap',
    toolbar: { show: false },
  },
  legend: { show: true, position: 'bottom' },
  title: {
    text: 'Entity Hierarchies',
    align: 'center',
    style: {
      fontSize: '14px',
      fontWeight: 600,
    },
  },
  plotOptions: {
    treemap: {
      distributed: false,
      enableShades: true,
      shadeIntensity: 0.3,
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '12px',
    },
    formatter: function (text: string) {
      return text
    },
  },
  tooltip: {
    y: {
      formatter: function (_val: number, opts: { seriesIndex: number }) {
        const descriptions: Record<number, string> = {
          0: 'Product hierarchy: configurable items with features and options',
          1: 'Pricing hierarchy: price books with entries and volume tiers',
          2: 'Quote hierarchy: quotes with line items and applied discounts',
          3: 'Customer hierarchy: customers linked to their quotes',
          4: 'Rules hierarchy: business rules with conditions and actions',
          5: 'Discount hierarchy: discount definitions with volume tiers',
        }
        return descriptions[opts.seriesIndex] || ''
      },
    },
  },
})

const series = ref([
  {
    name: 'Product Hierarchy',
    color: '#3b82f6',
    data: [
      { x: 'Product', y: 30 },
      { x: '  └ ProductFeature', y: 20 },
      { x: '      └ ProductOption', y: 15 },
    ],
  },
  {
    name: 'Pricing Hierarchy',
    color: '#10b981',
    data: [
      { x: 'PriceBook', y: 25 },
      { x: '  └ PriceBookEntry', y: 20 },
      { x: '      └ PriceTier', y: 15 },
    ],
  },
  {
    name: 'Quote Hierarchy',
    color: '#f59e0b',
    data: [
      { x: 'Quote', y: 28 },
      { x: '  └ QuoteLineItem', y: 22 },
      { x: '      └ AppliedDiscount', y: 16 },
    ],
  },
  {
    name: 'Customer Hierarchy',
    color: '#8b5cf6',
    data: [
      { x: 'Customer', y: 25 },
      { x: '  └ Quotes', y: 20 },
    ],
  },
  {
    name: 'Rules Hierarchy',
    color: '#ec4899',
    data: [
      { x: 'Rule', y: 24 },
      { x: '  └ Condition (JSON)', y: 18 },
      { x: '  └ Action (JSON)', y: 18 },
    ],
  },
  {
    name: 'Discount Hierarchy',
    color: '#ef4444',
    data: [
      { x: 'Discount', y: 26 },
      { x: '  └ DiscountTier', y: 18 },
    ],
  },
])
</script>

<template>
  <div class="w-full">
    <ClientOnly>
      <ApexChart
        type="treemap"
        height="450"
        :options="chartOptions"
        :series="series"
      />
      <template #fallback>
        <div class="h-[350px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p class="text-gray-500">Loading chart...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
