<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const { createQuote } = useQuotes()
const { priceBooks, fetchPriceBooks } = usePricing()
const { currencies, fetchCurrencies } = useCurrencies()

const initialFormState = {
  name: '',
  customerId: (route.query.customerId as string) || null,
  priceBookId: undefined as string | undefined,
  currencyId: undefined as string | undefined,
}

const form = ref({ ...initialFormState })
const initialValues = ref({ ...initialFormState })

const { confirmLeave } = useUnsavedChanges(form, initialValues)

const loading = ref(false)
const error = ref<string | null>(null)

onMounted(() => {
  fetchPriceBooks()
  fetchCurrencies()
})

function handleCancel() {
  if (confirmLeave()) {
    router.push('/quotes')
  }
}

async function handleSubmit() {
  if (!form.value.name.trim()) {
    error.value = 'Quote name is required'
    return
  }

  loading.value = true
  error.value = null

  try {
    const quote = await createQuote({
      name: form.value.name.trim(),
      customerId: form.value.customerId || undefined,
      priceBookId: form.value.priceBookId || undefined,
      currencyId: form.value.currencyId || undefined,
    })

    if (quote) {
      router.push(`/quotes/${quote.id}`)
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to create quote'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UButton
      to="/quotes"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Quotes
    </UButton>

    <UCard :ui="{ body: 'overflow-visible' }">
      <template #header>
        <h1 class="text-xl font-bold">Create New Quote</h1>
      </template>

      <form class="space-y-4 overflow-visible" @submit.prevent="handleSubmit">
        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <UFormField label="Quote Name" required>
          <UInput
            v-model="form.name"
            placeholder="Enter quote name"
            icon="i-heroicons-document-text"
          />
        </UFormField>

        <UFormField label="Customer" hint="Optional for draft quotes, required for submission">
          <CpqCustomerSelector v-model="form.customerId" />
        </UFormField>

        <UFormField label="Currency" hint="Leave empty to use customer's currency or system default">
          <USelectMenu
            v-model="form.currencyId"
            :items="currencies.filter(c => c.isActive).map(c => ({ label: `${c.code} - ${c.name}`, value: c.id }))"
            placeholder="Use default"
            value-key="value"
          />
        </UFormField>

        <UFormField label="Price Book" hint="Leave empty to use customer's price book or system default">
          <USelectMenu
            v-model="form.priceBookId"
            :items="priceBooks.map(pb => ({ label: pb.name + (pb.isDefault ? ' (Default)' : ''), value: pb.id }))"
            placeholder="Use default"
            value-key="value"
          />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4">
          <UButton
            variant="ghost"
            :disabled="loading"
            @click="handleCancel"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            :loading="loading"
            icon="i-heroicons-plus"
          >
            Create Quote
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
