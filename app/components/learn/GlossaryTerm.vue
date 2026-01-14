<script setup lang="ts">
const props = defineProps<{
  term: string
  definition: string
  example?: string
  relatedTerms?: string[]
  confusedWith?: string
  distinction?: string
  compareMode?: boolean
  selected?: boolean
  highlighted?: boolean
}>()

const emit = defineEmits<{
  toggleSelect: []
  navigateToTerm: [term: string]
}>()

function handleCardClick() {
  if (props.compareMode) {
    emit('toggleSelect')
  }
}
</script>

<template>
  <UCard
    :class="[
      compareMode ? 'cursor-pointer hover:ring-2 hover:ring-primary/50' : '',
      selected ? 'ring-2 ring-primary' : '',
      highlighted ? 'ring-2 ring-amber-400 animate-pulse' : '',
    ]"
    @click="handleCardClick"
  >
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <h3 class="font-semibold text-lg">{{ term }}</h3>
        <UCheckbox
          v-if="compareMode"
          :model-value="selected"
          @click.stop
          @update:model-value="emit('toggleSelect')"
        />
      </div>
    </template>

    <div class="space-y-3">
      <p class="text-gray-600 dark:text-gray-300">{{ definition }}</p>

      <div v-if="example" class="flex gap-2 text-sm">
        <UIcon name="i-heroicons-light-bulb" class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p class="text-gray-500 dark:text-gray-400 italic">{{ example }}</p>
      </div>

      <!-- Confusable term hint -->
      <div
        v-if="confusedWith && !compareMode"
        class="flex gap-2 text-sm p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md"
      >
        <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p class="text-amber-700 dark:text-amber-300">
            <span class="font-medium">Easily confused with: </span>
            <button
              class="underline hover:text-amber-900 dark:hover:text-amber-100"
              @click.stop="emit('navigateToTerm', confusedWith)"
            >
              {{ confusedWith }}
            </button>
          </p>
          <p v-if="distinction" class="text-amber-600 dark:text-amber-400 text-xs mt-1">
            {{ distinction }}
          </p>
        </div>
      </div>
    </div>

    <template v-if="relatedTerms?.length" #footer>
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-xs text-gray-500">Related:</span>
        <UBadge
          v-for="related in relatedTerms"
          :key="related"
          variant="subtle"
          size="xs"
        >
          {{ related }}
        </UBadge>
      </div>
    </template>
  </UCard>
</template>
