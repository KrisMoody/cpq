<script setup lang="ts">
import { getErrorMessage } from '~/utils/errors'
const router = useRouter()
const { createCategory, fetchCategories, categories, flattenCategories } = useCategories()

const initialFormState = {
  name: '',
  description: '',
  parentId: undefined as string | undefined,
  sortOrder: 0,
}

const form = ref({ ...initialFormState })
const initialValues = ref({ ...initialFormState })

const { confirmLeave } = useUnsavedChanges(form, initialValues)

const loading = ref(false)
const error = ref<string | null>(null)

onMounted(() => {
  fetchCategories({ flat: true })
})

function handleCancel() {
  if (confirmLeave()) {
    router.push('/categories')
  }
}

const parentOptions = computed(() => {
  const flat = flattenCategories(categories.value)
  return flat.map((c) => ({
    label: '\u00A0'.repeat(c.depth * 4) + c.name,
    value: c.id,
  }))
})

async function handleSubmit() {
  if (!form.value.name.trim()) {
    error.value = 'Category name is required'
    return
  }

  loading.value = true
  error.value = null

  try {
    const category = await createCategory({
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined,
      parentId: form.value.parentId || undefined,
      sortOrder: form.value.sortOrder,
    })

    if (category) {
      router.push(`/categories/${category.id}`)
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Failed to create category')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UButton
      to="/categories"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Categories
    </UButton>

    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Create New Category</h1>
      </template>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mb-4">
          <template #description>{{ error }}</template>
        </UAlert>

        <UFormField label="Name" required>
          <UInput
            v-model="form.name"
            placeholder="Enter category name"
            icon="i-heroicons-folder"
          />
        </UFormField>

        <UFormField label="Description">
          <UTextarea
            v-model="form.description"
            placeholder="Optional description"
            :rows="3"
          />
        </UFormField>

        <UFormField label="Parent Category" hint="Leave empty to create a root category">
          <USelect
            v-model="form.parentId"
            :items="parentOptions"
            placeholder="None (root category)"
            value-key="value"
          />
        </UFormField>

        <UFormField label="Sort Order" hint="Lower numbers appear first">
          <UInput
            v-model.number="form.sortOrder"
            type="number"
            placeholder="0"
          />
        </UFormField>

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
            Create Category
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
