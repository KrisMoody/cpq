<script setup lang="ts">
import type { Questionnaire } from '~/composables/useQuestionnaires'

defineProps<{
  quoteId: string
}>()

const emit = defineEmits<{
  close: []
  'add-products': [productIds: string[]]
}>()

const { fetchQuestionnaires, fetchQuestionnaire, questionnaires } = useQuestionnaires()
const { formatPrice: _formatPrice } = usePricing()

const selectedQuestionnaireId = ref<string | null>(null)
const questionnaire = ref<Questionnaire | null>(null)
const currentQuestionIndex = ref(0)
const answers = ref<Map<string, string | string[]>>(new Map())
const results = ref<Array<{ productId: string; productName: string; score: number }>>([])
const selectedProducts = ref<Set<string>>(new Set())
const step = ref<'select' | 'questions' | 'results'>('select')

onMounted(async () => {
  await fetchQuestionnaires()
})

const currentQuestion = computed(() => {
  if (!questionnaire.value) return null
  const sorted = [...questionnaire.value.questions].sort((a, b) => a.sortOrder - b.sortOrder)
  return sorted[currentQuestionIndex.value] || null
})

const progress = computed(() => {
  if (!questionnaire.value) return 0
  const total = questionnaire.value.questions.length
  if (total === 0) return 0
  return Math.round((currentQuestionIndex.value / total) * 100)
})

const questionOptions = computed(() => {
  if (!currentQuestion.value) return []
  if (currentQuestion.value.type === 'YES_NO') {
    return [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ]
  }
  return currentQuestion.value.options || []
})

async function selectQuestionnaire(id: string) {
  selectedQuestionnaireId.value = id
  questionnaire.value = await fetchQuestionnaire(id)
  if (questionnaire.value && questionnaire.value.questions.length > 0) {
    step.value = 'questions'
    currentQuestionIndex.value = 0
    answers.value.clear()
  }
}

function submitAnswer(value: string | string[]) {
  if (!currentQuestion.value) return
  answers.value.set(currentQuestion.value.id, value)

  // Check for branch logic
  const branchLogic = currentQuestion.value.branchLogic as Record<string, string> | null
  if (branchLogic) {
    const answerValue = Array.isArray(value) ? value[0] : value
    const nextQuestionId = answerValue ? branchLogic[answerValue] : undefined
    if (nextQuestionId && questionnaire.value) {
      const sorted = [...questionnaire.value.questions].sort((a, b) => a.sortOrder - b.sortOrder)
      const nextIndex = sorted.findIndex((q) => q.id === nextQuestionId)
      if (nextIndex !== -1) {
        currentQuestionIndex.value = nextIndex
        return
      }
    }
  }

  // Move to next question or results
  if (questionnaire.value && currentQuestionIndex.value < questionnaire.value.questions.length - 1) {
    currentQuestionIndex.value++
  } else {
    calculateResults()
  }
}

function calculateResults() {
  if (!questionnaire.value) return

  const productScores = new Map<string, { score: number; name: string }>()

  for (const question of questionnaire.value.questions) {
    const answer = answers.value.get(question.id)
    if (!answer) continue

    const answerValues = Array.isArray(answer) ? answer : [answer]

    for (const answerValue of answerValues) {
      const matchingMappings = question.productMappings.filter(
        (m) => m.answerValue === answerValue
      )

      for (const mapping of matchingMappings) {
        const existing = productScores.get(mapping.productId)
        if (existing) {
          existing.score += mapping.score
        } else {
          productScores.set(mapping.productId, {
            score: mapping.score,
            name: mapping.product.name,
          })
        }
      }
    }
  }

  results.value = Array.from(productScores.entries())
    .map(([productId, { score, name }]) => ({ productId, productName: name, score }))
    .sort((a, b) => b.score - a.score)

  step.value = 'results'
}

function toggleProduct(productId: string) {
  if (selectedProducts.value.has(productId)) {
    selectedProducts.value.delete(productId)
  } else {
    selectedProducts.value.add(productId)
  }
}

function addSelectedProducts() {
  emit('add-products', Array.from(selectedProducts.value))
  emit('close')
}

function goBack() {
  if (step.value === 'questions' && currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  } else if (step.value === 'questions') {
    step.value = 'select'
    questionnaire.value = null
  } else if (step.value === 'results') {
    step.value = 'questions'
    currentQuestionIndex.value = questionnaire.value?.questions.length ? questionnaire.value.questions.length - 1 : 0
  }
}

