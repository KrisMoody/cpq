<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
import type { QuoteWithLineItems, EvaluationSummary } from '~/composables/useQuotes'
import type { Customer } from '~/composables/useCustomers'
import type { AIRecommendation, GenerateQuoteResponse } from '~/composables/useAIQuoteOptimizer'

definePageMeta({
  key: (route) => route.fullPath,
})

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
const { formatPrice: _formatPrice } = usePricing()

// Track products in the quote's price book
const priceBookProductIds = ref<Set<string>>(new Set())
const loadingPriceBookProducts = ref(false)

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

// Discount modal
const showDiscountModal = ref(false)
const discountTargetLineId = ref<string | undefined>(undefined)

// Bundle configurator modal
const showBundleConfigurator = ref(false)
const bundleProduct = ref<any>(null)
const bundlePrice = ref(0)
const loadingBundleProduct = ref(false)
const addingBundle = ref(false)

// Pre-validation for bundle options
const bundlePreValidation = ref<{ hasIssues: boolean; requiredMissing: number; optionalMissing: number } | null>(null)
const loadingBundleValidation = ref(false)

// Track expanded bundles
const expandedBundles = ref<Set<string>>(new Set())

const quoteId = useRequiredParam('id')

// Load data on mount and when route changes (e.g., returning from preview)
const initialLoadDone = ref(false)

watch(
  () => route.path,
  async (newPath) => {
    // Only load if we're on the exact quote page (not preview or other sub-routes)
    if (newPath === `/quotes/${quoteId}`) {
      if (!initialLoadDone.value) {
        initialLoadDone.value = true
        await Promise.all([loadQuote(), fetchProducts()])
      } else {
        await loadQuote()
      }
    }
  },
  { immediate: true }
)

async function loadQuote(showLoading = true) {
  // Only show loading spinner on initial load, not on refreshes
  if (showLoading && !quote.value) {
    loading.value = true
  }
  try {
    quote.value = await fetchQuote(quoteId)
    if (!quote.value) {
      error.value = 'Quote not found'
    } else {
      // Fetch products in this quote's price book
      await loadPriceBookProducts(quote.value.priceBookId)
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to load quote')
  } finally {
    loading.value = false
  }
}

async function loadPriceBookProducts(priceBookId: string) {
  loadingPriceBookProducts.value = true
  try {
    const entries = await $fetch<Array<{ productId: string }>>(`/api/price-books/${priceBookId}/entries`)
    priceBookProductIds.value = new Set(entries.map((e) => e.productId))
  } catch {
    // If we can't load price book products, allow all products (fallback)
    priceBookProductIds.value = new Set()
  } finally {
    loadingPriceBookProducts.value = false
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
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to calculate quote')
  } finally {
    calculating.value = false
  }
}

async function handleAddProduct() {
  if (!quote.value || !selectedProductId.value) return

  // Check if selected product is a bundle
  const selectedProduct = products.value.find((p) => p.id === selectedProductId.value)
  if (selectedProduct?.type === 'BUNDLE') {
    // Open bundle configurator instead of direct add
    await openBundleConfigurator()
    return
  }

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
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to add product')
  } finally {
    addingProduct.value = false
  }
}

async function openBundleConfigurator() {
  if (!quote.value || !selectedProductId.value) return

  try {
    loadingBundleProduct.value = true

    // Fetch product with features and options enriched with price book data
    const priceBookId = quote.value.priceBookId
    const response = await $fetch<any>(`/api/products/${selectedProductId.value}`, {
      query: priceBookId ? { priceBookId } : undefined,
    })

    bundleProduct.value = response

    // Get the bundle's own price from the price book
    const bundlePriceEntry = response.priceBookEntries?.find(
      (e: any) => e.priceBookId === priceBookId
    )
    bundlePrice.value = bundlePriceEntry ? Number(bundlePriceEntry.listPrice) : 0

    // Check if bundle has features - if not, add directly
    if (!response.features || response.features.length === 0) {
      // No features, add bundle directly without configuration
      showAddProduct.value = false
      addingProduct.value = true
      await addLineItem(quote.value.id, {
        productId: selectedProductId.value,
        quantity: productQuantity.value,
      })
      await loadQuote()
      selectedProductId.value = ''
      productQuantity.value = 1
      addingProduct.value = false
      return
    }

    // Close add product modal and open configurator
    showAddProduct.value = false
    loadingBundleProduct.value = false
    // Use nextTick to ensure the DOM has updated before opening new modal
    await nextTick()
    showBundleConfigurator.value = true
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to load bundle configuration')
    loadingBundleProduct.value = false
  }
}

