<script setup lang="ts">
import type { Category } from '~/composables/useCategories'

const { categories, loading, error, fetchCategories, deleteCategory } = useCategories()
const toast = useToast()

const showInactive = useState('categories-show-inactive', () => false)
const expandedIds = ref<Set<string>>(new Set())

onMounted(() => {
  fetchCategories({ includeInactive: showInactive.value })
})

watch(showInactive, (value) => {
  fetchCategories({ includeInactive: value })
})

function toggleExpand(id: string) {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
  expandedIds.value = new Set(expandedIds.value) // trigger reactivity
}

function isExpanded(id: string) {
  return expandedIds.value.has(id)
}

async function handleDelete(category: Category) {
  if (confirm(`Deactivate category "${category.name}"?`)) {
    const success = await deleteCategory(category.id)
    if (success) {
      toast.add({ title: 'Category deactivated', color: 'success' })
    } else {
      toast.add({ title: 'Failed to deactivate category', color: 'error' })
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Categories</h1>
        <p class="text-gray-500">Organize products into categories</p>
      </div>
      <UButton to="/categories/new" icon="i-heroicons-plus">
        New Category
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4">
      <UCheckbox v-model="showInactive" label="Show inactive" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error State -->
    <UAlert v-else-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error loading categories</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Empty State -->
    <div v-else-if="categories.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-folder" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 mb-4">No categories found</p>
      <UButton to="/categories/new" variant="soft">Create your first category</UButton>
    </div>

    <!-- Categories Tree -->
    <div v-else class="space-y-2">
      <CategoriesCategoryTreeItem
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :expanded-ids="expandedIds"
        :depth="0"
        @toggle="toggleExpand"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>
