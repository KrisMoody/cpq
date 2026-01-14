<script setup lang="ts">
import type { QuoteWithLineItems, QuoteLineItem } from '~/composables/useQuotes'
import type { TaxBreakdownItem } from '~/composables/useTaxRates'
import type {
  QuoteLayout,
  QuoteLayoutSection,
  LayoutColumn,
} from '~/types/quote-layout'
import {
  DEFAULT_SUMMARY_CONFIG,
  DEFAULT_THEME,
  createDefaultSection,
} from '~/types/quote-layout'

const props = defineProps<{
  quote: QuoteWithLineItems
  layout?: QuoteLayout | null
}>()

const { formatPrice } = usePricing()

// Get currency for formatting
const currency = computed(() => props.quote.currency || null)

function formatQuotePrice(price: string | number): string {
  return formatPrice(price, currency.value)
}

// Resolve layout - use provided layout or create a default one
const resolvedLayout = computed(() => {
  if (props.layout) {
    return props.layout
  }
  // Create default layout if none provided
  return {
    id: 'default',
    entityId: 'default',
    name: 'Default Layout',
    isTemplate: false,
    sections: [createDefaultSection('main', 'Products')],
    summaryConfig: { ...DEFAULT_SUMMARY_CONFIG },
    theme: { ...DEFAULT_THEME },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as QuoteLayout
})

// Extended line item type with unit info
interface ExtendedLineItem extends QuoteLineItem {
  isChild: boolean
  parentName?: string
  product: QuoteLineItem['product'] & {
    unitOfMeasure?: { id: string; name: string; abbreviation: string } | null
    billingFrequency?: string
    categories?: { category: { id: string; name: string } }[]
  }
}

// Flatten line items with child lines
const flattenedLineItems = computed((): ExtendedLineItem[] => {
  const items: ExtendedLineItem[] = []

  for (const line of props.quote.lineItems) {
    items.push({ ...line, isChild: false } as ExtendedLineItem)

    if (line.childLines && line.childLines.length > 0) {
      for (const child of line.childLines) {
        items.push({
          ...child,
          isChild: true,
          parentName: line.product.name,
        } as ExtendedLineItem)
      }
    }
  }

  return items
})

// Filter line items for a section
function filterLineItemsForSection(section: QuoteLayoutSection): ExtendedLineItem[] {
  const filter = section.filter

  // No filter or 'all' type - return all items
  if (!filter || filter.type === 'all') {
    return flattenedLineItems.value
  }

  return flattenedLineItems.value.filter((item) => {
    if (filter.type === 'productType' && filter.productTypes?.length) {
      return filter.productTypes.includes(item.product.type)
    }

    if (filter.type === 'category' && filter.categoryIds?.length) {
      const itemCategoryIds = item.product.categories?.map((c) => c.category.id) || []
      return filter.categoryIds.some((catId) => itemCategoryIds.includes(catId))
    }

    return true
  })
}

// Calculate section subtotal
function calculateSectionSubtotal(items: ExtendedLineItem[]): number {
  return items.reduce((sum, item) => sum + parseFloat(String(item.netPrice)) * item.quantity, 0)
}

// Get column value for a line item
function getColumnValue(item: ExtendedLineItem, column: LayoutColumn): string {
  switch (column.field) {
    case 'productName':
      return item.product.name
    case 'sku':
      return item.product.sku
    case 'description':
      return (item.product as any).description || ''
    case 'quantity':
      return String(item.quantity)
    case 'unitPrice':
      return formatQuotePrice(item.listPrice)
    case 'discount': {
      const discountVal = parseFloat(String(item.discount))
      return discountVal > 0 ? `-${formatQuotePrice(item.discount)}` : '-'
    }
    case 'netPrice':
      return formatQuotePrice(item.netPrice)
    case 'unit':
      return item.product.unitOfMeasure?.abbreviation || ''
    default:
      return ''
  }
}

// Get column header
function getColumnHeader(column: LayoutColumn): string {
  if (column.label) return column.label

  const defaults: Record<string, string> = {
    productName: 'Product',
    sku: 'SKU',
    description: 'Description',
    quantity: 'Qty',
    unitPrice: 'Unit Price',
    discount: 'Discount',
    netPrice: 'Net Price',
    unit: 'Unit',
  }

  return defaults[column.field] || column.field
}

// Theme-based styles
const themeStyles = computed(() => {
  const theme = resolvedLayout.value.theme
  return {
    '--primary-color': theme.primaryColor,
    '--secondary-color': theme.secondaryColor,
    '--font-family': theme.fontFamily,
  }
})

const headerClass = computed(() => {
  const style = resolvedLayout.value.theme.headerStyle
  return {
    'header-simple': style === 'simple',
    'header-branded': style === 'branded',
    'header-minimal': style === 'minimal',
  }
})

// Summary values
const subtotalNum = computed(() => parseFloat(String(props.quote.subtotal)))
const discountTotalNum = computed(() => parseFloat(String(props.quote.discountTotal || 0)))
const taxAmountNum = computed(() => parseFloat(String(props.quote.taxAmount || 0)))
const totalNum = computed(() => parseFloat(String(props.quote.total)))
const taxBreakdown = computed((): TaxBreakdownItem[] => {
  return (props.quote.taxBreakdown as TaxBreakdownItem[]) || []
})
const isTaxExempt = computed(() => props.quote.customer?.isTaxExempt || false)

// Recurring metrics
const oneTimeTotalNum = computed(() => parseFloat(String((props.quote as any).oneTimeTotal || 0)))
const mrrNum = computed(() => parseFloat(String((props.quote as any).mrr || 0)))
const arrNum = computed(() => parseFloat(String((props.quote as any).arr || 0)))
const tcvNum = computed(() => parseFloat(String((props.quote as any).tcv || 0)))
const hasRecurringItems = computed(() => mrrNum.value > 0)

function formatTaxRate(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`
}

// Quote metadata
const quoteNumber = computed(() => props.quote.id.slice(0, 8).toUpperCase())

const formattedValidFrom = computed(() => {
  return new Date(props.quote.validFrom).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const formattedValidTo = computed(() => {
  return new Date(props.quote.validTo).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const formattedCreatedAt = computed(() => {
  return new Date(props.quote.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// Summary config
const summaryConfig = computed(() => resolvedLayout.value.summaryConfig)
</script>

<template>
  <div
    class="quote-renderer bg-white dark:bg-gray-900 min-h-screen"
    :style="themeStyles"
  >
    <div class="max-w-4xl mx-auto p-8 print:p-0 print:max-w-none">
      <!-- Header -->
      <header
        class="flex items-start justify-between mb-8 pb-6 border-b-2"
        :class="headerClass"
        :style="{ borderColor: resolvedLayout.theme.primaryColor }"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-lg flex items-center justify-center border-2 border-dashed"
            :style="{ borderColor: resolvedLayout.theme.secondaryColor }"
          >
            <UIcon name="i-heroicons-building-office-2" class="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Your Company Name</h1>
            <p class="text-sm text-gray-500">123 Business Street</p>
            <p class="text-sm text-gray-500">City, State 12345</p>
          </div>
        </div>
        <div class="text-right">
          <h2
            class="text-2xl font-bold"
            :style="{ color: resolvedLayout.theme.primaryColor }"
          >
            QUOTE
          </h2>
          <p class="text-sm text-gray-500 mt-1">Quote #{{ quoteNumber }}</p>
        </div>
      </header>

      <!-- Quote Metadata -->
      <section class="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quote Details</h3>
          <dl class="space-y-2">
            <div class="flex justify-between">
              <dt class="text-gray-500">Quote Name:</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ quote.name }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Created:</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ formattedCreatedAt }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Valid From:</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ formattedValidFrom }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Valid Until:</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ formattedValidTo }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Price Book:</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ quote.priceBook.name }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Status:</dt>
              <dd>
                <UBadge
                  :color="quote.status === 'APPROVED' ? 'success' : quote.status === 'DRAFT' ? 'warning' : 'info'"
                  variant="subtle"
                  size="sm"
                >
                  {{ quote.status }}
                </UBadge>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Customer</h3>
          <div v-if="quote.customer" class="space-y-1">
            <p class="font-semibold text-gray-900 dark:text-white text-lg">{{ quote.customer.name }}</p>
            <p v-if="quote.customer.company" class="text-gray-600 dark:text-gray-400">{{ quote.customer.company }}</p>
          </div>
          <div v-else class="text-gray-500 italic">
            No customer assigned
          </div>
        </div>
      </section>

      <!-- Sections -->
      <section
        v-for="section in resolvedLayout.sections"
        :key="section.id"
        class="mb-8"
      >
        <h3
          class="text-sm font-semibold uppercase tracking-wide mb-3"
          :style="{ color: resolvedLayout.theme.primaryColor }"
        >
          {{ section.name }}
        </h3>
        <p
          v-if="section.description"
          class="text-sm text-gray-500 mb-3"
        >
          {{ section.description }}
        </p>

        <div
          class="rounded-lg overflow-hidden"
          :class="{ 'border border-gray-200 dark:border-gray-700': resolvedLayout.theme.tableBorders }"
        >
          <table class="w-full">
            <thead
              class="bg-gray-50 dark:bg-gray-800"
              :style="resolvedLayout.theme.headerStyle === 'branded' ? { backgroundColor: resolvedLayout.theme.primaryColor + '15' } : {}"
            >
              <tr>
                <th
                  v-for="column in section.columns"
                  :key="column.field"
                  class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  :class="{
                    'text-left': column.align === 'left' || !column.align,
                    'text-center': column.align === 'center',
                    'text-right': column.align === 'right',
                  }"
                  :style="column.width ? { width: column.width } : {}"
                >
                  {{ getColumnHeader(column) }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(item, index) in filterLineItemsForSection(section)"
                :key="item.id"
                class="print:break-inside-avoid"
                :class="[
                  item.isChild ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-900',
                  resolvedLayout.theme.alternateRowColors && index % 2 === 1 && !item.isChild ? 'bg-gray-50 dark:bg-gray-800/30' : ''
                ]"
              >
                <td
                  v-for="column in section.columns"
                  :key="column.field"
                  class="px-4 py-3"
                  :class="{
                    'text-left': column.align === 'left' || !column.align,
                    'text-center': column.align === 'center',
                    'text-right': column.align === 'right',
                  }"
                >
                  <div v-if="column.field === 'productName'" :class="{ 'pl-6': item.isChild }">
                    <div class="flex items-center gap-2">
                      <UIcon
                        v-if="item.isChild"
                        name="i-heroicons-arrow-turn-down-right"
                        class="w-4 h-4 text-gray-400 flex-shrink-0"
                      />
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{ item.product.name }}</p>
                        <p class="text-xs text-gray-500">{{ item.product.sku }}</p>
                      </div>
                    </div>
                  </div>
                  <span
                    v-else
                    :class="{
                      'font-medium text-gray-900 dark:text-white': column.field === 'netPrice',
                      'text-red-500': column.field === 'discount' && parseFloat(String(item.discount)) > 0,
                      'text-gray-400': column.field === 'discount' && parseFloat(String(item.discount)) === 0,
                      'text-gray-900 dark:text-white': !['netPrice', 'discount'].includes(column.field),
                    }"
                  >
                    {{ getColumnValue(item, column) }}
                  </span>
                </td>
              </tr>
              <tr v-if="filterLineItemsForSection(section).length === 0">
                <td
                  :colspan="section.columns.length"
                  class="px-4 py-8 text-center text-gray-500"
                >
                  No items in this section
                </td>
              </tr>
            </tbody>
            <tfoot v-if="section.showSubtotal && filterLineItemsForSection(section).length > 0">
              <tr class="bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700">
                <td
                  :colspan="section.columns.length - 1"
                  class="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300"
                >
                  Section Subtotal
                </td>
                <td class="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                  {{ formatQuotePrice(calculateSectionSubtotal(filterLineItemsForSection(section))) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <!-- Pricing Summary -->
      <section class="mb-8">
        <div class="flex justify-end">
          <div class="w-80">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <div v-if="summaryConfig.showSubtotal" class="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatQuotePrice(subtotalNum) }}</span>
              </div>

              <!-- Discounts -->
              <template v-if="summaryConfig.showDiscounts && quote.appliedDiscounts?.length">
                <div class="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p class="text-xs font-semibold text-gray-500 uppercase">Discounts Applied</p>
                  <div
                    v-for="discount in quote.appliedDiscounts"
                    :key="discount.id"
                    class="flex justify-between text-sm"
                  >
                    <span class="text-gray-600 dark:text-gray-400 truncate max-w-[60%]">
                      {{ discount.discount?.name || 'Manual Discount' }}
                      <span class="text-xs text-gray-400">
                        ({{ discount.type === 'PERCENTAGE' ? `${discount.value}%` : 'Fixed' }})
                      </span>
                    </span>
                    <span class="text-red-500">-{{ formatQuotePrice(discount.calculatedAmount) }}</span>
                  </div>
                </div>

                <div v-if="discountTotalNum > 0" class="flex justify-between text-red-500 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span>Total Discount</span>
                  <span class="font-medium">-{{ formatQuotePrice(discountTotalNum) }}</span>
                </div>
              </template>

              <!-- Taxes -->
              <template v-if="summaryConfig.showTaxes">
                <div v-if="isTaxExempt" class="flex justify-between text-green-600 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span>Tax Exempt</span>
                  <span class="font-medium">{{ formatQuotePrice(0) }}</span>
                </div>

                <div v-else-if="taxBreakdown.length > 0" class="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p class="text-xs font-semibold text-gray-500 uppercase">Tax</p>
                  <div
                    v-for="(tax, index) in taxBreakdown"
                    :key="index"
                    class="flex justify-between text-sm"
                  >
                    <span class="text-gray-600 dark:text-gray-400">
                      {{ tax.name }}
                      <span class="text-xs text-gray-400">({{ formatTaxRate(tax.rate) }})</span>
                    </span>
                    <span class="text-gray-900 dark:text-white">{{ formatQuotePrice(tax.amount) }}</span>
                  </div>
                </div>

                <div v-else-if="taxAmountNum > 0" class="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span class="text-gray-600 dark:text-gray-400">Tax</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatQuotePrice(taxAmountNum) }}</span>
                </div>
              </template>

              <!-- Total -->
              <div
                v-if="summaryConfig.showTotal"
                class="flex justify-between text-lg border-t-2 border-gray-300 dark:border-gray-600 pt-3"
              >
                <span class="font-semibold text-gray-900 dark:text-white">Total</span>
                <span
                  class="font-bold"
                  :style="{ color: resolvedLayout.theme.primaryColor }"
                >
                  {{ formatQuotePrice(totalNum) }}
                </span>
              </div>

              <!-- Recurring Revenue -->
              <div v-if="hasRecurringItems" class="space-y-2 border-t-2 border-blue-300 dark:border-blue-700 pt-3 mt-3">
                <p class="text-xs font-semibold text-blue-600 uppercase">Recurring Revenue</p>

                <div v-if="oneTimeTotalNum > 0" class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">One-Time Charges</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatQuotePrice(oneTimeTotalNum) }}</span>
                </div>

                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">MRR (Monthly)</span>
                  <span class="font-medium text-blue-600">{{ formatQuotePrice(mrrNum) }}/mo</span>
                </div>

                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">ARR (Annual)</span>
                  <span class="font-medium text-blue-600">{{ formatQuotePrice(arrNum) }}/yr</span>
                </div>

                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Total Contract Value</span>
                  <span class="font-bold text-green-600">{{ formatQuotePrice(tcvNum) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Terms and Conditions -->
      <section class="border-t border-gray-200 dark:border-gray-700 pt-6 print:break-inside-avoid">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Terms & Conditions</h3>
        <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p>1. This quote is valid until the expiration date indicated above.</p>
          <p>2. Prices are subject to change after the validity period.</p>
          <p>3. Payment terms: Net 30 days from invoice date.</p>
          <p>4. All prices are in {{ currency?.code || 'USD' }} unless otherwise specified.</p>
          <p>5. Delivery terms and timelines to be confirmed upon order placement.</p>
        </div>
      </section>

      <!-- Footer -->
      <footer class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-400 print:mt-auto">
        <p>Generated on {{ new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
        <p class="mt-1">Thank you for your business!</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.quote-renderer {
  font-family: var(--font-family);
}

.header-simple {
  border-color: var(--primary-color);
}

.header-branded {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: none !important;
}

.header-branded h1,
.header-branded h2,
.header-branded p {
  color: white !important;
}

.header-minimal {
  border-width: 1px;
  border-color: var(--secondary-color);
}

@media print {
  .quote-renderer {
    background: white !important;
    color: black !important;
    font-size: 11pt;
  }

  tr {
    page-break-inside: avoid;
  }

  section {
    page-break-inside: avoid;
  }

  .dark\:bg-gray-900 {
    background: white !important;
  }

  .dark\:bg-gray-800 {
    background: #f9fafb !important;
  }

  .dark\:text-white {
    color: #111827 !important;
  }

  .dark\:text-gray-400 {
    color: #6b7280 !important;
  }

  .dark\:border-gray-700 {
    border-color: #e5e7eb !important;
  }
}
</style>