async function handleBundleConfirm(selections: Array<{ optionId: string; quantity: number }>) {
  if (!quote.value || !bundleProduct.value) return

  addingBundle.value = true
  try {
    // Call the bundle creation endpoint
    const result = await $fetch(`/api/quotes/${quote.value.id}/bundles`, {
      method: 'POST',
      body: {
        productId: bundleProduct.value.id,
        quantity: productQuantity.value,
        selections,
      },
    })

    // Auto-expand the new bundle
    if (result && typeof result === 'object' && 'id' in result) {
      expandedBundles.value.add((result as any).id)
    }

    await loadQuote()
    showBundleConfigurator.value = false
    bundleProduct.value = null
    selectedProductId.value = ''
    productQuantity.value = 1

    toast.add({
      title: 'Bundle added',
      description: 'Bundle and its components have been added to the quote.',
      color: 'success',
    })
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to add bundle to quote')
  } finally {
    addingBundle.value = false
  }
}

function handleBundleCancel() {
  showBundleConfigurator.value = false
  bundleProduct.value = null
  // Re-open the add product modal so user can choose another product
  showAddProduct.value = true
}

function toggleBundleExpand(lineId: string) {
  if (expandedBundles.value.has(lineId)) {
    expandedBundles.value.delete(lineId)
  } else {
    expandedBundles.value.add(lineId)
  }
}

async function handleRemoveLine(lineId: string) {
  if (!quote.value) return
  try {
    await removeLineItem(quote.value.id, lineId)
    await loadQuote()
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to remove line item')
  }
}

async function handleUpdateQuantity(lineId: string, quantity: number) {
  if (!quote.value) return
  try {
    const result = await updateLineItem(quote.value.id, lineId, { quantity })
    if (result) {
      quote.value = result
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to update quantity')
  }
}

async function handleCustomerSelect(customer: Customer | null) {
  if (!quote.value) return
  try {
    await updateQuote(quote.value.id, { customerId: customer?.id ?? null })
    await loadQuote()
    showCustomerSelector.value = false
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to update customer')
  }
}

function openDiscountModal(lineItemId?: string) {
  discountTargetLineId.value = lineItemId
  showDiscountModal.value = true
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
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to remove discount')
  }
}

async function handleSubmit() {
  if (!quote.value) return
  try {
    await submitQuote(quote.value.id)
    await loadQuote()
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to submit quote')
  }
}

async function handleApprove() {
  if (!quote.value) return
  try {
    await approveQuote(quote.value.id, 'Current User')
    await loadQuote()
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to approve quote')
  }
}

async function handleReject(_reason: string) {
  if (!quote.value) return
  try {
    await rejectQuote(quote.value.id)
    await loadQuote()
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to reject quote')
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
  // Filter products to only those in the quote's price book
  const filteredProducts = priceBookProductIds.value.size > 0
    ? products.value.filter((p) => priceBookProductIds.value.has(p.id))
    : products.value

  return filteredProducts.map((p) => ({
    label: `${p.name} (${p.sku})${p.isTaxable === false ? ' [Non-Taxable]' : ''}`,
    value: p.id,
    isTaxable: p.isTaxable,
  }))
})

// Count of products NOT in price book (for warning)
const productsNotInPriceBook = computed(() => {
  if (priceBookProductIds.value.size === 0) return 0
  return products.value.filter((p) => !priceBookProductIds.value.has(p.id)).length
})

const selectedProduct = computed(() => {
  if (!selectedProductId.value) return null
  return products.value.find((p) => p.id === selectedProductId.value) || null
})

// Pre-validate bundle options when a bundle is selected
watch(selectedProductId, async (productId) => {
  bundlePreValidation.value = null
  if (!productId || !quote.value) return

  const product = products.value.find((p) => p.id === productId)
  if (!product || product.type !== 'BUNDLE') return

  loadingBundleValidation.value = true
  try {
    const response = await $fetch<any>(`/api/products/${productId}`, {
      query: { priceBookId: quote.value.priceBookId },
    })

    if (response.features && response.features.length > 0) {
      let requiredMissing = 0
      let optionalMissing = 0

      for (const feature of response.features) {
        for (const option of feature.options || []) {
          // Check for both missing pricing and inactive products
          const isUnavailable = !option.product?.hasPrice || option.product?.isActive === false
          if (isUnavailable) {
            if (option.isRequired) {
              requiredMissing++
            } else {
              optionalMissing++
            }
          }
        }
      }

      bundlePreValidation.value = {
        hasIssues: requiredMissing > 0 || optionalMissing > 0,
        requiredMissing,
        optionalMissing,
      }
    }
  } catch {
    // Ignore errors
  } finally {
    loadingBundleValidation.value = false
  }
})

