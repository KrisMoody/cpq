<script setup lang="ts">
import type { Attribute, AttributeGroup } from '~/composables/useAttributes'

const {
  attributes,
  groups,
  loading,
  error,
  fetchAttributes,
  fetchGroups,
  deleteAttribute,
  deleteGroup,
  createGroup,
  updateGroup,
} = useAttributes()
const toast = useToast()

const showGroupModal = ref(false)
const editingGroup = ref<AttributeGroup | null>(null)
const groupForm = ref({ name: '', sortOrder: 0 })

onMounted(async () => {
  await Promise.all([fetchAttributes({ includeGroup: true }), fetchGroups()])
})

// Group attributes by their group
const groupedAttributes = computed(() => {
  const grouped = new Map<string | null, Attribute[]>()

  // Initialize with all groups (even empty ones)
  for (const group of groups.value) {
    grouped.set(group.id, [])
  }
  grouped.set(null, []) // Ungrouped

  // Add attributes to their groups
  for (const attr of attributes.value) {
    const groupId = attr.groupId
    if (!grouped.has(groupId)) {
      grouped.set(groupId, [])
    }
    grouped.get(groupId)!.push(attr)
  }

  return grouped
})

const sortedGroups = computed(() => {
  return [...groups.value].sort((a, b) => a.sortOrder - b.sortOrder)
})

function _getGroupName(groupId: string | null): string {
  if (!groupId) return 'Ungrouped'
  const group = groups.value.find((g) => g.id === groupId)
  return group?.name || 'Unknown Group'
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    TEXT: 'Text',
    NUMBER: 'Number',
    BOOLEAN: 'Yes/No',
    SELECT: 'Select',
    DATE: 'Date',
  }
  return labels[type] || type
}

function getTypeColor(type: string): 'primary' | 'success' | 'warning' | 'info' | 'neutral' {
  const colors: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'neutral'> = {
    TEXT: 'neutral',
    NUMBER: 'primary',
    BOOLEAN: 'success',
    SELECT: 'info',
    DATE: 'warning',
  }
  return colors[type] || 'neutral'
}

async function handleDeleteAttribute(attr: Attribute) {
  if (!confirm(`Delete attribute "${attr.name}"?`)) return

  const success = await deleteAttribute(attr.id)
  if (success) {
    toast.add({ title: 'Attribute deleted', color: 'success' })
  } else {
    toast.add({ title: error.value || 'Failed to delete attribute', color: 'error' })
  }
}

function openAddGroup() {
  editingGroup.value = null
  groupForm.value = { name: '', sortOrder: 0 }
  showGroupModal.value = true
}

function openEditGroup(group: AttributeGroup) {
  editingGroup.value = group
  groupForm.value = { name: group.name, sortOrder: group.sortOrder }
  showGroupModal.value = true
}

async function handleSaveGroup() {
  if (!groupForm.value.name.trim()) {
    toast.add({ title: 'Group name is required', color: 'error' })
    return
  }

  let success
  if (editingGroup.value) {
    success = await updateGroup(editingGroup.value.id, groupForm.value)
  } else {
    success = await createGroup(groupForm.value)
  }

  if (success) {
    showGroupModal.value = false
    toast.add({
      title: editingGroup.value ? 'Group updated' : 'Group created',
      color: 'success',
    })
  } else {
    toast.add({ title: error.value || 'Failed to save group', color: 'error' })
  }
}

