<script setup lang="ts">
import type { CurrencyWithCounts, ExchangeRate } from '~/composables/useCurrencies'

const _route = useRoute()
const router = useRouter()
const {
  fetchCurrency,
  updateCurrency,
  deleteCurrency,
  fetchExchangeRates,
  addExchangeRate,
  error,
} = useCurrencies()

const currencyId = useRequiredParam('id')
const currency = ref<CurrencyWithCounts | null>(null)
const exchangeRates = ref<ExchangeRate[]>([])
const loading = ref(true)
const saving = ref(false)
const isEditing = ref(false)

const form = ref({
  name: '',
  symbol: '',
  isBase: false,
  isActive: true,
})

// New exchange rate form
const showAddRate = ref(false)
const newRate = ref({
  rate: 1,
  effectiveDate: new Date().toISOString().split('T')[0],
})

onMounted(async () => {
  await loadCurrency()
})

async function loadCurrency() {
  loading.value = true
  try {
    currency.value = await fetchCurrency(currencyId)
    if (currency.value) {
      form.value = {
        name: currency.value.name,
        symbol: currency.value.symbol,
        isBase: currency.value.isBase,
        isActive: currency.value.isActive,
      }
      exchangeRates.value = await fetchExchangeRates(currencyId)
    }
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.value.name.trim() || !form.value.symbol.trim()) {
    return
  }

  saving.value = true

  const updated = await updateCurrency(currencyId, {
    name: form.value.name.trim(),
    symbol: form.value.symbol.trim(),
    isBase: form.value.isBase,
    isActive: form.value.isActive,
  })

  saving.value = false

  if (updated) {
    await loadCurrency()
    isEditing.value = false
  }
}

async function handleDelete() {
  if (!confirm('Are you sure you want to deactivate this currency?')) return

  const success = await deleteCurrency(currencyId)
  if (success) {
    router.push('/currencies')
  }
}

function cancelEdit() {
  isEditing.value = false
  if (currency.value) {
    form.value = {
      name: currency.value.name,
      symbol: currency.value.symbol,
      isBase: currency.value.isBase,
      isActive: currency.value.isActive,
    }
  }
}

