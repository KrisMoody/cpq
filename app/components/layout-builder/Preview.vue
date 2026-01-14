<script setup lang="ts">
import type { QuoteLayout } from '~/types/quote-layout'
import type { QuoteWithLineItems } from '~/composables/useQuotes'

const props = defineProps<{
  quote: QuoteWithLineItems
  layout: QuoteLayout
  scale?: number
}>()

const scaleValue = computed(() => props.scale || 1)
</script>

<template>
  <div
    class="layout-preview-container origin-top-left"
    :style="{
      transform: `scale(${scaleValue})`,
      width: `${100 / scaleValue}%`,
    }"
  >
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <CpqQuoteRenderer
        :quote="quote"
        :layout="layout"
      />
    </div>
  </div>
</template>

<style scoped>
.layout-preview-container {
  transition: transform 0.2s ease;
}
</style>
