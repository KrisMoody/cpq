<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
import { formatMarginPercent } from '~/utils/pricing'
import type { PriceBook, PriceBookEntry, PriceTier } from '~/composables/usePricing'

const _route = useRoute()
const router = useRouter()
const {
  fetchPriceBook,
  fetchPriceBookPrices,
  updatePriceBook,
  deletePriceBook,
  addPriceBookEntry,
  updatePriceBookEntry,
  deletePriceBookEntry,
  formatPrice,
} = usePricing()
const { products, fetchProducts } = useProducts()
const { currencies, fetchCurrencies } = useCurrencies()

const priceBookId = useRequiredParam('id')
const priceBook = ref<PriceBook | null>(null)
const entries = ref<PriceBookEntry[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const isEditing = ref(false)

const form = ref({
  name: '',
  currencyId: '',
  isDefault: false,
  isActive: true,
  validFrom: '',
  validTo: '',
})

// Add entry modal
const showAddEntry = ref(false)
const newEntry = ref({
  productId: '',
  listPrice: 0,
  cost: null as number | null,
})

// Inline edit state
const editingEntryId = ref<string | null>(null)
const editingEntry = ref({
  listPrice: 0,
  cost: null as number | null,
})

// Tier management
const expandedEntryId = ref<string | null>(null)
const editingTiersEntryId = ref<string | null>(null)
const editingTiers = ref<Array<{ minQuantity: number; maxQuantity: number | null; tierPrice: number; tierType: string; discountPercent: number | null }>>([])
const editingTierType = ref<string>('UNIT_PRICE')

const tierTypeOptions = [
  { label: 'Unit Price', value: 'UNIT_PRICE' },
  { label: 'Flat Price', value: 'FLAT_PRICE' },
  { label: 'Graduated', value: 'GRADUATED' },
  { label: 'Volume %', value: 'VOLUME_DISCOUNT_PERCENT' },
]

onMounted(async () => {
  await Promise.all([loadPriceBook(), fetchProducts(), fetchCurrencies()])
})

async function loadPriceBook() {
  loading.value = true
  error.value = null
  try {
    const [pb, pbWithEntries] = await Promise.all([
      fetchPriceBook(priceBookId),
      fetchPriceBookPrices(priceBookId),
    ])
    priceBook.value = pb
    entries.value = pbWithEntries?.entries || []
    if (pb) {
      form.value = {
        name: pb.name,
        currencyId: pb.currencyId ?? '',
        isDefault: pb.isDefault,
        isActive: pb.isActive,
        validFrom: pb.validFrom ? pb.validFrom.split('T')[0] ?? '' : '',
        validTo: pb.validTo ? pb.validTo.split('T')[0] ?? '' : '',
      }
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to load price book')
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.value.name.trim()) {
    error.value = 'Price book name is required'
    return
  }

  saving.value = true
  error.value = null

  try {
    const updated = await updatePriceBook(priceBookId, {
      name: form.value.name.trim(),
      currencyId: form.value.currencyId || null,
      isDefault: form.value.isDefault,
      isActive: form.value.isActive,
      validFrom: form.value.validFrom || null,
      validTo: form.value.validTo || null,
    })

    if (updated) {
      await loadPriceBook()
      isEditing.value = false
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to update price book')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!confirm('Are you sure you want to deactivate this price book?')) return

  try {
    await deletePriceBook(priceBookId)
    router.push('/price-books')
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to delete price book')
  }
}

function cancelEdit() {
  isEditing.value = false
  if (priceBook.value) {
    form.value = {
      name: priceBook.value.name,
      currencyId: priceBook.value.currencyId ?? '',
      isDefault: priceBook.value.isDefault,
      isActive: priceBook.value.isActive,
      validFrom: priceBook.value.validFrom ? priceBook.value.validFrom.split('T')[0] ?? '' : '',
      validTo: priceBook.value.validTo ? priceBook.value.validTo.split('T')[0] ?? '' : '',
    }
  }
}

// Entry management
const availableProducts = computed(() => {
  const existingProductIds = new Set(entries.value.map((e) => e.productId))
  return products.value.filter((p) => p.isActive && !existingProductIds.has(p.id))
})

// Get selected product for add entry modal
const selectedNewProduct = computed(() => {
  if (!newEntry.value.productId) return null
  return products.value.find((p) => p.id === newEntry.value.productId) || null
})

// Check if selected bundle has missing option coverage
const bundleOptionWarning = ref<string | null>(null)
const loadingBundleCheck = ref(false)

watch(() => newEntry.value.productId, async (productId) => {
  bundleOptionWarning.value = null
  if (!productId) return

  const product = products.value.find((p) => p.id === productId)
  if (!product || product.type !== 'BUNDLE') return

  loadingBundleCheck.value = true
  try {
    // Fetch bundle with features to check options
    const bundle = await $fetch<any>(`/api/products/${productId}`)
    if (bundle.features && bundle.features.length > 0) {
      const entryProductIds = new Set(entries.value.map((e) => e.productId))
      const missingOptions: string[] = []

      for (const feature of bundle.features) {
        for (const option of feature.options || []) {
          if (!entryProductIds.has(option.optionProductId)) {
            // Option product is not in this price book
            const optProduct = products.value.find((p) => p.id === option.optionProductId)
            missingOptions.push(optProduct?.name || option.optionProductId)
          }
        }
      }

      if (missingOptions.length > 0) {
        bundleOptionWarning.value = `This bundle has ${missingOptions.length} option product(s) not in this price book: ${missingOptions.slice(0, 3).join(', ')}${missingOptions.length > 3 ? ` and ${missingOptions.length - 3} more` : ''}`
      }
    }
  } catch {
    // Ignore errors
  } finally {
    loadingBundleCheck.value = false
  }
})

// Bundle coverage analysis - find bundles with missing option prices
const bundleCoverage = computed(() => {
  const priceBookProductIds = new Set(entries.value.map((e) => e.productId))

  // Get all bundle products
  const bundles = products.value.filter((p) => p.type === 'BUNDLE' && p.isActive)

  return bundles.map((bundle) => {
    const bundleInfo = bundle._bundleInfo
    const hasBundlePrice = priceBookProductIds.has(bundle.id)

    // For now, we can only check if the bundle itself has a price
    // Full option coverage would require fetching bundle features
    return {
      id: bundle.id,
      name: bundle.name,
      sku: bundle.sku,
      hasBundlePrice,
      featureCount: bundleInfo?.featureCount ?? 0,
      totalOptions: bundleInfo?.totalOptions ?? 0,
      isConfigured: bundleInfo?.isConfigured ?? false,
    }
  }).filter((b) => !b.hasBundlePrice || !b.isConfigured)
})

const hasBundleCoverageIssues = computed(() => bundleCoverage.value.length > 0)

async function handleAddEntry() {
  if (!newEntry.value.productId) {
    error.value = 'Please select a product'
    return
  }

  error.value = null
  const entry = await addPriceBookEntry(priceBookId, {
    productId: newEntry.value.productId,
    listPrice: newEntry.value.listPrice,
    cost: newEntry.value.cost,
  })

  if (entry) {
    entries.value.push(entry)
    showAddEntry.value = false
    newEntry.value = { productId: '', listPrice: 0, cost: null }
  }
}

function startEditEntry(entry: PriceBookEntry) {
  editingEntryId.value = entry.id
  editingEntry.value = {
    listPrice: parseFloat(entry.listPrice),
    cost: entry.cost ? parseFloat(entry.cost) : null,
  }
}

async function saveEntryEdit(entry: PriceBookEntry) {
  error.value = null
  const updated = await updatePriceBookEntry(priceBookId, entry.id, {
    listPrice: editingEntry.value.listPrice,
    cost: editingEntry.value.cost,
  })

  if (updated) {
    const idx = entries.value.findIndex((e) => e.id === entry.id)
    if (idx >= 0) {
      entries.value[idx] = updated
    }
    editingEntryId.value = null
  }
}

function cancelEntryEdit() {
  editingEntryId.value = null
}

async function handleDeleteEntry(entry: PriceBookEntry) {
  if (!confirm(`Remove ${entry.product.name} from this price book?`)) return

  error.value = null
  const success = await deletePriceBookEntry(priceBookId, entry.id)

  if (success) {
    entries.value = entries.value.filter((e) => e.id !== entry.id)
  }
}

// Tier management functions
function toggleTiers(entryId: string) {
  expandedEntryId.value = expandedEntryId.value === entryId ? null : entryId
}

function startEditTiers(entry: PriceBookEntry) {
  editingTiersEntryId.value = entry.id
  editingTiers.value = (entry.priceTiers ?? []).map((t: PriceTier) => ({
    minQuantity: t.minQuantity,
    maxQuantity: t.maxQuantity,
    tierPrice: parseFloat(t.tierPrice),
    tierType: t.tierType,
    discountPercent: t.discountPercent ? parseFloat(t.discountPercent) : null,
  }))
  // Initialize entry-level tier type from first tier or default to UNIT_PRICE
  editingTierType.value = editingTiers.value[0]?.tierType || 'UNIT_PRICE'
  expandedEntryId.value = entry.id
}

function cancelTierEdit() {
  editingTiersEntryId.value = null
  editingTiers.value = []
}

function addTier() {
  const lastTier = editingTiers.value[editingTiers.value.length - 1]
  const minQty = lastTier ? (lastTier.maxQuantity ?? lastTier.minQuantity) + 1 : 2
  editingTiers.value.push({
    minQuantity: minQty,
    maxQuantity: null,
    tierPrice: 0,
    tierType: editingTierType.value,
    discountPercent: editingTierType.value === 'VOLUME_DISCOUNT_PERCENT' ? 0 : null,
  })
}

function removeTier(index: number) {
  editingTiers.value.splice(index, 1)
}

function onEntryTierTypeChange(newType: string) {
  editingTierType.value = newType
  // Update all tiers to use the same type (as required by validation)
  for (const tier of editingTiers.value) {
    tier.tierType = newType
    if (newType === 'VOLUME_DISCOUNT_PERCENT') {
      tier.discountPercent = tier.discountPercent ?? 0
    } else {
      tier.discountPercent = null
    }
  }
}

async function saveTiers(entry: PriceBookEntry) {
  // Validate tiers
  for (let i = 0; i < editingTiers.value.length; i++) {
    const tier = editingTiers.value[i]
    if (!tier) continue
    if (tier.minQuantity < 1) {
      error.value = `Tier ${i + 1}: Min quantity must be at least 1`
      return
    }
    if (tier.maxQuantity !== null && tier.maxQuantity < tier.minQuantity) {
      error.value = `Tier ${i + 1}: Max quantity cannot be less than min quantity`
      return
    }
    if (tier.tierType !== 'VOLUME_DISCOUNT_PERCENT' && tier.tierPrice < 0) {
      error.value = `Tier ${i + 1}: Price cannot be negative`
      return
    }
    if (tier.tierType === 'VOLUME_DISCOUNT_PERCENT') {
      if (tier.discountPercent === null || tier.discountPercent === undefined) {
        error.value = `Tier ${i + 1}: Discount percentage is required for Volume Discount % type`
        return
      }
      if (tier.discountPercent < 0 || tier.discountPercent > 100) {
        error.value = `Tier ${i + 1}: Discount percentage must be between 0 and 100`
        return
      }
    }
  }

  error.value = null
  try {
    const updated = await $fetch<PriceBookEntry>(`/api/price-books/${priceBookId}/entries/${entry.id}`, {
      method: 'PUT',
      body: {
        listPrice: parseFloat(entry.listPrice),
        cost: entry.cost ? parseFloat(entry.cost) : null,
        tiers: editingTiers.value,
      },
    })

    const idx = entries.value.findIndex((e) => e.id === entry.id)
    if (idx >= 0) {
      entries.value[idx] = updated
    }
    editingTiersEntryId.value = null
    editingTiers.value = []
  } catch (e) {
    error.value = getErrorMessage(e, 'Failed to save tiers')
  }
}

function getEntryTiers(entry: PriceBookEntry): PriceTier[] {
  return entry.priceTiers || []
}

function getTierTypeLabel(tierType: string): string {
  switch (tierType) {
    case 'UNIT_PRICE': return 'Per Unit'
    case 'FLAT_PRICE': return 'Flat'
    case 'GRADUATED': return 'Graduated'
    case 'VOLUME_DISCOUNT_PERCENT': return 'Volume %'
    default: return tierType
  }
}

function getTierTypeColor(tierType: string): 'primary' | 'info' | 'success' | 'warning' | 'neutral' {
  switch (tierType) {
    case 'UNIT_PRICE': return 'primary'
    case 'FLAT_PRICE': return 'info'
    case 'GRADUATED': return 'success'
    case 'VOLUME_DISCOUNT_PERCENT': return 'warning'
    default: return 'neutral'
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-ga-navy-500" />
    </div>

    <!-- Error -->
    <UAlert v-else-if="error && !priceBook" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Not Found -->
    <UAlert v-else-if="!priceBook" color="warning" icon="i-heroicons-exclamation-triangle">
      <template #title>Price book not found</template>
    </UAlert>

    <!-- Price Book Details -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold">{{ priceBook.name }}</h1>
          <div class="flex items-center gap-2 mt-2">
            <UBadge v-if="priceBook.isDefault" color="primary" variant="subtle">
              Default
            </UBadge>
            <UBadge v-if="!priceBook.isActive" color="warning" variant="subtle">
              Inactive
            </UBadge>
          </div>
        </div>
        <div class="flex gap-2">
          <UButton
            v-if="!isEditing"
            variant="soft"
            icon="i-heroicons-pencil"
            @click="isEditing = true"
          >
            Edit
          </UButton>
          <UButton
            v-if="priceBook.isActive"
            variant="ghost"
            color="error"
            icon="i-heroicons-trash"
            @click="handleDelete"
          >
            Deactivate
          </UButton>
        </div>
      </div>

      <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle">
        <template #description>{{ error }}</template>
      </UAlert>

      <!-- Price Book Form -->
      <UCard>
        <template #header>
          <h2 class="font-semibold">Price Book Details</h2>
        </template>

        <form v-if="isEditing" class="space-y-4" @submit.prevent="handleSave">
          <UFormField label="Name" required>
            <UInput v-model="form.name" />
          </UFormField>

          <UFormField label="Currency">
            <USelect
              v-model="form.currencyId"
              placeholder="Use default"
              :items="currencies.filter(c => c.isActive).map(c => ({ label: `${c.code} - ${c.name}`, value: c.id }))"
              value-key="value"
            />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Valid From">
              <UInput v-model="form.validFrom" type="date" />
            </UFormField>
            <UFormField label="Valid To">
              <UInput v-model="form.validTo" type="date" />
            </UFormField>
          </div>

          <div class="flex items-center gap-6">
            <UCheckbox v-model="form.isDefault" label="Default price book" />
            <UCheckbox v-model="form.isActive" label="Active" />
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <UButton variant="ghost" @click="cancelEdit">Cancel</UButton>
            <UButton type="submit" :loading="saving">Save Changes</UButton>
          </div>
        </form>

        <dl v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt class="text-sm text-ga-gray-600">Currency</dt>
            <dd>{{ priceBook.currency ? `${priceBook.currency.code} (${priceBook.currency.symbol})` : 'Default' }}</dd>
          </div>
          <div>
            <dt class="text-sm text-ga-gray-600">Products</dt>
            <dd>{{ priceBook._count.entries }}</dd>
          </div>
          <div>
            <dt class="text-sm text-ga-gray-600">Valid From</dt>
            <dd>{{ priceBook.validFrom ? new Date(priceBook.validFrom).toLocaleDateString() : '—' }}</dd>
          </div>
          <div>
            <dt class="text-sm text-ga-gray-600">Valid To</dt>
            <dd>{{ priceBook.validTo ? new Date(priceBook.validTo).toLocaleDateString() : '—' }}</dd>
          </div>
        </dl>
      </UCard>

      <!-- Bundle Coverage Warning -->
      <UAlert
        v-if="hasBundleCoverageIssues"
        color="warning"
        icon="i-heroicons-exclamation-triangle"
        class="mb-4"
      >
        <template #title>Bundle Pricing Issues</template>
        <template #description>
          <p class="mb-2">The following bundles have missing prices or configuration issues:</p>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="bundle in bundleCoverage" :key="bundle.id">
              <NuxtLink :to="`/products/${bundle.id}`" class="text-primary-600 hover:underline">
                {{ bundle.name }}
              </NuxtLink>
              <span class="text-ga-gray-600 text-xs ml-1">({{ bundle.sku }})</span>
              <span v-if="!bundle.hasBundlePrice" class="text-warning-600 text-xs ml-2">— No price in this price book</span>
              <span v-else-if="!bundle.isConfigured" class="text-warning-600 text-xs ml-2">— Bundle not fully configured</span>
            </li>
          </ul>
        </template>
      </UAlert>

      <!-- Entries -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Price Entries</h2>
            <UButton
              size="sm"
              icon="i-heroicons-plus"
              :disabled="availableProducts.length === 0"
              @click="showAddEntry = true"
            >
              Add Product
            </UButton>
          </div>
        </template>

        <div v-if="entries.length === 0" class="text-center py-8 text-ga-gray-600">
          <UIcon name="i-heroicons-currency-dollar" class="w-12 h-12 text-ga-gray-400 mx-auto mb-4" />
          <p>No products in this price book</p>
          <UButton
            variant="soft"
            class="mt-4"
            :disabled="availableProducts.length === 0"
            @click="showAddEntry = true"
          >
            Add your first product
          </UButton>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-ga-gray-300">
            <thead class="bg-ga-gray-100">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-ga-gray-600 uppercase">Product</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-ga-gray-600 uppercase">SKU</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-ga-gray-600 uppercase">List Price</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-ga-gray-600 uppercase">Cost</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-ga-gray-600 uppercase">Margin</th>
                <th class="px-4 py-3"/>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-ga-gray-300">
              <template v-for="entry in entries" :key="entry.id">
                <tr>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <UButton
                        size="xs"
                        variant="ghost"
                        :icon="expandedEntryId === entry.id ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
                        @click="toggleTiers(entry.id)"
                      />
                      <NuxtLink
                        :to="`/products/${entry.product.id}`"
                        class="text-ga-navy-600 hover:underline font-medium"
                      >
                        {{ entry.product.name }}
                      </NuxtLink>
                      <UBadge v-if="getEntryTiers(entry).length > 0" size="xs" variant="subtle" color="info">
                        {{ getEntryTiers(entry).length }} tier{{ getEntryTiers(entry).length !== 1 ? 's' : '' }}
                      </UBadge>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-ga-gray-600">{{ entry.product.sku }}</td>
                  <td class="px-4 py-3 text-right">
                    <template v-if="editingEntryId === entry.id">
                      <UInput
                        v-model.number="editingEntry.listPrice"
                        type="number"
                        step="0.01"
                        class="w-40 text-right"
                      />
                    </template>
                    <template v-else>
                      {{ formatPrice(entry.listPrice) }}
                    </template>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <template v-if="editingEntryId === entry.id">
                      <UInput
                        v-model.number="editingEntry.cost"
                        type="number"
                        step="0.01"
                        class="w-40 text-right"
                        placeholder="—"
                      />
                    </template>
                    <template v-else>
                      {{ entry.cost ? formatPrice(entry.cost) : '—' }}
                    </template>
                  </td>
                  <td class="px-4 py-3 text-right text-sm">
                    {{ formatMarginPercent(entry.cost, entry.listPrice) }}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <template v-if="editingEntryId === entry.id">
                      <div class="flex justify-end gap-1">
                        <UButton
                          size="xs"
                          variant="ghost"
                          icon="i-heroicons-check"
                          @click="saveEntryEdit(entry)"
                        />
                        <UButton
                          size="xs"
                          variant="ghost"
                          icon="i-heroicons-x-mark"
                          @click="cancelEntryEdit"
                        />
                      </div>
                    </template>
                    <template v-else>
                      <div class="flex justify-end gap-1">
                        <UButton
                          size="xs"
                          variant="ghost"
                          icon="i-heroicons-pencil"
                          @click="startEditEntry(entry)"
                        />
                        <UButton
                          size="xs"
                          variant="ghost"
                          color="error"
                          icon="i-heroicons-trash"
                          @click="handleDeleteEntry(entry)"
                        />
                      </div>
                    </template>
                  </td>
                </tr>
                <!-- Expanded Tiers Row -->
                <tr v-if="expandedEntryId === entry.id" class="bg-ga-gray-100">
                  <td colspan="6" class="px-4 py-4">
                    <div class="ml-8">
                      <div class="flex items-center justify-between mb-3">
                        <h4 class="text-sm font-medium text-ga-gray-800">Volume Pricing Tiers</h4>
                        <div class="flex gap-2">
                          <template v-if="editingTiersEntryId === entry.id">
                            <UButton size="xs" variant="soft" icon="i-heroicons-plus" @click="addTier">
                              Add Tier
                            </UButton>
                            <UButton size="xs" variant="ghost" @click="cancelTierEdit">
                              Cancel
                            </UButton>
                            <UButton size="xs" @click="saveTiers(entry)">
                              Save Tiers
                            </UButton>
                          </template>
                          <template v-else>
                            <UButton size="xs" variant="soft" icon="i-heroicons-pencil" @click="startEditTiers(entry)">
                              Edit Tiers
                            </UButton>
                          </template>
                        </div>
                      </div>

                      <!-- Edit Mode -->
                      <div v-if="editingTiersEntryId === entry.id" class="space-y-3">
                        <!-- Entry-level tier type selector -->
                        <div class="flex items-center gap-3 pb-2 border-b border-ga-gray-300">
                          <UFormField label="Pricing Type" class="w-48">
                            <USelect
                              :model-value="editingTierType"
                              :items="tierTypeOptions"
                              value-key="value"
                              @update:model-value="onEntryTierTypeChange"
                            />
                          </UFormField>
                        </div>

                        <div v-if="editingTiers.length === 0" class="text-sm text-ga-gray-600 py-2">
                          No tiers configured. Click "Add Tier" to create volume pricing.
                        </div>
                        <div
                          v-for="(tier, index) in editingTiers"
                          :key="index"
                          class="flex items-center gap-3 p-3 bg-white rounded-lg border border-ga-gray-300"
                        >
                          <UFormField label="Min Qty" class="w-28">
                            <UInput v-model.number="tier.minQuantity" type="number" min="1" />
                          </UFormField>
                          <UFormField label="Max Qty" class="w-28">
                            <UInput v-model.number="tier.maxQuantity" type="number" min="1" placeholder="No max" />
                          </UFormField>
                          <UFormField v-if="editingTierType !== 'VOLUME_DISCOUNT_PERCENT'" label="Price" class="w-40">
                            <UInput v-model.number="tier.tierPrice" type="number" step="0.01" min="0" />
                          </UFormField>
                          <UFormField v-if="editingTierType === 'VOLUME_DISCOUNT_PERCENT'" label="Discount %" class="w-28">
                            <UInput v-model.number="tier.discountPercent" type="number" step="0.01" min="0" max="100" />
                          </UFormField>
                          <UButton
                            size="xs"
                            variant="ghost"
                            color="error"
                            icon="i-heroicons-trash"
                            class="mt-6"
                            @click="removeTier(index)"
                          />
                        </div>
                      </div>

                      <!-- View Mode -->
                      <div v-else>
                        <div v-if="getEntryTiers(entry).length === 0" class="text-sm text-ga-gray-600 py-2">
                          No volume pricing tiers configured.
                        </div>
                        <template v-else>
                          <!-- Entry-level tier type badge -->
                          <div class="flex items-center gap-2 mb-2 pb-2 border-b border-ga-gray-300">
                            <span class="text-xs text-ga-gray-600">Pricing Type:</span>
                            <UBadge size="xs" variant="subtle" :color="getTierTypeColor(getEntryTiers(entry)[0]?.tierType ?? 'UNIT_PRICE')">
                              {{ getTierTypeLabel(getEntryTiers(entry)[0]?.tierType ?? 'UNIT_PRICE') }}
                            </UBadge>
                          </div>
                          <table class="min-w-full text-sm">
                            <thead>
                              <tr class="text-left text-xs text-ga-gray-600 uppercase">
                                <th class="pr-4 py-1">Quantity Range</th>
                                <th class="pr-4 py-1">{{ getEntryTiers(entry)[0]?.tierType === 'VOLUME_DISCOUNT_PERCENT' ? 'Discount' : 'Price' }}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="tier in getEntryTiers(entry)" :key="tier.id">
                                <td class="pr-4 py-1">
                                  {{ tier.minQuantity }}{{ tier.maxQuantity ? ` - ${tier.maxQuantity}` : '+' }}
                                </td>
                                <td class="pr-4 py-1">
                                  <template v-if="tier.tierType === 'VOLUME_DISCOUNT_PERCENT'">
                                    {{ tier.discountPercent }}% off
                                  </template>
                                  <template v-else>
                                    {{ formatPrice(tier.tierPrice) }}
                                  </template>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </template>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>

    <!-- Add Entry Modal -->
    <UModal v-model:open="showAddEntry" title="Add Product to Price Book">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">Add Product to Price Book</h3>
          </template>

          <div class="space-y-4">
            <UFormField label="Product" required>
              <USelect
                v-model="newEntry.productId"
                :items="availableProducts.map(p => ({ label: `${p.name} (${p.sku})${p.type === 'BUNDLE' ? ' [Bundle]' : ''}`, value: p.id }))"
                placeholder="Select a product"
                value-key="value"
              />
            </UFormField>

            <!-- Bundle warning -->
            <UAlert
              v-if="selectedNewProduct?.type === 'BUNDLE'"
              :color="bundleOptionWarning ? 'warning' : 'info'"
              :icon="bundleOptionWarning ? 'i-heroicons-exclamation-triangle' : 'i-heroicons-information-circle'"
              variant="subtle"
            >
              <template #description>
                <div v-if="loadingBundleCheck" class="flex items-center gap-2">
                  <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                  Checking bundle options...
                </div>
                <div v-else-if="bundleOptionWarning">
                  {{ bundleOptionWarning }}
                </div>
                <div v-else>
                  This is a bundle product. Bundle options are also in this price book.
                </div>
              </template>
            </UAlert>

            <UFormField label="List Price" required>
              <UInput
                v-model.number="newEntry.listPrice"
                type="number"
                step="0.01"
                min="0"
              />
            </UFormField>

            <UFormField label="Cost">
              <UInput
                v-model.number="newEntry.cost"
                type="number"
                step="0.01"
                min="0"
                placeholder="Optional"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" @click="showAddEntry = false">Cancel</UButton>
              <UButton @click="handleAddEntry">Add Entry</UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
