<script setup lang="ts">
import type { QuoteLineItem, ContractPriceInfo } from '~/composables/useQuotes'
import type { AttributeValue } from '~/types/domain'

const { features } = usePhaseContext()

interface ProductAttributeDisplay {
  id: string
  name: string
  code: string
  type: string
  value: AttributeValue
}

// Extended line item with additional product details
type ExtendedLineItem = QuoteLineItem & {
  product: QuoteLineItem['product'] & {
    unitOfMeasure?: { id: string; name: string; abbreviation: string } | null
    attributes?: Array<{
      value: AttributeValue
      attribute: {
        id: string
        name: string
        code: string
        type: string
        options?: Array<{ label: string; value: string }> | null
      }
    }>
  }
}

const props = defineProps<{
  lineItem: ExtendedLineItem
  isChild?: boolean
  editable?: boolean
  contractInfo?: ContractPriceInfo
  isExpanded?: boolean
}>()

const emit = defineEmits<{
  'remove': [lineId: string]
  'update-quantity': [lineId: string, quantity: number]
  'apply-discount': [lineId: string]
  'toggle-expand': [lineId: string]
}>()

const { formatPrice } = usePricing()
const { getBillingLabel, getBillingSuffix, isRecurring, getEffectiveTerm, formatTerm } = useBillingDisplay()

const isEditing = ref(false)
const editQuantity = ref(props.lineItem.quantity)
const updating = ref(false)

watch(
  () => props.lineItem.quantity,
  (newQty) => {
    if (!isEditing.value) {
      editQuantity.value = newQty
    }
  }
)

function startEditing() {
  if (!props.editable) return
  editQuantity.value = props.lineItem.quantity
  isEditing.value = true
}

function cancelEditing() {
  editQuantity.value = props.lineItem.quantity
  isEditing.value = false
}

async function saveQuantity() {
  if (editQuantity.value < 1) {
    editQuantity.value = 1
  }
  if (editQuantity.value === props.lineItem.quantity) {
    isEditing.value = false
    return
  }

  updating.value = true
  emit('update-quantity', props.lineItem.id, editQuantity.value)
  isEditing.value = false
  updating.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    saveQuantity()
  } else if (event.key === 'Escape') {
    cancelEditing()
  }
}

const hasDiscounts = computed(() => {
  return props.lineItem.appliedDiscounts && props.lineItem.appliedDiscounts.length > 0
})

// Calculate line total before discounts
const lineTotal = computed(() => {
  return parseFloat(String(props.lineItem.listPrice)) * props.lineItem.quantity
})

// Calculate total discount amount
const discountAmount = computed(() => {
  return parseFloat(String(props.lineItem.discount)) || 0
})

// Check if this is a bundle (netPrice would be 0)
const isBundle = computed(() => {
  return props.lineItem.product.type === 'BUNDLE'
})

// Check if bundle has children
const hasChildren = computed(() => {
  return isBundle.value && props.lineItem.childLines && props.lineItem.childLines.length > 0
})

// Check for issues with child line items
const childLineIssues = computed(() => {
  if (!hasChildren.value) return []
  const issues: Array<{ lineId: string; issue: string }> = []

  for (const child of props.lineItem.childLines || []) {
    if (!child.product) {
      issues.push({ lineId: child.id, issue: 'Product not found' })
    } else if (!child.product.isActive) {
      issues.push({ lineId: child.id, issue: `${child.product.name} is inactive` })
    }
  }

  return issues
})

const hasChildIssues = computed(() => childLineIssues.value.length > 0)

// Get key attributes to display (first 3)
const keyAttributes = computed<ProductAttributeDisplay[]>(() => {
  const attrs = props.lineItem.product?.attributes || []
  return attrs.slice(0, 3).map((pa) => ({
    id: pa.attribute.id,
    name: pa.attribute.name,
    code: pa.attribute.code,
    type: pa.attribute.type,
    value: pa.value,
  }))
})

function formatAttrValue(attr: ProductAttributeDisplay): string {
  if (attr.value === null || attr.value === undefined || attr.value === '') return '-'
  switch (attr.type) {
    case 'BOOLEAN':
      return attr.value ? 'Yes' : 'No'
    case 'SELECT': {
      const pa = props.lineItem.product?.attributes?.find((a) => a.attribute.id === attr.id)
      const opt = pa?.attribute.options?.find((o) => o.value === attr.value)
      return opt?.label || String(attr.value)
    }
    case 'DATE':
      return typeof attr.value === 'string' ? new Date(attr.value).toLocaleDateString() : '-'
    default:
      return String(attr.value)
  }
}
</script>

