<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'

const ApexChart = defineAsyncComponent(() =>
  import('vue3-apexcharts').then((m) => m.default)
)

// Detect mobile viewport
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const isMobile = computed(() => windowWidth.value < 640)

onMounted(() => {
  const handleResize = () => {
    windowWidth.value = window.innerWidth
  }
  window.addEventListener('resize', handleResize)
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})

// ASSERTION: vue3-apexcharts type definitions don't include 'treemap' but ApexCharts supports it
// See: https://apexcharts.com/docs/chart-types/treemap-chart/
const chartType = 'treemap'

const chartOptions = ref<ApexOptions>({
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
          3: 'Customer hierarchy: customers linked to their contracts and quotes',
          4: 'Category hierarchy: nested categories with self-referencing parent',
          5: 'Attribute hierarchy: grouped attributes assigned to products and categories',
          6: 'Currency hierarchy: currencies with exchange rates',
          7: 'Guided Selling hierarchy: questionnaires with questions and product mappings',
          8: 'Rules hierarchy: business rules with conditions and actions',
          9: 'Discount hierarchy: discount definitions with volume tiers',
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
    color: '#14b8a6',
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
      { x: '  └ Contract', y: 20 },
      { x: '      └ ContractPriceEntry', y: 15 },
      { x: '  └ Quote', y: 20 },
    ],
  },
  {
    name: 'Category Hierarchy',
    color: '#22c55e',
    data: [
      { x: 'Category', y: 24 },
      { x: '  └ Category (parent)', y: 18 },
      { x: '  └ CategoryAttribute', y: 16 },
    ],
  },
  {
    name: 'Attribute Hierarchy',
    color: '#06b6d4',
    data: [
      { x: 'AttributeGroup', y: 24 },
      { x: '  └ Attribute', y: 20 },
      { x: '      └ ProductAttribute', y: 15 },
      { x: '      └ CategoryAttribute', y: 15 },
    ],
  },
  {
    name: 'Currency Hierarchy',
    color: '#10b981',
    data: [
      { x: 'Currency', y: 22 },
      { x: '  └ ExchangeRate', y: 16 },
    ],
  },
  {
    name: 'Guided Selling',
    color: '#6366f1',
    data: [
      { x: 'Questionnaire', y: 24 },
      { x: '  └ Question', y: 20 },
      { x: '      └ QuestionProductMapping', y: 15 },
      { x: 'ProductAffinity', y: 18 },
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
  <div class="w-full space-y-4">
    <!-- Mobile notice -->
    <div class="md:hidden p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div class="flex items-start gap-3">
        <UIcon name="i-heroicons-device-phone-mobile" class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p class="text-sm font-medium text-blue-800 dark:text-blue-200">Best viewed on larger screens</p>
          <p class="text-xs text-blue-600 dark:text-blue-300 mt-1">This treemap visualization is easier to explore on tablet or desktop.</p>
        </div>
      </div>
    </div>

    <ClientOnly>
      <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
      <ApexChart
        :type="(chartType as any)"
        :height="isMobile ? 400 : 550"
        :options="chartOptions"
        :series="series"
      />
      <template #fallback>
        <div class="h-[350px] sm:h-[550px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p class="text-gray-500">Loading chart...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
