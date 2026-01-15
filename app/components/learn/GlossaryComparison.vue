<script setup lang="ts">
interface GlossaryTerm {
  term: string
  definition: string
  example: string
  relatedTerms: string[]
  confusedWith?: string
  distinction?: string
}

defineProps<{
  terms: GlossaryTerm[]
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <UCard class="mb-6">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold">Comparing: {{ terms.map(t => t.term).join(' vs ') }}</h3>
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark"
          @click="emit('close')"
        />
      </div>
    </template>

    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2" :class="terms.length === 3 ? 'lg:grid-cols-3' : ''">
      <div
        v-for="term in terms"
        :key="term.term"
        class="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <h4 class="font-semibold text-lg text-primary">{{ term.term }}</h4>

        <div>
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Definition</p>
          <p class="text-sm text-gray-700 dark:text-gray-300">{{ term.definition }}</p>
        </div>

        <div>
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Example</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 italic">{{ term.example }}</p>
        </div>

        <div v-if="term.distinction">
          <p class="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">Key Distinction</p>
          <p class="text-sm text-amber-700 dark:text-amber-300 font-medium">{{ term.distinction }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <p class="text-xs text-gray-500">
        Tip: Look at the "Key Distinction" section to quickly understand how these terms differ.
      </p>
    </template>
  </UCard>
</template>
