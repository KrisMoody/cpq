<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { fetchCustomer, updateCustomer, deleteCustomer } = useCustomers()
const { priceBooks, fetchPriceBooks, formatPrice } = usePricing()
const { contracts, fetchContracts, getStatusColor, isContractActive: _isContractActive } = useContracts()
const { currencies, fetchCurrencies } = useCurrencies()

const customerId = route.params.id as string
const customer = ref<Awaited<ReturnType<typeof fetchCustomer>> | null>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const isEditing = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  priceBookId: '',
  currencyId: '',
  isTaxExempt: false,
  taxExemptReason: '',
  taxExemptCertificate: '',
  taxExemptExpiry: '',
  isActive: true,
})

const isTaxExemptExpired = computed(() => {
  if (!customer.value?.taxExemptExpiry) return false
  return new Date(customer.value.taxExemptExpiry) < new Date()
})

onMounted(async () => {
  await Promise.all([loadCustomer(), fetchPriceBooks(), fetchCurrencies()])
  // Fetch contracts for this customer after customer is loaded
  await fetchContracts({ customerId: customerId })
})

const customerContracts = computed(() => contracts.value)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

async function loadCustomer() {
  loading.value = true
  error.value = null
  try {
    customer.value = await fetchCustomer(customerId)
    if (customer.value) {
      form.value = {
        name: customer.value.name,
        email: customer.value.email ?? '',
        phone: customer.value.phone ?? '',
        company: customer.value.company ?? '',
        street: customer.value.street ?? '',
        city: customer.value.city ?? '',
        state: customer.value.state ?? '',
        postalCode: customer.value.postalCode ?? '',
        country: customer.value.country ?? '',
        priceBookId: customer.value.priceBookId ?? '',
        currencyId: customer.value.currencyId ?? '',
        isTaxExempt: customer.value.isTaxExempt ?? false,
        taxExemptReason: customer.value.taxExemptReason ?? '',
        taxExemptCertificate: customer.value.taxExemptCertificate ?? '',
        taxExemptExpiry: customer.value.taxExemptExpiry?.split('T')[0] ?? '',
        isActive: customer.value.isActive,
      }
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load customer'
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.value.name.trim()) {
    error.value = 'Customer name is required'
    return
  }

  saving.value = true
  error.value = null

  try {
    const updated = await updateCustomer(customerId, {
      name: form.value.name.trim(),
      email: form.value.email.trim() || null,
      phone: form.value.phone.trim() || null,
      company: form.value.company.trim() || null,
      street: form.value.street.trim() || null,
      city: form.value.city.trim() || null,
      state: form.value.state.trim() || null,
      postalCode: form.value.postalCode.trim() || null,
      country: form.value.country.trim() || null,
      priceBookId: form.value.priceBookId || null,
      currencyId: form.value.currencyId || null,
      isTaxExempt: form.value.isTaxExempt,
      taxExemptReason: form.value.taxExemptReason.trim() || null,
      taxExemptCertificate: form.value.taxExemptCertificate.trim() || null,
      taxExemptExpiry: form.value.taxExemptExpiry || null,
      isActive: form.value.isActive,
    })

    if (updated) {
      await loadCustomer()
      isEditing.value = false
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to update customer'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!confirm('Are you sure you want to deactivate this customer?')) return

  try {
    await deleteCustomer(customerId)
    router.push('/customers')
  } catch (e: any) {
    error.value = e.message || 'Failed to delete customer'
  }
}

function cancelEdit() {
  isEditing.value = false
  if (customer.value) {
    form.value = {
      name: customer.value.name,
      email: customer.value.email ?? '',
      phone: customer.value.phone ?? '',
      company: customer.value.company ?? '',
      street: customer.value.street ?? '',
      city: customer.value.city ?? '',
      state: customer.value.state ?? '',
      postalCode: customer.value.postalCode ?? '',
      country: customer.value.country ?? '',
      priceBookId: customer.value.priceBookId ?? '',
      currencyId: customer.value.currencyId ?? '',
      isTaxExempt: customer.value.isTaxExempt ?? false,
      taxExemptReason: customer.value.taxExemptReason ?? '',
      taxExemptCertificate: customer.value.taxExemptCertificate ?? '',
      taxExemptExpiry: customer.value.taxExemptExpiry?.split('T')[0] ?? '',
      isActive: customer.value.isActive,
    }
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <UButton
      to="/customers"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Customers
    </UButton>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error -->
    <UAlert v-else-if="error && !customer" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Not Found -->
    <UAlert v-else-if="!customer" color="warning" icon="i-heroicons-exclamation-triangle">
      <template #title>Customer not found</template>
    </UAlert>

    <!-- Customer Details -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold">{{ customer.name }}</h1>
          <p v-if="customer.company" class="text-gray-500">{{ customer.company }}</p>
          <UBadge v-if="!customer.isActive" color="warning" variant="subtle" class="mt-2">
            Inactive
          </UBadge>
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
            v-if="customer.isActive"
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

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Info Card -->
        <UCard class="lg:col-span-2">
          <template #header>
            <h2 class="font-semibold">Customer Information</h2>
          </template>

          <form v-if="isEditing" class="space-y-4" @submit.prevent="handleSave">
            <UFormField label="Name" required>
              <UInput v-model="form.name" />
            </UFormField>

            <UFormField label="Company">
              <UInput v-model="form.company" />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Email">
                <UInput v-model="form.email" type="email" />
              </UFormField>
              <UFormField label="Phone">
                <UInput v-model="form.phone" />
              </UFormField>
            </div>

            <UFormField label="Street">
              <UInput v-model="form.street" />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="City">
                <UInput v-model="form.city" />
              </UFormField>
              <UFormField label="State">
                <UInput v-model="form.state" />
              </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Postal Code">
                <UInput v-model="form.postalCode" />
              </UFormField>
              <UFormField label="Country">
                <UInput v-model="form.country" />
              </UFormField>
            </div>

            <UFormField label="Currency">
              <USelect
                v-model="form.currencyId"
                placeholder="Use default"
                :items="currencies.filter(c => c.isActive).map(c => ({ label: `${c.code} - ${c.name}`, value: c.id }))"
                value-key="value"
              />
            </UFormField>

            <UFormField label="Price Book">
              <USelect
                v-model="form.priceBookId"
                placeholder="Use default"
                :items="priceBooks.map(pb => ({ label: pb.name, value: pb.id }))"
                value-key="value"
              />
            </UFormField>

            <!-- Tax Exemption Section -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h3 class="font-medium mb-3">Tax Exemption</h3>

              <UCheckbox v-model="form.isTaxExempt" label="Tax Exempt" class="mb-4" />

              <div v-if="form.isTaxExempt" class="space-y-4 pl-6">
                <UFormField label="Exemption Reason">
                  <UInput v-model="form.taxExemptReason" placeholder="e.g., Non-profit organization" />
                </UFormField>

                <UFormField label="Certificate Number">
                  <UInput v-model="form.taxExemptCertificate" placeholder="Tax exemption certificate number" />
                </UFormField>

                <UFormField label="Expiry Date">
                  <UInput v-model="form.taxExemptExpiry" type="date" />
                </UFormField>
              </div>
            </div>

            <UCheckbox v-model="form.isActive" label="Active" />

            <div class="flex justify-end gap-3 pt-4">
              <UButton variant="ghost" @click="cancelEdit">Cancel</UButton>
              <UButton type="submit" :loading="saving">Save Changes</UButton>
            </div>
          </form>

          <dl v-else class="space-y-4">
            <div v-if="customer.email" class="flex items-center gap-3">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400" />
              <span>{{ customer.email }}</span>
            </div>
            <div v-if="customer.phone" class="flex items-center gap-3">
              <UIcon name="i-heroicons-phone" class="w-5 h-5 text-gray-400" />
              <span>{{ customer.phone }}</span>
            </div>
            <div v-if="customer.street || customer.city" class="flex items-start gap-3">
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p v-if="customer.street">{{ customer.street }}</p>
                <p>
                  {{ [customer.city, customer.state, customer.postalCode].filter(Boolean).join(', ') }}
                </p>
                <p v-if="customer.country">{{ customer.country }}</p>
              </div>
            </div>
            <div v-if="customer.currency" class="flex items-center gap-3">
              <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 text-gray-400" />
              <span>Currency: {{ customer.currency.code }} ({{ customer.currency.symbol }})</span>
            </div>
            <div v-if="customer.priceBook" class="flex items-center gap-3">
              <UIcon name="i-heroicons-book-open" class="w-5 h-5 text-gray-400" />
              <span>Price Book: {{ customer.priceBook.name }}</span>
            </div>

            <!-- Tax Exemption Status -->
            <div v-if="customer.isTaxExempt" class="border-t pt-4 mt-4 dark:border-gray-700">
              <div class="flex items-center gap-2 mb-3">
                <UIcon name="i-heroicons-receipt-percent" class="w-5 h-5 text-gray-400" />
                <UBadge
                  :color="isTaxExemptExpired ? 'warning' : 'success'"
                  variant="subtle"
                >
                  Tax Exempt{{ isTaxExemptExpired ? ' (Expired)' : '' }}
                </UBadge>
              </div>
              <div class="ml-7 space-y-1 text-sm">
                <p v-if="customer.taxExemptReason" class="text-gray-600 dark:text-gray-300">
                  <span class="text-gray-500">Reason:</span> {{ customer.taxExemptReason }}
                </p>
                <p v-if="customer.taxExemptCertificate" class="text-gray-600 dark:text-gray-300">
                  <span class="text-gray-500">Certificate:</span> {{ customer.taxExemptCertificate }}
                </p>
                <p v-if="customer.taxExemptExpiry" class="text-gray-600 dark:text-gray-300">
                  <span class="text-gray-500">Expires:</span>
                  <span :class="{ 'text-warning-500': isTaxExemptExpired }">
                    {{ new Date(customer.taxExemptExpiry).toLocaleDateString() }}
                  </span>
                </p>
              </div>
            </div>
          </dl>
        </UCard>

        <!-- Recent Quotes Card -->
        <UCard>
          <template #header>
            <h2 class="font-semibold">Recent Quotes</h2>
          </template>

          <div v-if="customer.quotes?.length === 0" class="text-center py-4 text-gray-500">
            No quotes yet
          </div>

          <div v-else class="space-y-3">
            <NuxtLink
              v-for="quote in customer.quotes"
              :key="quote.id"
              :to="`/quotes/${quote.id}`"
              class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium text-primary-600 dark:text-primary-400">{{ quote.name }}</p>
                  <p class="text-xs text-gray-500">
                    {{ new Date(quote.createdAt).toLocaleDateString() }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-medium">{{ formatPrice(quote.total) }}</p>
                  <UBadge size="xs" variant="subtle">{{ quote.status }}</UBadge>
                </div>
              </div>
            </NuxtLink>
          </div>

          <template #footer>
            <UButton
              :to="`/quotes/new?customerId=${customer.id}`"
              variant="soft"
              block
              icon="i-heroicons-plus"
            >
              Create Quote
            </UButton>
          </template>
        </UCard>
      </div>

      <!-- Contracts Section -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Contracts</h2>
            <UButton
              :to="`/contracts/new?customerId=${customer.id}`"
              variant="soft"
              size="sm"
              icon="i-heroicons-plus"
            >
              New Contract
            </UButton>
          </div>
        </template>

        <div v-if="customerContracts.length === 0" class="text-center py-8 text-gray-500">
          <UIcon name="i-heroicons-document-text" class="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>No contracts for this customer</p>
        </div>

        <div v-else class="space-y-3">
          <NuxtLink
            v-for="contract in customerContracts"
            :key="contract.id"
            :to="`/contracts/${contract.id}`"
            class="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium text-primary-600 dark:text-primary-400">{{ contract.name }}</p>
                <p class="text-sm text-gray-500">
                  {{ formatDate(contract.startDate) }} - {{ formatDate(contract.endDate) }}
                </p>
                <p v-if="contract.priceEntryCount" class="text-xs text-gray-400 mt-1">
                  {{ contract.priceEntryCount }} custom price{{ contract.priceEntryCount !== 1 ? 's' : '' }}
                </p>
              </div>
              <div class="text-right">
                <UBadge :color="getStatusColor(contract.status) as any" variant="subtle">
                  {{ contract.status }}
                </UBadge>
                <p v-if="contract.discountPercent" class="text-sm text-gray-500 mt-1">
                  {{ contract.discountPercent }}% off
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </UCard>
    </div>
  </div>
</template>
