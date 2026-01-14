<script setup lang="ts">
import type { QuoteTheme, HeaderStyle } from '~/types/quote-layout'

defineProps<{
  theme: QuoteTheme
}>()

const emit = defineEmits<{
  update: [updates: Partial<QuoteTheme>]
  applyPreset: [preset: 'professional' | 'modern' | 'minimal' | 'classic']
}>()

const isExpanded = ref(true)

const presets = [
  {
    id: 'professional' as const,
    name: 'Professional',
    primaryColor: '#1a56db',
    secondaryColor: '#6b7280',
  },
  {
    id: 'modern' as const,
    name: 'Modern',
    primaryColor: '#7c3aed',
    secondaryColor: '#a78bfa',
  },
  {
    id: 'minimal' as const,
    name: 'Minimal',
    primaryColor: '#374151',
    secondaryColor: '#9ca3af',
  },
  {
    id: 'classic' as const,
    name: 'Classic',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
  },
]

const headerStyleOptions = [
  { label: 'Simple', value: 'simple' },
  { label: 'Branded', value: 'branded' },
  { label: 'Minimal', value: 'minimal' },
]

const fontFamilyOptions = [
  { label: 'System Default', value: 'system-ui, sans-serif' },
  { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { label: 'Georgia (Serif)', value: 'Georgia, serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
]
</script>

<template>
  <UCard :ui="{ root: 'overflow-visible' }">
    <template #header>
      <div
        class="flex items-center justify-between cursor-pointer"
        @click="isExpanded = !isExpanded"
      >
        <h3 class="font-semibold">Theme</h3>
        <UIcon
          :name="isExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          class="w-4 h-4 text-gray-500"
        />
      </div>
    </template>

    <div
      class="grid transition-[grid-template-rows] duration-200"
      :class="isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div :class="isExpanded ? 'overflow-visible' : 'overflow-hidden'">
        <div class="space-y-4">
          <!-- Theme Presets -->
          <div>
            <p class="text-xs font-medium text-gray-500 mb-2">Quick Presets</p>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="preset in presets"
                :key="preset.id"
                class="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors"
                @click="emit('applyPreset', preset.id)"
              >
                <div class="flex gap-1">
                  <div
                    class="w-4 h-4 rounded-full"
                    :style="{ backgroundColor: preset.primaryColor }"
                  />
                  <div
                    class="w-4 h-4 rounded-full"
                    :style="{ backgroundColor: preset.secondaryColor }"
                  />
                </div>
                <span class="text-xs text-gray-600 dark:text-gray-400">{{ preset.name }}</span>
              </button>
            </div>
          </div>

          <!-- Color Pickers -->
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Primary Color">
              <div class="flex items-center gap-2">
                <input
                  :value="theme.primaryColor"
                  type="color"
                  class="w-8 h-8 rounded cursor-pointer border-0"
                  @input="emit('update', { primaryColor: ($event.target as HTMLInputElement).value })"
                >
                <UInput
                  :model-value="theme.primaryColor"
                  size="sm"
                  class="flex-1"
                  @update:model-value="emit('update', { primaryColor: $event })"
                />
              </div>
            </UFormField>

            <UFormField label="Secondary Color">
              <div class="flex items-center gap-2">
                <input
                  :value="theme.secondaryColor"
                  type="color"
                  class="w-8 h-8 rounded cursor-pointer border-0"
                  @input="emit('update', { secondaryColor: ($event.target as HTMLInputElement).value })"
                >
                <UInput
                  :model-value="theme.secondaryColor"
                  size="sm"
                  class="flex-1"
                  @update:model-value="emit('update', { secondaryColor: $event })"
                />
              </div>
            </UFormField>
          </div>

          <!-- Header Style -->
          <UFormField label="Header Style">
            <USelectMenu
              :model-value="theme.headerStyle"
              :items="headerStyleOptions"
              value-key="value"
              size="sm"
              @update:model-value="emit('update', { headerStyle: $event as HeaderStyle })"
            />
          </UFormField>

          <!-- Font Family -->
          <UFormField label="Font Family">
            <USelectMenu
              :model-value="theme.fontFamily"
              :items="fontFamilyOptions"
              value-key="value"
              size="sm"
              @update:model-value="emit('update', { fontFamily: $event })"
            />
          </UFormField>

          <!-- Table Styling Toggles -->
          <div class="flex flex-wrap gap-4">
            <UCheckbox
              :model-value="theme.tableBorders"
              label="Show table borders"
              @update:model-value="emit('update', { tableBorders: $event === true })"
            />
            <UCheckbox
              :model-value="theme.alternateRowColors"
              label="Alternate row colors"
              @update:model-value="emit('update', { alternateRowColors: $event === true })"
            />
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
