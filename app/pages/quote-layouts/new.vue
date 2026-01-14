<script setup lang="ts">
import type { QuoteLayout } from '~/types/quote-layout'

const router = useRouter()
const toast = useToast()
const { createLayout } = useQuoteLayouts()

const saving = ref(false)

async function handleSave(layout: QuoteLayout) {
  if (!layout.name.trim()) {
    toast.add({ title: 'Name is required', color: 'error' })
    return
  }

  saving.value = true
  try {
    const created = await createLayout({
      name: layout.name.trim(),
      description: layout.description?.trim() || undefined,
      isTemplate: layout.isTemplate,
      sections: layout.sections,
      summaryConfig: layout.summaryConfig,
      theme: layout.theme,
    })

    if (created) {
      toast.add({ title: 'Layout created', color: 'success' })
      router.push('/quote-layouts')
    }
  } finally {
    saving.value = false
  }
}

function handleCancel() {
  router.push('/quote-layouts')
}

// Warn on unsaved changes when navigating away
onBeforeRouteLeave((_to, _from, next) => {
  // The builder handles its own unsaved changes dialog
  next()
})
</script>

<template>
  <div class="h-[calc(100vh-4rem)]">
    <QuoteLayoutBuilder
      mode="create"
      @save="handleSave"
      @cancel="handleCancel"
    />
  </div>
</template>
