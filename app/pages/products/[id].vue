<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
import type { ProductWithDetails, ProductFeature } from '~/composables/useProducts'
import type { ProductType, BillingFrequency } from '~/generated/prisma/client'
import type { Attribute } from '~/composables/useAttributes'
import type { CategoryAttributeWithSuggestion } from '~/composables/useCategories'

const { features: phaseFeatures } = usePhaseContext()

const _route = useRoute()
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
  reorderFeatures,
  reorderOptions,
  updateProductCategories,
  error: productError,
} = useProducts()
const { products } = useProducts()
const { formatPrice: _formatPrice } = usePricing()
const { createQuote, addLineItem } = useQuotes()
const { attributes, groups, fetchAttributes, fetchGroups, setProductAttributes } = useAttributes()
const { units, fetchUnits } = useUnits()
const { categories, fetchCategories, fetchCategoryAttributesBulk, flattenCategories } = useCategories()

const productId = useRequiredParam('id')
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
  isTaxable: true,
  isActive: true,
  unitOfMeasureId: null as string | null,
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
const attributeValues = ref<Record<string, string | number | boolean | null>>({})
const savingAttributes = ref(false)

// Categories state
const showCategoriesModal = ref(false)
const editingCategoryIds = ref<string[]>([])
const savingCategories = ref(false)
const suggestedAttributes = ref<CategoryAttributeWithSuggestion[]>([])

// Drag-and-drop state
const draggedFeatureId = ref<string | null>(null)
const draggedOptionId = ref<string | null>(null)
const dragOverFeatureId = ref<string | null>(null)
const dragOverOptionId = ref<string | null>(null)

