<script setup lang="ts">
import type { AffinityType, BillingFrequency } from '~/generated/prisma/client.js'

const _route = useRoute()
const router = useRouter()
const toast = useToast()
const { fetchAffinity, updateAffinity, deleteAffinity, error } = useAffinities()
const { products, fetchProducts } = useProducts()
const { categories, fetchCategories } = useCategories()

const affinity = ref<Awaited<ReturnType<typeof fetchAffinity>> | null>(null)
const loading = ref(true)
const saving = ref(false)

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

const affinityId = useRequiredParam('id')

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchCategories()])
  affinity.value = await fetchAffinity(affinityId)
  if (affinity.value) {
    form.value.sourceType = affinity.value.sourceProductId ? 'product' : 'category'
    form.value.targetType = affinity.value.targetProductId ? 'product' : 'category'
    form.value.sourceProductId = affinity.value.sourceProductId || undefined
    form.value.targetProductId = affinity.value.targetProductId || undefined
    form.value.sourceCategoryId = affinity.value.sourceCategoryId || undefined
    form.value.targetCategoryId = affinity.value.targetCategoryId || undefined
    form.value.type = affinity.value.type
    form.value.priority = affinity.value.priority
    form.value.sourceBillingFrequency = affinity.value.sourceBillingFrequency || undefined
    form.value.targetBillingFrequency = affinity.value.targetBillingFrequency || undefined
    form.value.isActive = affinity.value.isActive
  }
  loading.value = false
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
  if (!affinity.value) return
  saving.value = true
  try {
    const data: Parameters<typeof updateAffinity>[1] = {
      type: form.value.type,
      priority: form.value.priority,
      isActive: form.value.isActive,
      sourceBillingFrequency: form.value.sourceBillingFrequency || null,
      targetBillingFrequency: form.value.targetBillingFrequency || null,
    }

    if (form.value.sourceType === 'product') {
      data.sourceProductId = form.value.sourceProductId || null
      data.sourceCategoryId = null
    } else {
      data.sourceCategoryId = form.value.sourceCategoryId || null
      data.sourceProductId = null
    }

    if (form.value.targetType === 'product') {
      data.targetProductId = form.value.targetProductId || null
      data.targetCategoryId = null
    } else {
      data.targetCategoryId = form.value.targetCategoryId || null
      data.targetProductId = null
    }

    const updated = await updateAffinity(affinity.value.id, data)
    if (updated) {
      toast.add({ title: 'Affinity updated', color: 'success' })
      router.push('/affinities')
    }
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!affinity.value) return
  if (!confirm('Are you sure you want to delete this affinity rule?')) return
  const success = await deleteAffinity(affinity.value.id)
  if (success) {
    toast.add({ title: 'Affinity deleted', color: 'success' })
    router.push('/affinities')
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <UButton to="/affinities" variant="ghost" icon="i-heroicons-arrow-left" />
      <div class="flex-1">
        <h1 class="text-2xl font-bold">Edit Product Affinity</h1>
        <p class="text-gray-500">Update this recommendation rule</p>
      </div>
      <UButton
        v-if="affinity"
        variant="ghost"
        color="error"
        icon="i-heroicons-trash"
        @click="handleDelete"
      >
        Delete
      </UButton>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <UAlert v-else-if="!affinity" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Affinity not found</template>
    </UAlert>

    <template v-else>
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
            <UButton type="submit" :loading="saving">Save Changes</UButton>
          </div>
        </form>
      </UCard>
    </template>
  </div>
</template>
