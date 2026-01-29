<script setup lang="ts">
import type { Category } from '~/composables/useCategories'

const props = defineProps<{
  category: Category
  expandedIds: Set<string>
  depth: number
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [category: Category]
}>()

const hasChildren = computed(() => props.category.children && props.category.children.length > 0)
const isExpanded = computed(() => props.expandedIds.has(props.category.id))
</script>

<template>
  <div>
    <div
      class="flex items-center gap-3 p-3 rounded-lg hover:bg-ga-gray-100 group"
      :class="{ 'opacity-50': !category.isActive }"
      :style="{ paddingLeft: `${depth * 24 + 12}px` }"
    >
      <!-- Expand/Collapse -->
      <button
        v-if="hasChildren"
        class="p-1 rounded hover:bg-ga-gray-300"
        @click="emit('toggle', category.id)"
      >
        <UIcon
          :name="isExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
          class="w-4 h-4"
        />
      </button>
      <div v-else class="w-6" />

      <!-- Icon -->
      <UIcon name="i-heroicons-folder" class="w-5 h-5 text-ga-gray-500" />

      <!-- Name & Info -->
      <NuxtLink
        :to="`/categories/${category.id}`"
        class="flex-1 flex items-center gap-3"
      >
        <span class="font-medium">{{ category.name }}</span>
        <span v-if="!category.isActive" class="text-xs text-ga-gray-500">(inactive)</span>
      </NuxtLink>

      <!-- Counts -->
      <div class="flex items-center gap-4 text-sm text-ga-gray-600">
        <span v-if="category.productCount" class="flex items-center gap-1">
          <UIcon name="i-heroicons-cube" class="w-4 h-4" />
          {{ category.productCount }}
        </span>
        <span v-if="category.childCount" class="flex items-center gap-1">
          <UIcon name="i-heroicons-folder" class="w-4 h-4" />
          {{ category.childCount }}
        </span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <UButton
          :to="`/categories/${category.id}`"
          icon="i-heroicons-pencil"
          size="xs"
          variant="ghost"
          color="neutral"
        />
        <UButton
          v-if="category.isActive"
          icon="i-heroicons-trash"
          size="xs"
          variant="ghost"
          color="error"
          @click="emit('delete', category)"
        />
      </div>
    </div>

    <!-- Children -->
    <div v-if="hasChildren && isExpanded">
      <CategoryTreeItem
        v-for="child in category.children"
        :key="child.id"
        :category="child"
        :expanded-ids="expandedIds"
        :depth="depth + 1"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
  </div>
</template>
