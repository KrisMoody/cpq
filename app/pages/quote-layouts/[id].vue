<script setup lang="ts">
import type { QuoteLayout } from '~/types/quote-layout'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { fetchLayout, updateLayout } = useQuoteLayouts()

const loading = ref(true)
const saving = ref(false)
const layout = ref<QuoteLayout | null>(null)

onMounted(async () => {
  const id = route.params.id as string
  loading.value = true
  try {
    layout.value = await fetchLayout(id)
  } finally {
    loading.value = false
  }
})

async function handleSave(updatedLayout: QuoteLayout) {
  if (!layout.value) return

  if (!updatedLayout.name.trim()) {
    toast.add({ title: 'Name is required', color: 'error' })
    return
  }

  saving.value = true
  try {
    const updated = await updateLayout(layout.value.id, {
      name: updatedLayout.name.trim(),
      description: updatedLayout.description?.trim() || undefined,
      isTemplate: updatedLayout.isTemplate,
      sections: updatedLayout.sections,
      summaryConfig: updatedLayout.summaryConfig,
      theme: updatedLayout.theme,
    })

    if (updated) {
      toast.add({ title: 'Layout updated', color: 'success' })
      router.push('/quote-layouts')
    }
  } finally {
    saving.value = false
  }
}

function handleCancel() {
  router.push('/quote-layouts')
}
</script>

<template>
  <div class="h-[calc(100vh-4rem)]">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-full">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Not Found -->
    <div v-else-if="!layout" class="flex flex-col items-center justify-center h-full gap-4">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-error-500" />
      <p class="text-gray-500">Layout not found</p>
      <UButton to="/quote-layouts" variant="soft">
        Back to Layouts
      </UButton>
    </div>

    <!-- Editor -->
    <QuoteLayoutBuilder
      v-else
      :initial-layout="layout"
      mode="edit"
      @save="handleSave"
      @cancel="handleCancel"
    />
  </div>
</template>
