<script setup lang="ts">
import type { DiscountType, DiscountScope } from '~/generated/prisma'

const route = useRoute()
const router = useRouter()
const { fetchDiscount, updateDiscount, deleteDiscount } = useDiscounts()

const discountId = route.params.id as string
const discount = ref<Awaited<ReturnType<typeof fetchDiscount>> | null>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)

const form = ref({
  name: '',
  description: '',
  type: 'PERCENTAGE' as DiscountType,
  value: 10,
  scope: 'LINE_ITEM' as DiscountScope,
  minQuantity: null as number | null,
  maxQuantity: null as number | null,
  minOrderValue: null as number | null,
  validFrom: '',
  validTo: '',
  isActive: true,
  stackable: false,
  priority: 100,
  tiers: [] as { minQuantity: number; maxQuantity: number | null; value: number }[],
})

const typeOptions = [
  { label: 'Percentage', value: 'PERCENTAGE' },
  { label: 'Fixed Amount', value: 'FIXED_AMOUNT' },
]

const scopeOptions = [
  { label: 'Line Item', value: 'LINE_ITEM' },
  { label: 'Quote Total', value: 'QUOTE' },
]

onMounted(async () => {
  await loadDiscount()
})

async function loadDiscount() {
  loading.value = true
  error.value = null
  try {
    discount.value = await fetchDiscount(discountId)
    if (discount.value) {
      form.value = {
        name: discount.value.name,
        description: discount.value.description || '',
        type: discount.value.type,
        value: Number(discount.value.value),
        scope: discount.value.scope,
        minQuantity: discount.value.minQuantity,
        maxQuantity: discount.value.maxQuantity,
        minOrderValue: discount.value.minOrderValue ? Number(discount.value.minOrderValue) : null,
        validFrom: discount.value.validFrom ? discount.value.validFrom.split('T')[0] : '',
        validTo: discount.value.validTo ? discount.value.validTo.split('T')[0] : '',
        isActive: discount.value.isActive,
        stackable: discount.value.stackable,
        priority: discount.value.priority,
        tiers: discount.value.tiers.map((t) => ({
          minQuantity: t.minQuantity,
          maxQuantity: t.maxQuantity,
          value: Number(t.value),
        })),
      }
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load discount'
  } finally {
    loading.value = false
  }
}

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

async function handleSave() {
  if (!form.value.name.trim()) {
    error.value = 'Discount name is required'
    return
  }

  saving.value = true
  error.value = null

  try {
    const updated = await updateDiscount(discountId, {
      name: form.value.name.trim(),
      description: form.value.description.trim() || null,
      type: form.value.type,
      value: form.value.value,
      scope: form.value.scope,
      minQuantity: form.value.minQuantity,
      maxQuantity: form.value.maxQuantity,
      minOrderValue: form.value.minOrderValue,
      validFrom: form.value.validFrom || null,
      validTo: form.value.validTo || null,
      isActive: form.value.isActive,
      stackable: form.value.stackable,
      priority: form.value.priority,
      tiers: form.value.tiers,
    })

    if (updated) {
      await loadDiscount()
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to update discount'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!confirm('Are you sure you want to delete this discount?')) return

  try {
    await deleteDiscount(discountId)
    router.push('/discounts')
  } catch (e: any) {
    error.value = e.message || 'Failed to delete discount'
  }
}

function cancelEdit() {
  if (discount.value) {
    form.value = {
      name: discount.value.name,
      description: discount.value.description || '',
      type: discount.value.type,
      value: Number(discount.value.value),
      scope: discount.value.scope,
      minQuantity: discount.value.minQuantity,
      maxQuantity: discount.value.maxQuantity,
      minOrderValue: discount.value.minOrderValue ? Number(discount.value.minOrderValue) : null,
      validFrom: discount.value.validFrom ? discount.value.validFrom.split('T')[0] : '',
      validTo: discount.value.validTo ? discount.value.validTo.split('T')[0] : '',
      isActive: discount.value.isActive,
      stackable: discount.value.stackable,
      priority: discount.value.priority,
      tiers: discount.value.tiers.map((t) => ({
        minQuantity: t.minQuantity,
        maxQuantity: t.maxQuantity,
        value: Number(t.value),
      })),
    }
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UButton
      to="/discounts"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Discounts
    </UButton>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error -->
    <UAlert v-else-if="error && !discount" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Not Found -->
    <UAlert v-else-if="!discount" color="warning" icon="i-heroicons-exclamation-triangle">
      <template #title>Discount not found</template>
    </UAlert>

    <!-- Discount Editor -->
    <UCard v-else>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Edit Discount</h1>
          <UButton
            variant="ghost"
            color="error"
            icon="i-heroicons-trash"
            size="sm"
            @click="handleDelete"
          >
            Delete
          </UButton>
        </div>
      </template>

      <form class="space-y-6" @submit.prevent="handleSave">
        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <!-- Basic Info -->
        <div class="space-y-4">
          <UFormField label="Discount Name" required>
            <UInput v-model="form.name" />
          </UFormField>

          <UFormField label="Description">
            <UTextarea v-model="form.description" :rows="2" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Type">
              <USelect v-model="form.type" :items="typeOptions" />
            </UFormField>

            <UFormField :label="form.type === 'PERCENTAGE' ? 'Percentage' : 'Amount'">
              <UInput v-model.number="form.value" type="number" :min="0" />
            </UFormField>
          </div>

          <UFormField label="Scope">
            <USelect v-model="form.scope" :items="scopeOptions" />
          </UFormField>
        </div>

        <!-- Thresholds -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Thresholds</h3>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Min Quantity">
              <UInput v-model.number="form.minQuantity" type="number" :min="1" />
            </UFormField>

            <UFormField label="Max Quantity">
              <UInput v-model.number="form.maxQuantity" type="number" :min="1" />
            </UFormField>
          </div>

          <UFormField v-if="form.scope === 'QUOTE'" label="Min Order Value">
            <UInput v-model.number="form.minOrderValue" type="number" :min="0" step="0.01" />
          </UFormField>
        </div>

        <!-- Volume Tiers -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Volume Tiers</h3>

          <div class="space-y-3">
            <div
              v-for="(tier, index) in form.tiers"
              :key="index"
              class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <UFormField label="Min Qty" class="flex-1">
                <UInput v-model.number="tier.minQuantity" type="number" :min="1" />
              </UFormField>
              <UFormField label="Max Qty" class="flex-1">
                <UInput v-model.number="tier.maxQuantity" type="number" placeholder="No max" />
              </UFormField>
              <UFormField :label="form.type === 'PERCENTAGE' ? '%' : '$'" class="flex-1">
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

            <UButton variant="soft" size="sm" icon="i-heroicons-plus" @click="addTier">
              Add Tier
            </UButton>
          </div>
        </div>

        <!-- Validity -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Validity Period</h3>

          <div class="grid grid-cols-2 gap-4">
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

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Priority">
              <UInput v-model.number="form.priority" type="number" />
            </UFormField>

            <div class="space-y-2 pt-6">
              <UCheckbox v-model="form.isActive" label="Active" />
              <UCheckbox v-model="form.stackable" label="Stackable" />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <UButton variant="ghost" :disabled="saving" @click="cancelEdit">
            Cancel
          </UButton>
          <UButton type="submit" :loading="saving">
            Save Changes
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
