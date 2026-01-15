<script setup lang="ts">
import type { AffinityType, BillingFrequency } from '~/generated/prisma/client'

const router = useRouter()
const toast = useToast()
const { createAffinity, error } = useAffinities()
const { products, fetchProducts } = useProducts()
const { categories, fetchCategories } = useCategories()

const form = ref({
  sourceType: 'product' as 'product' | 'category',
  targetType: 'product' as 'product' | 'category',
  sourceProductId: undefined as string | undefined,
  targetProductId: undefined as string | undefined,
  sourceCategoryId: undefined as string | undefined,
  targetCategoryId: undefined as string | undefined,
  type: 'CROSS_SELL' as AffinityType,
  priority: 100,
  sourceBillingFrequency: undefined as BillingFrequency | undefined,
  targetBillingFrequency: undefined as BillingFrequency | undefined,
  isActive: true,
})

const saving = ref(false)

onMounted(() => {
  fetchProducts()
  fetchCategories()
})

const productOptions = computed(() =>
  products.value.map((p) => ({
    label: `${p.name} (${p.sku})`,
    value: p.id,
  }))
)

const categoryOptions = computed(() =>
  categories.value.map((c) => ({
    label: c.name,
    value: c.id,
  }))
)

const typeOptions = [
  { label: 'Cross-sell', value: 'CROSS_SELL' },
  { label: 'Upsell', value: 'UPSELL' },
  { label: 'Accessory', value: 'ACCESSORY' },
  { label: 'Required', value: 'REQUIRED' },
  { label: 'Frequently Bought', value: 'FREQUENTLY_BOUGHT' },
  { label: 'Subscription Add-on', value: 'SUBSCRIPTION_ADDON' },
]

const billingFrequencyOptions = [
  { label: 'One-time', value: 'ONE_TIME' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Quarterly', value: 'QUARTERLY' },
  { label: 'Annual', value: 'ANNUAL' },
  { label: 'Custom', value: 'CUSTOM' },
]

async function handleSubmit() {
  saving.value = true
  try {
    const data: Parameters<typeof createAffinity>[0] = {
      type: form.value.type,
      priority: form.value.priority,
      isActive: form.value.isActive,
    }

    if (form.value.sourceType === 'product') {
      if (!form.value.sourceProductId) {
        toast.add({ title: 'Source product is required', color: 'error' })
        return
      }
      data.sourceProductId = form.value.sourceProductId
    } else {
      if (!form.value.sourceCategoryId) {
        toast.add({ title: 'Source category is required', color: 'error' })
        return
      }
      data.sourceCategoryId = form.value.sourceCategoryId
    }

    if (form.value.targetType === 'product') {
      if (!form.value.targetProductId) {
        toast.add({ title: 'Target product is required', color: 'error' })
        return
      }
      data.targetProductId = form.value.targetProductId
    } else {
      if (!form.value.targetCategoryId) {
        toast.add({ title: 'Target category is required', color: 'error' })
        return
      }
      data.targetCategoryId = form.value.targetCategoryId
    }

    if (form.value.sourceBillingFrequency) {
      data.sourceBillingFrequency = form.value.sourceBillingFrequency
    }
    if (form.value.targetBillingFrequency) {
      data.targetBillingFrequency = form.value.targetBillingFrequency
    }

    const affinity = await createAffinity(data)
    if (affinity) {
      toast.add({ title: 'Affinity created', color: 'success' })
      router.push('/affinities')
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <UButton to="/affinities" variant="ghost" icon="i-heroicons-arrow-left" />
      <div>
        <h1 class="text-2xl font-bold">New Product Affinity</h1>
        <p class="text-gray-500">Create a recommendation rule between products</p>
      </div>
    </div>

    <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #description>{{ error }}</template>
    </UAlert>

    <UCard>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Source -->
        <div class="space-y-4">
          <h3 class="font-medium">Source (When this is in the quote...)</h3>

          <UFormField label="Source Type">
            <URadioGroup
              v-model="form.sourceType"
              :items="[
                { label: 'Product', value: 'product' },
                { label: 'Category', value: 'category' },
              ]"
              orientation="horizontal"
            />
          </UFormField>

          <UFormField v-if="form.sourceType === 'product'" label="Source Product">
            <USelectMenu
              v-model="form.sourceProductId"
              :items="productOptions"
              placeholder="Select a product"
              searchable
              value-key="value"
            />
          </UFormField>

          <UFormField v-else label="Source Category">
            <USelectMenu
              v-model="form.sourceCategoryId"
              :items="categoryOptions"
              placeholder="Select a category"
              searchable
              value-key="value"
            />
          </UFormField>

          <UFormField label="Source Billing Frequency (Optional)">
            <USelectMenu
              v-model="form.sourceBillingFrequency"
              :items="billingFrequencyOptions"
              placeholder="Any"
              value-key="value"
            />
          </UFormField>
        </div>

        <USeparator />

        <!-- Target -->
        <div class="space-y-4">
          <h3 class="font-medium">Target (...recommend this)</h3>

          <UFormField label="Target Type">
            <URadioGroup
              v-model="form.targetType"
              :items="[
                { label: 'Product', value: 'product' },
                { label: 'Category', value: 'category' },
              ]"
              orientation="horizontal"
            />
          </UFormField>

          <UFormField v-if="form.targetType === 'product'" label="Target Product">
            <USelectMenu
              v-model="form.targetProductId"
              :items="productOptions"
              placeholder="Select a product"
              searchable
              value-key="value"
            />
          </UFormField>

          <UFormField v-else label="Target Category">
            <USelectMenu
              v-model="form.targetCategoryId"
              :items="categoryOptions"
              placeholder="Select a category"
              searchable
              value-key="value"
            />
          </UFormField>

          <UFormField label="Target Billing Frequency (Optional)">
            <USelectMenu
              v-model="form.targetBillingFrequency"
              :items="billingFrequencyOptions"
              placeholder="Any"
              value-key="value"
            />
          </UFormField>
        </div>

        <USeparator />

        <!-- Settings -->
        <div class="space-y-4">
          <h3 class="font-medium">Settings</h3>

          <UFormField label="Affinity Type">
            <USelectMenu
              v-model="form.type"
              :items="typeOptions"
              value-key="value"
            />
          </UFormField>

          <UFormField label="Priority" hint="Lower values are higher priority">
            <UInput v-model.number="form.priority" type="number" min="1" />
          </UFormField>

          <UFormField>
            <UCheckbox v-model="form.isActive" label="Active" />
          </UFormField>
        </div>

        <div class="flex justify-end gap-3">
          <UButton variant="ghost" to="/affinities">Cancel</UButton>
          <UButton type="submit" :loading="saving">Create Affinity</UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
