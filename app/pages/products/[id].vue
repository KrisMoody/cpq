<script setup lang="ts">
import type { ProductWithDetails, ProductFeature } from '~/composables/useProducts'
import type { ProductType, BillingFrequency } from '~/generated/prisma/client.js'
import type { Attribute } from '~/composables/useAttributes'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const {
  fetchProduct,
  fetchProducts,
  updateProduct,
  deleteProduct,
  createFeature,
  updateFeature,
  deleteFeature,
  createOption,
  updateOption,
  deleteOption,
  error: productError,
} = useProducts()
const { products } = useProducts()
const { formatPrice } = usePricing()
const { createQuote, addLineItem } = useQuotes()
const { attributes, groups, fetchAttributes, fetchGroups, setProductAttributes } = useAttributes()
const { units, fetchUnits } = useUnits()

const productId = route.params.id as string
const product = ref<ProductWithDetails | null>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const isEditing = ref(false)

// Form state for editing
const form = ref({
  name: '',
  sku: '',
  description: '',
  type: 'STANDALONE' as ProductType,
  billingFrequency: 'ONE_TIME' as BillingFrequency,
  customBillingMonths: null as number | null,
  defaultTermMonths: null as number | null,
  isActive: true,
  unitOfMeasureId: '' as string,
})

// Configuration state for bundles (view mode)
const selectedOptions = ref<Record<string, string>>({})

// Feature/option editing state
const editingFeature = ref<ProductFeature | null>(null)
const featureForm = ref({ name: '', minOptions: 0, maxOptions: 1 })
const showFeatureModal = ref(false)
const showOptionModal = ref(false)
const editingOptionFeatureId = ref<string | null>(null)
const optionForm = ref({
  optionProductId: '',
  isRequired: false,
  isDefault: false,
  minQty: 1,
  maxQty: 1,
})
const editingOptionId = ref<string | null>(null)

// Attribute editing state
const showAttributesModal = ref(false)
const attributeValues = ref<Record<string, any>>({})
const savingAttributes = ref(false)

onMounted(async () => {
  await loadProduct()
  await Promise.all([
    fetchProducts(true), // Fetch all products for option selector
    fetchAttributes({ includeGroup: true }),
    fetchGroups(),
    fetchUnits(),
  ])
})

