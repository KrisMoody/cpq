<script setup lang="ts">
interface GlossaryTerm {
  term: string
  definition: string
  example: string
  relatedTerms: string[]
  group: 'product' | 'pricing' | 'quote' | 'meta' | 'customer' | 'rules' | 'discount' | 'category'
  confusedWith?: string
  distinction?: string
}

const glossaryTerms: GlossaryTerm[] = [
  // === META GROUP ===
  {
    term: 'CPQ',
    group: 'meta',
    definition:
      'Configure, Price, Quote - a three-step sales workflow. First, configure a product to match customer needs. Second, calculate the price using price books and adjustments. Third, generate a quote document for the customer.',
    example: 'A sales rep configures a "Laptop Pro Bundle" with i7 CPU and 32GB RAM, the system looks up the list price ($1,299) and adds the RAM adjustment (+$200), then generates Quote #Q-2024-0042 showing $1,499 total.',
    relatedTerms: ['Configuration', 'Quote', 'List Price'],
  },

  // === PRODUCT GROUP ===
  {
    term: 'Product',
    group: 'product',
    definition:
      'The top-level sellable item in the catalog. Every product has a SKU and a type: STANDALONE (sold as-is, no choices) or BUNDLE (has features and options for customization). A Bundle is a type of Product.',
    example: '"USB-C Cable" (SKU: USB-001) is a STANDALONE product. "Laptop Pro Bundle" (SKU: LAP-PRO) is a BUNDLE product with configurable features.',
    relatedTerms: ['SKU', 'Bundle', 'Price Book Entry'],
    confusedWith: 'Bundle',
    distinction: 'Product is the parent concept. Bundle is a Product with type=BUNDLE that has Features and Options.',
  },
  {
    term: 'SKU',
    group: 'product',
    definition:
      'Stock Keeping Unit - a unique alphanumeric code that identifies a specific product in the catalog. Every Product MUST have exactly one SKU. SKUs enable inventory tracking, price lookups, and rule conditions.',
    example: '"LAP-PRO" is the SKU for "Laptop Pro Bundle". "USB-001" is the SKU for "USB-C Cable". When writing a rule condition, you can match by SKU: productSku equals "LAP-PRO".',
    relatedTerms: ['Product', 'Price Book Entry', 'Rule'],
    confusedWith: 'Product',
    distinction: 'SKU is the CODE (the identifier string). Product is the ENTITY (the full record with name, description, features, etc.).',
  },
  {
    term: 'Bundle',
    group: 'product',
    definition:
      'A Product with type=BUNDLE that requires configuration before purchase. Bundles contain Features (the categories of choice) and Options (the specific choices). Think: a Bundle asks questions, the customer picks answers.',
    example: '"Laptop Pro Bundle" has 3 Features: "Processor" (i5/i7/i9), "RAM" (16GB/32GB), "Storage" (256GB/512GB/1TB). Customer picks one Option from each Feature.',
    relatedTerms: ['Product', 'Feature', 'Option'],
    confusedWith: 'Product',
    distinction: 'A Bundle IS a Product (with type=BUNDLE). Not all Products are Bundles - STANDALONE products have no Features.',
  },
  {
    term: 'Feature',
    group: 'product',
    definition:
      'A category of choice within a Bundle - the QUESTION being asked. Each Feature has a name, belongs to one Bundle, and contains multiple Options. Features define min/max selections (e.g., "pick exactly 1" or "pick 0-3").',
    example: 'The "Laptop Pro Bundle" has a Feature called "RAM". This Feature has minOptions=1, maxOptions=1 (must pick exactly one). It contains Options: 16GB, 32GB.',
    relatedTerms: ['Bundle', 'Option'],
    confusedWith: 'Option',
    distinction: 'Feature is the QUESTION ("Which RAM?"). Option is the ANSWER ("32GB"). One Feature contains many Options.',
  },
  {
    term: 'Option',
    group: 'product',
    definition:
      'A specific choice within a Feature - the ANSWER to the question. Each Option references a Product (for pricing lookup) and can have a price adjustment. When selected, Options become part of the Configuration.',
    example: 'The "RAM" Feature has Options: "16GB" (no adjustment, $0) and "32GB" (+$200 adjustment). Both Options reference underlying products for price lookup.',
    relatedTerms: ['Feature', 'Price Adjustment', 'Configuration'],
    confusedWith: 'Feature',
    distinction: 'Option is the ANSWER ("32GB"). Feature is the QUESTION ("Which RAM?"). Options live inside Features.',
  },

  // === CATEGORY GROUP ===
  {
    term: 'Category',
    group: 'category',
    definition:
      'A hierarchical classification for organizing products in the catalog. Categories can have parent-child relationships forming a tree structure. Products can belong to multiple categories via a many-to-many relationship.',
    example: '"Hardware" is a root category with children "Processors", "Memory", and "Storage". A product like "Intel i7 CPU" belongs to the "Processors" category.',
    relatedTerms: ['Product', 'Product Category', 'Discount Scope'],
  },
  {
    term: 'Product Category',
    group: 'category',
    definition:
      'The junction record linking a Product to a Category. Enables many-to-many relationships where one product can be in multiple categories, and one category can contain multiple products.',
    example: 'A "USB-C Hub" product might be assigned to both "Accessories" and "Hardware" categories via two ProductCategory records.',
    relatedTerms: ['Category', 'Product'],
    confusedWith: 'Category',
    distinction: 'Category is the classification folder. Product Category is the assignment linking a specific product to that folder.',
  },
  {
    term: 'Category Hierarchy',
    group: 'category',
    definition:
      'The parent-child tree structure of categories. Root categories have no parent. Child categories reference a parentId. This enables browsing products by drilling down through nested categories.',
    example: 'Root: "Hardware" → Child: "Storage" → Child: "SSDs". When viewing "Hardware", you see its children. Category discounts can apply to all products in a branch.',
    relatedTerms: ['Category', 'Discount Scope'],
  },

  // === PRICING GROUP ===
  {
    term: 'Price Book',
    group: 'pricing',
    definition:
      'A named container that holds prices for products. Different price books serve different purposes: "Retail 2024" for consumers, "Partner" for resellers, "EMEA" for European pricing. Each Quote uses exactly one Price Book.',
    example: 'Price Book "Retail 2024" contains prices for all products. Price Book "Partner" has the same products at 20% lower prices. Quote #Q-2024-0042 uses "Retail 2024".',
    relatedTerms: ['Price Book Entry', 'Quote'],
    confusedWith: 'Price Book Entry',
    distinction: 'Price Book is the CONTAINER (the whole price list). Price Book Entry is ONE ROW in that container (one product\'s price).',
  },
  {
    term: 'Price Book Entry',
    group: 'pricing',
    definition:
      'A single row linking one Product to one Price Book, storing that product\'s List Price (and optionally Cost). One Product can have entries in multiple Price Books at different prices. The entry is WHERE the List Price lives.',
    example: '"Laptop Pro Bundle" has an entry in "Retail 2024" with List Price $1,299 and Cost $950. The same product has an entry in "Partner" with List Price $1,039.',
    relatedTerms: ['Price Book', 'List Price', 'Product'],
    confusedWith: 'List Price',
    distinction: 'Price Book Entry is the DATABASE ROW (product + price book + list price). List Price is the DOLLAR VALUE stored in that row.',
  },
  {
    term: 'List Price',
    group: 'pricing',
    definition:
      'The base dollar amount for a product, stored inside a Price Book Entry. This is the starting price BEFORE any Option adjustments or discounts are applied. "List" means the catalog/listed price.',
    example: 'The List Price of "Laptop Pro Bundle" is $1,299 (stored in the Price Book Entry). After selecting the +$200 RAM upgrade, the configured price becomes $1,499.',
    relatedTerms: ['Price Book Entry', 'Price Adjustment'],
    confusedWith: 'Price Book Entry',
    distinction: 'List Price is the NUMBER ($1,299). Price Book Entry is the RECORD that contains that number plus the product and price book references.',
  },
  {
    term: 'Price Adjustment',
    group: 'pricing',
    definition:
      'A positive or negative amount that modifies the List Price when an Option is selected. Premium options add (+), budget options may subtract (−). Adjustments stack: selecting multiple upgraded options adds all their adjustments.',
    example: 'List Price: $1,299. Select "32GB RAM": +$200 adjustment. Select "1TB Storage": +$250 adjustment. Final configured price: $1,749.',
    relatedTerms: ['Option', 'List Price'],
  },

  // === QUOTE GROUP ===
  {
    term: 'Quote',
    group: 'quote',
    definition:
      'The sales document sent to a customer listing what they\'re buying and the total price. Contains Quote Line Items (the rows). Has a lifecycle: Draft → Pending → Approved/Rejected. Uses one Price Book for all pricing.',
    example: 'Quote #Q-2024-0042 for "Acme Corp" using "Retail 2024" price book. Contains 2 line items. Total: $1,559. Status: Draft.',
    relatedTerms: ['Quote Line Item', 'Price Book'],
    confusedWith: 'Quote Line Item',
    distinction: 'Quote is the DOCUMENT (the whole thing). Quote Line Item is ONE ROW on that document (one product being purchased).',
  },
  {
    term: 'Quote Line Item',
    group: 'quote',
    definition:
      'A single row on a Quote representing one product being purchased. Stores: product reference, quantity, unit price, and subtotal. For Bundles, also stores the Configuration (which Options were selected).',
    example: 'Line 1: "Laptop Pro Bundle" × 1 @ $1,499 = $1,499 (with Configuration: i7, 32GB, 512GB). Line 2: "USB-C Cable" × 5 @ $12 = $60.',
    relatedTerms: ['Quote', 'Configuration', 'Product'],
    confusedWith: 'Configuration',
    distinction: 'Quote Line Item is the ROW (product, qty, price). Configuration is the OPTIONS DATA stored inside that row for bundles.',
  },
  {
    term: 'Configuration',
    group: 'quote',
    definition:
      'The saved record of which Options were selected when configuring a Bundle. Stored as JSON on the Quote Line Item. Captures the exact choices so the order can be fulfilled correctly.',
    example: 'Configuration for "Laptop Pro Bundle": {processor: "i7", ram: "32GB", storage: "512GB"}. This JSON is saved on the Quote Line Item.',
    relatedTerms: ['Bundle', 'Option', 'Quote Line Item'],
    confusedWith: 'Quote Line Item',
    distinction: 'Configuration is the OPTIONS DATA (the JSON of choices). Quote Line Item is the ROW that contains the configuration plus qty, price, etc.',
  },

  // === CUSTOMER GROUP ===
  {
    term: 'Customer',
    group: 'customer',
    definition:
      'A record representing a buyer with contact information (name, email, phone), optional company details, and an assigned Price Book for customer-specific pricing. Customers are linked to Quotes for tracking and reporting.',
    example: '"Acme Corp" (customer) has email sales@acme.com, is assigned to "Partner" price book (20% discount), and has 3 quotes totaling $45,000.',
    relatedTerms: ['Quote', 'Price Book'],
  },

  // === PRICING GROUP (continued) ===
  {
    term: 'Price Tier',
    group: 'pricing',
    definition:
      'A quantity-based price break within a Price Book Entry. Price Tiers enable volume pricing where unit cost decreases as quantity increases. Each tier specifies a quantity range and the price for that range.',
    example: 'PriceBookEntry for "USB-C Cable" in "Retail 2024" has tiers: $12/unit (1-9 qty), $10/unit (10-49 qty), $8/unit (50+ qty). Buying 25 cables uses the $10 tier.',
    relatedTerms: ['Price Book Entry', 'List Price'],
    confusedWith: 'Discount Tier',
    distinction: 'Price Tier sets the BASE PRICE at different quantities. Discount Tier applies a REDUCTION to that price. Price Tiers are in Price Book Entries; Discount Tiers are in Discounts.',
  },

  // === RULES GROUP ===
  {
    term: 'Rule',
    group: 'rules',
    definition:
      'A business rule that automates configuration validation or pricing adjustments. Rules have a type (CONFIGURATION or PRICING), a trigger event, a condition (when to fire), and an action (what to do). Rules are evaluated in priority order.',
    example: 'Rule "RAM requires SSD" (type: CONFIGURATION, trigger: ON_PRODUCT_ADD, priority: 100) checks if 32GB RAM is selected and requires SSD storage option.',
    relatedTerms: ['Rule Type', 'Rule Trigger'],
  },
  {
    term: 'Rule Type',
    group: 'rules',
    definition:
      'The category of rule: CONFIGURATION rules validate product combinations and enforce dependencies. PRICING rules adjust prices, apply automatic discounts, or flag quotes for approval.',
    example: 'CONFIGURATION rule: "Gaming GPU requires 750W PSU". PRICING rule: "Orders over $10,000 require manager approval".',
    relatedTerms: ['Rule', 'Rule Trigger'],
    confusedWith: 'Rule Trigger',
    distinction: 'Rule Type is WHAT the rule does (validate config vs adjust price). Rule Trigger is WHEN the rule runs (on add, on save, etc.).',
  },
  {
    term: 'Rule Trigger',
    group: 'rules',
    definition:
      'The event that causes a Rule to be evaluated: ON_PRODUCT_ADD (product added to quote), ON_QUANTITY_CHANGE (quantity updated), ON_QUOTE_SAVE (quote saved), ON_FINALIZE (quote finalized).',
    example: 'Rule with trigger ON_QUANTITY_CHANGE fires when user changes line item quantity from 5 to 10, recalculating volume discounts.',
    relatedTerms: ['Rule', 'Rule Type'],
    confusedWith: 'Rule Type',
    distinction: 'Rule Trigger is WHEN the rule fires (the event). Rule Type is WHAT it does (configuration vs pricing logic).',
  },

  // === DISCOUNT GROUP ===
  {
    term: 'Discount',
    group: 'discount',
    definition:
      'A reusable discount definition with a type (PERCENTAGE or FIXED_AMOUNT), scope (LINE_ITEM, QUOTE, or PRODUCT_CATEGORY), and optional validity period. Discounts can have tiers for volume-based reductions and can be stackable or exclusive.',
    example: 'Discount "Volume Savings" (type: PERCENTAGE, scope: LINE_ITEM, stackable: false) with tiers: 5% off at 10+ qty, 10% off at 50+ qty.',
    relatedTerms: ['Discount Type', 'Discount Scope', 'Discount Tier', 'Applied Discount'],
    confusedWith: 'Applied Discount',
    distinction: 'Discount is the TEMPLATE (the reusable definition). Applied Discount is the INSTANCE (a specific application to a quote/line).',
  },
  {
    term: 'Discount Type',
    group: 'discount',
    definition:
      'How the discount value is calculated: PERCENTAGE (e.g., 10% off the price) or FIXED_AMOUNT (e.g., $50 off). Percentage discounts scale with price; fixed amounts are constant.',
    example: 'PERCENTAGE: 15% off $1,000 = $150 savings. FIXED_AMOUNT: $50 off $1,000 = $50 savings (same $50 off $500 too).',
    relatedTerms: ['Discount', 'Discount Scope'],
  },
  {
    term: 'Discount Scope',
    group: 'discount',
    definition:
      'Where the discount applies: LINE_ITEM (to a single product line), QUOTE (to the entire order total), or PRODUCT_CATEGORY (to all products in a category).',
    example: 'LINE_ITEM scope: 10% off just the laptop. QUOTE scope: $100 off the entire order. PRODUCT_CATEGORY scope: 15% off all accessories.',
    relatedTerms: ['Discount', 'Discount Type'],
  },
  {
    term: 'Discount Tier',
    group: 'discount',
    definition:
      'A volume-based level within a Discount that increases savings at higher quantities. Each tier specifies a quantity range and the discount value for that range. Tiers are evaluated in order.',
    example: 'Discount "Bulk Buy" has tiers: Tier 1 (10-24 qty): 5% off, Tier 2 (25-49 qty): 10% off, Tier 3 (50+ qty): 15% off.',
    relatedTerms: ['Discount', 'Price Tier'],
    confusedWith: 'Price Tier',
    distinction: 'Discount Tier is a REDUCTION applied on top of the price. Price Tier is the BASE PRICE itself. Both are quantity-based but serve different purposes.',
  },
  {
    term: 'Applied Discount',
    group: 'discount',
    definition:
      'An instance of a Discount applied to a specific Quote or Quote Line Item. Records which discount was used, the calculated amount saved, and when/who applied it. Multiple Applied Discounts can exist on one quote.',
    example: 'Quote #Q-2024-0042 has Applied Discount: "Volume Savings" on Line 1, calculated amount: $149.90 (10% of $1,499). Applied by: System, at: 2024-01-15.',
    relatedTerms: ['Discount', 'Quote', 'Quote Line Item'],
    confusedWith: 'Discount',
    distinction: 'Applied Discount is the INSTANCE (specific to one quote/line with calculated amount). Discount is the TEMPLATE (the reusable definition).',
  },
]

