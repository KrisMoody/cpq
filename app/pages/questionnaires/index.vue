<script setup lang="ts">
const { questionnaires, loading, error, fetchQuestionnaires, deleteQuestionnaire } = useQuestionnaires()
const toast = useToast()

onMounted(() => {
  fetchQuestionnaires()
})

async function handleDelete(id: string, name: string) {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) return
  const success = await deleteQuestionnaire(id)
  if (success) {
    toast.add({ title: 'Questionnaire deleted', color: 'success' })
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Questionnaires</h1>
        <p class="text-gray-500">Create guided selling questionnaires to help find the right products</p>
      </div>
      <UButton to="/questionnaires/new" icon="i-heroicons-plus">
        New Questionnaire
      </UButton>
    </div>

    <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #description>{{ error }}</template>
    </UAlert>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else-if="questionnaires.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No questionnaires yet</h3>
      <p class="text-gray-500 mt-1">Create your first questionnaire to help guide product selection</p>
      <UButton to="/questionnaires/new" class="mt-4" icon="i-heroicons-plus">
        Create Questionnaire
      </UButton>
    </div>

    <div v-else class="space-y-3">
      <UCard
        v-for="q in questionnaires"
        :key="q.id"
        class="hover:ring-1 hover:ring-primary-500 transition-all"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1 min-w-0">
            <NuxtLink
              :to="`/questionnaires/${q.id}`"
              class="font-medium text-primary-600 hover:text-primary-700"
            >
              {{ q.name }}
            </NuxtLink>
            <p v-if="q.description" class="text-sm text-gray-500 mt-1">{{ q.description }}</p>
            <div class="flex items-center gap-2 mt-2">
              <UBadge variant="subtle" color="neutral">
                {{ q.questionCount }} question{{ q.questionCount !== 1 ? 's' : '' }}
              </UBadge>
              <UBadge :color="q.isActive ? 'success' : 'neutral'" variant="subtle">
                {{ q.isActive ? 'Active' : 'Inactive' }}
              </UBadge>
            </div>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0">
            <UButton
              :to="`/questionnaires/${q.id}`"
              variant="ghost"
              size="sm"
              icon="i-heroicons-pencil-square"
            />
            <UButton
              variant="ghost"
              size="sm"
              color="error"
              icon="i-heroicons-trash"
              @click="handleDelete(q.id, q.name)"
            />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
