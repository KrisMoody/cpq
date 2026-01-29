<script setup lang="ts">
import { VueFlow, useVueFlow, MarkerType } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import type { Node, Edge } from '@vue-flow/core'
import { usePrismaSchema, domainColors, domainGroups } from '~/composables/usePrismaSchema'
import type { ParsedModel } from '~/composables/usePrismaSchema'
import SchemaTableNode from './SchemaTableNode.vue'

// Import Vue Flow styles
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

const { schema, isLoading, error, fetchSchema } = usePrismaSchema()
const { fitView } = useVueFlow()

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

// Track global expanded state
const allExpanded = ref(false)

// Estimate node height based on content
function estimateNodeHeight(model: ParsedModel, expanded: boolean): number {
  if (!expanded) {
    return 60 // Collapsed: header + summary
  }
  // Expanded: header (40px) + fields (20px each, max 300px) + relations section
  const fieldsHeight = Math.min(model.fields.length * 20, 300)
  const relationsHeight = model.relations.length > 0 ? 40 + model.relations.length * 20 : 0
  return 50 + fieldsHeight + relationsHeight
}

function expandAll() {
  allExpanded.value = true
  if (schema.value) {
    nodes.value = calculateLayout(schema.value.models, true)
    nextTick(() => fitView({ padding: 0.2 }))
  }
}

function collapseAll() {
  allExpanded.value = false
  if (schema.value) {
    nodes.value = calculateLayout(schema.value.models, false)
    nextTick(() => fitView({ padding: 0.2 }))
  }
}

// Custom node types - use type assertion for Vue Flow compatibility
const nodeTypes = {
  tableNode: markRaw(SchemaTableNode),
} as const

// Calculate layout based on domain groups with dynamic spacing
function calculateLayout(models: ParsedModel[], expanded = false): Node[] {
  const result: Node[] = []
  const domainOrder = ['Product', 'Pricing', 'Quote', 'Customer', 'Rules', 'Discount', 'Reference']

  const horizontalGap = 280
  const verticalPadding = 20

  let currentX = 50

  for (const domain of domainOrder) {
    const domainModels = domainGroups[domain] || []
    let currentY = 50

    for (const modelName of domainModels) {
      const model = models.find((m) => m.name === modelName)
      if (!model) continue

      const nodeHeight = estimateNodeHeight(model, expanded)

      result.push({
        id: model.name,
        type: 'tableNode',
        position: { x: currentX, y: currentY },
        data: {
          label: model.name,
          fields: model.fields,
          relations: model.relations,
          color: domainColors[model.name] || '#6b7280',
          isExpanded: expanded,
        },
      })

      currentY += nodeHeight + verticalPadding
    }

    // Move to next column if we placed any nodes
    if (domainModels.some((m) => models.find((mo) => mo.name === m))) {
      currentX += horizontalGap
    }
  }

  // Handle any models not in a domain group
  const allGroupedModels = Object.values(domainGroups).flat()
  const ungroupedModels = models.filter((m) => !allGroupedModels.includes(m.name))

  let ungroupedY = 50
  for (const model of ungroupedModels) {
    const nodeHeight = estimateNodeHeight(model, expanded)

    result.push({
      id: model.name,
      type: 'tableNode',
      position: { x: currentX, y: ungroupedY },
      data: {
        label: model.name,
        fields: model.fields,
        relations: model.relations,
        color: domainColors[model.name] || '#6b7280',
        isExpanded: expanded,
      },
    })
    ungroupedY += nodeHeight + verticalPadding
  }

  return result
}

// Generate edges from relations
function generateEdges(models: ParsedModel[]): Edge[] {
  const result: Edge[] = []
  const existingEdges = new Set<string>()

  for (const model of models) {
    for (const relation of model.relations) {
      // Skip if the related model doesn't exist in our schema
      const relatedModel = models.find((m) => m.name === relation.relatedModel)
      if (!relatedModel) continue

      // Create a unique edge ID to avoid duplicates
      const edgeId = [model.name, relation.relatedModel].sort().join('-')
      if (existingEdges.has(edgeId)) continue
      existingEdges.add(edgeId)

      // Determine edge direction based on relation type
      const isSourceMany = relation.relationType === '1:N' || relation.relationType === 'N:N'
      const source = isSourceMany ? model.name : relation.relatedModel
      const target = isSourceMany ? relation.relatedModel : model.name

      result.push({
        id: `e-${model.name}-${relation.relatedModel}`,
        source,
        target,
        label: relation.relationType,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#94a3b8', strokeWidth: 1.5 },
        labelStyle: { fill: '#64748b', fontSize: 10 },
        labelBgStyle: { fill: 'white' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#94a3b8',
        },
      })
    }
  }

  return result
}

