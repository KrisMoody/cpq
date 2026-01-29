<script setup lang="ts">
import type { QuoteLayout } from '~/types/quote-layout'

const toast = useToast()
const { layouts, loading, error, fetchLayouts, deleteLayout, cloneLayout } = useQuoteLayouts()

onMounted(() => {
  fetchLayouts()
})

async function handleDelete(layout: QuoteLayout) {
  if (!confirm(`Are you sure you want to delete "${layout.name}"?`)) return

  const success = await deleteLayout(layout.id)
  if (success) {
    toast.add({ title: 'Layout deleted', color: 'success' })
  } else {
    toast.add({ title: 'Failed to delete layout', color: 'error' })
  }
}

async function handleClone(layout: QuoteLayout) {
  const cloned = await cloneLayout(layout.id)
  if (cloned) {
    toast.add({ title: `Layout "${cloned.name}" created`, color: 'success' })
  } else {
    toast.add({ title: 'Failed to clone layout', color: 'error' })
  }
}

const templateLayouts = computed(() => layouts.value.filter((l) => l.isTemplate))
const customLayouts = computed(() => layouts.value.filter((l) => !l.isTemplate))
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2">
          <UButton to="/quotes" variant="ghost" icon="i-heroicons-arrow-left" size="sm" />
          <h1 class="text-2xl font-bold">Quote Layouts</h1>
        </div>
        <p class="text-ga-gray-600 mt-1">Manage reusable quote presentation templates</p>
      </div>

      <UButton to="/quote-layouts/new" icon="i-heroicons-plus">
        New Layout
      </UButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error State -->
    <UAlert v-else-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error loading layouts</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <template v-else>
      <!-- Template Layouts -->
      <div v-if="templateLayouts.length > 0">
        <h2 class="text-lg font-semibold mb-3">Templates</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard
            v-for="layout in templateLayouts"
            :key="layout.id"
            class="hover:shadow-md transition-shadow"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-primary-500" />
                  <h3 class="font-semibold">{{ layout.name }}</h3>
                </div>
                <UBadge color="primary" variant="subtle" size="xs">
                  Template
                </UBadge>
              </div>
            </template>

            <p v-if="layout.description" class="text-sm text-ga-gray-600 mb-3">
              {{ layout.description }}
            </p>

            <div class="text-xs text-ga-gray-500 space-y-1">
              <p>{{ layout.sections.length }} section{{ layout.sections.length !== 1 ? 's' : '' }}</p>
              <p>Theme: {{ layout.theme.headerStyle }}</p>
            </div>

            <template #footer>
              <div class="flex items-center justify-end gap-2">
                <UButton
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-document-duplicate"
                  @click="handleClone(layout)"
                >
                  Clone
                </UButton>
                <UButton
                  :to="`/quote-layouts/${layout.id}`"
                  variant="soft"
                  size="sm"
                  icon="i-heroicons-pencil"
                >
                  Edit
                </UButton>
                <UButton
                  variant="ghost"
                  color="error"
                  size="sm"
                  icon="i-heroicons-trash"
                  @click="handleDelete(layout)"
                />
              </div>
            </template>
          </UCard>
        </div>
      </div>

      <!-- Custom Layouts -->
      <div v-if="customLayouts.length > 0" class="mt-8">
        <h2 class="text-lg font-semibold mb-3">Custom Layouts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard
            v-for="layout in customLayouts"
            :key="layout.id"
            class="hover:shadow-md transition-shadow"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-document" class="w-5 h-5 text-ga-gray-600" />
                  <h3 class="font-semibold">{{ layout.name }}</h3>
                </div>
              </div>
            </template>

            <p v-if="layout.description" class="text-sm text-ga-gray-600 mb-3">
              {{ layout.description }}
            </p>

            <div class="text-xs text-ga-gray-500 space-y-1">
              <p>{{ layout.sections.length }} section{{ layout.sections.length !== 1 ? 's' : '' }}</p>
              <p>Theme: {{ layout.theme.headerStyle }}</p>
            </div>

            <template #footer>
              <div class="flex items-center justify-end gap-2">
                <UButton
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-document-duplicate"
                  @click="handleClone(layout)"
                >
                  Clone
                </UButton>
                <UButton
                  :to="`/quote-layouts/${layout.id}`"
                  variant="soft"
                  size="sm"
                  icon="i-heroicons-pencil"
                >
                  Edit
                </UButton>
                <UButton
                  variant="ghost"
                  color="error"
                  size="sm"
                  icon="i-heroicons-trash"
                  @click="handleDelete(layout)"
                />
              </div>
            </template>
          </UCard>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="layouts.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-squares-2x2" class="w-12 h-12 text-ga-gray-400 mx-auto mb-4" />
        <p class="text-ga-gray-600 mb-4">No layouts found</p>
        <UButton to="/quote-layouts/new" variant="soft">
          Create your first layout
        </UButton>
      </div>
    </template>
  </div>
</template>
