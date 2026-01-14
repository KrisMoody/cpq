<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/controls/dist/style.css'

interface EntityData {
  name: string
  domain: string
  color: string
  attributes: string[]
  relationships: { target: string; type: '1:N' | 'N:1' | 'N:N'; label?: string }[]
  isCore?: boolean
}

const domains = {
  currency: { color: '#10b981', label: 'Currency' },
  units: { color: '#64748b', label: 'Units' },
  products: { color: '#3b82f6', label: 'Products' },
  categories: { color: '#22c55e', label: 'Categories' },
  attributes: { color: '#06b6d4', label: 'Attributes' },
  customers: { color: '#8b5cf6', label: 'Customers' },
  pricing: { color: '#14b8a6', label: 'Pricing' },
  quotes: { color: '#f59e0b', label: 'Quotes' },
  rules: { color: '#ec4899', label: 'Rules' },
  discounts: { color: '#ef4444', label: 'Discounts' },
  tax: { color: '#f97316', label: 'Tax' },
  guidedSelling: { color: '#6366f1', label: 'Guided Selling' },
}

const entities: Record<string, EntityData> = {
  // Currency
  Currency: { name: 'Currency', domain: 'currency', color: domains.currency.color, attributes: ['code', 'name', 'symbol', 'isBase'], relationships: [{ target: 'ExchangeRate', type: '1:N' }], isCore: true },
  ExchangeRate: { name: 'ExchangeRate', domain: 'currency', color: domains.currency.color, attributes: ['rate', 'effectiveDate'], relationships: [] },

  // Units
  UnitOfMeasure: { name: 'UnitOfMeasure', domain: 'units', color: domains.units.color, attributes: ['name', 'abbreviation', 'conversionFactor'], relationships: [] },

  // Products
  Product: { name: 'Product', domain: 'products', color: domains.products.color, attributes: ['name', 'sku', 'type', 'billingFrequency'], relationships: [{ target: 'ProductFeature', type: '1:N' }, { target: 'ProductAttribute', type: '1:N' }, { target: 'ProductCategory', type: '1:N' }], isCore: true },
  ProductFeature: { name: 'ProductFeature', domain: 'products', color: domains.products.color, attributes: ['name', 'minOptions', 'maxOptions'], relationships: [{ target: 'ProductOption', type: '1:N' }], isCore: true },
  ProductOption: { name: 'ProductOption', domain: 'products', color: domains.products.color, attributes: ['name', 'priceAdjustment'], relationships: [], isCore: true },
  ProductCategory: { name: 'ProductCategory', domain: 'products', color: domains.products.color, attributes: [], relationships: [] },
  ProductAttribute: { name: 'ProductAttribute', domain: 'products', color: domains.products.color, attributes: ['value'], relationships: [] },

  // Categories
  Category: { name: 'Category', domain: 'categories', color: domains.categories.color, attributes: ['name', 'parentId'], relationships: [{ target: 'ProductCategory', type: '1:N' }, { target: 'CategoryAttribute', type: '1:N' }], isCore: true },
  CategoryAttribute: { name: 'CategoryAttribute', domain: 'categories', color: domains.categories.color, attributes: [], relationships: [] },

  // Attributes
  AttributeGroup: { name: 'AttributeGroup', domain: 'attributes', color: domains.attributes.color, attributes: ['name', 'description'], relationships: [{ target: 'Attribute', type: '1:N' }] },
  Attribute: { name: 'Attribute', domain: 'attributes', color: domains.attributes.color, attributes: ['name', 'type', 'required'], relationships: [{ target: 'ProductAttribute', type: '1:N' }, { target: 'CategoryAttribute', type: '1:N' }], isCore: true },

  // Customers
  Customer: { name: 'Customer', domain: 'customers', color: domains.customers.color, attributes: ['name', 'email', 'company'], relationships: [{ target: 'Quote', type: '1:N' }, { target: 'Contract', type: '1:N' }], isCore: true },
  Contract: { name: 'Contract', domain: 'customers', color: domains.customers.color, attributes: ['name', 'status', 'startDate', 'endDate'], relationships: [{ target: 'ContractPriceEntry', type: '1:N' }], isCore: true },
  ContractPriceEntry: { name: 'ContractPriceEntry', domain: 'customers', color: domains.customers.color, attributes: ['fixedPrice'], relationships: [] },

  // Pricing
  PriceBook: { name: 'PriceBook', domain: 'pricing', color: domains.pricing.color, attributes: ['name', 'isDefault', 'currency'], relationships: [{ target: 'PriceBookEntry', type: '1:N' }], isCore: true },
  PriceBookEntry: { name: 'PriceBookEntry', domain: 'pricing', color: domains.pricing.color, attributes: ['listPrice', 'cost'], relationships: [{ target: 'PriceTier', type: '1:N' }], isCore: true },
  PriceTier: { name: 'PriceTier', domain: 'pricing', color: domains.pricing.color, attributes: ['minQty', 'maxQty', 'tierPrice'], relationships: [], isCore: true },

  // Quotes
  Quote: { name: 'Quote', domain: 'quotes', color: domains.quotes.color, attributes: ['status', 'subtotal', 'total'], relationships: [{ target: 'QuoteLineItem', type: '1:N' }, { target: 'AppliedDiscount', type: '1:N' }], isCore: true },
  QuoteLineItem: { name: 'QuoteLineItem', domain: 'quotes', color: domains.quotes.color, attributes: ['quantity', 'unitPrice', 'netPrice'], relationships: [{ target: 'AppliedDiscount', type: '1:N' }], isCore: true },
  AppliedDiscount: { name: 'AppliedDiscount', domain: 'quotes', color: domains.quotes.color, attributes: ['amount', 'appliedAt'], relationships: [] },

  // Rules
  Rule: { name: 'Rule', domain: 'rules', color: domains.rules.color, attributes: ['name', 'type', 'trigger', 'priority'], relationships: [], isCore: true },

  // Discounts
  Discount: { name: 'Discount', domain: 'discounts', color: domains.discounts.color, attributes: ['name', 'type', 'scope', 'value'], relationships: [{ target: 'DiscountTier', type: '1:N' }, { target: 'AppliedDiscount', type: '1:N' }], isCore: true },
  DiscountTier: { name: 'DiscountTier', domain: 'discounts', color: domains.discounts.color, attributes: ['minQty', 'value'], relationships: [], isCore: true },

  // Tax
  TaxRate: { name: 'TaxRate', domain: 'tax', color: domains.tax.color, attributes: ['name', 'rate', 'country', 'state'], relationships: [], isCore: true },

  // Guided Selling
  ProductAffinity: { name: 'ProductAffinity', domain: 'guidedSelling', color: domains.guidedSelling.color, attributes: ['affinityType', 'priority'], relationships: [] },
  Questionnaire: { name: 'Questionnaire', domain: 'guidedSelling', color: domains.guidedSelling.color, attributes: ['name', 'description'], relationships: [{ target: 'Question', type: '1:N' }] },
  Question: { name: 'Question', domain: 'guidedSelling', color: domains.guidedSelling.color, attributes: ['text', 'type', 'order'], relationships: [{ target: 'QuestionProductMapping', type: '1:N' }] },
  QuestionProductMapping: { name: 'QuestionProductMapping', domain: 'guidedSelling', color: domains.guidedSelling.color, attributes: ['answerValue', 'relevanceScore'], relationships: [] },
  RecommendationLog: { name: 'RecommendationLog', domain: 'guidedSelling', color: domains.guidedSelling.color, attributes: ['source', 'action', 'timestamp'], relationships: [] },
}

