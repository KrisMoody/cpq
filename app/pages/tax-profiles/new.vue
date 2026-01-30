<script setup lang="ts">
const router = useRouter()
const { createTaxProfile, error } = useTaxProfiles()

const saving = ref(false)

const initialFormState = {
  name: '',
  description: '',
  country: '',
}

const form = ref({ ...initialFormState })
const initialValues = ref({ ...initialFormState })

const { confirmLeave } = useUnsavedChanges(form, initialValues)

function handleCancel() {
  if (confirmLeave()) {
    router.push('/tax-profiles')
  }
}

async function handleSubmit() {
  if (!form.value.name.trim()) {
    return
  }

  if (!form.value.country.trim()) {
    return
  }

  saving.value = true

  const taxProfile = await createTaxProfile({
    name: form.value.name.trim(),
    description: form.value.description.trim() || undefined,
    country: form.value.country.trim(),
  })

  saving.value = false

  if (taxProfile) {
    router.push(`/tax-profiles/${taxProfile.id}`)
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Create Tax Profile</h1>
      </template>

      <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
        <template #description>{{ error }}</template>
      </UAlert>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField label="Name" required>
          <UInput v-model="form.name" placeholder="e.g., EU VAT Profile" class="w-64" />
        </UFormField>

        <UFormField label="Description">
          <UTextarea v-model="form.description" placeholder="Optional description" />
        </UFormField>

        <UFormField label="Country" required>
          <UInput v-model="form.country" placeholder="e.g., DE" class="w-64" />
          <template #hint>
            Default jurisdiction for this profile (ISO country code)
          </template>
        </UFormField>

        <div class="flex justify-end gap-3 pt-4">
          <UButton variant="ghost" @click="handleCancel">Cancel</UButton>
          <UButton type="submit" :loading="saving">Create Tax Profile</UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
