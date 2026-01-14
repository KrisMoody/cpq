<script setup lang="ts">
const router = useRouter()
const { units, fetchUnits, createUnit, error: unitError } = useUnits()

const initialFormState = {
  name: '',
  abbreviation: '',
  baseUnitId: '' as string,
  conversionFactor: 1,
}

const form = ref({ ...initialFormState })
const initialValues = ref({ ...initialFormState })

const { confirmLeave } = useUnsavedChanges(form, initialValues)

const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  await fetchUnits()
})

function handleCancel() {
  if (confirmLeave()) {
    router.push('/units')
  }
}

const baseUnitOptions = computed(() => [
  { label: 'None (base unit)', value: '' },
  ...units.value.map((u) => ({ label: `${u.name} (${u.abbreviation})`, value: u.id })),
])

async function handleSubmit() {
  if (!form.value.name.trim()) {
    error.value = 'Unit name is required'
    return
  }
  if (!form.value.abbreviation.trim()) {
    error.value = 'Abbreviation is required'
    return
  }

  loading.value = true
  error.value = null

  try {
    const unit = await createUnit({
      name: form.value.name.trim(),
      abbreviation: form.value.abbreviation.trim(),
      baseUnitId: form.value.baseUnitId || undefined,
      conversionFactor: form.value.baseUnitId ? form.value.conversionFactor : undefined,
    })

    if (unit) {
      router.push('/units')
    } else {
      error.value = unitError.value || 'Failed to create unit'
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to create unit'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UButton
      to="/units"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Units
    </UButton>

    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Create New Unit of Measure</h1>
      </template>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <div class="space-y-4">
          <UFormField label="Name" required hint="Display name (e.g., Hour, License, Box)">
            <UInput
              v-model="form.name"
              placeholder="e.g., Hour"
              icon="i-heroicons-tag"
            />
          </UFormField>

          <UFormField label="Abbreviation" required hint="Short code shown with quantities (e.g., hr, lic, box)">
            <UInput
              v-model="form.abbreviation"
              placeholder="e.g., hr"
              icon="i-heroicons-hashtag"
            />
          </UFormField>
        </div>

        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Unit Conversion (Optional)</h3>

          <UFormField label="Base Unit" hint="If this unit converts to another unit">
            <USelect
              v-model="form.baseUnitId"
              :items="baseUnitOptions"
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
            Create Unit
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