// Generate node positions in a grid layout grouped by domain
function generatePositions() {
  const positions: Record<string, { x: number; y: number }> = {}
  const domainGroups: Record<string, string[]> = {}

  for (const [name, entity] of Object.entries(entities)) {
    if (!domainGroups[entity.domain]) domainGroups[entity.domain] = []
    domainGroups[entity.domain]!.push(name)
  }

  const domainOrder = ['products', 'categories', 'attributes', 'pricing', 'quotes', 'customers', 'discounts', 'rules', 'tax', 'currency', 'units', 'guidedSelling']
  let col = 0
  const colWidth = 200
  const rowHeight = 100

  for (const domain of domainOrder) {
    const names = domainGroups[domain] || []
    let row = 0
    for (const name of names) {
      positions[name] = { x: col * colWidth, y: row * rowHeight }
      row++
    }
    if (names.length > 0) col++
  }

  return positions
}

const positions = generatePositions()

const showFull = ref(false)
const selectedEntity = ref<string | null>(null)
const searchQuery = ref('')
const visibleDomains = ref<string[]>(Object.keys(domains))

const selectedEntityData = computed(() => {
  if (!selectedEntity.value) return null
  return entities[selectedEntity.value] ?? null
})

const filteredEntities = computed(() => {
  return Object.entries(entities).filter(([name, entity]) => {
    // Filter by full/simplified mode
    if (!showFull.value && !entity.isCore) return false
    // Filter by visible domains
    if (!visibleDomains.value.includes(entity.domain)) return false
    // Filter by search
    if (searchQuery.value && !name.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    return true
  })
})

const nodes = computed(() => {
  return filteredEntities.value.map(([name, entity]) => ({
    id: name,
    type: 'entity',
    position: positions[name] || { x: 0, y: 0 },
    data: entity,
    style: {
      opacity: searchQuery.value && !name.toLowerCase().includes(searchQuery.value.toLowerCase()) ? 0.3 : 1,
    },
  }))
})

const edges = computed(() => {
  const result: { id: string; source: string; target: string; label?: string; animated?: boolean; style?: { stroke: string } }[] = []
  for (const [name, entity] of filteredEntities.value) {
    for (const rel of entity.relationships) {
      const targetExists = filteredEntities.value.some(([n]) => n === rel.target)
      if (targetExists) {
        result.push({
          id: `${name}-${rel.target}`,
          source: name,
          target: rel.target,
          label: rel.type,
          animated: false,
          style: { stroke: entity.color },
        })
      }
    }
  }
  return result
})

const { fitView } = useVueFlow()

function toggleDomain(domain: string) {
  const index = visibleDomains.value.indexOf(domain)
  if (index === -1) {
    visibleDomains.value.push(domain)
  }
  else {
    visibleDomains.value.splice(index, 1)
  }
}

function handleNodeClick(event: { node: { id: string } }) {
  selectedEntity.value = event.node.id
}

function closePanel() {
  selectedEntity.value = null
}

onMounted(() => {
  setTimeout(() => fitView(), 100)
})
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <div class="flex flex-wrap items-center gap-4">
      <div class="flex items-center gap-2">
        <UButton
          :variant="showFull ? 'solid' : 'outline'"
          size="sm"
          @click="showFull = !showFull"
        >
          {{ showFull ? 'Full (31)' : 'Simplified (18)' }}
        </UButton>
      </div>

      <UInput
        v-model="searchQuery"
        placeholder="Search entities..."
        icon="i-heroicons-magnifying-glass"
        size="sm"
        class="w-48"
      />

      <div class="flex flex-wrap gap-1">
        <button
          v-for="(domain, key) in domains"
          :key="key"
          class="px-2 py-1 text-xs rounded-full transition-colors"
          :class="visibleDomains.includes(key)
            ? 'text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500'"
          :style="visibleDomains.includes(key) ? { backgroundColor: domain.color } : {}"
          @click="toggleDomain(key)"
        >
          {{ domain.label }}
        </button>
      </div>
    </div>

    <!-- Diagram Container -->
    <div class="relative h-[500px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        :default-viewport="{ x: 50, y: 50, zoom: 0.8 }"
        :min-zoom="0.2"
        :max-zoom="2"
        fit-view-on-init
        @node-click="handleNodeClick"
      >
        <template #node-entity="{ data }">
          <div
            class="entity-node rounded-lg border-2 shadow-md p-2 min-w-[140px] bg-white dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
            :style="{ borderColor: data.color }"
          >
            <div class="font-semibold text-sm" :style="{ color: data.color }">
              {{ data.name }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {{ data.attributes.slice(0, 2).join(', ') }}
              <span v-if="data.attributes.length > 2">...</span>
            </div>
          </div>
        </template>

        <MiniMap class="!bg-white dark:!bg-gray-800" />
        <Controls />
      </VueFlow>

      <!-- Entity Detail Panel -->
      <Transition
        enter-active-class="transition-transform duration-200"
        leave-active-class="transition-transform duration-200"
        enter-from-class="translate-x-full"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="selectedEntity && selectedEntityData"
          class="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl p-4 overflow-y-auto"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold" :style="{ color: selectedEntityData.color }">
              {{ selectedEntity }}
            </h3>
            <UButton
              icon="i-heroicons-x-mark"
              variant="ghost"
              size="xs"
              @click="closePanel"
            />
          </div>

          <div class="space-y-4 text-sm">
            <div>
              <h4 class="font-medium text-gray-500 dark:text-gray-400 mb-1">Domain</h4>
              <span
                class="px-2 py-0.5 rounded-full text-xs text-white"
                :style="{ backgroundColor: selectedEntityData.color }"
              >
                {{ domains[selectedEntityData.domain as keyof typeof domains]?.label }}
              </span>
            </div>

            <div>
              <h4 class="font-medium text-gray-500 dark:text-gray-400 mb-1">Attributes</h4>
              <ul class="space-y-0.5">
                <li
                  v-for="attr in selectedEntityData.attributes"
                  :key="attr"
                  class="font-mono text-xs"
                >
                  {{ attr }}
                </li>
              </ul>
            </div>

            <div v-if="selectedEntityData.relationships.length > 0">
              <h4 class="font-medium text-gray-500 dark:text-gray-400 mb-1">Relationships</h4>
              <ul class="space-y-1">
                <li
                  v-for="rel in selectedEntityData.relationships"
                  :key="rel.target"
                  class="flex items-center gap-2 text-xs"
                >
                  <span class="text-gray-400">→</span>
                  <span class="font-medium">{{ rel.target }}</span>
                  <span class="text-gray-400">({{ rel.type }})</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap gap-3 text-xs">
      <div
        v-for="(domain, key) in domains"
        :key="key"
        class="flex items-center gap-1.5"
      >
        <div
          class="w-3 h-3 rounded"
          :style="{ backgroundColor: domain.color }"
        />
        <span class="text-gray-600 dark:text-gray-400">{{ domain.label }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.vue-flow__edge-text {
  font-size: 10px;
}
</style>
