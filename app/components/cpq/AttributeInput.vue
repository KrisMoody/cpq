<script setup lang="ts">
import type { Attribute } from '~/composables/useAttributes'
import type { AttributeValue, NumberConstraints, TextConstraints } from '~/types/domain'

const props = defineProps<{
  attribute: Attribute
  modelValue: AttributeValue
}>()

const emit = defineEmits<{
  'update:modelValue': [value: AttributeValue]
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

// Type-safe constraint accessors based on attribute type
const textConstraints = computed((): TextConstraints | null => {
  if (props.attribute.type === 'TEXT' && props.attribute.constraints) {
    return props.attribute.constraints as TextConstraints
  }
  return null
})

const numberConstraints = computed((): NumberConstraints | null => {
  if (props.attribute.type === 'NUMBER' && props.attribute.constraints) {
    return props.attribute.constraints as NumberConstraints
  }
  return null
})

// Type-safe value accessors for component bindings
const stringValue = computed({
  get: () => (typeof props.modelValue === 'string' ? props.modelValue : ''),
  set: (val: string) => emit('update:modelValue', val || null),
})

const booleanValue = computed({
  get: () => props.modelValue === true,
  set: (val: boolean) => emit('update:modelValue', val),
})
</script>

<template>
  <div>
    <!-- TEXT -->
    <UInput
      v-if="attribute.type === 'TEXT'"
      v-model="stringValue"
      :placeholder="attribute.name"
      :minlength="textConstraints?.minLength"
      :maxlength="textConstraints?.maxLength"
    />

    <!-- NUMBER -->
    <UInput
      v-else-if="attribute.type === 'NUMBER'"
      v-model.number="value"
      type="number"
      :placeholder="attribute.name"
      :min="numberConstraints?.min"
      :max="numberConstraints?.max"
      step="any"
    />

    <!-- BOOLEAN -->
    <UCheckbox
      v-else-if="attribute.type === 'BOOLEAN'"
      v-model="booleanValue"
      :label="attribute.name"
    />

    <!-- SELECT -->
    <USelect
      v-else-if="attribute.type === 'SELECT'"
      v-model="stringValue"
      :items="selectOptions"
      :placeholder="`Select ${attribute.name}`"
      value-key="value"
    />

    <!-- DATE -->
    <UInput
      v-else-if="attribute.type === 'DATE'"
      v-model="stringValue"
      type="date"
      :placeholder="attribute.name"
    />
  </div>
</template>
