<script setup lang="ts">
import mermaid from 'mermaid'

const props = defineProps<{
  chart: string
  id?: string
}>()

const diagramRef = ref<HTMLElement>()
const diagramId = computed(() => props.id || `mermaid-${Math.random().toString(36).slice(2, 9)}`)
const svgContent = ref('')

onMounted(async () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis',
    },
  })

  try {
    const { svg } = await mermaid.render(diagramId.value, props.chart)
    svgContent.value = svg
  }
  catch (e) {
    console.error('Mermaid rendering error:', e)
  }
})
</script>

<template>
  <div ref="diagramRef" class="mermaid-container overflow-x-auto" v-html="svgContent" />
</template>

<style>
.mermaid-container svg {
  max-width: 100%;
  height: auto;
}
</style>