const groupLabels: Record<GlossaryTerm['group'], string> = {
  meta: 'Overview',
  product: 'Product Terms',
  category: 'Category Terms',
  pricing: 'Pricing Terms',
  quote: 'Quote Terms',
  customer: 'Customer Terms',
  rules: 'Rules Terms',
  discount: 'Discount Terms',
}

const groupOrder: GlossaryTerm['group'][] = ['meta', 'product', 'category', 'pricing', 'quote', 'customer', 'rules', 'discount']

const searchQuery = ref('')
const compareMode = ref(false)
const selectedTerms = ref<string[]>([])
const highlightedTerm = ref<string | null>(null)

const filteredTerms = computed(() => {
  if (!searchQuery.value.trim()) return glossaryTerms
  const query = searchQuery.value.toLowerCase()
  return glossaryTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(query) ||
      t.definition.toLowerCase().includes(query) ||
      t.example.toLowerCase().includes(query) ||
      t.relatedTerms.some((rt) => rt.toLowerCase().includes(query))
  )
})

const groupedTerms = computed(() => {
  const groups: Record<GlossaryTerm['group'], GlossaryTerm[]> = {
    meta: [],
    product: [],
    category: [],
    pricing: [],
    quote: [],
    customer: [],
    rules: [],
    discount: [],
  }
  for (const term of filteredTerms.value) {
    groups[term.group].push(term)
  }
  return groups
})