async function handleDeleteGroup(group: AttributeGroup) {
  if (!confirm(`Delete group "${group.name}"? Attributes in this group will become ungrouped.`)) return

  const success = await deleteGroup(group.id)
  if (success) {
    toast.add({ title: 'Group deleted', color: 'success' })
  } else {
    toast.add({ title: error.value || 'Failed to delete group', color: 'error' })
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Product Attributes</h1>
        <p class="text-ga-gray-600">Define reusable attributes for products</p>
      </div>
      <div class="flex gap-2">
        <UButton variant="soft" icon="i-heroicons-folder-plus" @click="openAddGroup">
          New Group
        </UButton>
        <UButton to="/attributes/new" icon="i-heroicons-plus">
          New Attribute
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-ga-navy-500" />
    </div>

    <!-- Error State -->
    <UAlert v-else-if="error" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Error loading attributes</template>
      <template #description>{{ error }}</template>
    </UAlert>

    <!-- Empty State -->
    <div v-else-if="attributes.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-tag" class="w-12 h-12 text-ga-gray-400 mx-auto mb-4" />
      <p class="text-ga-gray-600 mb-4">No attributes defined yet</p>
      <UButton to="/attributes/new" variant="soft">Create your first attribute</UButton>
    </div>

    <!-- Attributes by Group -->
    <div v-else class="space-y-6">
      <!-- Grouped Attributes -->
      <UCard v-for="group in sortedGroups" :key="group.id">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-folder" class="w-5 h-5 text-ga-gray-500" />
              <h2 class="font-semibold">{{ group.name }}</h2>
              <UBadge size="xs" variant="subtle">
                {{ groupedAttributes.get(group.id)?.length || 0 }} attributes
              </UBadge>
            </div>
            <div class="flex gap-1">
              <UButton
                size="xs"
                variant="ghost"
                icon="i-heroicons-pencil"
                @click="openEditGroup(group)"
              />
              <UButton
                size="xs"
                variant="ghost"
                color="error"
                icon="i-heroicons-trash"
                @click="handleDeleteGroup(group)"
              />
            </div>
          </div>
        </template>

        <div v-if="!groupedAttributes.get(group.id)?.length" class="text-ga-gray-600 text-sm py-4 text-center">
          No attributes in this group
        </div>

        <div v-else class="divide-y">
          <div
            v-for="attr in groupedAttributes.get(group.id)"
            :key="attr.id"
            class="flex items-center justify-between py-3"
          >
            <div class="flex items-center gap-4">
              <div>
                <NuxtLink
                  :to="`/attributes/${attr.id}`"
                  class="font-medium hover:text-ga-navy-500"
                >
                  {{ attr.name }}
                </NuxtLink>
                <p class="text-sm text-ga-gray-600">{{ attr.code }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UBadge :color="getTypeColor(attr.type)" variant="subtle" size="sm">
                {{ getTypeLabel(attr.type) }}
              </UBadge>
              <UBadge v-if="attr.isRequired" color="warning" variant="subtle" size="sm">
                Required
              </UBadge>
              <UButton
                size="xs"
                variant="ghost"
                color="error"
                icon="i-heroicons-trash"
                @click="handleDeleteAttribute(attr)"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Ungrouped Attributes -->
      <UCard v-if="groupedAttributes.get(null)?.length">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-squares-2x2" class="w-5 h-5 text-ga-gray-500" />
            <h2 class="font-semibold">Ungrouped</h2>
            <UBadge size="xs" variant="subtle">
              {{ groupedAttributes.get(null)?.length || 0 }} attributes
            </UBadge>
          </div>
        </template>

        <div class="divide-y">
          <div
            v-for="attr in groupedAttributes.get(null)"
            :key="attr.id"
            class="flex items-center justify-between py-3"
          >
            <div class="flex items-center gap-4">
              <div>
                <NuxtLink
                  :to="`/attributes/${attr.id}`"
                  class="font-medium hover:text-ga-navy-500"
                >
                  {{ attr.name }}
                </NuxtLink>
                <p class="text-sm text-ga-gray-600">{{ attr.code }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UBadge :color="getTypeColor(attr.type)" variant="subtle" size="sm">
                {{ getTypeLabel(attr.type) }}
              </UBadge>
              <UBadge v-if="attr.isRequired" color="warning" variant="subtle" size="sm">
                Required
              </UBadge>
              <UButton
                size="xs"
                variant="ghost"
                color="error"
                icon="i-heroicons-trash"
                @click="handleDeleteAttribute(attr)"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Group Modal -->
    <UModal v-model:open="showGroupModal" :title="editingGroup ? 'Edit Group' : 'New Group'">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">{{ editingGroup ? 'Edit Group' : 'New Group' }}</h3>
          </template>

          <form class="space-y-4" @submit.prevent="handleSaveGroup">
            <UFormField label="Name" required>
              <UInput v-model="groupForm.name" placeholder="e.g., Physical, Technical" />
            </UFormField>

            <UFormField label="Sort Order">
              <UInput v-model.number="groupForm.sortOrder" type="number" min="0" />
            </UFormField>

            <div class="flex justify-end gap-3 pt-4">
              <UButton variant="ghost" @click="showGroupModal = false">Cancel</UButton>
              <UButton type="submit">
                {{ editingGroup ? 'Save' : 'Create' }}
              </UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
