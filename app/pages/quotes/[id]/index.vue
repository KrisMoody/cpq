<script setup lang="ts">
import type { QuoteWithLineItems, EvaluationSummary } from '~/composables/useQuotes'
import type { Customer } from '~/composables/useCustomers'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const {
  fetchQuote,
  updateQuote,
  addLineItem,
  removeLineItem,
  updateLineItem,
  calculateQuote,
  removeDiscount,
  submitQuote,
  approveQuote,
  rejectQuote,
  deleteQuote,
} = useQuotes()
const { products, fetchProducts } = useProducts()
const { formatPrice } = usePricing()

const quote = ref<QuoteWithLineItems | null>(null)
const evaluation = ref<EvaluationSummary | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const calculating = ref(false)

// Add product modal
const showAddProduct = ref(false)
const selectedProductId = ref('')
const productQuantity = ref(1)
const addingProduct = ref(false)

// Customer selection modal
const showCustomerSelector = ref(false)

// Discount modals
const showApplyDiscount = ref(false)
const showManualDiscount = ref(false)
const discountTargetLineId = ref<string | undefined>(undefined)

onMounted(async () => {
  await Promise.all([loadQuote(), fetchProducts()])
})

async function loadQuote() {
  const id = route.params.id as string
  loading.value = true
  try {
    quote.value = await fetchQuote(id)
    if (!quote.value) {
      error.value = 'Quote not found'
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load quote'
  } finally {
    loading.value = false
  }
}

async function handleCalculate() {
  if (!quote.value) return
  calculating.value = true
  try {
    const result = await calculateQuote(quote.value.id)
    if (result) {
      quote.value = result.quote
      evaluation.value = result.evaluation
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to calculate quote'
  } finally {
    calculating.value = false
  }
}

async function handleAddProduct() {
  if (!quote.value || !selectedProductId.value) return

  addingProduct.value = true
  try {
    await addLineItem(quote.value.id, {
      productId: selectedProductId.value,
      quantity: productQuantity.value,
    })
    await loadQuote()
    showAddProduct.value = false
    selectedProductId.value = ''
    productQuantity.value = 1
  } catch (e: any) {
    error.value = e.message || 'Failed to add product'
  } finally {
    addingProduct.value = false
  }
}

async function handleRemoveLine(lineId: string) {
  if (!quote.value) return
  try {
    await removeLineItem(quote.value.id, lineId)
    await loadQuote()
  } catch (e: any) {
    error.value = e.message || 'Failed to remove line item'
  }
}

async function handleUpdateQuantity(lineId: string, quantity: number) {
  if (!quote.value) return
  try {
    const result = await updateLineItem(quote.value.id, lineId, { quantity })
    if (result) {
      quote.value = result
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to update quantity'
  }
}

async function handleCustomerSelect(customer: Customer | null) {
  if (!quote.value) return
  try {
    await updateQuote(quote.value.id, { customerId: customer?.id ?? null })
    await loadQuote()
    showCustomerSelector.value = false
  } catch (e: any) {
    error.value = e.message || 'Failed to update customer'
  }
}

function openApplyDiscount(lineItemId?: string) {
  discountTargetLineId.value = lineItemId
  showApplyDiscount.value = true
}

function openManualDiscount(lineItemId?: string) {
  discountTargetLineId.value = lineItemId
  showManualDiscount.value = true
}

async function handleDiscountApplied() {
  await loadQuote()
}

async function handleRemoveDiscount(appliedDiscountId: string) {
  if (!quote.value) return
  try {
    const result = await removeDiscount(quote.value.id, appliedDiscountId)
    if (result) {
      quote.value = result
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to remove discount'
  }
}

async function handleSubmit() {
  if (!quote.value) return
  try {
    await submitQuote(quote.value.id)
    await loadQuote()
  } catch (e: any) {
    error.value = e.message || 'Failed to submit quote'
  }
}

async function handleApprove() {
  if (!quote.value) return
  try {
    await approveQuote(quote.value.id, 'Current User')
    await loadQuote()
  } catch (e: any) {
    error.value = e.message || 'Failed to approve quote'
  }
}

async function handleReject(reason: string) {
  if (!quote.value) return
  try {
    await rejectQuote(quote.value.id)
    await loadQuote()
  } catch (e: any) {
    error.value = e.message || 'Failed to reject quote'
  }
}

async function handleDelete() {
  if (!quote.value) return
  if (!confirm(`Are you sure you want to delete "${quote.value.name}"? This action cannot be undone.`)) return

  const success = await deleteQuote(quote.value.id)
  if (success) {
    toast.add({ title: 'Quote deleted', color: 'success' })
    router.push('/quotes')
  } else {
    toast.add({ title: 'Failed to delete quote', color: 'error' })
  }
}

const canDelete = computed(() => {
  if (!quote.value) return false
  return !['FINALIZED', 'ACCEPTED', 'CANCELLED'].includes(quote.value.status)
})

const statusColor = computed(() => {
  switch (quote.value?.status) {
    case 'DRAFT':
      return 'warning'
    case 'PENDING':
    case 'PENDING_APPROVAL':
      return 'info'
    case 'APPROVED':
      return 'success'
    case 'REJECTED':
      return 'error'
    case 'CANCELLED':
      return 'neutral'
    default:
      return 'neutral'
  }
})

const isEditable = computed(() => quote.value?.status === 'DRAFT')

const availableProducts = computed(() => {
  return products.value.map((p) => ({
    label: `${p.name} (${p.sku})`,
    value: p.id,
  }))
})

const quoteSubtotal = computed(() => {
  return quote.value ? parseFloat(String(quote.value.subtotal)) : 0
})
</script>

<template>
  <div>
    <UButton
      to="/quotes"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Quotes
    </UButton>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error -->
    <UAlert v-else-if="error && !quote" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Quote Editor -->
    <div v-else-if="quote" class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold">{{ quote.name }}</h1>
          <p class="text-gray-500 text-sm mt-1">
            Created {{ new Date(quote.createdAt).toLocaleDateString() }}
          </p>
        </div>

        <div class="flex items-center gap-3">
          <UButton
            v-if="canDelete"
            variant="ghost"
            color="error"
            icon="i-heroicons-trash"
            @click="handleDelete"
          >
            Delete
          </UButton>
          <UButton
            :to="`/quotes/${quote.id}/preview`"
            variant="soft"
            icon="i-heroicons-eye"
          >
            Preview
          </UButton>
          <UBadge :color="statusColor" variant="subtle" size="lg">
            {{ quote.status }}
          </UBadge>
        </div>
      </div>

      <!-- Error Alert -->
      <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" closable @close="error = null">
        <template #description>{{ error }}</template>
      </UAlert>

      <!-- Approval Banner -->
      <CpqQuoteApprovalBanner
        :quote="quote"
        :approval-reasons="evaluation?.approvalReasons"
        @submit="handleSubmit"
        @approve="handleApprove"
        @reject="handleReject"
      />

      <!-- Quote Details -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Line Items -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Contract Pricing Banner -->
          <UAlert
            v-if="evaluation?.contractPricing"
            color="info"
            icon="i-heroicons-document-check"
          >
            <template #title>Contract Pricing Active</template>
            <template #description>
              <NuxtLink
                :to="`/contracts/${evaluation.contractPricing.contractId}`"
                class="font-medium underline hover:text-primary-700"
              >
                {{ evaluation.contractPricing.contractName }}
              </NuxtLink>
              is applying contract pricing to {{ Object.keys(evaluation.contractPricing.lineItems).length }} line item(s).
            </template>
          </UAlert>

          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="font-semibold">Line Items</h2>
                <UButton
                  v-if="isEditable"
                  size="sm"
                  variant="soft"
                  icon="i-heroicons-plus"
                  @click="showAddProduct = true"
                >
                  Add Product
                </UButton>
              </div>
            </template>

            <div v-if="quote.lineItems.length === 0" class="text-center py-8 text-gray-500">
              No line items yet. Add products to this quote.
            </div>

            <div v-else class="space-y-3">
              <CpqQuoteLineItem
                v-for="line in quote.lineItems"
                :key="line.id"
                :line-item="line"
                :editable="isEditable"
                :contract-info="evaluation?.contractPricing?.lineItems?.[line.id]"
                @remove="handleRemoveLine"
                @update-quantity="handleUpdateQuantity"
                @apply-discount="openApplyDiscount"
              />
            </div>
          </UCard>

          <!-- Rules Panel -->
          <CpqQuoteRulesPanel :evaluation="evaluation" />
        </div>

        <!-- Right Column -->
        <div class="space-y-4">
          <!-- Customer Card -->
          <CpqQuoteCustomerCard
            :customer="quote.customer || null"
            :price-book="quote.priceBook"
            :editable="isEditable"
            @change-customer="showCustomerSelector = true"
          />

          <!-- Discounts Card -->
          <CpqQuoteDiscountsCard
            :applied-discounts="quote.appliedDiscounts || []"
            :editable="isEditable"
            @apply-discount="openApplyDiscount()"
            @apply-manual-discount="openManualDiscount()"
            @remove-discount="handleRemoveDiscount"
          />

          <!-- Pricing Summary -->
          <CpqPricingSummary
            :subtotal="quote.subtotal"
            :discount-total="quote.discountTotal"
            :tax-amount="quote.taxAmount"
            :tax-breakdown="quote.taxBreakdown"
            :total="quote.total"
            :one-time-total="(quote as any).oneTimeTotal"
            :mrr="(quote as any).mrr"
            :arr="(quote as any).arr"
            :tcv="(quote as any).tcv"
            :applied-discounts="quote.appliedDiscounts"
            :is-tax-exempt="quote.customer?.isTaxExempt"
            :editable="isEditable"
            @apply-discount="openApplyDiscount()"
          />

          <UButton
            v-if="isEditable"
            block
            :loading="calculating"
            icon="i-heroicons-calculator"
            @click="handleCalculate"
          >
            Recalculate Pricing
          </UButton>
        </div>
      </div>
    </div>

    <!-- Add Product Modal -->
    <UModal v-model:open="showAddProduct" title="Add Product to Quote">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">Add Product to Quote</h3>
              <UButton
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="showAddProduct = false"
              />
            </div>
          </template>

          <div class="space-y-4">
            <UFormField label="Product">
              <USelectMenu
                v-model="selectedProductId"
                :items="availableProducts"
                placeholder="Select a product"
                value-key="value"
              />
            </UFormField>

            <UFormField label="Quantity">
              <UInput
                v-model.number="productQuantity"
                type="number"
                :min="1"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                variant="ghost"
                @click="showAddProduct = false"
              >
                Cancel
              </UButton>
              <UButton
                :loading="addingProduct"
                :disabled="!selectedProductId"
                @click="handleAddProduct"
              >
                Add to Quote
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Customer Selector Modal -->
    <UModal v-model:open="showCustomerSelector" title="Select Customer">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">Select Customer</h3>
              <UButton
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="showCustomerSelector = false"
              />
            </div>
          </template>

          <CpqCustomerSelector
            :model-value="quote?.customerId ?? null"
            @select="handleCustomerSelect"
          />
        </UCard>
      </template>
    </UModal>

    <!-- Apply Discount Modal -->
    <CpqApplyDiscountModal
      v-if="quote"
      v-model:open="showApplyDiscount"
      :quote-id="quote.id"
      :line-item-id="discountTargetLineId"
      :subtotal="quoteSubtotal"
      @applied="handleDiscountApplied"
    />

    <!-- Manual Discount Modal -->
    <CpqManualDiscountModal
      v-if="quote"
      v-model:open="showManualDiscount"
      :quote-id="quote.id"
      :line-item-id="discountTargetLineId"
      @applied="handleDiscountApplied"
    />
  </div>
</template>
