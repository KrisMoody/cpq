<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
import type { ProductType, BillingFrequency } from '~/generated/prisma/client'
import type { Feature } from '~/components/cpq/BundleFeaturesEditor.vue'
import type { Attribute } from '~/composables/useAttributes'
import type { CategoryAttributeWithSuggestion } from '~/composables/useCategories'
import type { AttributeValue } from '~/types/domain'

const router = useRouter()
const { createProduct, error: productError, products, fetchProducts } = useProducts()
const { units, fetchUnits } = useUnits()
const { fetchCategories, fetchCategoryAttributesBulk } = useCategories()
const { attributes, groups, fetchAttributes, fetchGroups } = useAttributes()

const initialFormState = {
  name: '',
  sku: '',
  description: '',
  type: 'STANDALONE' as ProductType,
  billingFrequency: 'ONE_TIME' as BillingFrequency,
  customBillingMonths: null as number | null,
  defaultTermMonths: null as number | null,
  isTaxable: true,
  unitOfMeasureId: null as string | null,
  categoryIds: [] as string[],
  features: [] as Feature[],
}

const form = ref({ ...initialFormState })
const initialValues = ref({ ...initialFormState })

const { confirmLeave } = useUnsavedChanges(form, initialValues)

const loading = ref(false)
const error = ref<string | null>(null)

// Attribute values state
const attributeValues = ref<Record<string, AttributeValue>>({})

// Category-suggested attributes
const suggestedAttributes = ref<CategoryAttributeWithSuggestion[]>([])
const loadingSuggestedAttributes = ref(false)

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
const isBundle = computed(() => form.value.type === 'BUNDLE')

const unitOptions = computed(() => [
  { label: 'No unit selected', value: null },
  ...units.value.map((u) => ({ label: `${u.name} (${u.abbreviation})`, value: u.id })),
])

// Available products for bundle options (active standalone only)
const availableOptionProducts = computed(() =>
  products.value.filter((p) => p.type === 'STANDALONE' && p.isActive)
)

// Non-suggested attributes (all attributes not in suggested list)
const suggestedAttributeIds = computed(() => new Set(suggestedAttributes.value.map((a) => a.id)))
const otherAttributes = computed(() =>
  attributes.value.filter((a) => !suggestedAttributeIds.value.has(a.id))
)

// Show attributes section expanded state
const showAllAttributes = ref(false)

onMounted(async () => {
  await Promise.all([
    fetchUnits(),
    fetchCategories(),
    fetchAttributes({ includeGroup: true }),
    fetchGroups(),
    fetchProducts(true),
  ])
})

// Watch for category changes to load suggested attributes
watch(
  () => form.value.categoryIds,
  async (newCategoryIds) => {
    if (newCategoryIds.length > 0) {
      loadingSuggestedAttributes.value = true
      suggestedAttributes.value = await fetchCategoryAttributesBulk(newCategoryIds)
      loadingSuggestedAttributes.value = false
    } else {
      suggestedAttributes.value = []
    }
  },
  { deep: true }
)

// Getter/setter for attribute values
function getAttributeValue(attrId: string): AttributeValue {
  return attributeValues.value[attrId] ?? null
}