onMounted(async () => {
  await loadProduct()
  await Promise.all([
    fetchProducts(true), // Fetch all products for option selector
    fetchAttributes({ includeGroup: true }),
    fetchGroups(),
    fetchUnits(),
    fetchCategories(),
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
      billingFrequency: product.value.billingFrequency || 'ONE_TIME',
      customBillingMonths: product.value.customBillingMonths || null,
      defaultTermMonths: product.value.defaultTermMonths || null,
      isTaxable: product.value.isTaxable ?? true,
      isActive: product.value.isActive,
      unitOfMeasureId: product.value.unitOfMeasureId || null,
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
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to load product')
  } finally {
    loading.value = false
  }
}

const isBundle = computed(() => product.value?.type === 'BUNDLE')

// Bundle validation status
const bundleValidation = computed(() => {
  if (!isBundle.value || !product.value) return null

  const features = product.value.features || []
  const issues: string[] = []

  if (features.length === 0) {
    issues.push('No features configured')
  } else {
    const emptyFeatures = features.filter((f) => !f.options?.length)
    if (emptyFeatures.length > 0) {
      issues.push(`${emptyFeatures.length} feature(s) have no options`)
    }

    const optionsWithoutPricing = features.flatMap((f) =>
      (f.options || []).filter((o) => !o.product?.priceBookEntries?.length)
    )
    if (optionsWithoutPricing.length > 0) {
      issues.push(`${optionsWithoutPricing.length} option(s) have no pricing`)
    }

    const missingProducts = features.flatMap((f) =>
      (f.options || []).filter((o) => !o.product)
    )
    if (missingProducts.length > 0) {
      issues.push(`${missingProducts.length} option(s) reference missing products`)
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
})

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
      isTaxable: form.value.isTaxable,
      isActive: form.value.isActive,
      unitOfMeasureId: form.value.unitOfMeasureId || null,
    })

    if (updated) {
      await loadProduct()
      isEditing.value = false
    } else {
      error.value = productError.value || 'Failed to update product'
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to update product')
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
      billingFrequency: product.value.billingFrequency || 'ONE_TIME',
      customBillingMonths: product.value.customBillingMonths || null,
      defaultTermMonths: product.value.defaultTermMonths || null,
      isTaxable: product.value.isTaxable ?? true,
      isActive: product.value.isActive,
      unitOfMeasureId: product.value.unitOfMeasureId || null,
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
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to deactivate product')
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
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to create quote')
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
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to create quote with bundle configuration')
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
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to save feature')
  } finally {
    saving.value = false
  }
}

async function handleDeleteFeature(featureId: string) {
  if (!confirm('Are you sure you want to delete this feature and all its options?')) return

  try {
    await deleteFeature(productId, featureId)
    await loadProduct()
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to delete feature')
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
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to save option')
  } finally {
    saving.value = false
  }
}

async function handleDeleteOption(featureId: string, optionId: string) {
  if (!confirm('Are you sure you want to delete this option?')) return

  try {
    await deleteOption(productId, featureId, optionId)
    await loadProduct()
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to delete option')
  }
}

// Feature drag-and-drop handlers
function handleFeatureDragStart(e: DragEvent, featureId: string) {
  draggedFeatureId.value = featureId
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

function handleFeatureDragOver(e: DragEvent, featureId: string) {
  e.preventDefault()
  if (draggedFeatureId.value && draggedFeatureId.value !== featureId) {
    dragOverFeatureId.value = featureId
  }
}

function handleFeatureDragLeave() {
  dragOverFeatureId.value = null
}

async function handleFeatureDrop(e: DragEvent, targetFeatureId: string) {
  e.preventDefault()
  dragOverFeatureId.value = null

  if (!draggedFeatureId.value || !product.value?.features) return
  if (draggedFeatureId.value === targetFeatureId) return

  const features = [...product.value.features]
  const draggedIndex = features.findIndex((f) => f.id === draggedFeatureId.value)
  const targetIndex = features.findIndex((f) => f.id === targetFeatureId)

  if (draggedIndex === -1 || targetIndex === -1) return

  // Reorder locally for immediate feedback
  const draggedFeature = features[draggedIndex]!
  features.splice(draggedIndex, 1)
  features.splice(targetIndex, 0, draggedFeature)
  product.value.features = features

  // Persist to server
  const featureIds = features.map((f) => f.id)
  const success = await reorderFeatures(productId, featureIds)
  if (!success) {
    await loadProduct() // Reload on failure
  }

  draggedFeatureId.value = null
}

function handleFeatureDragEnd() {
  draggedFeatureId.value = null
  dragOverFeatureId.value = null
}

// Option drag-and-drop handlers
function handleOptionDragStart(e: DragEvent, optionId: string) {
  draggedOptionId.value = optionId
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

function handleOptionDragOver(e: DragEvent, optionId: string) {
  e.preventDefault()
  if (draggedOptionId.value && draggedOptionId.value !== optionId) {
    dragOverOptionId.value = optionId
  }
}

function handleOptionDragLeave() {
  dragOverOptionId.value = null
}

async function handleOptionDrop(e: DragEvent, featureId: string, targetOptionId: string) {
  e.preventDefault()
  dragOverOptionId.value = null

  if (!draggedOptionId.value || !product.value?.features) return
  if (draggedOptionId.value === targetOptionId) return

  const feature = product.value.features.find((f) => f.id === featureId)
  if (!feature) return

  const options = [...feature.options]
  const draggedIndex = options.findIndex((o) => o.id === draggedOptionId.value)
  const targetIndex = options.findIndex((o) => o.id === targetOptionId)

  if (draggedIndex === -1 || targetIndex === -1) return

  // Reorder locally for immediate feedback
  const draggedOption = options[draggedIndex]!
  options.splice(draggedIndex, 1)
  options.splice(targetIndex, 0, draggedOption)
  feature.options = options

  // Persist to server
  const optionIds = options.map((o) => o.id)
  const success = await reorderOptions(productId, featureId, optionIds)
  if (!success) {
    await loadProduct() // Reload on failure
  }

  draggedOptionId.value = null
}

function handleOptionDragEnd() {
  draggedOptionId.value = null
  dragOverOptionId.value = null
}

const productTypes = computed(() => {
  const types = [{ label: 'Standalone', value: 'STANDALONE' }]
  if (phaseFeatures.value.bundles) {
    types.push({ label: 'Bundle', value: 'BUNDLE' })
  }
  return types
})

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
  { label: 'No unit selected', value: null },
  ...units.value.map((u) => ({ label: `${u.name} (${u.abbreviation})`, value: u.id })),
])

// Attribute helpers
const productAttributes = computed(() => {
  return product.value?.attributes || []
})

const groupedProductAttributes = computed(() => {
  const grouped = new Map<string | null, Array<{ attribute: Attribute; value: string | number | boolean | null }>>()
  for (const pa of productAttributes.value) {
    const groupId = pa.attribute.groupId
    if (!grouped.has(groupId)) {
      grouped.set(groupId, [])
    }
    grouped.get(groupId)!.push({ attribute: pa.attribute as Attribute, value: pa.value })
  }
  return grouped
})

function getGroupName(groupId: string | null): string {
  if (!groupId) return 'Other'
  const group = groups.value.find((g) => g.id === groupId)
  return group?.name || 'Unknown'
}

function formatAttributeValue(attr: Attribute, value: string | number | boolean | null): string {
  if (value === null || value === undefined || value === '') return '-'
  switch (attr.type) {
    case 'BOOLEAN':
      return value ? 'Yes' : 'No'
    case 'SELECT': {
      const opt = attr.options?.find((o) => o.value === value)
      return opt?.label || String(value)
    }
    case 'DATE':
      return new Date(String(value)).toLocaleDateString()
    default:
      return String(value)
  }
}

function openAttributesModal() {
  // Initialize form with current attribute values (default all to null, then set existing values)
  attributeValues.value = {}
  for (const attr of attributes.value) {
    attributeValues.value[attr.id] = null
  }
  for (const pa of productAttributes.value) {
    attributeValues.value[pa.attribute.id] = pa.value
  }
  showAttributesModal.value = true
}

// Getter/setter for attribute values that handles undefined → null conversion
function getAttributeValue(attrId: string): string | number | boolean | null {
  return attributeValues.value[attrId] ?? null
}

function setAttributeValue(attrId: string, value: string | number | boolean | null) {
  attributeValues.value[attrId] = value
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

// Categories helpers
const productCategories = computed(() => {
  if (!product.value?.categories) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return product.value.categories.map((pc: any) => pc.category as { id: string; name: string })
})

function getCategoryPath(categoryId: string): string {
  const flatCats = flattenCategories(categories.value)
  const path: string[] = []
  let current = flatCats.find((c) => c.id === categoryId)

  while (current) {
    path.unshift(current.name)
    current = flatCats.find((c) => c.id === current?.parentId)
  }

  return path.join(' > ')
}

function openCategoriesModal() {
  editingCategoryIds.value = productCategories.value.map((c: { id: string }) => c.id)
  showCategoriesModal.value = true
}

async function handleSaveCategories() {
  savingCategories.value = true

  const result = await updateProductCategories(productId, editingCategoryIds.value)

  savingCategories.value = false

  if (result) {
    toast.add({ title: 'Categories saved', color: 'success' })
    showCategoriesModal.value = false
    await loadProduct()
    // Reload suggested attributes
    await loadSuggestedAttributes()
  } else {
    toast.add({ title: 'Failed to save categories', color: 'error' })
  }
}

async function loadSuggestedAttributes() {
  const categoryIds = productCategories.value.map((c: { id: string }) => c.id)
  if (categoryIds.length > 0) {
    suggestedAttributes.value = await fetchCategoryAttributesBulk(categoryIds)
  } else {
    suggestedAttributes.value = []
  }
}

// Load suggested attributes when product loads
watch(
  () => product.value?.categories,
  () => {
    loadSuggestedAttributes()
  },
  { immediate: true }
)

// Suggested attribute IDs for highlighting
const suggestedAttributeIds = computed(() => new Set(suggestedAttributes.value.map((a) => a.id)))

function isAttributeSuggested(attributeId: string): boolean {
  return suggestedAttributeIds.value.has(attributeId)
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
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
          <p class="text-ga-gray-600 mt-1">
            SKU: {{ product.sku }}
            <span v-if="phaseFeatures.unitsOfMeasure && product.unitOfMeasure" class="ml-3">
              Unit: {{ product.unitOfMeasure.name }} ({{ product.unitOfMeasure.abbreviation }})
            </span>
            <span v-if="product.billingFrequency && product.billingFrequency !== 'ONE_TIME'" class="ml-3">
              <UBadge color="primary" variant="subtle" size="xs">
                {{ formatBillingFrequency(product.billingFrequency) }}
              </UBadge>
              <span v-if="product.defaultTermMonths" class="text-xs ml-1">
                ({{ product.defaultTermMonths }}mo term)
              </span>
            </span>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UBadge v-if="phaseFeatures.taxes && !product.isTaxable" color="info" variant="subtle">
            Non-Taxable
          </UBadge>
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
            <USelect v-model="form.type" :items="productTypes" value-key="value" />
          </UFormField>

          <UFormField v-if="phaseFeatures.subscriptions" label="Billing Frequency" hint="How often this product is billed">
            <USelect v-model="form.billingFrequency" :items="billingFrequencies" value-key="value" />
          </UFormField>

          <UFormField v-if="phaseFeatures.subscriptions && isCustomFrequency" label="Custom Billing Period (months)" required>
            <UInput
              v-model.number="form.customBillingMonths"
              type="number"
              min="1"
              placeholder="e.g., 6 for semi-annual"
            />
          </UFormField>

          <UFormField v-if="phaseFeatures.subscriptions && isRecurring" label="Default Contract Term (months)" hint="Default subscription term for quotes">
            <UInput
              v-model.number="form.defaultTermMonths"
              type="number"
              min="1"
              placeholder="e.g., 12 for annual contracts"
            />
          </UFormField>

          <UFormField v-if="phaseFeatures.unitsOfMeasure" label="Unit of Measure" hint="How this product is measured and priced">
            <USelect v-model="form.unitOfMeasureId" :items="unitOptions" value-key="value" />
          </UFormField>

          <UCheckbox
            v-if="phaseFeatures.taxes"
            v-model="form.isTaxable"
            label="Taxable"
            hint="Uncheck for products exempt from sales tax (e.g., some services, digital goods)"
          />

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
        <p class="text-ga-gray-700">{{ product.description }}</p>
      </UCard>

      <!-- Categories Section (View Mode) -->
      <UCard v-if="!isEditing">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Categories</h2>
            <UButton size="sm" variant="soft" icon="i-heroicons-pencil" @click="openCategoriesModal">
              Edit
            </UButton>
          </div>
        </template>

        <div v-if="productCategories.length === 0" class="text-ga-gray-600 text-sm">
          No categories assigned
        </div>

        <div v-else class="flex flex-wrap gap-2">
          <UTooltip
            v-for="category in productCategories"
            :key="category.id"
            :text="getCategoryPath(category.id)"
          >
            <UBadge color="neutral" variant="subtle">
              {{ category.name }}
            </UBadge>
          </UTooltip>
        </div>
      </UCard>

      <!-- Product Attributes (View Mode) - Phase 4+ -->
      <UCard v-if="phaseFeatures.attributes && !isEditing && productAttributes.length > 0">
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
            <h3 v-if="groupedProductAttributes.size > 1" class="text-sm font-medium text-ga-gray-600 mb-2">
              {{ getGroupName(groupId) }}
            </h3>
            <div class="grid grid-cols-2 gap-x-6 gap-y-2">
              <div v-for="{ attribute, value } in attrs" :key="attribute.id" class="flex justify-between">
                <span class="text-ga-gray-600">{{ attribute.name }}</span>
                <span class="font-medium">{{ formatAttributeValue(attribute, value) }}</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Add Attributes Button (when no attributes yet) - Phase 4+ -->
      <div v-if="phaseFeatures.attributes && !isEditing && productAttributes.length === 0 && attributes.length > 0" class="text-center py-4">
        <UButton variant="soft" icon="i-heroicons-tag" @click="openAttributesModal">
          Add Attributes
        </UButton>
      </div>

      <!-- Bundle Features Management (Edit Mode) - Phase 2+ -->
      <UCard v-if="phaseFeatures.bundles && isBundle && isEditing">
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

        <!-- Bundle validation warnings -->
        <UAlert
          v-if="bundleValidation && !bundleValidation.isValid"
          color="warning"
          icon="i-heroicons-exclamation-triangle"
          class="mb-4"
        >
          <template #title>Bundle Configuration Issues</template>
          <template #description>
            <ul class="list-disc list-inside mt-1 space-y-0.5">
              <li v-for="issue in bundleValidation.issues" :key="issue">{{ issue }}</li>
            </ul>
          </template>
        </UAlert>

        <div v-if="!product.features?.length" class="text-center py-8 text-ga-gray-600">
          <UIcon name="i-heroicons-squares-2x2" class="w-10 h-10 mx-auto mb-2 text-ga-gray-400" />
          <p>No features defined yet.</p>
          <p class="text-sm">Add features to make this bundle configurable.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="feature in product.features"
            :key="feature.id"
            draggable="true"
            class="border rounded-lg p-4 border-ga-gray-300 transition-all cursor-move"
            :class="{
              'opacity-50': draggedFeatureId === feature.id,
              'border-primary-500 border-2': dragOverFeatureId === feature.id,
            }"
            @dragstart="handleFeatureDragStart($event, feature.id)"
            @dragover="handleFeatureDragOver($event, feature.id)"
            @dragleave="handleFeatureDragLeave"
            @drop="handleFeatureDrop($event, feature.id)"
            @dragend="handleFeatureDragEnd"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-bars-3" class="w-4 h-4 text-ga-gray-500" />
                <div>
                  <h3 class="font-medium">{{ feature.name }}</h3>
                  <p class="text-sm text-ga-gray-600">
                    Select {{ feature.minOptions }}-{{ feature.maxOptions }} option(s)
                  </p>
                </div>
                <!-- Validation warnings -->
                <UBadge
                  v-if="!feature.options?.length"
                  color="warning"
                  variant="subtle"
                  size="xs"
                >
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-3 h-3 mr-1" />
                  No options
                </UBadge>
                <UBadge
                  v-else-if="feature.minOptions > feature.options.length"
                  color="warning"
                  variant="subtle"
                  size="xs"
                >
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-3 h-3 mr-1" />
                  Not enough options
                </UBadge>
              </div>
              <div class="flex gap-2">
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-heroicons-pencil"
                  @click.stop="openEditFeature(feature)"
                />
                <UButton
                  size="xs"
                  variant="ghost"
                  color="error"
                  icon="i-heroicons-trash"
                  @click.stop="handleDeleteFeature(feature.id)"
                />
              </div>
            </div>

            <!-- Options -->
            <div class="space-y-2">
              <div
                v-for="option in feature.options"
                :key="option.id"
                draggable="true"
                class="flex items-center justify-between py-2 px-3 bg-ga-gray-100 rounded cursor-move transition-all"
                :class="{
                  'opacity-50': draggedOptionId === option.id,
                  'ring-2 ring-primary-500': dragOverOptionId === option.id,
                }"
                @dragstart.stop="handleOptionDragStart($event, option.id)"
                @dragover.stop="handleOptionDragOver($event, option.id)"
                @dragleave.stop="handleOptionDragLeave"
                @drop.stop="handleOptionDrop($event, feature.id, option.id)"
                @dragend.stop="handleOptionDragEnd"
              >
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-bars-2" class="w-3 h-3 text-ga-gray-500" />
                  <span class="font-medium">{{ option.product?.name || 'Unknown product' }}</span>
                  <UBadge v-if="option.isDefault" size="xs" color="primary" variant="subtle">Default</UBadge>
                  <UBadge v-if="option.isRequired" size="xs" color="warning" variant="subtle">Required</UBadge>
                  <!-- Status warnings -->
                  <UBadge
                    v-if="!option.product"
                    size="xs"
                    color="error"
                    variant="subtle"
                  >
                    <UIcon name="i-heroicons-exclamation-triangle" class="w-3 h-3 mr-1" />
                    Product not found
                  </UBadge>
                  <UBadge
                    v-else-if="option.product.isActive === false"
                    size="xs"
                    color="error"
                    variant="subtle"
                  >
                    <UIcon name="i-heroicons-exclamation-triangle" class="w-3 h-3 mr-1" />
                    Inactive
                  </UBadge>
                  <UBadge
                    v-else-if="!option.product.priceBookEntries?.length"
                    size="xs"
                    color="warning"
                    variant="subtle"
                  >
                    <UIcon name="i-heroicons-currency-dollar" class="w-3 h-3 mr-1" />
                    No pricing
                  </UBadge>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-ga-gray-600">Qty: {{ option.minQty }}-{{ option.maxQty }}</span>
                  <UButton
                    size="xs"
                    variant="ghost"
                    icon="i-heroicons-pencil"
                    @click.stop="openEditOption(feature.id, option)"
                  />
                  <UButton
                    size="xs"
                    variant="ghost"
                    color="error"
                    icon="i-heroicons-trash"
                    @click.stop="handleDeleteOption(feature.id, option.id)"
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

      <!-- Bundle Configuration (View Mode) - Phase 2+ -->
      <template v-if="phaseFeatures.bundles && isBundle && !isEditing && product.features?.length">
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
              class="flex items-center justify-between py-2 border-b border-ga-gray-300 last:border-0"
            >
              <div>
                <span class="font-medium">{{ config.featureName }}</span>
                <span class="text-ga-gray-600 mx-2">→</span>
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

            <div class="flex gap-4">
              <UFormField label="Min Options" class="w-28">
                <UInput v-model.number="featureForm.minOptions" type="number" min="0" />
              </UFormField>
              <UFormField label="Max Options" class="w-28">
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
                value-key="value"
              />
            </UFormField>

            <div class="flex gap-4">
              <UFormField label="Min Quantity" class="w-28">
                <UInput v-model.number="optionForm.minQty" type="number" min="1" />
              </UFormField>
              <UFormField label="Max Quantity" class="w-28">
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
            <div v-if="attributes.length === 0" class="text-center py-8 text-ga-gray-600">
              <p>No attributes defined yet.</p>
              <NuxtLink to="/attributes/new" class="text-primary-500 hover:underline">
                Create attributes first
              </NuxtLink>
            </div>

            <template v-else>
              <!-- Suggested Attributes Section -->
              <div v-if="suggestedAttributes.length > 0" class="space-y-3">
                <div class="flex items-center gap-2">
                  <UBadge color="primary" variant="subtle" size="xs">Suggested</UBadge>
                  <span class="text-sm text-ga-gray-600">Based on assigned categories</span>
                </div>
                <div class="space-y-3">
                  <UFormField
                    v-for="attr in suggestedAttributes"
                    :key="attr.id"
                    :label="attr.name"
                    :required="attr.isRequired"
                  >
                    <template #hint>
                      <span class="text-xs">{{ attr.suggestedByCategoryNames.join(', ') }}</span>
                    </template>
                    <CpqAttributeInput
                      :model-value="getAttributeValue(attr.id)"
                      :attribute="attr as unknown as Attribute"
                      @update:model-value="setAttributeValue(attr.id, $event)"
                    />
                  </UFormField>
                </div>
              </div>

              <div v-for="group in groups" :key="group.id" class="space-y-3">
                <h4 class="text-sm font-medium text-ga-gray-600 border-b pb-1 border-ga-gray-300">
                  {{ group.name }}
                </h4>
                <div class="space-y-3">
                  <UFormField
                    v-for="attr in attributes.filter(a => a.groupId === group.id && !isAttributeSuggested(a.id))"
                    :key="attr.id"
                    :label="attr.name"
                    :required="attr.isRequired"
                  >
                    <CpqAttributeInput
                      :model-value="getAttributeValue(attr.id)"
                      :attribute="attr"
                      @update:model-value="setAttributeValue(attr.id, $event)"
                    />
                  </UFormField>
                </div>
              </div>

              <!-- Ungrouped attributes -->
              <div v-if="attributes.some(a => !a.groupId && !isAttributeSuggested(a.id))" class="space-y-3">
                <h4 v-if="groups.length > 0" class="text-sm font-medium text-ga-gray-600 border-b pb-1 border-ga-gray-300">
                  Other
                </h4>
                <div class="space-y-3">
                  <UFormField
                    v-for="attr in attributes.filter(a => !a.groupId && !isAttributeSuggested(a.id))"
                    :key="attr.id"
                    :label="attr.name"
                    :required="attr.isRequired"
                  >
                    <CpqAttributeInput
                      :model-value="getAttributeValue(attr.id)"
                      :attribute="attr"
                      @update:model-value="setAttributeValue(attr.id, $event)"
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

    <!-- Categories Modal -->
    <UModal v-model:open="showCategoriesModal" title="Edit Categories">
      <template #content>
        <UCard class="w-[450px]">
          <template #header>
            <h3 class="font-semibold">Edit Product Categories</h3>
          </template>

          <form class="space-y-4" @submit.prevent="handleSaveCategories">
            <p class="text-sm text-ga-gray-600">
              Select categories for this product. Categories help organize products and suggest relevant attributes.
            </p>

            <CpqCategorySelector
              v-model="editingCategoryIds"
              placeholder="Select categories..."
            />

            <div class="flex justify-end gap-3 pt-4">
              <UButton variant="ghost" @click="showCategoriesModal = false">Cancel</UButton>
              <UButton type="submit" :loading="savingCategories">
                Save Categories
              </UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