<template>
  <div>
    <div
      :class="[
        'py-3 px-4 rounded-lg',
        isChild ? 'ml-6 bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-900 border dark:border-gray-800'
      ]"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 min-w-0 flex-1">
          <!-- Expand/collapse button for bundles -->
          <button
            v-if="hasChildren"
            class="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            @click="emit('toggle-expand', lineItem.id)"
          >
            <UIcon
              :name="isExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
              class="w-4 h-4 text-gray-500"
            />
          </button>
          <div v-else-if="!isChild" class="w-6" />
          <div v-if="isChild" class="text-gray-400">
            <UIcon name="i-heroicons-arrow-turn-down-right" class="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-medium truncate">{{ lineItem.product.name }}</p>
              <UBadge
                v-if="isBundle"
                color="primary"
                variant="subtle"
                size="xs"
              >
                Bundle
              </UBadge>
              <UBadge
                v-if="hasChildren"
                color="neutral"
                variant="subtle"
                size="xs"
              >
                {{ lineItem.childLines?.length }} items
              </UBadge>
              <!-- Warning for bundles without children -->
              <UTooltip
                v-if="isBundle && !hasChildren"
                text="Bundle has no configured components"
              >
                <UBadge
                  color="warning"
                  variant="subtle"
                  size="xs"
                >
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-3 h-3 mr-1" />
                  No components
                </UBadge>
              </UTooltip>
              <!-- Warning for child line issues -->
              <UTooltip
                v-if="hasChildIssues"
                :text="childLineIssues.map(i => i.issue).join(', ')"
              >
                <UBadge
                  color="error"
                  variant="subtle"
                  size="xs"
                >
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-3 h-3 mr-1" />
                  {{ childLineIssues.length }} issue(s)
                </UBadge>
              </UTooltip>
              <UBadge
                v-if="features.taxes && lineItem.product.isTaxable === false"
                color="info"
                variant="subtle"
                size="xs"
              >
                Non-Taxable
              </UBadge>
              <!-- Billing Frequency Badge (Phase 3+) -->
              <UBadge
                v-if="features.subscriptions && isRecurring(lineItem.product.billingFrequency)"
                color="info"
                variant="subtle"
                size="xs"
              >
                {{ getBillingLabel(lineItem.product.billingFrequency, lineItem.product.customBillingMonths) }}
              </UBadge>
            </div>
            <p class="text-xs text-gray-500">{{ lineItem.product.sku }}</p>
            <!-- Key Attributes (Phase 4+) -->
            <div v-if="features.attributes && keyAttributes.length > 0" class="mt-1 flex flex-wrap gap-1">
              <UBadge
                v-for="attr in keyAttributes"
                :key="attr.id"
                variant="subtle"
                color="neutral"
                size="xs"
              >
                {{ attr.name }}: {{ formatAttrValue(attr) }}
              </UBadge>
            </div>
          </div>
        </div>

      <div class="flex items-center gap-4">
        <!-- Quantity -->
        <div class="text-right w-24">
          <p class="text-xs text-gray-500">Qty</p>
          <div v-if="isEditing" class="mt-1">
            <UInput
              v-model.number="editQuantity"
              type="number"
              :min="1"
              size="xs"
              class="w-16"
              autofocus
              @keydown="handleKeydown"
              @blur="saveQuantity"
            />
          </div>
          <button
            v-else
            class="font-medium hover:text-primary-600 transition-colors"
            :class="{ 'cursor-pointer': editable }"
            @click="startEditing"
          >
            {{ lineItem.quantity }}
            <span v-if="features.unitsOfMeasure && lineItem.product.unitOfMeasure" class="text-gray-500 font-normal">
              {{ lineItem.product.unitOfMeasure.abbreviation }}
            </span>
            <UIcon
              v-if="editable"
              name="i-heroicons-pencil"
              class="w-3 h-3 inline-block ml-1 opacity-0 group-hover:opacity-100"
            />
          </button>
        </div>

        <!-- Term (for recurring products) - Phase 3+ -->
        <div v-if="features.subscriptions && isRecurring(lineItem.product.billingFrequency)" class="text-right w-16">
          <p class="text-xs text-gray-500">Term</p>
          <p class="font-medium text-gray-600">
            {{ formatTerm(getEffectiveTerm(lineItem.termMonths, lineItem.product.defaultTermMonths)) }}
          </p>
        </div>

        <!-- Unit Price -->
        <div class="text-right w-28">
          <p class="text-xs text-gray-500">Unit Price</p>
          <div class="flex items-center justify-end gap-1">
            <p v-if="contractInfo" class="text-xs text-gray-400 line-through">
              {{ formatPrice(contractInfo.originalPrice) }}
            </p>
            <p class="font-medium" :class="{ 'text-info-600 dark:text-info-400': contractInfo }">
              {{ formatPrice(lineItem.listPrice) }}<span class="text-gray-400 font-normal text-xs">{{ getBillingSuffix(lineItem.product.billingFrequency, lineItem.product.customBillingMonths) }}</span><span v-if="features.unitsOfMeasure && lineItem.product.unitOfMeasure" class="text-gray-500 font-normal text-xs">/{{ lineItem.product.unitOfMeasure.abbreviation }}</span>
            </p>
          </div>
        </div>

        <!-- Line Total (before discounts) - Phase 2+ -->
        <div v-if="features.discounts && discountAmount > 0" class="text-right w-24">
          <p class="text-xs text-gray-500">Line Total</p>
          <p class="font-medium text-gray-400 line-through">{{ formatPrice(lineTotal) }}</p>
        </div>

        <!-- Discount - Phase 2+ -->
        <div v-if="features.discounts && discountAmount > 0" class="text-right w-24">
          <p class="text-xs text-gray-500">Discount</p>
          <p class="font-medium text-red-500">-{{ formatPrice(discountAmount) }}</p>
        </div>

        <!-- Net Price -->
        <div class="text-right w-24">
          <p class="text-xs text-gray-500">{{ isBundle ? 'Bundle' : 'Net Price' }}</p>
          <p v-if="isBundle" class="text-xs text-gray-500 italic">Sum of components</p>
          <p v-else class="font-semibold">{{ formatPrice(lineItem.netPrice) }}</p>
        </div>

        <!-- Actions -->
        <div v-if="editable" class="flex items-center gap-1">
          <UButton
            v-if="features.discounts"
            variant="ghost"
            size="xs"
            icon="i-heroicons-tag"
            title="Apply Discount"
            @click="emit('apply-discount', lineItem.id)"
          />
          <UButton
            variant="ghost"
            color="error"
            size="xs"
            icon="i-heroicons-trash"
            title="Remove"
            @click="emit('remove', lineItem.id)"
          />
        </div>
      </div>
    </div>

    <!-- Contract Pricing Indicator (Phase 3+) -->
    <div v-if="features.contracts && contractInfo" class="mt-2 flex flex-wrap items-center gap-2">
      <NuxtLink :to="`/contracts/${contractInfo.contractId}`" class="hover:opacity-80 transition-opacity">
        <UBadge variant="subtle" color="info" size="xs">
          <UIcon name="i-heroicons-document-check" class="w-3 h-3 mr-1" />
          {{ contractInfo.contractName }}:
          {{ contractInfo.priceType === 'fixed' ? 'Fixed Price' : `${contractInfo.discountPercent}% off` }}
        </UBadge>
      </NuxtLink>
      <span class="text-xs text-gray-500">(was {{ formatPrice(contractInfo.originalPrice) }})</span>
    </div>

      <!-- Applied Discounts (Phase 2+) -->
      <div v-if="features.discounts && hasDiscounts" class="mt-2 space-y-1">
        <div
          v-for="discount in lineItem.appliedDiscounts"
          :key="discount.id"
          class="flex items-center gap-2 text-sm text-gray-500"
        >
          <span class="text-gray-400">&#8627;</span>
          <span>{{ discount.discount?.name || 'Manual Discount' }}</span>
          <span v-if="discount.type === 'PERCENTAGE'" class="text-gray-400">({{ discount.value }}%)</span>
          <span class="text-red-500 font-medium">-{{ formatPrice(discount.calculatedAmount) }}</span>
        </div>
      </div>
    </div>

    <!-- Child Line Items (Bundle Components) -->
    <div v-if="hasChildren && isExpanded" class="mt-2 space-y-2">
      <CpqQuoteLineItem
        v-for="child in lineItem.childLines"
        :key="child.id"
        :line-item="child"
        :is-child="true"
        :editable="false"
      />
    </div>
  </div>
</template>