function setAttributeValue(attrId: string, value: AttributeValue) {
  attributeValues.value[attrId] = value
}

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

  // Validate bundle features have names
  if (isBundle.value) {
    for (const feature of form.value.features) {
      if (!feature.name.trim()) {
        error.value = 'All features must have a name'
        return
      }
    }
  }

  loading.value = true
  error.value = null

  try {
    // Prepare attributes array (only non-null values)
    const attrValues = Object.entries(attributeValues.value)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .map(([attributeId, value]) => ({ attributeId, value }))

    // Prepare features for API (strip temp IDs, map to API format)
    const featuresPayload = isBundle.value
      ? form.value.features.map((f, i) => ({
          name: f.name,
          minOptions: f.minOptions,
          maxOptions: f.maxOptions,
          sortOrder: i,
          options: f.options.map((o, j) => ({
            optionProductId: o.optionProductId,
            isRequired: o.isRequired,
            isDefault: o.isDefault,
            minQty: o.minQty,
            maxQty: o.maxQty,
            sortOrder: j,
          })),
        }))
      : undefined

    const product = await createProduct({
      name: form.value.name.trim(),
      sku: form.value.sku.trim(),
      description: form.value.description.trim() || undefined,
      type: form.value.type,
      billingFrequency: form.value.billingFrequency,
      customBillingMonths: form.value.customBillingMonths || undefined,
      defaultTermMonths: form.value.defaultTermMonths || undefined,
      isTaxable: form.value.isTaxable,
      unitOfMeasureId: form.value.unitOfMeasureId || undefined,
      categoryIds: form.value.categoryIds.length > 0 ? form.value.categoryIds : undefined,
      attributes: attrValues.length > 0 ? attrValues : undefined,
      features: featuresPayload,
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
        </div>

        <!-- Bundle Features (conditional) -->
        <div v-if="isBundle" class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Bundle Features</h3>
          <p class="text-sm text-gray-500">
            Define features and options for this configurable bundle.
          </p>
          <CpqBundleFeaturesEditor
            v-model="form.features"
            :available-products="availableOptionProducts"
          />
        </div>

        <!-- Categories -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Categories</h3>
          <p class="text-sm text-gray-500">
            Assign this product to one or more categories. Categories help organize products and can suggest relevant attributes.
          </p>
          <CpqCategorySelector
            v-model="form.categoryIds"
            placeholder="Select categories..."
          />
        </div>

        <!-- Attributes -->
        <div v-if="attributes.length > 0" class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Attributes</h3>

          <!-- Suggested Attributes (from selected categories) -->
          <div v-if="loadingSuggestedAttributes" class="flex items-center gap-2 text-sm text-gray-500">
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
            Loading suggested attributes...
          </div>

          <div v-else-if="suggestedAttributes.length > 0" class="space-y-4">
            <div class="flex items-center gap-2">
              <UBadge color="primary" variant="subtle" size="xs">Suggested</UBadge>
              <span class="text-sm text-gray-500">Based on selected categories</span>
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

          <div v-else-if="form.categoryIds.length === 0" class="text-sm text-gray-500 italic">
            Select categories above to see suggested attributes.
          </div>

          <!-- All Other Attributes (expandable) -->
          <div v-if="otherAttributes.length > 0">
            <UButton
              variant="ghost"
              size="sm"
              :icon="showAllAttributes ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
              @click="showAllAttributes = !showAllAttributes"
            >
              {{ showAllAttributes ? 'Hide' : 'Show' }} all attributes ({{ otherAttributes.length }})
            </UButton>

            <div v-if="showAllAttributes" class="mt-4 space-y-4">
              <div v-for="group in groups" :key="group.id">
                <h4
                  v-if="otherAttributes.some(a => a.groupId === group.id)"
                  class="text-sm font-medium text-gray-500 border-b pb-1 mb-3 dark:border-gray-700"
                >
                  {{ group.name }}
                </h4>
                <div class="space-y-3">
                  <UFormField
                    v-for="attr in otherAttributes.filter(a => a.groupId === group.id)"
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
              <div v-if="otherAttributes.some(a => !a.groupId)">
                <h4
                  v-if="groups.length > 0"
                  class="text-sm font-medium text-gray-500 border-b pb-1 mb-3 dark:border-gray-700"
                >
                  Other
                </h4>
                <div class="space-y-3">
                  <UFormField
                    v-for="attr in otherAttributes.filter(a => !a.groupId)"
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
            </div>
          </div>
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

          <UCheckbox
            v-model="form.isTaxable"
            label="Taxable"
            hint="Uncheck for products exempt from sales tax (e.g., some services, digital goods)"
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
            Create Product
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
