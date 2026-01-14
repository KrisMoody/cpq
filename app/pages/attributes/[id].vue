<script setup lang="ts">
import type { AttributeType } from '~/generated/prisma'
import type { Attribute } from '~/composables/useAttributes'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { groups, fetchGroups, fetchAttribute, updateAttribute, deleteAttribute, error } = useAttributes()

const attributeId = route.params.id as string
const attribute = ref<Attribute | null>(null)
const loading = ref(true)
const saving = ref(false)
const isEditing = ref(false)

const form = ref({
  name: '',
  code: '',
  type: 'TEXT' as AttributeType,
  groupId: null as string | null,
  isRequired: false,
  sortOrder: 0,
  options: [{ label: '', value: '' }] as Array<{ label: string; value: string }>,
  constraints: {
    min: undefined as number | undefined,
    max: undefined as number | undefined,
    minLength: undefined as number | undefined,
    maxLength: undefined as number | undefined,
  },
})

onMounted(async () => {
  await fetchGroups()
  await loadAttribute()
})

async function loadAttribute() {
  loading.value = true
  attribute.value = await fetchAttribute(attributeId)
  if (attribute.value) {
    initForm()
  }
  loading.value = false
}

function initForm() {
  if (!attribute.value) return

  const attr = attribute.value
  form.value = {
    name: attr.name,
    code: attr.code,
    type: attr.type,
    groupId: attr.groupId,
    isRequired: attr.isRequired,
    sortOrder: attr.sortOrder,
    options: (attr.options as Array<{ label: string; value: string }>) || [{ label: '', value: '' }],
    constraints: {
      min: (attr.constraints as any)?.min,
      max: (attr.constraints as any)?.max,
      minLength: (attr.constraints as any)?.minLength,
      maxLength: (attr.constraints as any)?.maxLength,
    },
  }
  if (form.value.options.length === 0) {
    form.value.options = [{ label: '', value: '' }]
  }
}

const typeOptions = [
  { label: 'Text', value: 'TEXT' },
  { label: 'Number', value: 'NUMBER' },
  { label: 'Yes/No (Boolean)', value: 'BOOLEAN' },
  { label: 'Select (Dropdown)', value: 'SELECT' },
  { label: 'Date', value: 'DATE' },
]

const groupOptions = computed(() => [
  { label: 'No Group', value: '' },
  ...groups.value.map((g) => ({ label: g.name, value: g.id })),
])

const hasValues = computed(() => {
  return (attribute.value?._count?.productAttributes ?? 0) > 0
})

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

function addOption() {
  form.value.options.push({ label: '', value: '' })
}

function removeOption(index: number) {
  form.value.options.splice(index, 1)
}

function cancelEdit() {
  isEditing.value = false
  initForm()
}

async function handleSubmit() {
  if (!form.value.name.trim()) {
    toast.add({ title: 'Name is required', color: 'error' })
    return
  }
  if (!form.value.code.trim()) {
    toast.add({ title: 'Code is required', color: 'error' })
    return
  }
  if (form.value.type === 'SELECT') {
    const validOptions = form.value.options.filter((o) => o.label && o.value)
    if (validOptions.length === 0) {
      toast.add({ title: 'At least one option is required for SELECT type', color: 'error' })
      return
    }
  }

  saving.value = true

  // Prepare constraints based on type
  let constraints: Record<string, any> | null = null
  if (form.value.type === 'NUMBER') {
    const { min, max } = form.value.constraints
    if (min !== undefined || max !== undefined) {
      constraints = {}
      if (min !== undefined) constraints.min = min
      if (max !== undefined) constraints.max = max
    }
  } else if (form.value.type === 'TEXT') {
    const { minLength, maxLength } = form.value.constraints
    if (minLength !== undefined || maxLength !== undefined) {
      constraints = {}
      if (minLength !== undefined) constraints.minLength = minLength
      if (maxLength !== undefined) constraints.maxLength = maxLength
    }
  }

  // Prepare options for SELECT type
  const options = form.value.type === 'SELECT'
    ? form.value.options.filter((o) => o.label && o.value)
    : undefined

  const result = await updateAttribute(attributeId, {
    name: form.value.name.trim(),
    code: form.value.code.trim(),
    type: hasValues.value ? undefined : form.value.type, // Cannot change type if values exist
    groupId: form.value.groupId || null,
    isRequired: form.value.isRequired,
    sortOrder: form.value.sortOrder,
    options,
    constraints: constraints ?? undefined,
  })

  saving.value = false

  if (result) {
    toast.add({ title: 'Attribute updated', color: 'success' })
    await loadAttribute()
    isEditing.value = false
  } else {
    toast.add({ title: error.value || 'Failed to update attribute', color: 'error' })
  }
}

