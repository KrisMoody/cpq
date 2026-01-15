<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
import type { ProductType, BillingFrequency } from '~/generated/prisma/client'

const router = useRouter()
const { createProduct, error: productError } = useProducts()
const { units, fetchUnits } = useUnits()

const initialFormState = {
  name: '',
  sku: '',
  description: '',
  type: 'STANDALONE' as ProductType,
  billingFrequency: 'ONE_TIME' as BillingFrequency,
  customBillingMonths: null as number | null,
  defaultTermMonths: null as number | null,
  unitOfMeasureId: null as string | null,
}

const form = ref({ ...initialFormState })
const initialValues = ref({ ...initialFormState })

const { confirmLeave } = useUnsavedChanges(form, initialValues)

const loading = ref(false)
const error = ref<string | null>(null)

function handleCancel() {
  if (confirmLeave()) {
    router.push('/products')
  }
}

const productTypes = [
  { label: 'Standalone Product', value: 'STANDALONE' },
  { label: 'Bundle (Configurable)', value: 'BUNDLE' },
]

const billingFrequencies = [
  { label: 'One-Time', value: 'ONE_TIME' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Quarterly', value: 'QUARTERLY' },
  { label: 'Annual', value: 'ANNUAL' },
  { label: 'Custom', value: 'CUSTOM' },
]

const isRecurring = computed(() => form.value.billingFrequency !== 'ONE_TIME')
const isCustomFrequency = computed(() => form.value.billingFrequency === 'CUSTOM')

const unitOptions = computed(() => [
  { label: 'No unit selected', value: null },
  ...units.value.map((u) => ({ label: `${u.name} (${u.abbreviation})`, value: u.id })),
])

onMounted(() => {
  fetchUnits()
})

async function handleSubmit() {
  // Client-side validation
  if (!form.value.name.trim()) {
    error.value = 'Product name is required'
    return
  }
  if (!form.value.sku.trim()) {
    error.value = 'SKU is required'
    return
  }

  loading.value = true
  error.value = null

  try {
    const product = await createProduct({
      name: form.value.name.trim(),
      sku: form.value.sku.trim(),
      description: form.value.description.trim() || undefined,
      type: form.value.type,
      billingFrequency: form.value.billingFrequency,
      customBillingMonths: form.value.customBillingMonths || undefined,
      defaultTermMonths: form.value.defaultTermMonths || undefined,
      unitOfMeasureId: form.value.unitOfMeasureId || undefined,
    })

    if (product) {
      router.push(`/products/${product.id}`)
    } else {
      error.value = productError.value || 'Failed to create product'
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to create product')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UButton
      to="/products"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Products
    </UButton>

    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Create New Product</h1>
      </template>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <!-- Basic Info -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Basic Information</h3>

          <UFormField label="Name" required>
            <UInput
              v-model="form.name"
              placeholder="Enter product name"
              icon="i-heroicons-cube"
            />
          </UFormField>

          <UFormField label="SKU" required hint="Unique product identifier">
            <UInput
              v-model="form.sku"
              placeholder="e.g., PROD-001"
              icon="i-heroicons-tag"
            />
          </UFormField>

          <UFormField label="Description">
            <UTextarea
              v-model="form.description"
              placeholder="Product description (optional)"
              :rows="3"
            />
          </UFormField>
        </div>

        <!-- Product Type -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Product Type</h3>

          <UFormField label="Type" hint="Bundles can have configurable features and options">
            <USelect
              v-model="form.type"
              :items="productTypes"
              value-key="value"
            />
          </UFormField>

          <UAlert v-if="form.type === 'BUNDLE'" color="info" variant="subtle" icon="i-heroicons-information-circle">
            <template #description>
              After creating the bundle, you can add features and options to make it configurable.
            </template>
          </UAlert>
        </div>

        <!-- Billing & Pricing -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Billing & Pricing</h3>

          <UFormField label="Billing Frequency" hint="How often this product is billed">
            <USelect
              v-model="form.billingFrequency"
              :items="billingFrequencies"
              value-key="value"
            />
          </UFormField>

          <UFormField v-if="isCustomFrequency" label="Custom Billing Period (months)" required>
            <UInput
              v-model.number="form.customBillingMonths"
              type="number"
              min="1"
              placeholder="e.g., 6 for semi-annual"
            />
          </UFormField>

          <UFormField v-if="isRecurring" label="Default Contract Term (months)" hint="Default subscription term for quotes">
            <UInput
              v-model.number="form.defaultTermMonths"
              type="number"
              min="1"
              placeholder="e.g., 12 for annual contracts"
            />
          </UFormField>

          <UAlert v-if="isRecurring" color="info" variant="subtle" icon="i-heroicons-information-circle">
            <template #description>
              Recurring products will show MRR/ARR metrics on quotes. The term can be overridden per line item.
            </template>
          </UAlert>

          <UFormField label="Unit of Measure" hint="How this product is measured and priced (e.g., per hour, per license)">
            <USelect
              v-model="form.unitOfMeasureId"
              :items="unitOptions"
              value-key="value"
            />
          </UFormField>
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
            Create Product
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
