<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
import type { RuleType, RuleTrigger } from '~/generated/prisma/client'

const router = useRouter()
const { createRule } = useRules()

const initialFormState = {
  name: '',
  description: '',
  type: 'PRICING' as RuleType,
  trigger: 'ON_QUOTE_SAVE' as RuleTrigger,
  priority: 100,
  isActive: true,
  conditionField: 'quantity',
  conditionOp: 'gte' as const,
  conditionValue: '10',
  actionType: 'APPLY_DISCOUNT' as const,
  actionMessage: '',
}

const form = ref({ ...initialFormState })
const initialValues = ref({ ...initialFormState })

const { confirmLeave } = useUnsavedChanges(form, initialValues)

const loading = ref(false)
const error = ref<string | null>(null)

function handleCancel() {
  if (confirmLeave()) {
    router.push('/rules')
  }
}

const typeOptions = [
  { label: 'Configuration', value: 'CONFIGURATION' },
  { label: 'Pricing', value: 'PRICING' },
]

const triggerOptions = [
  { label: 'On Product Add', value: 'ON_PRODUCT_ADD' },
  { label: 'On Quantity Change', value: 'ON_QUANTITY_CHANGE' },
  { label: 'On Quote Save', value: 'ON_QUOTE_SAVE' },
  { label: 'On Finalize', value: 'ON_FINALIZE' },
]

const conditionFields = [
  { label: 'Quantity', value: 'quantity' },
  { label: 'Line Total', value: 'lineTotal' },
  { label: 'Quote Total', value: 'quoteTotal' },
  { label: 'Product SKU', value: 'productSku' },
  { label: 'Customer ID', value: 'customerId' },
  { label: 'Discount %', value: 'discountPercentage' },
]

const conditionOps = [
  { label: 'Equals', value: 'eq' },
  { label: 'Not Equals', value: 'neq' },
  { label: 'Greater Than', value: 'gt' },
  { label: 'Less Than', value: 'lt' },
  { label: 'Greater or Equal', value: 'gte' },
  { label: 'Less or Equal', value: 'lte' },
]

const configActionTypes = [
  { label: 'Require Option', value: 'REQUIRE_OPTION' },
  { label: 'Exclude Option', value: 'EXCLUDE_OPTION' },
  { label: 'Require Product', value: 'REQUIRE_PRODUCT' },
  { label: 'Exclude Product', value: 'EXCLUDE_PRODUCT' },
  { label: 'Show Warning', value: 'SHOW_WARNING' },
]

const pricingActionTypes = [
  { label: 'Apply Discount', value: 'APPLY_DISCOUNT' },
  { label: 'Apply Markup', value: 'APPLY_MARKUP' },
  { label: 'Set Price', value: 'SET_PRICE' },
  { label: 'Require Approval', value: 'REQUIRE_APPROVAL' },
  { label: 'Show Warning', value: 'SHOW_WARNING' },
]

const actionTypeOptions = computed(() =>
  form.value.type === 'CONFIGURATION' ? configActionTypes : pricingActionTypes
)

async function handleSubmit() {
  if (!form.value.name.trim()) {
    error.value = 'Rule name is required'
    return
  }

  loading.value = true
  error.value = null

  try {
    // Build condition object
    const condition = {
      field: form.value.conditionField,
      op: form.value.conditionOp,
      value: isNaN(Number(form.value.conditionValue))
        ? form.value.conditionValue
        : Number(form.value.conditionValue),
    }

    // Build action object
    const action: Record<string, any> = {
      type: form.value.actionType,
    }
    if (form.value.actionMessage) {
      action.message = form.value.actionMessage
    }

    const rule = await createRule({
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined,
      type: form.value.type,
      trigger: form.value.trigger,
      priority: form.value.priority,
      condition,
      action,
      isActive: form.value.isActive,
    })

    if (rule) {
      router.push('/rules')
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to create rule')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Create New Rule</h1>
      </template>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <!-- Basic Info -->
        <div class="space-y-4">
          <UFormField label="Rule Name" required>
            <UInput
              v-model="form.name"
              placeholder="e.g., Volume Discount for 10+ units"
            />
          </UFormField>

          <UFormField label="Description">
            <UTextarea
              v-model="form.description"
              placeholder="Describe what this rule does"
              :rows="2"
            />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Type">
              <USelect v-model="form.type" :items="typeOptions" value-key="value" />
            </UFormField>

            <UFormField label="Trigger">
              <USelect v-model="form.trigger" :items="triggerOptions" value-key="value" />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Priority" hint="Lower numbers run first">
              <UInput v-model.number="form.priority" type="number" />
            </UFormField>

            <UFormField label="Status">
              <UCheckbox v-model="form.isActive" label="Active" />
            </UFormField>
          </div>
        </div>

        <!-- Condition -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Condition (When)</h3>

          <div class="grid grid-cols-3 gap-4">
            <UFormField label="Field">
              <USelect v-model="form.conditionField" :items="conditionFields" value-key="value" />
            </UFormField>

            <UFormField label="Operator">
              <USelect v-model="form.conditionOp" :items="conditionOps" value-key="value" />
            </UFormField>

            <UFormField label="Value">
              <UInput v-model="form.conditionValue" placeholder="Value" />
            </UFormField>
          </div>

          <p class="text-sm text-gray-500">
            When <strong>{{ form.conditionField }}</strong>
            <strong>{{ conditionOps.find(o => o.value === form.conditionOp)?.label.toLowerCase() }}</strong>
            <strong>{{ form.conditionValue }}</strong>
          </p>
        </div>

        <!-- Action -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Action (Then)</h3>

          <UFormField label="Action Type">
            <USelect v-model="form.actionType" :items="actionTypeOptions" value-key="value" />
          </UFormField>

          <UFormField
            v-if="['SHOW_WARNING', 'REQUIRE_APPROVAL'].includes(form.actionType)"
            label="Message"
          >
            <UInput
              v-model="form.actionMessage"
              placeholder="Message to display"
            />
          </UFormField>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <UButton variant="ghost" :disabled="loading" @click="handleCancel">
            Cancel
          </UButton>
          <UButton type="submit" :loading="loading" icon="i-heroicons-plus">
            Create Rule
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
