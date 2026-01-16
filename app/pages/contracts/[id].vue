<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
import type { ContractStatus, ContractWithPrices } from '~/composables/useContracts'

const _route = useRoute()
const router = useRouter()
const {
  fetchContract,
  updateContract,
  deleteContract,
  addPriceEntry,
  updatePriceEntry,
  deletePriceEntry,
  renewContract,
  getStatusColor,
  isContractActive,
} = useContracts()
const { customers, fetchCustomers } = useCustomers()
const { products, fetchProducts } = useProducts()
const { formatPrice } = usePricing()

const contractId = useRequiredParam('id')
const contract = ref<ContractWithPrices | null>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const isEditing = ref(false)

const form = ref({
  name: '',
  customerId: '',
  startDate: '',
  endDate: '',
  status: 'DRAFT' as ContractStatus,
  discountPercent: null as number | null,
})

// Price entry form
const showAddPrice = ref(false)
const newPriceEntry = ref({
  productId: '',
  fixedPrice: 0,
})
const editingPriceId = ref<string | null>(null)
const editingPrice = ref<number>(0)

// Renew form
const showRenewModal = ref(false)
const renewForm = ref({
  name: '',
  startDate: '',
  endDate: '',
  discountPercent: null as number | null,
  copyPrices: true,
})

onMounted(async () => {
  await Promise.all([loadContract(), fetchCustomers(), fetchProducts()])
})

