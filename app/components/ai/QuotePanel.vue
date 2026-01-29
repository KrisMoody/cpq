<script setup lang="ts">
import type { AIRecommendation, OptimizationResponse, GenerateQuoteResponse } from '~/composables/useAIQuoteOptimizer'

const props = defineProps<{
  quoteId: string
  customerId?: string
  priceBookId?: string
}>()

const emit = defineEmits<{
  applyRecommendation: [recommendation: AIRecommendation]
  createQuote: [data: GenerateQuoteResponse]
  refresh: []
}>()

const { optimizeQuote, loading, error, requiresConfirmation, userSettings, updateSettings } = useAIQuoteOptimizer()

const isExpanded = ref(true)
const activeTab = ref('chat')
const optimizationResult = ref<OptimizationResponse | null>(null)
const dismissedRecommendations = ref<Set<number>>(new Set())
const showSettings = ref(false)

const tabs = [
  { label: 'Chat', value: 'chat', icon: 'i-heroicons-chat-bubble-left-right' },
  { label: 'Optimize', value: 'optimize', icon: 'i-heroicons-light-bulb' },
  { label: 'Generate', value: 'generate', icon: 'i-heroicons-sparkles' },
]

const visibleRecommendations = computed(() => {
  if (!optimizationResult.value) return []
  return optimizationResult.value.recommendations.filter(
    (_r, index) => !dismissedRecommendations.value.has(index)
  )
})

const scoreColor = computed(() => {
  const score = optimizationResult.value?.overallScore ?? 0
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'error'
})

async function handleOptimize() {
  dismissedRecommendations.value.clear()
  optimizationResult.value = await optimizeQuote(props.quoteId)
}

function handleApplyRecommendation(recommendation: AIRecommendation) {
  emit('applyRecommendation', recommendation)
  // Mark as dismissed after applying
  const index = optimizationResult.value?.recommendations.indexOf(recommendation)
  if (index !== undefined && index >= 0) {
    dismissedRecommendations.value.add(index)
  }
}

function handleDismissRecommendation(recommendation: AIRecommendation) {
  const index = optimizationResult.value?.recommendations.indexOf(recommendation)
  if (index !== undefined && index >= 0) {
    dismissedRecommendations.value.add(index)
  }
}

function handleCreateQuote(data: GenerateQuoteResponse) {
  emit('createQuote', data)
}

function handleChatAction() {
  emit('refresh')
}

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value && !optimizationResult.value && activeTab.value === 'optimize') {
    handleOptimize()
  }
}

const confirmationOptions = [
  { label: 'Always confirm', value: 'always' },
  { label: 'Destructive only', value: 'destructive_only' },
  { label: 'Never confirm', value: 'never' },
]
</script>