function restart() {
  step.value = 'select'
  questionnaire.value = null
  currentQuestionIndex.value = 0
  answers.value.clear()
  results.value = []
  selectedProducts.value.clear()
}
</script>

<template>
  <UCard class="w-full max-w-lg">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold">Guided Product Selection</h3>
        <UButton variant="ghost" icon="i-heroicons-x-mark" @click="emit('close')" />
      </div>
    </template>

    <!-- Select Questionnaire -->
    <div v-if="step === 'select'" class="space-y-4">
      <p class="text-sm text-gray-500">Select a questionnaire to help find the right products:</p>

      <div v-if="questionnaires.length === 0" class="text-center py-8">
        <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p class="text-gray-500">No questionnaires available</p>
      </div>

      <div v-else class="space-y-2">
        <button
          v-for="q in questionnaires"
          :key="q.id"
          class="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors"
          @click="selectQuestionnaire(q.id)"
        >
          <div class="font-medium">{{ q.name }}</div>
          <div v-if="q.description" class="text-sm text-gray-500">{{ q.description }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ q.questionCount }} questions</div>
        </button>
      </div>
    </div>

    <!-- Questions -->
    <div v-else-if="step === 'questions' && currentQuestion" class="space-y-4">
      <div class="flex items-center gap-2">
        <UProgress :value="progress" size="sm" class="flex-1" />
        <span class="text-xs text-gray-500">{{ progress }}%</span>
      </div>

      <div class="py-4">
        <h4 class="text-lg font-medium mb-4">{{ currentQuestion.text }}</h4>

        <div v-if="currentQuestion.type === 'SINGLE_CHOICE' || currentQuestion.type === 'YES_NO'" class="space-y-2">
          <button
            v-for="option in questionOptions"
            :key="option.value"
            class="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            @click="submitAnswer(option.value)"
          >
            {{ option.label }}
          </button>
        </div>

        <div v-else-if="currentQuestion.type === 'MULTIPLE_CHOICE'" class="space-y-2">
          <div
            v-for="option in questionOptions"
            :key="option.value"
            class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <UCheckbox
              :model-value="(answers.get(currentQuestion.id) as string[] || []).includes(option.value)"
              @update:model-value="(checked: boolean | 'indeterminate') => {
                if (typeof checked !== 'boolean') return
                const current = (answers.get(currentQuestion!.id) as string[] || [])
                if (checked) {
                  answers.set(currentQuestion!.id, [...current, option.value])
                } else {
                  answers.set(currentQuestion!.id, current.filter(v => v !== option.value))
                }
              }"
            />
            <span>{{ option.label }}</span>
          </div>
          <UButton class="mt-4" @click="submitAnswer(answers.get(currentQuestion.id) as string[] || [])">
            Continue
          </UButton>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-else-if="step === 'results'" class="space-y-4">
      <div class="text-center py-4">
        <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-green-500 mx-auto mb-2" />
        <h4 class="text-lg font-medium">Recommended Products</h4>
        <p class="text-sm text-gray-500">Based on your answers, we recommend:</p>
      </div>

      <div v-if="results.length === 0" class="text-center py-4">
        <p class="text-gray-500">No matching products found</p>
      </div>

      <div v-else class="space-y-2 max-h-64 overflow-y-auto">
        <div
          v-for="result in results"
          :key="result.productId"
          class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900/20': selectedProducts.has(result.productId) }"
        >
          <UCheckbox
            :model-value="selectedProducts.has(result.productId)"
            @update:model-value="() => toggleProduct(result.productId)"
          />
          <div class="flex-1 min-w-0">
            <div class="font-medium truncate">{{ result.productName }}</div>
            <div class="text-xs text-gray-500">Match score: {{ result.score }}</div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <UButton v-if="step !== 'select'" variant="ghost" @click="goBack">
          Back
        </UButton>
        <div v-else />

        <div class="flex gap-2">
          <UButton v-if="step === 'results'" variant="ghost" @click="restart">
            Start Over
          </UButton>
          <UButton
            v-if="step === 'results' && selectedProducts.size > 0"
            @click="addSelectedProducts"
          >
            Add {{ selectedProducts.size }} Product{{ selectedProducts.size > 1 ? 's' : '' }}
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>
