<script setup lang="ts">
import type { QuoteLayout, QuoteLayoutSection, SummaryConfig, QuoteTheme } from '~/types/quote-layout'
import { DEFAULT_COLUMNS } from '~/types/quote-layout'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { fetchLayout, updateLayout, deleteLayout } = useQuoteLayouts()

const loading = ref(true)
const saving = ref(false)
const layout = ref<QuoteLayout | null>(null)

// Form state
const form = ref({
  name: '',
  description: '',
  isTemplate: false,
  sections: [] as QuoteLayoutSection[],
  summaryConfig: {} as SummaryConfig,
  theme: {} as QuoteTheme,
})

const headerStyleOptions = [
  { label: 'Simple', value: 'simple' },
  { label: 'Branded', value: 'branded' },
  { label: 'Minimal', value: 'minimal' },
]

onMounted(async () => {
  const id = route.params.id as string
  loading.value = true
  try {
    layout.value = await fetchLayout(id)
    if (layout.value) {
      form.value = {
        name: layout.value.name,
        description: layout.value.description || '',
        isTemplate: layout.value.isTemplate,
        sections: JSON.parse(JSON.stringify(layout.value.sections)),
        summaryConfig: JSON.parse(JSON.stringify(layout.value.summaryConfig)),
        theme: JSON.parse(JSON.stringify(layout.value.theme)),
      }
    }
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  if (!layout.value) return

  if (!form.value.name.trim()) {
    toast.add({ title: 'Name is required', color: 'error' })
    return
  }

  saving.value = true
  try {
    const updated = await updateLayout(layout.value.id, {
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined,
      isTemplate: form.value.isTemplate,
      sections: form.value.sections,
      summaryConfig: form.value.summaryConfig,
      theme: form.value.theme,
    })

    if (updated) {
      toast.add({ title: 'Layout updated', color: 'success' })
      router.push('/quote-layouts')
    }
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!layout.value) return
  if (!confirm(`Are you sure you want to delete "${layout.value.name}"?`)) return

  const success = await deleteLayout(layout.value.id)
  if (success) {
    toast.add({ title: 'Layout deleted', color: 'success' })
    router.push('/quote-layouts')
  }
}

function addSection() {
  const id = `section-${Date.now()}`
  form.value.sections.push({
    id,
    name: `Section ${form.value.sections.length + 1}`,
    description: '',
    columns: [...DEFAULT_COLUMNS],
    showSubtotal: false,
    sortOrder: form.value.sections.length,
  })
}

function removeSection(index: number) {
  if (form.value.sections.length <= 1) {
    toast.add({ title: 'At least one section is required', color: 'warning' })
    return
  }
  form.value.sections.splice(index, 1)
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UButton to="/quote-layouts" variant="ghost" icon="i-heroicons-arrow-left" size="sm" />
        <h1 class="text-2xl font-bold">Edit Quote Layout</h1>
      </div>

      <UButton
        v-if="layout"
        variant="ghost"
        color="error"
        icon="i-heroicons-trash"
        @click="handleDelete"
      >
        Delete
      </UButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Not Found -->
    <UAlert v-else-if="!layout" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Layout not found</template>
      <template #description>The requested layout does not exist.</template>
    </UAlert>

    <!-- Edit Form -->
    <form v-else class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Basic Info -->
      <UCard>
        <template #header>
          <h2 class="font-semibold">Basic Information</h2>
        </template>

        <div class="space-y-4">
          <UFormField label="Name" required>
            <UInput v-model="form.name" placeholder="Enter layout name" />
          </UFormField>

          <UFormField label="Description">
            <UTextarea v-model="form.description" placeholder="Optional description" :rows="2" />
          </UFormField>

          <UCheckbox v-model="form.isTemplate" label="Save as reusable template" />
        </div>
      </UCard>

      <!-- Sections -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Sections</h2>
            <UButton variant="soft" size="sm" icon="i-heroicons-plus" @click="addSection">
              Add Section
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <div
            v-for="(section, index) in form.sections"
            :key="section.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium">Section {{ index + 1 }}</h3>
              <UButton
                v-if="form.sections.length > 1"
                variant="ghost"
                color="error"
                size="xs"
                icon="i-heroicons-trash"
                @click="removeSection(index)"
              />
            </div>

            <div class="space-y-3">
              <UFormField label="Section Name">
                <UInput v-model="section.name" placeholder="e.g., Products, Services" />
              </UFormField>

              <UFormField label="Description">
                <UInput v-model="section.description" placeholder="Optional section description" />
              </UFormField>

              <UCheckbox v-model="section.showSubtotal" label="Show section subtotal" />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Theme -->
      <UCard>
        <template #header>
          <h2 class="font-semibold">Theme</h2>
        </template>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Primary Color">
            <div class="flex items-center gap-2">
              <input
                v-model="form.theme.primaryColor"
                type="color"
                class="w-10 h-10 rounded cursor-pointer"
              >
              <UInput v-model="form.theme.primaryColor" class="flex-1" />
            </div>
          </UFormField>

          <UFormField label="Secondary Color">
            <div class="flex items-center gap-2">
              <input
                v-model="form.theme.secondaryColor"
                type="color"
                class="w-10 h-10 rounded cursor-pointer"
              >
              <UInput v-model="form.theme.secondaryColor" class="flex-1" />
            </div>
          </UFormField>

          <UFormField label="Header Style">
            <USelectMenu
              v-model="form.theme.headerStyle"
              :items="headerStyleOptions"
              value-key="value"
            />
          </UFormField>

          <UFormField label="Font Family">
            <UInput v-model="form.theme.fontFamily" placeholder="system-ui, sans-serif" />
          </UFormField>

          <div class="col-span-2 flex gap-6">
            <UCheckbox v-model="form.theme.tableBorders" label="Show table borders" />
            <UCheckbox v-model="form.theme.alternateRowColors" label="Alternate row colors" />
          </div>
        </div>
      </UCard>

      <!-- Summary Config -->
      <UCard>
        <template #header>
          <h2 class="font-semibold">Summary Display</h2>
        </template>

        <div class="flex flex-wrap gap-6">
          <UCheckbox v-model="form.summaryConfig.showSubtotal" label="Show subtotal" />
          <UCheckbox v-model="form.summaryConfig.showDiscounts" label="Show discounts" />
          <UCheckbox v-model="form.summaryConfig.showTaxes" label="Show taxes" />
          <UCheckbox v-model="form.summaryConfig.showTotal" label="Show total" />
        </div>
      </UCard>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <UButton to="/quote-layouts" variant="ghost">
          Cancel
        </UButton>
        <UButton type="submit" :loading="saving">
          Save Changes
        </UButton>
      </div>
    </form>
  </div>
</template>