const quoteSubtotal = computed(() => {
  return quote.value ? parseFloat(String(quote.value.subtotal)) : 0
})

// Recommendations
const recommendationsRef = ref<{ refresh: () => void } | null>(null)

async function handleAddRecommendedProduct(productId: string) {
  if (!quote.value) return
  try {
    await addLineItem(quote.value.id, {
      productId,
      quantity: 1,
    })
    await loadQuote()
    // Refresh recommendations after adding a product
    recommendationsRef.value?.refresh()
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to add product')
  }
}

// AI Assistant
const aiPanelRef = ref<{ refresh: () => void } | null>(null)

async function handleApplyAIRecommendation(recommendation: AIRecommendation) {
  if (!quote.value) return
  try {
    switch (recommendation.type) {
      case 'ADD_PRODUCT':
        if (recommendation.productId) {
          await addLineItem(quote.value.id, {
            productId: recommendation.productId,
            quantity: recommendation.quantity || 1,
          })
        }
        break
      case 'REMOVE_PRODUCT':
        if (recommendation.lineItemId) {
          await removeLineItem(quote.value.id, recommendation.lineItemId)
        }
        break
      case 'ADJUST_QUANTITY':
        if (recommendation.lineItemId && recommendation.quantity) {
          await updateLineItem(quote.value.id, recommendation.lineItemId, {
            quantity: recommendation.quantity,
          })
        }
        break
      case 'APPLY_DISCOUNT':
        // For discount recommendations, open the discount modal
        openDiscountModal()
        return
    }
    await loadQuote()
    toast.add({ title: 'AI recommendation applied', color: 'success' })
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to apply AI recommendation')
  }
}

async function handleCreateQuoteFromAI(data: GenerateQuoteResponse) {
  // Navigate to new quote creation with AI data
  // For now, show a toast indicating the feature
  toast.add({
    title: 'Quote Generated',
    description: `Created "${data.suggestedName}" with ${data.lineItems.length} items`,
    color: 'success',
  })
  // The actual creation would be handled by the parent or navigation
}
</script>