async function loadContract() {
  loading.value = true
  error.value = null
  try {
    contract.value = await fetchContract(contractId)
    if (contract.value) {
      form.value = {
        name: contract.value.name,
        customerId: contract.value.customerId,
        startDate: contract.value.startDate.split('T')[0] ?? '',
        endDate: contract.value.endDate.split('T')[0] ?? '',
        status: contract.value.status,
        discountPercent: contract.value.discountPercent ? parseFloat(contract.value.discountPercent) : null,
      }
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to load contract')
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.value.name.trim()) {
    error.value = 'Contract name is required'
    return
  }

  saving.value = true
  error.value = null

  try {
    const updated = await updateContract(contractId, {
      name: form.value.name.trim(),
      customerId: form.value.customerId,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      status: form.value.status,
      discountPercent: form.value.discountPercent,
    })

    if (updated) {
      contract.value = updated
      isEditing.value = false
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to update contract')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!confirm('Are you sure you want to delete this contract?')) return

  try {
    await deleteContract(contractId)
    router.push('/contracts')
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to delete contract')
  }
}

function cancelEdit() {
  isEditing.value = false
  if (contract.value) {
    form.value = {
      name: contract.value.name,
      customerId: contract.value.customerId,
      startDate: contract.value.startDate.split('T')[0] ?? '',
      endDate: contract.value.endDate.split('T')[0] ?? '',
      status: contract.value.status,
      discountPercent: contract.value.discountPercent ? parseFloat(contract.value.discountPercent) : null,
    }
  }
}

// Price entry handlers
const availableProducts = computed(() => {
  if (!contract.value) return []
  const existingProductIds = new Set(contract.value.priceEntries.map((e) => e.productId))
  return products.value
    .filter((p) => !existingProductIds.has(p.id) && p.isActive)
    .map((p) => ({ label: `${p.name} (${p.sku})`, value: p.id }))
})

async function handleAddPrice() {
  if (!newPriceEntry.value.productId) {
    error.value = 'Please select a product'
    return
  }

  const entry = await addPriceEntry(contractId, {
    productId: newPriceEntry.value.productId,
    fixedPrice: newPriceEntry.value.fixedPrice,
  })

  if (entry) {
    await loadContract()
    showAddPrice.value = false
    newPriceEntry.value = { productId: '', fixedPrice: 0 }
  }
}

function startEditPrice(entryId: string, currentPrice: string) {
  editingPriceId.value = entryId
  editingPrice.value = parseFloat(currentPrice)
}

async function saveEditPrice(entryId: string) {
  const entry = await updatePriceEntry(contractId, entryId, {
    fixedPrice: editingPrice.value,
  })

  if (entry) {
    await loadContract()
    editingPriceId.value = null
  }
}

function cancelEditPrice() {
  editingPriceId.value = null
}

async function handleDeletePrice(entryId: string) {
  if (!confirm('Are you sure you want to remove this price entry?')) return

  const success = await deletePriceEntry(contractId, entryId)
  if (success) {
    await loadContract()
  }
}

// Renew handlers
function openRenewModal() {
  if (!contract.value) return
  const startDate = new Date(contract.value.endDate)
  startDate.setDate(startDate.getDate() + 1)
  const endDate = new Date(startDate)
  endDate.setFullYear(endDate.getFullYear() + 1)

  renewForm.value = {
    name: `${contract.value.name} (Renewed)`,
    startDate: startDate.toISOString().split('T')[0] ?? '',
    endDate: endDate.toISOString().split('T')[0] ?? '',
    discountPercent: contract.value.discountPercent ? parseFloat(contract.value.discountPercent) : null,
    copyPrices: true,
  }
  showRenewModal.value = true
}

async function handleRenew() {
  const newContract = await renewContract(contractId, {
    name: renewForm.value.name,
    startDate: renewForm.value.startDate,
    endDate: renewForm.value.endDate,
    discountPercent: renewForm.value.discountPercent,
    copyPrices: renewForm.value.copyPrices,
  })

  if (newContract) {
    showRenewModal.value = false
    router.push(`/contracts/${newContract.id}`)
  }
}

const statusOptions = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Expired', value: 'EXPIRED' },
]

const customerOptions = computed(() =>
  customers.value.map((c) => ({
    label: c.company ? `${c.name} (${c.company})` : c.name,
    value: c.id,
  }))
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <UButton
      to="/contracts"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Contracts
    </UButton>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error -->
    <UAlert v-else-if="error && !contract" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Not Found -->
    <UAlert v-else-if="!contract" color="warning" icon="i-heroicons-exclamation-triangle">
      <template #title>Contract not found</template>
    </UAlert>

    <!-- Contract Details -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold">{{ contract.name }}</h1>
          <p class="text-gray-500">
            {{ contract.customer.company || contract.customer.name }}
          </p>
          <div class="flex gap-2 mt-2">
            <UBadge :color="getStatusColor(contract.status)" variant="subtle">
              {{ contract.status }}
            </UBadge>
            <UBadge v-if="isContractActive(contract)" color="success" variant="outline">
              Currently Active
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
            v-if="contract.status !== 'DRAFT'"
            variant="soft"
            icon="i-heroicons-arrow-path"
            @click="openRenewModal"
          >
            Renew
          </UButton>
          <UButton
            variant="ghost"
            color="error"
            icon="i-heroicons-trash"
            @click="handleDelete"
          >
            Delete
          </UButton>
        </div>
      </div>

      <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle">
        <template #description>{{ error }}</template>
      </UAlert>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Info Card -->
        <UCard class="lg:col-span-2">
          <template #header>
            <h2 class="font-semibold">Contract Details</h2>
          </template>

          <form v-if="isEditing" class="space-y-4" @submit.prevent="handleSave">
            <UFormField label="Name" required>
              <UInput v-model="form.name" />
            </UFormField>

            <UFormField label="Customer" required>
              <USelect
                v-model="form.customerId"
                :items="customerOptions"
                value-key="value"
              />
            </UFormField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Start Date" required>
                <UInput v-model="form.startDate" type="date" />
              </UFormField>
              <UFormField label="End Date" required>
                <UInput v-model="form.endDate" type="date" />
              </UFormField>
            </div>

            <UFormField label="Default Discount %" hint="Applied to all products unless overridden">
              <UInput
                v-model.number="form.discountPercent"
                type="number"
                :min="0"
                :max="100"
                step="0.01"
                placeholder="No default discount"
              />
            </UFormField>

            <UFormField label="Status">
              <USelect v-model="form.status" :items="statusOptions" value-key="value" />
            </UFormField>

            <div class="flex justify-end gap-3 pt-4">
              <UButton variant="ghost" @click="cancelEdit">Cancel</UButton>
              <UButton type="submit" :loading="saving">Save Changes</UButton>
            </div>
          </form>

          <dl v-else class="space-y-4">
            <div class="flex justify-between">
              <dt class="text-gray-500">Customer</dt>
              <dd>
                <NuxtLink :to="`/customers/${contract.customer.id}`" class="text-primary-600 hover:underline">
                  {{ contract.customer.name }}
                </NuxtLink>
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Validity Period</dt>
              <dd>{{ formatDate(contract.startDate) }} - {{ formatDate(contract.endDate) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Default Discount</dt>
              <dd>
                <span v-if="contract.discountPercent">{{ contract.discountPercent }}%</span>
                <span v-else class="text-gray-400">None</span>
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Created</dt>
              <dd>{{ formatDate(contract.createdAt) }}</dd>
            </div>
          </dl>
        </UCard>

        <!-- Quick Stats Card -->
        <UCard>
          <template #header>
            <h2 class="font-semibold">Summary</h2>
          </template>

          <dl class="space-y-4">
            <div>
              <dt class="text-sm text-gray-500">Custom Prices</dt>
              <dd class="text-2xl font-bold">{{ contract.priceEntries.length }}</dd>
            </div>
            <div v-if="contract.discountPercent">
              <dt class="text-sm text-gray-500">Default Discount</dt>
              <dd class="text-2xl font-bold">{{ contract.discountPercent }}%</dd>
            </div>
          </dl>
        </UCard>
      </div>

      <!-- Price Entries Card -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Custom Product Prices</h2>
            <UButton
              v-if="!showAddPrice"
              variant="soft"
              size="sm"
              icon="i-heroicons-plus"
              @click="showAddPrice = true"
            >
              Add Price
            </UButton>
          </div>
        </template>

        <!-- Add Price Form -->
        <div v-if="showAddPrice" class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="font-medium mb-4">Add Custom Price</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UFormField label="Product" class="md:col-span-2">
              <USelect
                v-model="newPriceEntry.productId"
                placeholder="Select a product"
                :items="availableProducts"
                value-key="value"
              />
            </UFormField>
            <UFormField label="Fixed Price">
              <UInput
                v-model.number="newPriceEntry.fixedPrice"
                type="number"
                :min="0"
                step="0.01"
              />
            </UFormField>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <UButton variant="ghost" size="sm" @click="showAddPrice = false">Cancel</UButton>
            <UButton size="sm" @click="handleAddPrice">Add Price</UButton>
          </div>
        </div>

        <!-- Price Entries Table -->
        <div v-if="contract.priceEntries.length === 0 && !showAddPrice" class="text-center py-8 text-gray-500">
          <UIcon name="i-heroicons-tag" class="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>No custom prices defined</p>
          <p class="text-sm">Add product-specific prices to override the default discount</p>
        </div>

        <div v-else-if="contract.priceEntries.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SKU</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contract Price</th>
                <th class="px-4 py-3"/>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
              <tr
                v-for="entry in contract.priceEntries"
                :key="entry.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td class="px-4 py-3">
                  <NuxtLink :to="`/products/${entry.product.id}`" class="font-medium text-primary-600 hover:underline">
                    {{ entry.product.name }}
                  </NuxtLink>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">
                  {{ entry.product.sku }}
                </td>
                <td class="px-4 py-3">
                  <div v-if="editingPriceId === entry.id" class="flex items-center gap-2">
                    <UInput
                      v-model.number="editingPrice"
                      type="number"
                      :min="0"
                      step="0.01"
                      class="w-32"
                      size="sm"
                    />
                    <UButton size="xs" @click="saveEditPrice(entry.id)">Save</UButton>
                    <UButton variant="ghost" size="xs" @click="cancelEditPrice">Cancel</UButton>
                  </div>
                  <span v-else class="font-medium">{{ formatPrice(entry.fixedPrice) }}</span>
                </td>
                <td class="px-4 py-3">
                  <div v-if="editingPriceId !== entry.id" class="flex justify-end gap-2">
                    <UButton
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-pencil"
                      @click="startEditPrice(entry.id, entry.fixedPrice)"
                    />
                    <UButton
                      variant="ghost"
                      size="xs"
                      color="error"
                      icon="i-heroicons-trash"
                      @click="handleDeletePrice(entry.id)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>

    <!-- Renew Modal -->
    <UModal v-model:open="showRenewModal">
      <template #content>
        <UCard>
          <template #header>
            <h2 class="font-semibold">Renew Contract</h2>
          </template>

          <form class="space-y-4" @submit.prevent="handleRenew">
            <UFormField label="New Contract Name">
              <UInput v-model="renewForm.name" />
            </UFormField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Start Date">
                <UInput v-model="renewForm.startDate" type="date" />
              </UFormField>
              <UFormField label="End Date">
                <UInput v-model="renewForm.endDate" type="date" />
              </UFormField>
            </div>

            <UFormField label="Default Discount %">
              <UInput
                v-model.number="renewForm.discountPercent"
                type="number"
                :min="0"
                :max="100"
                step="0.01"
                placeholder="No default discount"
              />
            </UFormField>

            <UCheckbox v-model="renewForm.copyPrices" label="Copy custom product prices from current contract" />

            <div class="flex justify-end gap-3 pt-4">
              <UButton variant="ghost" @click="showRenewModal = false">Cancel</UButton>
              <UButton type="submit">Create Renewed Contract</UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
