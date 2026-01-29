<script setup lang="ts">
const props = defineProps<{
  name: string
  description: string | null | undefined
  isTemplate: boolean
  isDirty: boolean
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  'update:name': [value: string]
  'update:description': [value: string | null]
  'update:isTemplate': [value: boolean]
  save: []
  cancel: []
  reset: []
}>()

const localName = computed({
  get: () => props.name,
  set: (value) => emit('update:name', value),
})

const localDescription = computed({
  get: () => props.description || '',
  set: (value) => emit('update:description', value || null),
})

const localIsTemplate = computed({
  get: () => props.isTemplate,
  set: (value) => emit('update:isTemplate', value),
})

const showDescription = ref(!!props.description)
</script>

<template>
  <div class="flex items-center justify-between gap-4 px-6 py-4 border-b border-ga-gray-300 bg-white">
    <div class="flex-1 max-w-xl">
      <div class="flex items-center gap-3">
        <UButton to="/quote-layouts" variant="ghost" icon="i-heroicons-arrow-left" size="sm" />
        <div class="flex-1">
          <UInput
            v-model="localName"
            placeholder="Layout name"
            size="lg"
            class="font-semibold"
            :ui="{ base: 'bg-transparent border-transparent hover:border-ga-gray-400 focus:border-ga-navy-500' }"
          />
        </div>
        <UButton
          v-if="!showDescription"
          variant="ghost"
          size="xs"
          icon="i-heroicons-plus"
          @click="showDescription = true"
        >
          Add description
        </UButton>
      </div>

      <div v-if="showDescription" class="mt-2 ml-10">
        <UInput
          v-model="localDescription"
          placeholder="Optional description"
          size="sm"
          :ui="{ base: 'bg-transparent border-transparent hover:border-ga-gray-400 focus:border-ga-navy-500' }"
        />
      </div>
    </div>

    <div class="flex items-center gap-4">
      <UCheckbox v-model="localIsTemplate" label="Save as template" />

      <div class="flex items-center gap-2">
        <UButton variant="ghost" @click="emit('cancel')">
          Cancel
        </UButton>
        <UButton
          v-if="isDirty"
          variant="ghost"
          color="warning"
          @click="emit('reset')"
        >
          Reset
        </UButton>
        <UButton @click="emit('save')">
          {{ mode === 'create' ? 'Create Layout' : 'Save Changes' }}
        </UButton>
      </div>
    </div>
  </div>
</template>
