<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
import type { UnitOfMeasureWithDetails } from '~/composables/useUnits'

const _route = useRoute()
const router = useRouter()
const toast = useToast()
const { units, fetchUnits, fetchUnit, updateUnit, deleteUnit, error: unitError } = useUnits()

const unitId = useRequiredParam('id')
const unit = ref<UnitOfMeasureWithDetails | null>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)

const form = ref({
  name: '',
  abbreviation: '',
  baseUnitId: null as string | null,
  conversionFactor: 1,
  isActive: true,
})

onMounted(async () => {
  await Promise.all([loadUnit(), fetchUnits(true)])
})

async function loadUnit() {
  loading.value = true
  error.value = null
  try {
    unit.value = await fetchUnit(unitId)
    if (!unit.value) {
      error.value = 'Unit not found'
      return
    }
    form.value = {
      name: unit.value.name,
      abbreviation: unit.value.abbreviation,
      baseUnitId: unit.value.baseUnitId || null,
      conversionFactor: typeof unit.value.conversionFactor === 'string'
        ? parseFloat(unit.value.conversionFactor)
        : unit.value.conversionFactor,
      isActive: unit.value.isActive,
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to load unit')
  } finally {
    loading.value = false
  }
}

// Filter out self and derived units from base unit options
const baseUnitOptions = computed(() => {
  const derivedIds = new Set(unit.value?.derived?.map(d => d.id) || [])
  return [
    { label: 'None (base unit)', value: null },
    ...units.value
      .filter((u) => u.id !== unitId && !derivedIds.has(u.id))
      .map((u) => ({ label: `${u.name} (${u.abbreviation})`, value: u.id })),
  ]
})

async function handleSave() {
  if (!form.value.name.trim()) {
    error.value = 'Unit name is required'
    return
  }
  if (!form.value.abbreviation.trim()) {
    error.value = 'Abbreviation is required'
    return
  }

  saving.value = true
  error.value = null

  try {
    const updated = await updateUnit(unitId, {
      name: form.value.name.trim(),
      abbreviation: form.value.abbreviation.trim(),
      baseUnitId: form.value.baseUnitId || null,
      conversionFactor: form.value.baseUnitId ? form.value.conversionFactor : 1,
      isActive: form.value.isActive,
    })

    if (updated) {
      toast.add({ title: 'Unit saved', color: 'success' })
      await loadUnit()
    } else {
      error.value = unitError.value || 'Failed to update unit'
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to update unit')
  } finally {
    saving.value = false
  }
}

async function handleDeactivate() {
  if (!confirm('Are you sure you want to deactivate this unit?')) return

  try {
    const success = await deleteUnit(unitId)
    if (success) {
      router.push('/units')
    } else {
      error.value = unitError.value || 'Failed to deactivate unit'
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to deactivate unit')
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error -->
    <UAlert v-else-if="error && !unit" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Edit Form -->
    <UCard v-else-if="unit">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Edit Unit: {{ unit.name }}</h1>
          <div class="flex items-center gap-2">
            <UBadge v-if="!unit.isActive" color="warning" variant="subtle">
              Inactive
            </UBadge>
            <UButton
              v-if="unit.isActive"
              variant="ghost"
              color="error"
              icon="i-heroicons-trash"
              size="sm"
              @click="handleDeactivate"
            >
              Deactivate
            </UButton>
          </div>
        </div>
      </template>

      <form class="space-y-6" @submit.prevent="handleSave">
        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <div class="space-y-4">
          <UFormField label="Name" required>
            <UInput
              v-model="form.name"
              placeholder="e.g., Hour"
              icon="i-heroicons-tag"
            />
          </UFormField>

          <UFormField label="Abbreviation" required>
            <UInput
              v-model="form.abbreviation"
              placeholder="e.g., hr"
              icon="i-heroicons-hashtag"
            />
          </UFormField>
        </div>

        <div class="space-y-4">
          <h3 class="text-sm font-medium text-ga-gray-600 uppercase">Unit Conversion</h3>

          <UFormField label="Base Unit">
            <USelect
              v-model="form.baseUnitId"
              :items="baseUnitOptions"
              value-key="value"
            />
          </UFormField>

          <UFormField
            v-if="form.baseUnitId"
            label="Conversion Factor"
            hint="How many base units equal 1 of this unit"
          >
            <UInput
              v-model.number="form.conversionFactor"
              type="number"
              :min="0.0001"
              step="0.0001"
            />
          </UFormField>

          <UAlert v-if="form.baseUnitId" color="info" variant="subtle" icon="i-heroicons-information-circle">
            <template #description>
              1 {{ form.name || 'unit' }} = {{ form.conversionFactor }}
              {{ units.find(u => u.id === form.baseUnitId)?.abbreviation || 'base units' }}
            </template>
          </UAlert>
        </div>

        <!-- Usage Info -->
        <div v-if="unit.productCount !== undefined && unit.productCount > 0" class="space-y-2">
          <h3 class="text-sm font-medium text-ga-gray-600 uppercase">Usage</h3>
          <UAlert color="info" variant="subtle" icon="i-heroicons-cube">
            <template #description>
              This unit is used by {{ unit.productCount }} product{{ unit.productCount !== 1 ? 's' : '' }}.
            </template>
          </UAlert>
        </div>

        <!-- Derived Units -->
        <div v-if="unit.derived && unit.derived.length > 0" class="space-y-2">
          <h3 class="text-sm font-medium text-ga-gray-600 uppercase">Derived Units</h3>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="derived in unit.derived"
              :key="derived.id"
              variant="subtle"
              color="neutral"
            >
              {{ derived.name }} ({{ derived.conversionFactor }} {{ form.abbreviation }})
            </UBadge>
          </div>
        </div>

        <div class="space-y-4">
          <UCheckbox v-model="form.isActive" label="Active" />
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <UButton
            to="/units"
            variant="ghost"
            :disabled="saving"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            :loading="saving"
            icon="i-heroicons-check"
          >
            Save Changes
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