<template>
  <div>
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
            :to="`/quotes/preview-${quote.id}`"
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
                :is-expanded="expandedBundles.has(line.id)"
                @remove="handleRemoveLine"
                @update-quantity="handleUpdateQuantity"
                @apply-discount="openDiscountModal"
                @toggle-expand="toggleBundleExpand"
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
            @apply-discount="openDiscountModal()"
            @remove-discount="handleRemoveDiscount"
          />

          <!-- Pricing Summary -->
          <CpqPricingSummary
            :subtotal="quote.subtotal"
            :discount-total="quote.discountTotal"
            :tax-amount="quote.taxAmount"
            :tax-breakdown="quote.taxBreakdown"
            :total="quote.total"
            :one-time-total="quote.oneTimeTotal"
            :mrr="quote.mrr"
            :arr="quote.arr"
            :tcv="quote.tcv"
            :applied-discounts="quote.appliedDiscounts"
            :is-tax-exempt="quote.customer?.isTaxExempt"
            :has-customer="!!quote.customer"
            :customer-has-location="!!quote.customer?.country"
            :editable="isEditable"
            @apply-discount="openDiscountModal()"
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

          <!-- AI Assistant Panel -->
          <AiQuotePanel
            v-if="isEditable"
            ref="aiPanelRef"
            :quote-id="quote.id"
            :customer-id="quote.customerId || undefined"
            :price-book-id="quote.priceBookId"
            @apply-recommendation="handleApplyAIRecommendation"
            @create-quote="handleCreateQuoteFromAI"
            @refresh="loadQuote"
          />

          <!-- Recommendations Panel -->
          <CpqRecommendations
            v-if="isEditable"
            ref="recommendationsRef"
            :quote-id="quote.id"
            @add-product="handleAddRecommendedProduct"
          />
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
            <!-- Info about filtering -->
            <UAlert
              v-if="productsNotInPriceBook > 0"
              color="info"
              icon="i-heroicons-information-circle"
              variant="subtle"
            >
              <template #description>
                Showing {{ availableProducts.length }} products in the "{{ quote?.priceBook?.name }}" price book.
                {{ productsNotInPriceBook }} product(s) hidden.
              </template>
            </UAlert>

            <UFormField label="Product">
              <USelectMenu
                v-model="selectedProductId"
                :items="availableProducts"
                placeholder="Select a product"
                value-key="value"
                :loading="loadingPriceBookProducts"
              />
            </UFormField>

            <!-- Show product info and warnings for selected product -->
            <div v-if="selectedProduct" class="space-y-2">
              <div class="flex items-center gap-2">
                <UBadge
                  :color="selectedProduct.isTaxable ? 'neutral' : 'info'"
                  variant="subtle"
                  size="sm"
                >
                  <UIcon :name="selectedProduct.isTaxable ? 'i-heroicons-receipt-percent' : 'i-heroicons-receipt-percent'" class="w-3 h-3 mr-1" />
                  {{ selectedProduct.isTaxable ? 'Taxable' : 'Non-Taxable' }}
                </UBadge>
                <span v-if="!selectedProduct.isTaxable" class="text-xs text-gray-500">
                  This product will not incur sales tax
                </span>
              </div>

              <!-- Bundle warnings -->
              <template v-if="selectedProduct.type === 'BUNDLE'">
                <!-- Pre-validation loading -->
                <div v-if="loadingBundleValidation" class="flex items-center gap-2 text-sm text-gray-500">
                  <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                  Checking bundle options...
                </div>

                <!-- Pre-validation result: Required options missing -->
                <UAlert
                  v-else-if="bundlePreValidation?.requiredMissing"
                  color="error"
                  icon="i-heroicons-exclamation-triangle"
                >
                  <template #description>
                    <strong>Cannot add this bundle:</strong> {{ bundlePreValidation.requiredMissing }} required option(s) are not available in this price book.
                  </template>
                </UAlert>

                <!-- Pre-validation result: Optional options missing -->
                <UAlert
                  v-else-if="bundlePreValidation?.optionalMissing"
                  color="warning"
                  icon="i-heroicons-exclamation-triangle"
                  variant="subtle"
                >
                  <template #description>
                    {{ bundlePreValidation.optionalMissing }} optional option(s) are not available in this price book and cannot be selected.
                  </template>
                </UAlert>

                <!-- Bundle structure warnings from _bundleInfo -->
                <template v-else-if="selectedProduct._bundleInfo">
                  <UAlert
                    v-if="selectedProduct._bundleInfo.featureCount === 0"
                    color="warning"
                    icon="i-heroicons-exclamation-triangle"
                    variant="subtle"
                  >
                    <template #description>
                      This bundle has no features configured. It will be added as a standalone item.
                    </template>
                  </UAlert>
                  <UAlert
                    v-else-if="selectedProduct._bundleInfo.hasEmptyFeatures"
                    color="warning"
                    icon="i-heroicons-exclamation-triangle"
                    variant="subtle"
                  >
                    <template #description>
                      Some features in this bundle have no options. Configuration may be incomplete.
                    </template>
                  </UAlert>
                  <UAlert
                    v-else
                    color="info"
                    icon="i-heroicons-information-circle"
                    variant="subtle"
                  >
                    <template #description>
                      This is a configurable bundle. You'll be able to select options after clicking "Add to Quote".
                    </template>
                  </UAlert>
                </template>
              </template>
            </div>

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
                :loading="addingProduct || loadingBundleValidation"
                :disabled="!selectedProductId || (bundlePreValidation?.requiredMissing ?? 0) > 0"
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

    <!-- Discount Modal (Catalog + Manual) -->
    <CpqDiscountModal
      v-if="quote"
      v-model:open="showDiscountModal"
      :quote-id="quote.id"
      :line-item-id="discountTargetLineId"
      :subtotal="quoteSubtotal"
      @applied="handleDiscountApplied"
    />

    <!-- Bundle Configurator Modal -->
    <CpqBundleConfiguratorModal
      v-model:open="showBundleConfigurator"
      :product="bundleProduct"
      :bundle-price="bundlePrice"
      :quantity="productQuantity"
      :loading="addingBundle"
      @confirm="handleBundleConfirm"
      @cancel="handleBundleCancel"
    />
  </div>
</template>