async function handleAddRate() {
  if (!newRate.value.rate || newRate.value.rate <= 0) {
    return
  }

  const rate = await addExchangeRate(currencyId, {
    rate: newRate.value.rate,
    effectiveDate: newRate.value.effectiveDate || undefined,
  })

  if (rate) {
    exchangeRates.value.unshift(rate)
    showAddRate.value = false
    newRate.value = {
      rate: 1,
      effectiveDate: new Date().toISOString().split('T')[0],
    }
    await loadCurrency()
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-ga-navy-500" />
    </div>

    <!-- Not Found -->
    <UAlert v-else-if="!currency" color="warning" icon="i-heroicons-exclamation-triangle">
      <template #title>Currency not found</template>
    </UAlert>

    <!-- Currency Details -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold">{{ currency.code }}</h1>
          <p class="text-ga-gray-600">{{ currency.name }}</p>
          <div class="flex items-center gap-2 mt-2">
            <UBadge v-if="currency.isBase" color="primary" variant="subtle">Base Currency</UBadge>
            <UBadge v-if="!currency.isActive" color="warning" variant="subtle">Inactive</UBadge>
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
            v-if="currency.isActive && !currency.isBase"
            variant="ghost"
            color="error"
            icon="i-heroicons-trash"
            @click="handleDelete"
          />
        </div>
      </div>

      <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle">
        <template #description>{{ error }}</template>
      </UAlert>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Details Card -->
        <UCard class="lg:col-span-2">
          <template #header>
            <h2 class="font-semibold">Currency Details</h2>
          </template>

          <form v-if="isEditing" class="space-y-4" @submit.prevent="handleSave">
            <UFormField label="Name" required>
              <UInput v-model="form.name" />
            </UFormField>

            <UFormField label="Symbol" required>
              <UInput v-model="form.symbol" maxlength="5" class="w-20" />
            </UFormField>

            <div class="space-y-3">
              <UCheckbox
                v-model="form.isBase"
                label="Base currency"
                hint="Setting as base will change the exchange rate to 1.0"
              />
              <UCheckbox v-model="form.isActive" label="Active" />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <UButton variant="ghost" @click="cancelEdit">Cancel</UButton>
              <UButton type="submit" :loading="saving">Save Changes</UButton>
            </div>
          </form>

          <dl v-else class="space-y-4">
            <div class="flex justify-between">
              <dt class="text-ga-gray-600">Code</dt>
              <dd class="font-mono font-medium">{{ currency.code }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-ga-gray-600">Name</dt>
              <dd>{{ currency.name }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-ga-gray-600">Symbol</dt>
              <dd class="font-mono">{{ currency.symbol }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-ga-gray-600">Current Rate</dt>
              <dd class="font-mono">
                <template v-if="currency.isBase">1.0000 (Base)</template>
                <template v-else>{{ currency.currentRate?.toFixed(4) ?? '—' }}</template>
              </dd>
            </div>
          </dl>
        </UCard>

        <!-- Usage Stats Card -->
        <UCard>
          <template #header>
            <h2 class="font-semibold">Usage</h2>
          </template>

          <dl class="space-y-4">
            <div class="flex justify-between">
              <dt class="text-ga-gray-600">Price Books</dt>
              <dd class="font-medium">{{ currency._count?.priceBooks ?? 0 }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-ga-gray-600">Quotes</dt>
              <dd class="font-medium">{{ currency._count?.quotes ?? 0 }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-ga-gray-600">Customers</dt>
              <dd class="font-medium">{{ currency._count?.customers ?? 0 }}</dd>
            </div>
          </dl>
        </UCard>
      </div>

      <!-- Exchange Rate History -->
      <UCard v-if="!currency.isBase">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Exchange Rate History</h2>
            <UButton
              size="sm"
              icon="i-heroicons-plus"
              @click="showAddRate = true"
            >
              Add Rate
            </UButton>
          </div>
        </template>

        <div v-if="exchangeRates.length === 0" class="text-center py-8 text-ga-gray-600">
          No exchange rate history.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-ga-gray-300">
                <th class="text-left py-3 px-4 font-medium text-ga-gray-600">Effective Date</th>
                <th class="text-right py-3 px-4 font-medium text-ga-gray-600">Rate</th>
                <th class="text-right py-3 px-4 font-medium text-ga-gray-600">Added</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(rate, index) in exchangeRates"
                :key="rate.id"
                class="border-b border-ga-gray-200"
                :class="{ 'bg-ga-navy-50': index === 0 }"
              >
                <td class="py-3 px-4">
                  {{ formatDate(rate.effectiveDate) }}
                  <UBadge v-if="index === 0" size="xs" color="primary" variant="subtle" class="ml-2">
                    Current
                  </UBadge>
                </td>
                <td class="py-3 px-4 text-right font-mono">
                  {{ parseFloat(rate.rate).toFixed(4) }}
                </td>
                <td class="py-3 px-4 text-right text-sm text-ga-gray-600">
                  {{ formatDate(rate.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>

    <!-- Add Exchange Rate Modal -->
    <UModal v-model:open="showAddRate" title="Add Exchange Rate">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">Add Exchange Rate</h3>
          </template>

          <div class="space-y-4">
            <UFormField label="Exchange Rate" required hint="Rate relative to the base currency">
              <UInput
                v-model.number="newRate.rate"
                type="number"
                step="0.0001"
                min="0.0001"
                class="w-28"
              />
            </UFormField>

            <UFormField label="Effective Date" hint="When this rate becomes active">
              <UInput
                v-model="newRate.effectiveDate"
                type="date"
                class="w-40"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" @click="showAddRate = false">Cancel</UButton>
              <UButton @click="handleAddRate">Add Rate</UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
