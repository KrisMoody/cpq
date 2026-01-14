<script setup lang="ts">
import type { Attribute } from '~/composables/useAttributes'

const props = defineProps<{
  attribute: Attribute
  modelValue: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const selectOptions = computed(() => {
  if (props.attribute.type !== 'SELECT' || !props.attribute.options) return []
  return props.attribute.options.map((opt) => ({
    label: opt.label,
    value: opt.value,
  }))
})

const constraints = computed(() => {
  return props.attribute.constraints as Record<string, any> | null
})
</script>

<template>
  <div>
    <!-- TEXT -->
    <UInput
      v-if="attribute.type === 'TEXT'"
      v-model="value"
      :placeholder="attribute.name"
      :minlength="constraints?.minLength"
      :maxlength="constraints?.maxLength"
    />

    <!-- NUMBER -->
    <UInput
      v-else-if="attribute.type === 'NUMBER'"
      v-model.number="value"
      type="number"
      :placeholder="attribute.name"
      :min="constraints?.min"
      :max="constraints?.max"
      step="any"
    />

    <!-- BOOLEAN -->
    <UCheckbox
      v-else-if="attribute.type === 'BOOLEAN'"
      v-model="value"
      :label="attribute.name"
    />

    <!-- SELECT -->
    <USelect
      v-else-if="attribute.type === 'SELECT'"
      v-model="value"
      :items="selectOptions"
      :placeholder="`Select ${attribute.name}`"
      value-key="value"
    />

    <!-- DATE -->
    <UInput
      v-else-if="attribute.type === 'DATE'"
      v-model="value"
      type="date"
      :placeholder="attribute.name"
    />
  </div>
</template>