const selectedTermsData = computed(() => {
  return glossaryTerms.filter((t) => selectedTerms.value.includes(t.term))
})

function toggleTermSelection(term: string) {
  const index = selectedTerms.value.indexOf(term)
  if (index === -1) {
    if (selectedTerms.value.length < 3) {
      selectedTerms.value.push(term)
    }
  } else {
    selectedTerms.value.splice(index, 1)
  }
}

function exitCompareMode() {
  compareMode.value = false
  selectedTerms.value = []
}

function scrollToTerm(term: string) {
  highlightedTerm.value = term
  const element = document.getElementById(`glossary-term-${term.toLowerCase().replace(/\s+/g, '-')}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => {
      highlightedTerm.value = null
    }, 2000)
  }
}

const activeTab = ref('diagram')
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold">Learn CPQ</h1>
      <p class="text-gray-500">
        Interactive glossary and concepts for Configure, Price, Quote systems
      </p>
    </div>

    <!-- CPQ Flow Diagram -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">CPQ Workflow Overview</h2>
      </template>
      <LearnCPQFlowDiagram />
    </UCard>

    <!-- Entity Relationship Visualizations -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="font-semibold">Data Model</h2>
          <div class="flex gap-2">
            <UButton
              :variant="activeTab === 'diagram' ? 'solid' : 'ghost'"
              size="sm"
              @click="activeTab = 'diagram'"
            >
              ER Diagram
            </UButton>
            <UButton
              :variant="activeTab === 'hierarchy' ? 'solid' : 'ghost'"
              size="sm"
              @click="activeTab = 'hierarchy'"
            >
              Hierarchy
            </UButton>
          </div>
        </div>
      </template>
      <LearnEntityDiagram v-if="activeTab === 'diagram'" />
      <LearnEntityHierarchy v-else />
    </UCard>

    <!-- Glossary -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Glossary</h2>
        <div class="flex items-center gap-3">
          <UButton
            v-if="!compareMode"
            variant="outline"
            size="sm"
            icon="i-heroicons-arrows-right-left"
            @click="compareMode = true"
          >
            Compare Terms
          </UButton>
          <UButton
            v-else
            variant="soft"
            color="error"
            size="sm"
            icon="i-heroicons-x-mark"
            @click="exitCompareMode"
          >
            Exit Compare
          </UButton>
          <UInput
            v-model="searchQuery"
            placeholder="Search terms..."
            icon="i-heroicons-magnifying-glass"
            class="w-64"
          />
        </div>
      </div>

      <!-- Compare mode hint -->
      <div v-if="compareMode && selectedTerms.length < 2" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
        Select 2-3 terms to compare them side-by-side. Click on the cards below to select.
        <span v-if="selectedTerms.length === 1" class="font-medium">({{ selectedTerms.length }}/3 selected)</span>
      </div>

      <!-- Comparison view -->
      <LearnGlossaryComparison
        v-if="compareMode && selectedTerms.length >= 2"
        :terms="selectedTermsData"
        @close="exitCompareMode"
      />

      <div v-if="filteredTerms.length === 0" class="text-center py-8 text-gray-500">
        No terms found matching "{{ searchQuery }}"
      </div>

      <!-- Grouped glossary terms -->
      <div v-else class="space-y-8">
        <div
          v-for="group in groupOrder"
          :key="group"
        >
          <template v-if="groupedTerms[group].length > 0">
            <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
              {{ groupLabels[group] }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <LearnGlossaryTerm
                v-for="item in groupedTerms[group]"
                :id="`glossary-term-${item.term.toLowerCase().replace(/\s+/g, '-')}`"
                :key="item.term"
                :term="item.term"
                :definition="item.definition"
                :example="item.example"
                :related-terms="item.relatedTerms"
                :confused-with="item.confusedWith"
                :distinction="item.distinction"
                :compare-mode="compareMode"
                :selected="selectedTerms.includes(item.term)"
                :highlighted="highlightedTerm === item.term"
                @toggle-select="toggleTermSelection(item.term)"
                @navigate-to-term="scrollToTerm"
              />
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Quick Tips -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">Quick Tips</h2>
      </template>

      <div class="space-y-4">
        <div class="flex gap-3">
          <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium">Start with Products</p>
            <p class="text-sm text-gray-500">
              Browse the product catalog to understand what's available. Pay attention to the
              difference between standalone products and configurable bundles.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium">Configure Bundles Carefully</p>
            <p class="text-sm text-gray-500">
              When adding a bundle to a quote, review each feature and its options. Some options
              have price adjustments that affect the final price.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium">Recalculate After Changes</p>
            <p class="text-sm text-gray-500">
              After adding or removing line items, use the "Recalculate Pricing" button to update
              the quote totals with the latest prices from the price book.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium">Quote Lifecycle</p>
            <p class="text-sm text-gray-500">
              Quotes start as Draft, can be submitted for approval (Pending), and then either
              Approved or Rejected. Only draft quotes can be edited.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium">Assign Customers to Quotes</p>
            <p class="text-sm text-gray-500">
              Link quotes to customer records for tracking and reporting. Customers can have assigned
              price books for automatic customer-specific pricing.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium">Configuration Rules</p>
            <p class="text-sm text-gray-500">
              Rules can enforce product dependencies (e.g., "32GB RAM requires SSD") and validate
              configurations automatically when products are added or changed.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium">Pricing Rules & Approvals</p>
            <p class="text-sm text-gray-500">
              Pricing rules can trigger approval workflows (e.g., orders over $10,000 require manager
              approval) or apply automatic adjustments based on conditions.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <UIcon name="i-heroicons-receipt-percent" class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium">Discount Types</p>
            <p class="text-sm text-gray-500">
              Use percentage discounts for proportional savings that scale with price, or fixed-amount
              discounts for consistent dollar-off promotions regardless of order size.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <UIcon name="i-heroicons-squares-plus" class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium">Discount Stacking</p>
            <p class="text-sm text-gray-500">
              Check if discounts are stackable before applying multiple. Non-stackable discounts are
              exclusive; stackable discounts combine. Priority determines application order.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <UIcon name="i-heroicons-code-bracket" class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium">Naming Conventions</p>
            <p class="text-sm text-gray-500">
              Prisma enums use SCREAMING_CASE (e.g., QUOTE, LINE_ITEM, PERCENTAGE). JavaScript
              field names use camelCase (e.g., quoteTotal, lineTotal). UI labels may be the same
              (like "Quote Total") even when underlying values differ.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <UIcon name="i-heroicons-folder" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium">Organize with Categories</p>
            <p class="text-sm text-gray-500">
              Use hierarchical categories to organize your product catalog. Products can belong to
              multiple categories. Category-scoped discounts apply to all products within a category.
            </p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