<template>
  <UCard class="overflow-hidden">
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between">
        <button
          class="flex items-center gap-2 text-left flex-1"
          @click="toggleExpanded"
        >
          <UIcon
            name="i-heroicons-sparkles"
            class="w-5 h-5 text-primary-500"
          />
          <span class="font-semibold">AI Assistant</span>
          <UIcon
            :name="isExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="w-4 h-4 text-ga-gray-600"
          />
        </button>

        <div class="flex items-center gap-2">
          <!-- Score Badge (when optimization result exists) -->
          <UBadge
            v-if="optimizationResult && isExpanded"
            :color="scoreColor"
            variant="subtle"
          >
            Score: {{ optimizationResult.overallScore }}/100
          </UBadge>

          <!-- Settings Button -->
          <UButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-cog-6-tooth"
            @click.stop="showSettings = !showSettings"
          />
        </div>
      </div>
    </template>

    <!-- Collapsible Content -->
    <div v-show="isExpanded" class="space-y-4">
      <!-- Tabs -->
      <div class="flex gap-1 border-b border-ga-gray-400">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors"
          :class="{
            'text-ga-navy-500 border-b-2 border-ga-navy-500': activeTab === tab.value,
            'text-ga-gray-600 hover:text-ga-gray-800': activeTab !== tab.value,
          }"
          @click="activeTab = tab.value"
        >
          <UIcon :name="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Error Alert -->
      <UAlert
        v-if="error"
        color="error"
        icon="i-heroicons-exclamation-triangle"
        closable
      >
        <template #description>{{ error }}</template>
      </UAlert>

      <!-- Optimize Tab -->
      <div v-if="activeTab === 'optimize'" class="space-y-4">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
        </div>

        <!-- No Results -->
        <div
          v-else-if="!optimizationResult"
          class="text-center py-8"
        >
          <UIcon name="i-heroicons-light-bulb" class="w-12 h-12 mx-auto text-ga-gray-500 mb-3" />
          <p class="text-sm text-ga-gray-600 mb-4">Analyze your quote with AI to get optimization suggestions</p>
          <UButton
            icon="i-heroicons-sparkles"
            @click="handleOptimize"
          >
            Optimize Quote
          </UButton>
        </div>

        <!-- Results -->
        <template v-else>
          <!-- Analysis Summary -->
          <div class="p-4 bg-ga-gray-100 rounded-lg">
            <p class="text-sm text-ga-gray-700">{{ optimizationResult.summary }}</p>

            <!-- SWOT Grid -->
            <div v-if="optimizationResult.analysis" class="grid grid-cols-2 gap-3 mt-4">
              <div v-if="optimizationResult.analysis.strengths.length > 0">
                <p class="text-xs font-medium text-green-600 mb-1">Strengths</p>
                <ul class="text-xs text-ga-gray-700 space-y-1">
                  <li v-for="s in optimizationResult.analysis.strengths" :key="s" class="flex items-start gap-1">
                    <UIcon name="i-heroicons-check" class="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    {{ s }}
                  </li>
                </ul>
              </div>
              <div v-if="optimizationResult.analysis.opportunities.length > 0">
                <p class="text-xs font-medium text-blue-600 mb-1">Opportunities</p>
                <ul class="text-xs text-ga-gray-700 space-y-1">
                  <li v-for="o in optimizationResult.analysis.opportunities" :key="o" class="flex items-start gap-1">
                    <UIcon name="i-heroicons-arrow-trending-up" class="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                    {{ o }}
                  </li>
                </ul>
              </div>
              <div v-if="optimizationResult.analysis.weaknesses.length > 0">
                <p class="text-xs font-medium text-amber-600 mb-1">Weaknesses</p>
                <ul class="text-xs text-ga-gray-700 space-y-1">
                  <li v-for="w in optimizationResult.analysis.weaknesses" :key="w" class="flex items-start gap-1">
                    <UIcon name="i-heroicons-exclamation-triangle" class="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                    {{ w }}
                  </li>
                </ul>
              </div>
              <div v-if="optimizationResult.analysis.risks.length > 0">
                <p class="text-xs font-medium text-red-600 mb-1">Risks</p>
                <ul class="text-xs text-ga-gray-700 space-y-1">
                  <li v-for="r in optimizationResult.analysis.risks" :key="r" class="flex items-start gap-1">
                    <UIcon name="i-heroicons-shield-exclamation" class="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                    {{ r }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div v-if="visibleRecommendations.length > 0" class="space-y-3">
            <h4 class="text-sm font-medium">Recommendations ({{ visibleRecommendations.length }})</h4>
            <AiOptimizationCard
              v-for="(rec, index) in visibleRecommendations"
              :key="index"
              :recommendation="rec"
              :requires-confirmation="requiresConfirmation(rec.type)"
              @apply="handleApplyRecommendation"
              @dismiss="handleDismissRecommendation"
            />
          </div>

          <!-- Re-analyze Button -->
          <UButton
            variant="soft"
            size="sm"
            icon="i-heroicons-arrow-path"
            :loading="loading"
            @click="handleOptimize"
          >
            Re-analyze
          </UButton>
        </template>
      </div>

      <!-- Chat Tab -->
      <div v-if="activeTab === 'chat'">
        <AiQuoteChat
          :quote-id="quoteId"
          :customer-id="customerId"
          @action-executed="handleChatAction"
        />
      </div>

      <!-- Generate Tab -->
      <div v-if="activeTab === 'generate'">
        <AiQuoteGenerator
          :customer-id="customerId"
          :price-book-id="priceBookId"
          @create="handleCreateQuote"
        />
      </div>
    </div>

    <!-- Settings Dropdown -->
    <UModal v-model:open="showSettings" title="AI Settings">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">AI Settings</h3>
              <UButton
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="showSettings = false"
              />
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-ga-gray-800 mb-2">
                Action Confirmation
              </label>
              <p class="text-xs text-ga-gray-600 mb-3">
                Choose when to show confirmation dialogs before applying AI suggestions
              </p>
              <URadioGroup
                :model-value="userSettings.confirmActions"
                :items="confirmationOptions"
                @update:model-value="updateSettings({ confirmActions: $event as 'always' | 'destructive_only' | 'never' })"
              />
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton @click="showSettings = false">
                Done
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UCard>
</template>