async function loadProduct() {
  loading.value = true
  error.value = null
  try {
    product.value = await fetchProduct(productId)
    if (!product.value) {
      error.value = 'Product not found'
      return
    }
    // Initialize form with current values
    form.value = {
      name: product.value.name,
      sku: product.value.sku,
      description: product.value.description || '',
      type: product.value.type,
      billingFrequency: (product.value as any).billingFrequency || 'ONE_TIME',
      customBillingMonths: (product.value as any).customBillingMonths || null,
      defaultTermMonths: (product.value as any).defaultTermMonths || null,
      isActive: product.value.isActive,
      unitOfMeasureId: product.value.unitOfMeasureId || '',
    }
    // Initialize selected options with defaults
    if (product.value.features) {
      product.value.features.forEach((feature) => {
        const defaultOption = feature.options.find((o) => o.isDefault)
        if (defaultOption) {
          selectedOptions.value[feature.id] = defaultOption.id
        }
      })
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load product'
  } finally {
    loading.value = false
  }
}

const isBundle = computed(() => product.value?.type === 'BUNDLE')

const configuredOptions = computed(() => {
  if (!product.value?.features) return []
  return Object.entries(selectedOptions.value).map(([featureId, optionId]) => {
    const feature = product.value!.features!.find((f) => f.id === featureId)
    const option = feature?.options.find((o) => o.id === optionId)
    return {
      featureId,
      featureName: feature?.name,
      optionId,
      optionName: option?.product?.name || 'Unknown',
      priceAdjustment: '0',
    }
  })
})

// Get standalone products for option selector (exclude self and bundles)
const availableOptionProducts = computed(() => {
  return products.value.filter(
    (p) => p.id !== productId && p.type === 'STANDALONE' && p.isActive
  )
})

async function handleSave() {
  if (!form.value.name.trim()) {
    error.value = 'Product name is required'
    return
  }
  if (!form.value.sku.trim()) {
    error.value = 'SKU is required'
    return
  }

  saving.value = true
  error.value = null

  try {
    const updated = await updateProduct(productId, {
      name: form.value.name.trim(),
      sku: form.value.sku.trim(),
      description: form.value.description.trim() || null,
      type: form.value.type,
      billingFrequency: form.value.billingFrequency,
      customBillingMonths: form.value.customBillingMonths || null,
      defaultTermMonths: form.value.defaultTermMonths || null,
      isActive: form.value.isActive,
      unitOfMeasureId: form.value.unitOfMeasureId || null,
    })

    if (updated) {
      await loadProduct()
      isEditing.value = false
    } else {
      error.value = productError.value || 'Failed to update product'
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to update product'
  } finally {
    saving.value = false
  }
}

function cancelEdit() {
  isEditing.value = false
  if (product.value) {
    form.value = {
      name: product.value.name,
      sku: product.value.sku,
      description: product.value.description || '',
      type: product.value.type,
      billingFrequency: (product.value as any).billingFrequency || 'ONE_TIME',
      customBillingMonths: (product.value as any).customBillingMonths || null,
      defaultTermMonths: (product.value as any).defaultTermMonths || null,
      isActive: product.value.isActive,
      unitOfMeasureId: product.value.unitOfMeasureId || '',
    }
  }
}

async function handleDeactivate() {
  if (!confirm('Are you sure you want to deactivate this product?')) return

  try {
    const success = await deleteProduct(productId)
    if (success) {
      router.push('/products')
    } else {
      error.value = productError.value || 'Failed to deactivate product'
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to deactivate product'
  }
}

async function handleAddToQuote() {
  if (!product.value) return

  try {
    const quote = await createQuote({
      name: `Quote for ${product.value.name}`,
    })

    if (quote) {
      await addLineItem(quote.id, {
        productId: product.value.id,
        quantity: 1,
      })
      router.push(`/quotes/${quote.id}`)
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to create quote'
  }
}

async function handleBundleConfigure(options: Array<{ optionId: string; quantity: number }>) {
  if (!product.value) return

  try {
    const quote = await createQuote({
      name: `Quote for ${product.value.name}`,
    })

    if (quote) {
      // Add the bundle product
      await addLineItem(quote.id, {
        productId: product.value.id,
        quantity: 1,
      })

      // Add selected options as line items
      for (const option of options) {
        await addLineItem(quote.id, {
          productId: option.optionId,
          quantity: option.quantity,
        })
      }

      router.push(`/quotes/${quote.id}`)
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to create quote with bundle configuration'
  }
}

// Feature management
function openAddFeature() {
  editingFeature.value = null
  featureForm.value = { name: '', minOptions: 0, maxOptions: 1 }
  showFeatureModal.value = true
}

function openEditFeature(feature: ProductFeature) {
  editingFeature.value = feature
  featureForm.value = {
    name: feature.name,
    minOptions: feature.minOptions,
    maxOptions: feature.maxOptions,
  }
  showFeatureModal.value = true
}

async function handleSaveFeature() {
  if (!featureForm.value.name.trim()) {
    error.value = 'Feature name is required'
    return
  }

  saving.value = true
  error.value = null

  try {
    if (editingFeature.value) {
      await updateFeature(productId, editingFeature.value.id, featureForm.value)
    } else {
      await createFeature(productId, featureForm.value)
    }
    showFeatureModal.value = false
    await loadProduct()
  } catch (e: any) {
    error.value = e.message || 'Failed to save feature'
  } finally {
    saving.value = false
  }
}

async function handleDeleteFeature(featureId: string) {
  if (!confirm('Are you sure you want to delete this feature and all its options?')) return

  try {
    await deleteFeature(productId, featureId)
    await loadProduct()
  } catch (e: any) {
    error.value = e.message || 'Failed to delete feature'
  }
}

// Option management
function openAddOption(featureId: string) {
  editingOptionFeatureId.value = featureId
  editingOptionId.value = null
  optionForm.value = {
    optionProductId: '',
    isRequired: false,
    isDefault: false,
    minQty: 1,
    maxQty: 1,
  }
  showOptionModal.value = true
}

function openEditOption(featureId: string, option: any) {
  editingOptionFeatureId.value = featureId
  editingOptionId.value = option.id
  optionForm.value = {
    optionProductId: option.optionProductId,
    isRequired: option.isRequired,
    isDefault: option.isDefault,
    minQty: option.minQty,
    maxQty: option.maxQty,
  }
  showOptionModal.value = true
}

async function handleSaveOption() {
  if (!optionForm.value.optionProductId) {
    error.value = 'Please select a product for this option'
    return
  }

  saving.value = true
  error.value = null

  try {
    if (editingOptionId.value) {
      await updateOption(productId, editingOptionFeatureId.value!, editingOptionId.value, optionForm.value)
    } else {
      await createOption(productId, editingOptionFeatureId.value!, optionForm.value)
    }
    showOptionModal.value = false
    await loadProduct()
  } catch (e: any) {
    error.value = e.message || 'Failed to save option'
  } finally {
    saving.value = false
  }
}

async function handleDeleteOption(featureId: string, optionId: string) {
  if (!confirm('Are you sure you want to delete this option?')) return

  try {
    await deleteOption(productId, featureId, optionId)
    await loadProduct()
  } catch (e: any) {
    error.value = e.message || 'Failed to delete option'
  }
}

const productTypes = [
  { label: 'Standalone', value: 'STANDALONE' },
  { label: 'Bundle', value: 'BUNDLE' },
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

function formatBillingFrequency(frequency: string): string {
  const freq = billingFrequencies.find(f => f.value === frequency)
  return freq?.label || frequency
}

const unitOptions = computed(() => [
  { label: 'No unit selected', value: '' },
  ...units.value.map((u) => ({ label: `${u.name} (${u.abbreviation})`, value: u.id })),
])

// Attribute helpers
const productAttributes = computed(() => {
  return (product.value as any)?.attributes || []
})

const groupedProductAttributes = computed(() => {
  const grouped = new Map<string | null, Array<{ attribute: Attribute; value: any }>>()
  for (const pa of productAttributes.value) {
    const groupId = pa.attribute.groupId
    if (!grouped.has(groupId)) {
      grouped.set(groupId, [])
    }
    grouped.get(groupId)!.push({ attribute: pa.attribute, value: pa.value })
  }
  return grouped
})

function getGroupName(groupId: string | null): string {
  if (!groupId) return 'Other'
  const group = groups.value.find((g) => g.id === groupId)
  return group?.name || 'Unknown'
}

function formatAttributeValue(attr: Attribute, value: any): string {
  if (value === null || value === undefined || value === '') return '-'
  switch (attr.type) {
    case 'BOOLEAN':
      return value ? 'Yes' : 'No'
    case 'SELECT': {
      const opt = attr.options?.find((o) => o.value === value)
      return opt?.label || value
    }
    case 'DATE':
      return new Date(value).toLocaleDateString()
    default:
      return String(value)
  }
}

function openAttributesModal() {
  // Initialize form with current attribute values
  attributeValues.value = {}
  for (const pa of productAttributes.value) {
    attributeValues.value[pa.attribute.id] = pa.value
  }
  showAttributesModal.value = true
}

async function handleSaveAttributes() {
  savingAttributes.value = true

  const attrValues = Object.entries(attributeValues.value)
    .map(([attributeId, value]) => ({ attributeId, value }))

  const result = await setProductAttributes(productId, attrValues)

  savingAttributes.value = false

  if (result) {
    toast.add({ title: 'Attributes saved', color: 'success' })
    showAttributesModal.value = false
    await loadProduct()
  } else {
    toast.add({ title: 'Failed to save attributes', color: 'error' })
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Back button -->
    <UButton
      to="/products"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Products
    </UButton>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error -->
    <UAlert v-else-if="error && !product" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Not Found -->
    <UAlert v-else-if="!product" color="warning" icon="i-heroicons-exclamation-triangle">
      <template #title>Product not found</template>
    </UAlert>

    <!-- Product Details -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold">{{ product.name }}</h1>
            <UBadge :color="isBundle ? 'primary' : 'neutral'" variant="subtle">
              {{ isBundle ? 'Configurable Bundle' : 'Standalone' }}
            </UBadge>
          </div>
          <p class="text-gray-500 mt-1">
            SKU: {{ product.sku }}
            <span v-if="product.unitOfMeasure" class="ml-3">
              Unit: {{ product.unitOfMeasure.name }} ({{ product.unitOfMeasure.abbreviation }})
            </span>
            <span v-if="(product as any).billingFrequency && (product as any).billingFrequency !== 'ONE_TIME'" class="ml-3">
              <UBadge color="primary" variant="subtle" size="xs">
                {{ formatBillingFrequency((product as any).billingFrequency) }}
              </UBadge>
              <span v-if="(product as any).defaultTermMonths" class="text-xs ml-1">
                ({{ (product as any).defaultTermMonths }}mo term)
              </span>
            </span>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UBadge v-if="!product.isActive" color="warning" variant="subtle">
            Inactive
          </UBadge>
          <UButton
            v-if="!isEditing"
            variant="soft"
            icon="i-heroicons-pencil"
            @click="isEditing = true"
          >
            Edit
          </UButton>
          <UButton
            v-if="product.isActive && !isEditing"
            variant="ghost"
            color="error"
            icon="i-heroicons-trash"
            @click="handleDeactivate"
          >
            Deactivate
          </UButton>
        </div>
      </div>

      <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle">
        <template #description>{{ error }}</template>
      </UAlert>

      <!-- Edit Mode -->
      <UCard v-if="isEditing">
        <template #header>
          <h2 class="font-semibold">Edit Product</h2>
        </template>

        <form class="space-y-4" @submit.prevent="handleSave">
          <UFormField label="Name" required>
            <UInput v-model="form.name" placeholder="Product name" />
          </UFormField>

          <UFormField label="SKU" required>
            <UInput v-model="form.sku" placeholder="SKU" />
          </UFormField>

          <UFormField label="Description">
            <UTextarea v-model="form.description" placeholder="Description" :rows="3" />
          </UFormField>

          <UFormField label="Type">
            <USelect v-model="form.type" :items="productTypes" />
          </UFormField>

          <UFormField label="Billing Frequency" hint="How often this product is billed">
            <USelect v-model="form.billingFrequency" :items="billingFrequencies" />
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

          <UFormField label="Unit of Measure" hint="How this product is measured and priced">
            <USelect v-model="form.unitOfMeasureId" :items="unitOptions" />
          </UFormField>

          <UCheckbox v-model="form.isActive" label="Active" />

          <div class="flex justify-end gap-3 pt-4">
            <UButton variant="ghost" @click="cancelEdit">Cancel</UButton>
            <UButton type="submit" :loading="saving">Save Changes</UButton>
          </div>
        </form>
      </UCard>

      <!-- View Mode - Description -->
      <UCard v-if="!isEditing && product.description">
        <template #header>
          <h2 class="font-semibold">Description</h2>
        </template>
        <p class="text-gray-600 dark:text-gray-300">{{ product.description }}</p>
      </UCard>

      <!-- Product Attributes (View Mode) -->
      <UCard v-if="!isEditing && productAttributes.length > 0">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Attributes</h2>
            <UButton size="sm" variant="soft" icon="i-heroicons-pencil" @click="openAttributesModal">
              Edit
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <div v-for="[groupId, attrs] in groupedProductAttributes" :key="groupId ?? 'ungrouped'">
            <h3 v-if="groupedProductAttributes.size > 1" class="text-sm font-medium text-gray-500 mb-2">
              {{ getGroupName(groupId) }}
            </h3>
            <div class="grid grid-cols-2 gap-x-6 gap-y-2">
              <div v-for="{ attribute, value } in attrs" :key="attribute.id" class="flex justify-between">
                <span class="text-gray-500">{{ attribute.name }}</span>
                <span class="font-medium">{{ formatAttributeValue(attribute, value) }}</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Add Attributes Button (when no attributes yet) -->
      <div v-if="!isEditing && productAttributes.length === 0 && attributes.length > 0" class="text-center py-4">
        <UButton variant="soft" icon="i-heroicons-tag" @click="openAttributesModal">
          Add Attributes
        </UButton>
      </div>

      <!-- Bundle Features Management (Edit Mode) -->
      <UCard v-if="isBundle && isEditing">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Bundle Features</h2>
            <UButton
              size="sm"
              icon="i-heroicons-plus"
              @click="openAddFeature"
            >
              Add Feature
            </UButton>
          </div>
        </template>

        <div v-if="!product.features?.length" class="text-center py-8 text-gray-500">
          <UIcon name="i-heroicons-squares-2x2" class="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p>No features defined yet.</p>
          <p class="text-sm">Add features to make this bundle configurable.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="feature in product.features"
            :key="feature.id"
            class="border rounded-lg p-4 dark:border-gray-700"
          >
            <div class="flex items-center justify-between mb-3">
              <div>
                <h3 class="font-medium">{{ feature.name }}</h3>
                <p class="text-sm text-gray-500">
                  Select {{ feature.minOptions }}-{{ feature.maxOptions }} option(s)
                </p>
              </div>
              <div class="flex gap-2">
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-heroicons-pencil"
                  @click="openEditFeature(feature)"
                />
                <UButton
                  size="xs"
                  variant="ghost"
                  color="error"
                  icon="i-heroicons-trash"
                  @click="handleDeleteFeature(feature.id)"
                />
              </div>
            </div>

            <!-- Options -->
            <div class="space-y-2">
              <div
                v-for="option in feature.options"
                :key="option.id"
                class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <div class="flex items-center gap-3">
                  <span class="font-medium">{{ option.product?.name || 'Unknown product' }}</span>
                  <UBadge v-if="option.isDefault" size="xs" color="primary" variant="subtle">Default</UBadge>
                  <UBadge v-if="option.isRequired" size="xs" color="warning" variant="subtle">Required</UBadge>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Qty: {{ option.minQty }}-{{ option.maxQty }}</span>
                  <UButton
                    size="xs"
                    variant="ghost"
                    icon="i-heroicons-pencil"
                    @click="openEditOption(feature.id, option)"
                  />
                  <UButton
                    size="xs"
                    variant="ghost"
                    color="error"
                    icon="i-heroicons-trash"
                    @click="handleDeleteOption(feature.id, option.id)"
                  />
                </div>
              </div>

              <UButton
                size="xs"
                variant="soft"
                icon="i-heroicons-plus"
                @click="openAddOption(feature.id)"
              >
                Add Option
              </UButton>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Bundle Configuration (View Mode) -->
      <template v-if="isBundle && !isEditing && product.features?.length">
        <UCard>
          <template #header>
            <h2 class="font-semibold">Configure Bundle</h2>
          </template>

          <CpqBundleConfigurator
            :product="product"
            @configure="handleBundleConfigure"
          />
        </UCard>

        <!-- Configuration Summary -->
        <UCard v-if="configuredOptions.length">
          <template #header>
            <h2 class="font-semibold">Configuration Summary</h2>
          </template>

          <div class="space-y-2">
            <div
              v-for="config in configuredOptions"
              :key="config.featureId"
              class="flex items-center justify-between py-2 border-b dark:border-gray-800 last:border-0"
            >
              <div>
                <span class="font-medium">{{ config.featureName }}</span>
                <span class="text-gray-500 mx-2">→</span>
                <span>{{ config.optionName }}</span>
              </div>
            </div>
          </div>
        </UCard>
      </template>

      <!-- Actions (View Mode) -->
      <div v-if="!isEditing" class="flex gap-3">
        <UButton
          size="lg"
          icon="i-heroicons-shopping-cart"
          @click="handleAddToQuote"
        >
          Add to New Quote
        </UButton>
      </div>
    </div>

    <!-- Feature Modal -->
    <UModal v-model:open="showFeatureModal" :title="editingFeature ? 'Edit Feature' : 'Add Feature'">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">{{ editingFeature ? 'Edit Feature' : 'Add Feature' }}</h3>
          </template>

          <form class="space-y-4" @submit.prevent="handleSaveFeature">
            <UFormField label="Feature Name" required>
              <UInput v-model="featureForm.name" placeholder="e.g., Storage, Color, Processor" />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Min Options">
                <UInput v-model.number="featureForm.minOptions" type="number" min="0" />
              </UFormField>
              <UFormField label="Max Options">
                <UInput v-model.number="featureForm.maxOptions" type="number" min="1" />
              </UFormField>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <UButton variant="ghost" @click="showFeatureModal = false">Cancel</UButton>
              <UButton type="submit" :loading="saving">
                {{ editingFeature ? 'Save' : 'Add Feature' }}
              </UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>

    <!-- Option Modal -->
    <UModal v-model:open="showOptionModal" :title="editingOptionId ? 'Edit Option' : 'Add Option'">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">{{ editingOptionId ? 'Edit Option' : 'Add Option' }}</h3>
          </template>

          <form class="space-y-4" @submit.prevent="handleSaveOption">
            <UFormField label="Product" required>
              <USelect
                v-model="optionForm.optionProductId"
                :items="availableOptionProducts.map(p => ({ label: `${p.name} (${p.sku})`, value: p.id }))"
                placeholder="Select a product"
              />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Min Quantity">
                <UInput v-model.number="optionForm.minQty" type="number" min="1" />
              </UFormField>
              <UFormField label="Max Quantity">
                <UInput v-model.number="optionForm.maxQty" type="number" min="1" />
              </UFormField>
            </div>

            <div class="flex gap-4">
              <UCheckbox v-model="optionForm.isDefault" label="Default selection" />
              <UCheckbox v-model="optionForm.isRequired" label="Required" />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <UButton variant="ghost" @click="showOptionModal = false">Cancel</UButton>
              <UButton type="submit" :loading="saving">
                {{ editingOptionId ? 'Save' : 'Add Option' }}
              </UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>

    <!-- Attributes Modal -->
    <UModal v-model:open="showAttributesModal" title="Edit Product Attributes">
      <template #content>
        <UCard class="min-w-[500px]">
          <template #header>
            <h3 class="font-semibold">Edit Product Attributes</h3>
          </template>

          <form class="space-y-6" @submit.prevent="handleSaveAttributes">
            <div v-if="attributes.length === 0" class="text-center py-8 text-gray-500">
              <p>No attributes defined yet.</p>
              <NuxtLink to="/attributes/new" class="text-primary-500 hover:underline">
                Create attributes first
              </NuxtLink>
            </div>

            <template v-else>
              <div v-for="group in groups" :key="group.id" class="space-y-3">
                <h4 class="text-sm font-medium text-gray-500 border-b pb-1 dark:border-gray-700">
                  {{ group.name }}
                </h4>
                <div class="space-y-3">
                  <UFormField
                    v-for="attr in attributes.filter(a => a.groupId === group.id)"
                    :key="attr.id"
                    :label="attr.name"
                    :required="attr.isRequired"
                  >
                    <CpqAttributeInput
                      v-model="attributeValues[attr.id]"
                      :attribute="attr"
                    />
                  </UFormField>
                </div>
              </div>

              <!-- Ungrouped attributes -->
              <div v-if="attributes.some(a => !a.groupId)" class="space-y-3">
                <h4 v-if="groups.length > 0" class="text-sm font-medium text-gray-500 border-b pb-1 dark:border-gray-700">
                  Other
                </h4>
                <div class="space-y-3">
                  <UFormField
                    v-for="attr in attributes.filter(a => !a.groupId)"
                    :key="attr.id"
                    :label="attr.name"
                    :required="attr.isRequired"
                  >
                    <CpqAttributeInput
                      v-model="attributeValues[attr.id]"
                      :attribute="attr"
                    />
                  </UFormField>
                </div>
              </div>
            </template>

            <div class="flex justify-end gap-3 pt-4">
              <UButton variant="ghost" @click="showAttributesModal = false">Cancel</UButton>
              <UButton type="submit" :loading="savingAttributes" :disabled="attributes.length === 0">
                Save Attributes
              </UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
