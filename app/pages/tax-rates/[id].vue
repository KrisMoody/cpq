<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { fetchTaxRate, updateTaxRate, deleteTaxRate, formatRate, error } = useTaxRates()
const { categories, fetchCategories } = useCategories()

const taxRateId = route.params.id as string
const taxRate = ref<Awaited<ReturnType<typeof fetchTaxRate>> | null>(null)
const loading = ref(true)
const saving = ref(false)
const isEditing = ref(false)

const form = ref({
  name: '',
  ratePercent: '',
  country: '',
  state: '',
  categoryId: undefined as string | undefined,
  validFrom: '',
  validTo: '',
  isActive: true,
})

onMounted(async () => {
  await Promise.all([loadTaxRate(), fetchCategories()])
})

async function loadTaxRate() {
  loading.value = true
  try {
    taxRate.value = await fetchTaxRate(taxRateId)
    if (taxRate.value) {
      const ratePercent = parseFloat(taxRate.value.rate) * 100
      form.value = {
        name: taxRate.value.name,
        ratePercent: ratePercent.toFixed(2),
        country: taxRate.value.country,
        state: taxRate.value.state ?? '',
        categoryId: taxRate.value.categoryId ?? undefined,
        validFrom: taxRate.value.validFrom?.split('T')[0] ?? '',
        validTo: taxRate.value.validTo?.split('T')[0] ?? '',
        isActive: taxRate.value.isActive,
      }
    }
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.value.name.trim() || !form.value.ratePercent || !form.value.country.trim()) {
    return
  }

  saving.value = true

  const rateDecimal = parseFloat(form.value.ratePercent) / 100

  const updated = await updateTaxRate(taxRateId, {
    name: form.value.name.trim(),
    rate: rateDecimal,
    country: form.value.country.trim(),
    state: form.value.state.trim() || null,
    categoryId: form.value.categoryId || null,
    validFrom: form.value.validFrom || null,
    validTo: form.value.validTo || null,
    isActive: form.value.isActive,
  })

  saving.value = false

  if (updated) {
    await loadTaxRate()
    isEditing.value = false
  }
}

async function handleDelete() {
  if (!confirm('Are you sure you want to deactivate this tax rate?')) return

  const success = await deleteTaxRate(taxRateId)
  if (success) {
    router.push('/tax-rates')
  }
}

function cancelEdit() {
  isEditing.value = false
  if (taxRate.value) {
    const ratePercent = parseFloat(taxRate.value.rate) * 100
    form.value = {
      name: taxRate.value.name,
      ratePercent: ratePercent.toFixed(2),
      country: taxRate.value.country,
      state: taxRate.value.state ?? '',
      categoryId: taxRate.value.categoryId ?? '',
      validFrom: taxRate.value.validFrom?.split('T')[0] ?? '',
      validTo: taxRate.value.validTo?.split('T')[0] ?? '',
      isActive: taxRate.value.isActive,
    }
  }
}

const categoryOptions = computed(() =>
  categories.value.map((c) => ({ label: c.name, value: c.id }))
)
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UButton
      to="/tax-rates"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Tax Rates
    </UButton>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Not Found -->
    <UAlert v-else-if="!taxRate" color="warning" icon="i-heroicons-exclamation-triangle">
      <template #title>Tax rate not found</template>
    </UAlert>

    <!-- Tax Rate Details -->
    <UCard v-else>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold">{{ taxRate.name }}</h1>
            <p class="text-gray-500 text-sm">{{ formatRate(taxRate.rate) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <UBadge v-if="!taxRate.isActive" color="warning" variant="subtle">Inactive</UBadge>
            <UButton
              v-if="!isEditing"
              variant="soft"
              icon="i-heroicons-pencil"
              @click="isEditing = true"
            >
              Edit
            </UButton>
            <UButton
              v-if="taxRate.isActive"
              variant="ghost"
              color="error"
              icon="i-heroicons-trash"
              @click="handleDelete"
            />
          </div>
        </div>
      </template>

      <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
        <template #description>{{ error }}</template>
      </UAlert>

      <form v-if="isEditing" class="space-y-4" @submit.prevent="handleSave">
        <UFormField label="Name" required>
          <UInput v-model="form.name" />
        </UFormField>

        <UFormField label="Rate (%)" required>
          <UInput
            v-model="form.ratePercent"
            type="number"
            step="0.01"
            min="0"
            max="100"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Country" required>
            <UInput v-model="form.country" />
          </UFormField>
          <UFormField label="State/Region">
            <UInput v-model="form.state" />
          </UFormField>
        </div>

        <UFormField label="Product Category">
          <USelect v-model="form.categoryId" :items="categoryOptions" value-key="value" placeholder="All Products" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Valid From">
            <UInput v-model="form.validFrom" type="date" />
          </UFormField>
          <UFormField label="Valid To">
            <UInput v-model="form.validTo" type="date" />
          </UFormField>
        </div>

        <UCheckbox v-model="form.isActive" label="Active" />

        <div class="flex justify-end gap-3 pt-4">
          <UButton variant="ghost" @click="cancelEdit">Cancel</UButton>
          <UButton type="submit" :loading="saving">Save Changes</UButton>
        </div>
      </form>

      <dl v-else class="space-y-4">
        <div class="flex justify-between">
          <dt class="text-gray-500">Rate</dt>
          <dd class="font-mono font-medium">{{ formatRate(taxRate.rate) }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-gray-500">Country</dt>
          <dd>{{ taxRate.country }}</dd>
        </div>
        <div v-if="taxRate.state" class="flex justify-between">
          <dt class="text-gray-500">State/Region</dt>
          <dd>{{ taxRate.state }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-gray-500">Product Category</dt>
          <dd>{{ taxRate.category?.name || 'All Products' }}</dd>
        </div>
        <div v-if="taxRate.validFrom" class="flex justify-between">
          <dt class="text-gray-500">Valid From</dt>
          <dd>{{ new Date(taxRate.validFrom).toLocaleDateString() }}</dd>
        </div>
        <div v-if="taxRate.validTo" class="flex justify-between">
          <dt class="text-gray-500">Valid To</dt>
          <dd>{{ new Date(taxRate.validTo).toLocaleDateString() }}</dd>
        </div>
      </dl>
    </UCard>
  </div>
</template>
