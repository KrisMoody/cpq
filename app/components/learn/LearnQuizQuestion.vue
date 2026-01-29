<script setup lang="ts">
import type { QuizQuestion } from '~/data/quizQuestions'

const props = defineProps<{
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  answer: [selectedAnswers: number[]]
}>()

const selectedAnswers = ref<number[]>([])
const hasSubmitted = ref(false)

const isCorrect = computed(() => {
  if (!hasSubmitted.value) return null
  const correct = props.question.correctAnswers
  if (selectedAnswers.value.length !== correct.length) return false
  return correct.every(i => selectedAnswers.value.includes(i)) &&
    selectedAnswers.value.every(i => correct.includes(i))
})

function toggleOption(index: number) {
  if (hasSubmitted.value || props.disabled) return

  if (props.question.type === 'single') {
    selectedAnswers.value = [index]
  } else {
    const idx = selectedAnswers.value.indexOf(index)
    if (idx >= 0) {
      selectedAnswers.value.splice(idx, 1)
    } else {
      selectedAnswers.value.push(index)
    }
  }
}

function submit() {
  if (selectedAnswers.value.length === 0 || hasSubmitted.value) return
  hasSubmitted.value = true
  emit('answer', selectedAnswers.value)
}

function getOptionClass(index: number) {
  if (!hasSubmitted.value) {
    return selectedAnswers.value.includes(index)
      ? 'border-primary-500 bg-primary-500/10'
      : 'border-ga-gray-300 hover:border-ga-gray-400'
  }

  const isSelected = selectedAnswers.value.includes(index)
  const isCorrectAnswer = props.question.correctAnswers.includes(index)

  if (isCorrectAnswer) {
    return 'border-green-500 bg-green-500/10'
  }
  if (isSelected && !isCorrectAnswer) {
    return 'border-red-500 bg-red-500/10'
  }
  return 'border-ga-gray-300 opacity-50'
}

// Reset when question changes
watch(() => props.question.id, () => {
  selectedAnswers.value = []
  hasSubmitted.value = false
})
</script>

<template>
  <div class="space-y-4">
    <!-- Progress indicator -->
    <div class="flex items-center justify-between text-sm text-ga-gray-600">
      <span>Question {{ questionNumber }} of {{ totalQuestions }}</span>
      <span v-if="question.type === 'multiple'" class="text-xs bg-ga-gray-200 px-2 py-1 rounded">
        Select all that apply
      </span>
    </div>

    <!-- Question text -->
    <h3 class="text-lg font-medium">{{ question.question }}</h3>

    <!-- Options -->
    <div class="space-y-2">
      <button
        v-for="(option, index) in question.options"
        :key="index"
        :disabled="hasSubmitted || disabled"
        class="w-full text-left p-3 rounded-lg border-2 transition-colors flex items-start gap-3"
        :class="getOptionClass(index)"
        @click="toggleOption(index)"
      >
        <!-- Radio/Checkbox indicator -->
        <span class="flex-shrink-0 mt-0.5">
          <span
            v-if="question.type === 'single'"
            class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
            :class="selectedAnswers.includes(index) ? 'border-primary-500' : 'border-ga-gray-400'"
          >
            <span
              v-if="selectedAnswers.includes(index)"
              class="w-2 h-2 rounded-full bg-primary-500"
            />
          </span>
          <span
            v-else
            class="w-4 h-4 rounded border-2 flex items-center justify-center"
            :class="selectedAnswers.includes(index) ? 'border-primary-500 bg-primary-500' : 'border-ga-gray-400'"
          >
            <UIcon
              v-if="selectedAnswers.includes(index)"
              name="i-heroicons-check"
              class="w-3 h-3 text-white"
            />
          </span>
        </span>

        <!-- Option text -->
        <span class="flex-1">{{ option }}</span>

        <!-- Correct/Incorrect indicator -->
        <span v-if="hasSubmitted" class="flex-shrink-0">
          <UIcon
            v-if="question.correctAnswers.includes(index)"
            name="i-heroicons-check-circle"
            class="w-5 h-5 text-green-500"
          />
          <UIcon
            v-else-if="selectedAnswers.includes(index)"
            name="i-heroicons-x-circle"
            class="w-5 h-5 text-red-500"
          />
        </span>
      </button>
    </div>

    <!-- Submit button (before answering) -->
    <div v-if="!hasSubmitted" class="flex justify-end">
      <UButton
        :disabled="selectedAnswers.length === 0 || disabled"
        @click="submit"
      >
        Submit Answer
      </UButton>
    </div>

    <!-- Feedback (after answering) -->
    <div
      v-if="hasSubmitted"
      class="p-4 rounded-lg"
      :class="isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'"
    >
      <div class="flex items-start gap-2">
        <UIcon
          :name="isCorrect ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
          :class="isCorrect ? 'text-green-500' : 'text-red-500'"
          class="w-5 h-5 flex-shrink-0 mt-0.5"
        />
        <div>
          <p class="font-medium" :class="isCorrect ? 'text-green-700' : 'text-red-700'">
            {{ isCorrect ? 'Correct!' : 'Incorrect' }}
          </p>
          <p class="text-sm text-ga-gray-700 mt-1">
            {{ question.explanation }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
