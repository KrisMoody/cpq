<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
const router = useRouter()
const { createPriceBook } = usePricing()
const { currencies, fetchCurrencies } = useCurrencies()
const { taxProfiles, fetchTaxProfiles } = useTaxProfiles()

const initialFormState = {
  name: '',
  currencyId: undefined as string | undefined,
  taxProfileId: undefined as string | undefined,
  isDefault: false,
  isActive: true,
  validFrom: '',
  validTo: '',
}

onMounted(() => {
  fetchCurrencies()
  fetchTaxProfiles()
})

const form = ref({ ...initialFormState })
const initialValues = ref({ ...initialFormState })

const { confirmLeave } = useUnsavedChanges(form, initialValues)

const loading = ref(false)
const error = ref<string | null>(null)

function handleCancel() {
  if (confirmLeave()) {
    router.push('/price-books')
  }
}

async function handleSubmit() {
  if (!form.value.name.trim()) {
    error.value = 'Price book name is required'
    return
  }

  loading.value = true
  error.value = null

  try {
    const priceBook = await createPriceBook({
      name: form.value.name.trim(),
      currencyId: form.value.currencyId || null,
      taxProfileId: form.value.taxProfileId || null,
      isDefault: form.value.isDefault,
      isActive: form.value.isActive,
      validFrom: form.value.validFrom || null,
      validTo: form.value.validTo || null,
    })

    if (priceBook) {
      router.push(`/price-books/${priceBook.id}`)
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to create price book')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Create New Price Book</h1>
      </template>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <UFormField label="Name" required>
          <UInput
            v-model="form.name"
            placeholder="Enter price book name"
            icon="i-heroicons-book-open"
          />
        </UFormField>

        <UFormField label="Currency" hint="Prices in this book will be in this currency">
          <USelect
            v-model="form.currencyId"
            :items="currencies.filter(c => c.isActive).map(c => ({ label: `${c.code} - ${c.name}`, value: c.id }))"
            placeholder="Select currency"
            value-key="value"
          />
        </UFormField>

        <UFormField label="Tax Profile" hint="Default tax rates for quotes using this price book">
          <USelect
            v-model="form.taxProfileId"
            :items="taxProfiles.filter(p => p.isActive).map(p => ({ label: `${p.name} (${p.country})`, value: p.id }))"
            placeholder="No tax profile"
            value-key="value"
          />
        </UFormField>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField label="Valid From" hint="Optional start date">
            <UInput
              v-model="form.validFrom"
              type="date"
            />
          </UFormField>

          <UFormField label="Valid To" hint="Optional end date">
            <UInput
              v-model="form.validTo"
              type="date"
            />
          </UFormField>
        </div>

        <div class="space-y-3">
          <UCheckbox
            v-model="form.isDefault"
            label="Set as default price book"
            hint="New quotes will use this price book by default"
          />

          <UCheckbox
            v-model="form.isActive"
            label="Active"
            hint="Inactive price books cannot be used for new quotes"
          />
        </div>

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
            Create Price Book
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
