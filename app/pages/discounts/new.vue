<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
import type { DiscountType, DiscountScope } from '~/generated/prisma/client'

const router = useRouter()
const { createDiscount } = useDiscounts()
const { categories, fetchCategories } = useCategories()

const initialFormState = {
  name: '',
  description: '',
  type: 'PERCENTAGE' as DiscountType,
  value: 10,
  scope: 'LINE_ITEM' as DiscountScope,
  categoryId: undefined as string | undefined,
  minQuantity: null as number | null,
  maxQuantity: null as number | null,
  minOrderValue: null as number | null,
  validFrom: '',
  validTo: '',
  isActive: true,
  stackable: false,
  priority: 100,
  useTiers: false,
  tiers: [] as { minQuantity: number; maxQuantity: number | null; value: number }[],
}

onMounted(() => {
  fetchCategories()
})

const form = ref({ ...initialFormState })
const initialValues = ref({ ...initialFormState })

const { confirmLeave } = useUnsavedChanges(form, initialValues)

const loading = ref(false)
const error = ref<string | null>(null)

function handleCancel() {
  if (confirmLeave()) {
    router.push('/discounts')
  }
}

const typeOptions = [
  { label: 'Percentage', value: 'PERCENTAGE' },
  { label: 'Fixed Amount', value: 'FIXED_AMOUNT' },
]

const scopeOptions = [
  { label: 'Line Item', value: 'LINE_ITEM' },
  { label: 'Quote Total', value: 'QUOTE' },
  { label: 'Product Category', value: 'PRODUCT_CATEGORY' },
]

const categoryOptions = computed(() =>
  categories.value
    .filter((c) => c.isActive)
    .map((c) => ({ label: c.name, value: c.id }))
)

const isCategoryScope = computed(() => form.value.scope === 'PRODUCT_CATEGORY')

function addTier() {
  const lastTier = form.value.tiers[form.value.tiers.length - 1]
  const minQty = lastTier ? (lastTier.maxQuantity ?? lastTier.minQuantity) + 1 : 1
  form.value.tiers.push({
    minQuantity: minQty,
    maxQuantity: null,
    value: form.value.value,
  })
}

function removeTier(index: number) {
  form.value.tiers.splice(index, 1)
}

async function handleSubmit() {
  if (!form.value.name.trim()) {
    error.value = 'Discount name is required'
    return
  }

  loading.value = true
  error.value = null

  try {
    const discount = await createDiscount({
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined,
      type: form.value.type,
      value: form.value.value,
      scope: form.value.scope,
      categoryId: isCategoryScope.value ? form.value.categoryId : undefined,
      minQuantity: form.value.minQuantity ?? undefined,
      maxQuantity: form.value.maxQuantity ?? undefined,
      minOrderValue: form.value.minOrderValue ?? undefined,
      validFrom: form.value.validFrom || undefined,
      validTo: form.value.validTo || undefined,
      isActive: form.value.isActive,
      stackable: form.value.stackable,
      priority: form.value.priority,
      tiers: form.value.useTiers && form.value.tiers.length > 0 ? form.value.tiers : undefined,
    })

    if (discount) {
      router.push('/discounts')
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to create discount')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Create New Discount</h1>
      </template>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <!-- Basic Info -->
        <div class="space-y-4">
          <UFormField label="Discount Name" required>
            <UInput
              v-model="form.name"
              placeholder="e.g., Summer Sale 20%"
            />
          </UFormField>

          <UFormField label="Description">
            <UTextarea
              v-model="form.description"
              placeholder="Describe this discount"
              :rows="2"
            />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Type">
              <USelect v-model="form.type" :items="typeOptions" value-key="value" />
            </UFormField>

            <UFormField :label="form.type === 'PERCENTAGE' ? 'Percentage' : 'Amount'">
              <UInput
                v-model.number="form.value"
                type="number"
                :min="0"
                :step="form.type === 'PERCENTAGE' ? 1 : 0.01"
                :class="form.type === 'PERCENTAGE' ? 'w-20' : 'w-40'"
              />
            </UFormField>
          </div>

          <UFormField label="Scope">
            <USelect v-model="form.scope" :items="scopeOptions" value-key="value" />
          </UFormField>

          <UFormField v-if="isCategoryScope" label="Category" required hint="Discount applies only to products in this category">
            <USelect
              v-model="form.categoryId"
              :items="categoryOptions"
              value-key="value"
              placeholder="Select a category"
            />
          </UFormField>
        </div>

        <!-- Thresholds -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Thresholds (Optional)</h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Min Quantity">
              <UInput
                v-model.number="form.minQuantity"
                type="number"
                :min="1"
                placeholder="No minimum"
              />
            </UFormField>

            <UFormField label="Max Quantity">
              <UInput
                v-model.number="form.maxQuantity"
                type="number"
                :min="1"
                placeholder="No maximum"
              />
            </UFormField>
          </div>

          <UFormField v-if="form.scope === 'QUOTE'" label="Min Order Value">
            <UInput
              v-model.number="form.minOrderValue"
              type="number"
              :min="0"
              step="0.01"
              placeholder="No minimum"
            />
          </UFormField>
        </div>

        <!-- Volume Tiers -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-500 uppercase">Volume Tiers</h3>
            <UCheckbox v-model="form.useTiers" label="Use tiered pricing" />
          </div>

          <div v-if="form.useTiers" class="space-y-3">
            <div
              v-for="(tier, index) in form.tiers"
              :key="index"
              class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <UFormField label="Min Qty" class="w-28">
                <UInput v-model.number="tier.minQuantity" type="number" :min="1" />
              </UFormField>
              <UFormField label="Max Qty" class="w-28">
                <UInput
                  v-model.number="tier.maxQuantity"
                  type="number"
                  :min="tier.minQuantity"
                  placeholder="No max"
                />
              </UFormField>
              <UFormField :label="form.type === 'PERCENTAGE' ? '%' : '$'" :class="form.type === 'PERCENTAGE' ? 'w-20' : 'w-40'">
                <UInput v-model.number="tier.value" type="number" :min="0" />
              </UFormField>
              <UButton
                variant="ghost"
                color="error"
                icon="i-heroicons-trash"
                size="sm"
                class="mt-6"
                @click="removeTier(index)"
              />
            </div>

            <UButton
              variant="soft"
              size="sm"
              icon="i-heroicons-plus"
              @click="addTier"
            >
              Add Tier
            </UButton>
          </div>
        </div>

        <!-- Validity -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Validity Period (Optional)</h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Valid From">
              <UInput v-model="form.validFrom" type="date" />
            </UFormField>

            <UFormField label="Valid To">
              <UInput v-model="form.validTo" type="date" />
            </UFormField>
          </div>
        </div>

        <!-- Settings -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Settings</h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Priority" hint="Lower numbers apply first">
              <UInput v-model.number="form.priority" type="number" class="w-28" />
            </UFormField>

            <div class="space-y-2 pt-6">
              <UCheckbox v-model="form.isActive" label="Active" />
              <UCheckbox v-model="form.stackable" label="Stackable with other discounts" />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <UButton variant="ghost" :disabled="loading" @click="handleCancel">
            Cancel
          </UButton>
          <UButton type="submit" :loading="loading" icon="i-heroicons-plus">
            Create Discount
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
