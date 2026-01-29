<script setup lang="ts">
import mermaid from "mermaid";

const props = defineProps<{
  diagram: string;
  id?: string;
}>();

const diagramId = computed(
  () => props.id || `mermaid-${Math.random().toString(36).slice(2, 9)}`,
);
const containerRef = ref<HTMLElement | null>(null);
const svgContent = ref("");
const error = ref<string | null>(null);

const colorMode = useColorMode();

// Initialize mermaid with theme
async function initMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    theme: colorMode.value === "dark" ? "dark" : "neutral",
    securityLevel: "loose",
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: "basis",
    },
    er: {
      useMaxWidth: true,
    },
  });
}

// Render diagram (client-side only)
async function renderDiagram() {
  if (!import.meta.client || !props.diagram) {
    svgContent.value = "";
    return;
  }

  try {
    error.value = null;
    await initMermaid();
    const { svg } = await mermaid.render(diagramId.value, props.diagram);
    svgContent.value = svg;
  } catch (e) {
    console.error("Mermaid render error:", e);
    error.value = e instanceof Error ? e.message : "Failed to render diagram";
  }
}

// Watch for diagram changes (only after mounted)
watch(() => props.diagram, renderDiagram);

// Re-render on color mode change
watch(() => colorMode.value, renderDiagram);

// Initial render on mount (client-side)
onMounted(renderDiagram);
</script>

<template>
  <div ref="containerRef" class="mermaid-container overflow-x-auto">
    <div
      v-if="svgContent"
      class="mermaid-diagram p-4 flex justify-center"
      v-html="svgContent"
    />
    <div
      v-else-if="error"
      class="p-4 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded"
    >
      <p class="font-medium">Diagram Error</p>
      <p class="text-xs mt-1">{{ error }}</p>
    </div>
    <div v-else class="p-4 flex justify-center">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-6 h-6 animate-spin text-gray-400"
      />
    </div>
  </div>
</template>

<style scoped>
.mermaid-container :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>
