<script setup lang="ts">
import type { Category } from '~/composables/useCategories'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    placeholder: 'Select categories...',
    disabled: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const { categories, fetchCategories, flattenCategories } = useCategories()

const isOpen = ref(false)
const searchQuery = ref('')

onMounted(() => {
  fetchCategories()
})

// Flatten categories for display with depth information
const flatCategories = computed(() => flattenCategories(categories.value))

// Filter categories based on search
const filteredCategories = computed(() => {
  if (!searchQuery.value) return flatCategories.value
  const query = searchQuery.value.toLowerCase()
  return flatCategories.value.filter((cat) => cat.name.toLowerCase().includes(query))
})

// Get selected categories with full details
const selectedCategories = computed(() => {
  return flatCategories.value.filter((cat) => props.modelValue.includes(cat.id))
})

// Build hierarchy path for a category
function getCategoryPath(category: Category & { depth: number }): string {
  const path: string[] = []
  let current: Category | undefined = category

  // Walk up the tree to build path
  while (current) {
    path.unshift(current.name)
    current = flatCategories.value.find((c) => c.id === current?.parentId)
  }

  return path.join(' > ')
}

function toggleCategory(categoryId: string) {
  const newValue = props.modelValue.includes(categoryId)
    ? props.modelValue.filter((id) => id !== categoryId)
    : [...props.modelValue, categoryId]
  emit('update:modelValue', newValue)
}

function removeCategory(categoryId: string) {
  emit('update:modelValue', props.modelValue.filter((id) => id !== categoryId))
}

function isSelected(categoryId: string): boolean {
  return props.modelValue.includes(categoryId)
}
</script>

<template>
  <div class="space-y-2">
    <!-- Selected categories as chips -->
    <div v-if="selectedCategories.length > 0" class="flex flex-wrap gap-2">
      <UBadge
        v-for="category in selectedCategories"
        :key="category.id"
        color="primary"
        variant="subtle"
        class="flex items-center gap-1"
      >
        <span>{{ category.name }}</span>
        <UButton
          variant="ghost"
          size="xs"
          icon="i-heroicons-x-mark"
          class="!p-0 -mr-1"
          :disabled="disabled"
          @click.stop="removeCategory(category.id)"
        />
      </UBadge>
    </div>

    <!-- Category selector dropdown -->
    <UPopover v-model:open="isOpen" :disabled="disabled">
      <UButton
        variant="outline"
        trailing-icon="i-heroicons-chevron-down"
        class="w-full justify-between"
        :disabled="disabled"
      >
        {{ selectedCategories.length > 0 ? `${selectedCategories.length} selected` : placeholder }}
      </UButton>

      <template #content>
        <div class="p-2 w-80">
          <!-- Search -->
          <UInput
            v-model="searchQuery"
            placeholder="Search categories..."
            icon="i-heroicons-magnifying-glass"
            size="sm"
            class="mb-2"
          />

          <!-- Category list -->
          <div class="max-h-64 overflow-y-auto space-y-0.5">
            <div v-if="filteredCategories.length === 0" class="text-sm text-ga-gray-600 py-2 text-center">
              No categories found
            </div>

            <div
              v-for="category in filteredCategories"
              :key="category.id"
              class="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-ga-gray-200"
              :style="{ paddingLeft: `${(category.depth * 16) + 8}px` }"
              @click="toggleCategory(category.id)"
            >
              <UCheckbox
                :model-value="isSelected(category.id)"
                @update:model-value="toggleCategory(category.id)"
                @click.stop
              />
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">{{ category.name }}</div>
                <div v-if="category.depth > 0" class="text-xs text-ga-gray-600 truncate">
                  {{ getCategoryPath(category) }}
                </div>
              </div>
              <UBadge
                v-if="category.productCount !== undefined"
                size="xs"
                color="neutral"
                variant="subtle"
              >
                {{ category.productCount }}
              </UBadge>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-2 pt-2 border-t border-ga-gray-300 flex justify-between">
            <UButton
              v-if="modelValue.length > 0"
              variant="ghost"
              size="xs"
              @click="emit('update:modelValue', [])"
            >
              Clear all
            </UButton>
            <UButton
              variant="soft"
              size="xs"
              @click="isOpen = false"
            >
              Done
            </UButton>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>