async function handleDelete() {
  if (!confirm(`Delete attribute "${attribute.value?.name}"?`)) return

  const success = await deleteAttribute(attributeId)
  if (success) {
    toast.add({ title: 'Attribute deleted', color: 'success' })
    router.push('/attributes')
  } else {
    toast.add({ title: error.value || 'Failed to delete attribute', color: 'error' })
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UButton
      to="/attributes"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-4"
    >
      Back to Attributes
    </UButton>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Not Found -->
    <UAlert v-else-if="!attribute" color="error" icon="i-heroicons-exclamation-triangle">
      <template #title>Attribute not found</template>
    </UAlert>

    <!-- Attribute Details -->
    <template v-else>
      <!-- View Mode -->
      <UCard v-if="!isEditing">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-semibold">{{ attribute.name }}</h1>
              <p class="text-sm text-gray-500">{{ attribute.code }}</p>
            </div>
            <div class="flex gap-2">
              <UButton variant="soft" icon="i-heroicons-pencil" @click="isEditing = true">
                Edit
              </UButton>
              <UButton
                variant="ghost"
                color="error"
                icon="i-heroicons-trash"
                :disabled="hasValues"
                @click="handleDelete"
              >
                Delete
              </UButton>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-500">Type</label>
              <p class="font-medium">{{ getTypeLabel(attribute.type) }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Group</label>
              <p class="font-medium">{{ attribute.group?.name || 'Ungrouped' }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-500">Required</label>
              <p class="font-medium">{{ attribute.isRequired ? 'Yes' : 'No' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Usage</label>
              <p class="font-medium">{{ attribute._count?.productAttributes || 0 }} products</p>
            </div>
          </div>

          <!-- SELECT Options -->
          <div v-if="attribute.type === 'SELECT' && attribute.options">
            <label class="text-sm text-gray-500">Options</label>
            <div class="mt-1 flex flex-wrap gap-2">
              <UBadge
                v-for="opt in (attribute.options as Array<{ label: string; value: string }>)"
                :key="opt.value"
                variant="subtle"
              >
                {{ opt.label }}
              </UBadge>
            </div>
          </div>

          <!-- NUMBER Constraints -->
          <div v-if="attribute.type === 'NUMBER' && attribute.constraints" class="grid grid-cols-2 gap-4">
            <div v-if="(attribute.constraints as any).min !== undefined">
              <label class="text-sm text-gray-500">Minimum</label>
              <p class="font-medium">{{ (attribute.constraints as any).min }}</p>
            </div>
            <div v-if="(attribute.constraints as any).max !== undefined">
              <label class="text-sm text-gray-500">Maximum</label>
              <p class="font-medium">{{ (attribute.constraints as any).max }}</p>
            </div>
          </div>

          <!-- TEXT Constraints -->
          <div v-if="attribute.type === 'TEXT' && attribute.constraints" class="grid grid-cols-2 gap-4">
            <div v-if="(attribute.constraints as any).minLength !== undefined">
              <label class="text-sm text-gray-500">Min Length</label>
              <p class="font-medium">{{ (attribute.constraints as any).minLength }}</p>
            </div>
            <div v-if="(attribute.constraints as any).maxLength !== undefined">
              <label class="text-sm text-gray-500">Max Length</label>
              <p class="font-medium">{{ (attribute.constraints as any).maxLength }}</p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Edit Mode -->
      <UCard v-else>
        <template #header>
          <h1 class="text-xl font-semibold">Edit Attribute</h1>
        </template>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Name" required>
              <UInput v-model="form.name" placeholder="e.g., Color, Weight" />
            </UFormField>

            <UFormField label="Code" required>
              <UInput v-model="form.code" placeholder="e.g., color, weight_kg" />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Type" required>
              <USelect
                v-model="form.type"
                :items="typeOptions"
                :disabled="hasValues"
              />
              <template v-if="hasValues" #hint>
                <span class="text-warning-500">Cannot change type when values exist</span>
              </template>
            </UFormField>

            <UFormField label="Group">
              <USelect :model-value="form.groupId ?? undefined" :items="groupOptions" @update:model-value="form.groupId = $event || null" />
            </UFormField>
          </div>

          <!-- SELECT Options -->
          <div v-if="form.type === 'SELECT'" class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium">Options</label>
              <UButton size="xs" variant="soft" icon="i-heroicons-plus" @click="addOption">
                Add Option
              </UButton>
            </div>

            <div class="space-y-2">
              <div
                v-for="(option, index) in form.options"
                :key="index"
                class="flex items-center gap-2"
              >
                <UInput
                  v-model="option.label"
                  placeholder="Label"
                  class="flex-1"
                />
                <UInput
                  v-model="option.value"
                  placeholder="Value"
                  class="flex-1"
                />
                <UButton
                  v-if="form.options.length > 1"
                  size="xs"
                  variant="ghost"
                  color="error"
                  icon="i-heroicons-x-mark"
                  @click="removeOption(index)"
                />
              </div>
            </div>
          </div>

          <!-- NUMBER Constraints -->
          <div v-if="form.type === 'NUMBER'" class="grid grid-cols-2 gap-4">
            <UFormField label="Minimum Value">
              <UInput v-model.number="form.constraints.min" type="number" placeholder="No minimum" />
            </UFormField>
            <UFormField label="Maximum Value">
              <UInput v-model.number="form.constraints.max" type="number" placeholder="No maximum" />
            </UFormField>
          </div>

          <!-- TEXT Constraints -->
          <div v-if="form.type === 'TEXT'" class="grid grid-cols-2 gap-4">
            <UFormField label="Min Length">
              <UInput v-model.number="form.constraints.minLength" type="number" min="0" placeholder="No minimum" />
            </UFormField>
            <UFormField label="Max Length">
              <UInput v-model.number="form.constraints.maxLength" type="number" min="0" placeholder="No maximum" />
            </UFormField>
          </div>

          <div class="flex items-center gap-4">
            <UCheckbox v-model="form.isRequired" label="Required" />
          </div>

          <UFormField label="Sort Order">
            <UInput v-model.number="form.sortOrder" type="number" min="0" class="w-32" />
          </UFormField>

          <div class="flex justify-end gap-3 pt-4">
            <UButton variant="ghost" @click="cancelEdit">Cancel</UButton>
            <UButton type="submit" :loading="saving">Save Changes</UButton>
          </div>
        </form>
      </UCard>
    </template>
  </div>
</template>
