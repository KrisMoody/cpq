<script setup lang="ts">
const router = useRouter()
const toast = useToast()
const { createQuestionnaire, error } = useQuestionnaires()

const saving = ref(false)

const form = ref({
  name: '',
  description: '',
  isActive: true,
})

async function handleSubmit() {
  if (!form.value.name) {
    toast.add({ title: 'Please enter a name', color: 'error' })
    return
  }

  saving.value = true
  try {
    const questionnaire = await createQuestionnaire({
      name: form.value.name,
      description: form.value.description || undefined,
      isActive: form.value.isActive,
    })

    if (questionnaire) {
      toast.add({ title: 'Questionnaire created', color: 'success' })
      router.push(`/questionnaires/${questionnaire.id}`)
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <UButton to="/questionnaires" variant="ghost" icon="i-heroicons-arrow-left" />
      <div>
        <h1 class="text-2xl font-bold">New Questionnaire</h1>
        <p class="text-gray-500">Create a guided selling questionnaire</p>
      </div>
    </div>

    <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #description>{{ error }}</template>
    </UAlert>

    <UCard>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField label="Name" required>
          <UInput v-model="form.name" placeholder="e.g., Enterprise Solution Finder" />
        </UFormField>

        <UFormField label="Description">
          <UTextarea
            v-model="form.description"
            placeholder="Help customers find the right enterprise solution"
            :rows="2"
          />
        </UFormField>

        <UFormField>
          <UCheckbox v-model="form.isActive" label="Active" />
        </UFormField>

        <UAlert color="info" icon="i-heroicons-information-circle">
          <template #description>
            Create the questionnaire first, then add questions on the edit page.
          </template>
        </UAlert>

        <div class="flex justify-end gap-3">
          <UButton variant="ghost" to="/questionnaires">Cancel</UButton>
          <UButton type="submit" :loading="saving">Create Questionnaire</UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
