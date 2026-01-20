<script setup lang="ts">
const router = useRouter()
const { createTaxRate, error } = useTaxRates()
const { categories, fetchCategories } = useCategories()

const saving = ref(false)

const initialFormState = {
  name: '',
  ratePercent: '', // User enters percentage (e.g., "8.25")
  country: '',
  state: '',
  categoryId: undefined as string | undefined,
  validFrom: '',
  validTo: '',
}

const form = ref({ ...initialFormState })
const initialValues = ref({ ...initialFormState })

const { confirmLeave } = useUnsavedChanges(form, initialValues)

onMounted(async () => {
  await fetchCategories()
})

function handleCancel() {
  if (confirmLeave()) {
    router.push('/tax-rates')
  }
}

async function handleSubmit() {
  if (!form.value.name.trim()) {
    return
  }

  if (!form.value.ratePercent) {
    return
  }

  if (!form.value.country.trim()) {
    return
  }

  saving.value = true

  // Convert percentage to decimal (e.g., 8.25 -> 0.0825)
  const rateDecimal = parseFloat(form.value.ratePercent) / 100

  const taxRate = await createTaxRate({
    name: form.value.name.trim(),
    rate: rateDecimal,
    country: form.value.country.trim(),
    state: form.value.state.trim() || undefined,
    categoryId: form.value.categoryId || undefined,
    validFrom: form.value.validFrom || undefined,
    validTo: form.value.validTo || undefined,
  })

  saving.value = false

  if (taxRate) {
    router.push('/tax-rates')
  }
}

const categoryOptions = computed(() =>
  categories.value
    .filter((c) => c.isActive)
    .map((c) => ({ label: c.name, value: c.id }))
)
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Create Tax Rate</h1>
      </template>

      <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
        <template #description>{{ error }}</template>
      </UAlert>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField label="Name" required>
          <UInput v-model="form.name" placeholder="e.g., California State Tax" />
        </UFormField>

        <UFormField label="Rate (%)" required>
          <UInput
            v-model="form.ratePercent"
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="e.g., 8.25"
            class="w-20"
          />
          <template #hint>
            Enter the tax rate as a percentage (e.g., 8.25 for 8.25%)
          </template>
        </UFormField>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField label="Country" required>
            <UInput v-model="form.country" placeholder="e.g., USA" />
          </UFormField>
          <UFormField label="State/Region">
            <UInput v-model="form.state" placeholder="e.g., CA" />
            <template #hint>
              Leave blank for country-level tax
            </template>
          </UFormField>
        </div>

        <UFormField label="Product Category">
          <USelect
            v-model="form.categoryId"
            :items="categoryOptions"
            value-key="value"
            placeholder="All Products"
          />
          <template #hint>
            Apply this tax only to specific product category, or all products
          </template>
        </UFormField>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField label="Valid From">
            <UInput v-model="form.validFrom" type="date" />
          </UFormField>
          <UFormField label="Valid To">
            <UInput v-model="form.validTo" type="date" />
          </UFormField>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <UButton variant="ghost" @click="handleCancel">Cancel</UButton>
          <UButton type="submit" :loading="saving">Create Tax Rate</UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