// Fetch schema on mount
onMounted(async () => {
  await fetchSchema()

  if (schema.value) {
    nodes.value = calculateLayout(schema.value.models)
    edges.value = generateEdges(schema.value.models)

    // Fit view after nodes are rendered
    await nextTick()
    setTimeout(() => {
      fitView({ padding: 0.2 })
    }, 100)
  }
})

// Handle keyboard shortcuts
function handleKeydown(event: KeyboardEvent) {
  if (event.key === '0' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    fitView({ padding: 0.2 })
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="w-full space-y-4">
    <!-- Mobile notice -->
    <div class="md:hidden p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div class="flex items-start gap-3">
        <UIcon name="i-heroicons-device-phone-mobile" class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p class="text-sm font-medium text-blue-800">Best viewed on larger screens</p>
          <p class="text-xs text-blue-600 mt-1">This interactive diagram works best on tablet or desktop. You can still scroll and pinch-to-zoom on mobile.</p>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center h-[400px] sm:h-[600px] bg-ga-gray-100 rounded-lg">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-ga-gray-500 animate-spin" />
        <p class="mt-2 text-sm text-ga-gray-600">Loading database schema...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex items-center justify-center h-[400px] sm:h-[600px] bg-red-50 rounded-lg">
      <div class="text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-400" />
        <p class="mt-2 text-sm text-red-600">Failed to load database schema.</p>
        <p class="mt-1 text-xs text-ga-gray-600">{{ error }}</p>
      </div>
    </div>

    <!-- Vue Flow diagram -->
    <ClientOnly v-else>
      <div class="h-[400px] sm:h-[600px] border border-ga-gray-300 rounded-lg overflow-hidden bg-white">
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :node-types="nodeTypes"
          :default-viewport="{ zoom: 0.8, x: 0, y: 0 }"
          :min-zoom="0.2"
          :max-zoom="2"
          fit-view-on-init
          class="vue-flow-wrapper"
        >
          <Background pattern-color="#e5e7eb" :gap="20" />
          <Controls position="top-right" />
          <MiniMap
            position="bottom-right"
            :node-color="(node: Node) => node.data?.color || '#6b7280'"
            :node-stroke-color="() => '#fff'"
            :mask-color="'rgba(0, 0, 0, 0.1)'"
          />
        </VueFlow>
      </div>

      <template #fallback>
        <div class="flex items-center justify-center h-[400px] sm:h-[600px] bg-ga-gray-100 rounded-lg">
          <div class="text-center">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-ga-gray-500 animate-spin" />
            <p class="mt-2 text-sm text-ga-gray-600">Loading interactive diagram...</p>
          </div>
        </div>
      </template>
    </ClientOnly>

    <div class="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-ga-gray-600">
      <p>Interactive database schema. Drag nodes, zoom with scroll, pan by dragging background.</p>
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div class="flex items-center gap-1">
          <UButton size="xs" variant="ghost" color="neutral" @click="expandAll">
            <UIcon name="i-heroicons-arrows-pointing-out" class="w-3.5 h-3.5" />
            Expand all
          </UButton>
          <UButton size="xs" variant="ghost" color="neutral" @click="collapseAll">
            <UIcon name="i-heroicons-arrows-pointing-in" class="w-3.5 h-3.5" />
            Collapse all
          </UButton>
        </div>
        <p class="text-ga-gray-500 hidden sm:block">Press <kbd class="px-1 py-0.5 bg-ga-gray-200 rounded text-[10px]">Cmd+0</kbd> to reset view</p>
      </div>
    </div>
  </div>
</template>

<style>
.vue-flow-wrapper {
  width: 100%;
  height: 100%;
}

/* Dark mode adjustments for Vue Flow */
.dark .vue-flow__background {
  background-color: #111827;
}

.dark .vue-flow__background pattern line {
  stroke: #374151;
}

.dark .vue-flow__controls {
  background: #1f2937;
  border-color: #374151;
}

.dark .vue-flow__controls-button {
  background: #1f2937;
  border-color: #374151;
  fill: #9ca3af;
}

.dark .vue-flow__controls-button:hover {
  background: #374151;
}

.dark .vue-flow__minimap {
  background: #1f2937;
}

.dark .vue-flow__edge-path {
  stroke: #4b5563;
}

.dark .vue-flow__edge-text {
  fill: #9ca3af;
}

.dark .vue-flow__edge-textbg {
  fill: #1f2937;
}
</style>
