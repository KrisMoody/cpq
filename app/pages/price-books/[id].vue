<script setup lang="ts">
import type { PriceBook, PriceBookEntry } from '~/composables/usePricing'

const route = useRoute()
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

const priceBookId = route.params.id as string
const priceBook = ref<PriceBook | null>(null)
const entries = ref<PriceBookEntryWithTiers[]>([])
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
const editingTiers = ref<Array<{ minQuantity: number; maxQuantity: number | null; tierPrice: number; tierType: string }>>([])

interface PriceTier {
  id: string
  minQuantity: number
  maxQuantity: number | null
  tierPrice: string
  tierType: string
}

interface PriceBookEntryWithTiers extends PriceBookEntry {
  priceTiers?: PriceTier[]
}

const tierTypeOptions = [
  { label: 'Unit Price', value: 'UNIT_PRICE' },
  { label: 'Flat Price', value: 'FLAT_PRICE' },
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
  } catch (e: any) {
    error.value = e.message || 'Failed to load price book'
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
  } catch (e: any) {
    error.value = e.message || 'Failed to update price book'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!confirm('Are you sure you want to deactivate this price book?')) return

  try {
    await deletePriceBook(priceBookId)
    router.push('/price-books')
  } catch (e: any) {
    error.value = e.message || 'Failed to delete price book'
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

function startEditTiers(entry: PriceBookEntryWithTiers) {
  editingTiersEntryId.value = entry.id
  editingTiers.value = (entry.priceTiers ?? []).map((t) => ({
    minQuantity: t.minQuantity,
    maxQuantity: t.maxQuantity,
    tierPrice: parseFloat(t.tierPrice),
    tierType: t.tierType,
  }))
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
    tierType: 'UNIT_PRICE',
  })
}

function removeTier(index: number) {
  editingTiers.value.splice(index, 1)
}

async function saveTiers(entry: PriceBookEntryWithTiers) {
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
    if (tier.tierPrice < 0) {
      error.value = `Tier ${i + 1}: Price cannot be negative`
      return
    }
  }

  error.value = null
  const updated = await updatePriceBookEntry(priceBookId, entry.id, {
    listPrice: parseFloat(entry.listPrice),
    cost: entry.cost ? parseFloat(entry.cost) : null,
    tiers: editingTiers.value,
  })

  if (updated) {
    const idx = entries.value.findIndex((e) => e.id === entry.id)
    if (idx >= 0) {
      entries.value[idx] = updated
    }
    editingTiersEntryId.value = null
    editingTiers.value = []
  }
}

function getEntryTiers(entry: PriceBookEntry): PriceTier[] {
  return (entry as any).priceTiers || []
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <UButton
      to="/price-books"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Price Books
    </UButton>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
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

          <div class="grid grid-cols-2 gap-4">
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

        <dl v-else class="grid grid-cols-2 gap-4">
          <div>
            <dt class="text-sm text-gray-500">Currency</dt>
            <dd>{{ priceBook.currency ? `${priceBook.currency.code} (${priceBook.currency.symbol})` : 'Default' }}</dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">Products</dt>
            <dd>{{ priceBook._count.entries }}</dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">Valid From</dt>
            <dd>{{ priceBook.validFrom ? new Date(priceBook.validFrom).toLocaleDateString() : '—' }}</dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">Valid To</dt>
            <dd>{{ priceBook.validTo ? new Date(priceBook.validTo).toLocaleDateString() : '—' }}</dd>
          </div>
        </dl>
      </UCard>

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

        <div v-if="entries.length === 0" class="text-center py-8 text-gray-500">
          <UIcon name="i-heroicons-currency-dollar" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">List Price</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Margin</th>
                <th class="px-4 py-3"/>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
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
                        class="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                      >
                        {{ entry.product.name }}
                      </NuxtLink>
                      <UBadge v-if="getEntryTiers(entry).length > 0" size="xs" variant="subtle" color="info">
                        {{ getEntryTiers(entry).length }} tier{{ getEntryTiers(entry).length !== 1 ? 's' : '' }}
                      </UBadge>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ entry.product.sku }}</td>
                  <td class="px-4 py-3 text-right">
                    <template v-if="editingEntryId === entry.id">
                      <UInput
                        v-model.number="editingEntry.listPrice"
                        type="number"
                        step="0.01"
                        class="w-28 text-right"
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
                        class="w-28 text-right"
                        placeholder="—"
                      />
                    </template>
                    <template v-else>
                      {{ entry.cost ? formatPrice(entry.cost) : '—' }}
                    </template>
                  </td>
                  <td class="px-4 py-3 text-right text-sm">
                    <template v-if="entry.cost">
                      {{ Math.round((1 - parseFloat(entry.cost) / parseFloat(entry.listPrice)) * 100) }}%
                    </template>
                    <template v-else>—</template>
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
                <tr v-if="expandedEntryId === entry.id" class="bg-gray-50 dark:bg-gray-900">
                  <td colspan="6" class="px-4 py-4">
                    <div class="ml-8">
                      <div class="flex items-center justify-between mb-3">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Volume Pricing Tiers</h4>
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
                      <div v-if="editingTiersEntryId === entry.id" class="space-y-2">
                        <div v-if="editingTiers.length === 0" class="text-sm text-gray-500 py-2">
                          No tiers configured. Click "Add Tier" to create volume pricing.
                        </div>
                        <div
                          v-for="(tier, index) in editingTiers"
                          :key="index"
                          class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <UFormField label="Min Qty" class="w-24">
                            <UInput v-model.number="tier.minQuantity" type="number" min="1" />
                          </UFormField>
                          <UFormField label="Max Qty" class="w-24">
                            <UInput v-model.number="tier.maxQuantity" type="number" min="1" placeholder="No max" />
                          </UFormField>
                          <UFormField label="Price" class="w-28">
                            <UInput v-model.number="tier.tierPrice" type="number" step="0.01" min="0" />
                          </UFormField>
                          <UFormField label="Type" class="w-32">
                            <USelect v-model="tier.tierType" :items="tierTypeOptions" value-key="value" />
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
                        <div v-if="getEntryTiers(entry).length === 0" class="text-sm text-gray-500 py-2">
                          No volume pricing tiers configured.
                        </div>
                        <table v-else class="min-w-full text-sm">
                          <thead>
                            <tr class="text-left text-xs text-gray-500 uppercase">
                              <th class="pr-4 py-1">Quantity Range</th>
                              <th class="pr-4 py-1">Price</th>
                              <th class="py-1">Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="tier in getEntryTiers(entry)" :key="tier.id">
                              <td class="pr-4 py-1">
                                {{ tier.minQuantity }}{{ tier.maxQuantity ? ` - ${tier.maxQuantity}` : '+' }}
                              </td>
                              <td class="pr-4 py-1">{{ formatPrice(tier.tierPrice) }}</td>
                              <td class="py-1">
                                <UBadge size="xs" variant="subtle" :color="tier.tierType === 'UNIT_PRICE' ? 'primary' : 'info'">
                                  {{ tier.tierType === 'UNIT_PRICE' ? 'Per Unit' : 'Flat' }}
                                </UBadge>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
                :items="availableProducts.map(p => ({ label: `${p.name} (${p.sku})`, value: p.id }))"
                placeholder="Select a product"
                value-key="value"
              />
            </UFormField>

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
