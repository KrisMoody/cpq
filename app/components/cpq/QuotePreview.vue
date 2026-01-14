<script setup lang="ts">
import type { QuoteWithLineItems, QuoteLineItem, AppliedDiscount } from '~/composables/useQuotes'
import type { TaxBreakdownItem } from '~/composables/useTaxRates'

const props = defineProps<{
  quote: QuoteWithLineItems
}>()

const { formatPrice } = usePricing()

// Get currency for formatting
const currency = computed(() => props.quote.currency || null)

// Helper to format price with quote's currency
function formatQuotePrice(price: string | number): string {
  return formatPrice(price, currency.value)
}

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

// Extend product type to include unit of measure
interface ProductWithUnit {
  id: string
  name: string
  sku: string
  type: string
  unitOfMeasure?: { id: string; name: string; abbreviation: string } | null
}

// Flatten line items with proper nesting indication
interface DisplayLineItem extends Omit<QuoteLineItem, 'product'> {
  isChild: boolean
  parentName?: string
  product: ProductWithUnit
}

const displayLineItems = computed((): DisplayLineItem[] => {
  const items: DisplayLineItem[] = []

  for (const line of props.quote.lineItems) {
    // Add parent line
    items.push({ ...line, isChild: false })

    // Add child lines if present
    if (line.childLines && line.childLines.length > 0) {
      for (const child of line.childLines) {
        items.push({
          ...child,
          isChild: true,
          parentName: line.product.name,
        })
      }
    }
  }

  return items
})

const subtotalNum = computed(() => parseFloat(String(props.quote.subtotal)))
const discountTotalNum = computed(() => parseFloat(String(props.quote.discountTotal || 0)))
const taxAmountNum = computed(() => parseFloat(String(props.quote.taxAmount || 0)))
const totalNum = computed(() => parseFloat(String(props.quote.total)))

// Recurring metrics
const oneTimeTotalNum = computed(() => parseFloat(String((props.quote as any).oneTimeTotal || 0)))
const mrrNum = computed(() => parseFloat(String((props.quote as any).mrr || 0)))
const arrNum = computed(() => parseFloat(String((props.quote as any).arr || 0)))
const tcvNum = computed(() => parseFloat(String((props.quote as any).tcv || 0)))
const hasRecurringItems = computed(() => mrrNum.value > 0)

const taxBreakdown = computed((): TaxBreakdownItem[] => {
  return (props.quote.taxBreakdown as TaxBreakdownItem[]) || []
})

const isTaxExempt = computed(() => props.quote.customer?.isTaxExempt || false)

function formatTaxRate(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`
}

function formatBillingFrequency(frequency: string): string {
  const map: Record<string, string> = {
    'ONE_TIME': 'One-Time',
    'MONTHLY': 'Monthly',
    'QUARTERLY': 'Quarterly',
    'ANNUAL': 'Annual',
    'CUSTOM': 'Custom',
  }
  return map[frequency] || frequency
}
</script>

<template>
  <div class="quote-preview bg-white dark:bg-gray-900 min-h-screen">
    <!-- Document Container -->
    <div class="max-w-4xl mx-auto p-8 print:p-0 print:max-w-none">

      <!-- Header with Branding -->
      <header class="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-4">
          <!-- Company Logo Placeholder -->
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
            <UIcon name="i-heroicons-building-office-2" class="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Your Company Name</h1>
            <p class="text-sm text-gray-500">123 Business Street</p>
            <p class="text-sm text-gray-500">City, State 12345</p>
          </div>
        </div>
        <div class="text-right">
          <h2 class="text-2xl font-bold text-primary-600">QUOTE</h2>
          <p class="text-sm text-gray-500 mt-1">Quote #{{ quoteNumber }}</p>
        </div>
      </header>

      <!-- Quote Metadata Section -->
      <section class="grid grid-cols-2 gap-8 mb-8">
        <!-- Quote Information -->
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

        <!-- Customer Information -->
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

      <!-- Line Items Table -->
      <section class="mb-8">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Line Items</h3>
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Qty</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Unit Price</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Discount</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Net Price</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(item, index) in displayLineItems"
                :key="item.id"
                :class="[
                  'print:break-inside-avoid',
                  item.isChild ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-900'
                ]"
              >
                <td class="px-4 py-3">
                  <div :class="{ 'pl-6': item.isChild }">
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
                </td>
                <td class="px-4 py-3 text-center text-gray-900 dark:text-white">
                  {{ item.quantity }}
                  <span v-if="item.product.unitOfMeasure" class="text-gray-500 text-xs">
                    {{ item.product.unitOfMeasure.abbreviation }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right text-gray-900 dark:text-white">{{ formatQuotePrice(item.listPrice) }}</td>
                <td class="px-4 py-3 text-right">
                  <span v-if="parseFloat(String(item.discount)) > 0" class="text-red-500">
                    -{{ formatQuotePrice(item.discount) }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">{{ formatQuotePrice(item.netPrice) }}</td>
              </tr>
              <tr v-if="displayLineItems.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                  No line items in this quote
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Pricing Summary Section -->
      <section class="mb-8">
        <div class="flex justify-end">
          <div class="w-80">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <div class="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatQuotePrice(subtotalNum) }}</span>
              </div>

              <!-- Applied Discounts Breakdown -->
              <div v-if="quote.appliedDiscounts && quote.appliedDiscounts.length > 0" class="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
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

              <!-- Total Discount -->
              <div v-if="discountTotalNum > 0" class="flex justify-between text-red-500 border-t border-gray-200 dark:border-gray-700 pt-3">
                <span>Total Discount</span>
                <span class="font-medium">-{{ formatQuotePrice(discountTotalNum) }}</span>
              </div>

              <!-- Tax Section -->
              <div v-if="isTaxExempt" class="flex justify-between text-green-600 border-t border-gray-200 dark:border-gray-700 pt-3">
                <span class="flex items-center gap-1">
                  Tax Exempt
                </span>
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

              <div class="flex justify-between text-lg border-t-2 border-gray-300 dark:border-gray-600 pt-3">
                <span class="font-semibold text-gray-900 dark:text-white">Total</span>
                <span class="font-bold text-primary-600">{{ formatQuotePrice(totalNum) }}</span>
              </div>

              <!-- Recurring Revenue Metrics -->
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

      <!-- Terms and Conditions Section -->
      <section class="border-t border-gray-200 dark:border-gray-700 pt-6 print:break-inside-avoid">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Terms & Conditions</h3>
        <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p>1. This quote is valid until the expiration date indicated above.</p>
          <p>2. Prices are subject to change after the validity period.</p>
          <p>3. Payment terms: Net 30 days from invoice date.</p>
          <p>4. All prices are in {{ currency?.code || 'USD' }} unless otherwise specified.</p>
          <p>5. Delivery terms and timelines to be confirmed upon order placement.</p>
          <p class="text-xs text-gray-400 mt-4 italic">
            These terms and conditions are customizable. Contact your administrator to update the default terms.
          </p>
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
@media print {
  .quote-preview {
    background: white !important;
    color: black !important;
    font-size: 11pt;
  }

  /* Hide navigation and non-essential elements when printing */
  :deep(.no-print) {
    display: none !important;
  }

  /* Ensure page breaks don't occur in the middle of line items */
  tr {
    page-break-inside: avoid;
  }

  /* Ensure pricing summary stays together */
  section {
    page-break-inside: avoid;
  }

  /* Reset dark mode colors for print */
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
