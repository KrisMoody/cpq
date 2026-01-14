<script setup lang="ts">
const router = useRouter()
const { createCurrency, error } = useCurrencies()

const initialFormState = {
  code: '',
  name: '',
  symbol: '',
  isBase: false,
  exchangeRate: 1,
}

const form = ref({ ...initialFormState })
const initialValues = ref({ ...initialFormState })

const { confirmLeave } = useUnsavedChanges(form, initialValues)

const loading = ref(false)

function handleCancel() {
  if (confirmLeave()) {
    router.push('/currencies')
  }
}

async function handleSubmit() {
  if (!form.value.code.trim()) {
    return
  }
  if (!form.value.name.trim()) {
    return
  }
  if (!form.value.symbol.trim()) {
    return
  }

  loading.value = true

  const currency = await createCurrency({
    code: form.value.code.trim().toUpperCase(),
    name: form.value.name.trim(),
    symbol: form.value.symbol.trim(),
    isBase: form.value.isBase,
    exchangeRate: form.value.isBase ? undefined : form.value.exchangeRate,
  })

  loading.value = false

  if (currency) {
    router.push(`/currencies/${currency.id}`)
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UButton
      to="/currencies"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Currencies
    </UButton>

    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Add New Currency</h1>
      </template>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Currency Code" required hint="e.g., USD, EUR, GBP">
            <UInput
              v-model="form.code"
              placeholder="USD"
              maxlength="3"
              class="uppercase"
            />
          </UFormField>

          <UFormField label="Symbol" required hint="e.g., $, €, £">
            <UInput
              v-model="form.symbol"
              placeholder="$"
              maxlength="5"
            />
          </UFormField>
        </div>

        <UFormField label="Currency Name" required>
          <UInput
            v-model="form.name"
            placeholder="US Dollar"
          />
        </UFormField>

        <UCheckbox
          v-model="form.isBase"
          label="Set as base currency"
          hint="The base currency has an exchange rate of 1.0"
        />

        <UFormField
          v-if="!form.isBase"
          label="Exchange Rate"
          required
          hint="Rate relative to the base currency"
        >
          <UInput
            v-model.number="form.exchangeRate"
            type="number"
            step="0.0001"
            min="0.0001"
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
            Create Currency
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
