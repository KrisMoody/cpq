<script setup lang="ts">
const {
  quizState,
  currentQuestion,
  history,
  results,
  progress,
  isLastQuestion,
  startQuiz,
  submitAnswer,
  nextQuestion,
  resetQuiz,
  clearHistory,
} = useQuiz()

const questionsPerDomain = ref(2)
const hasAnsweredCurrent = ref(false)

function handleStartQuiz() {
  hasAnsweredCurrent.value = false
  startQuiz(questionsPerDomain.value)
}

function handleAnswer(selectedAnswers: number[]) {
  submitAnswer(selectedAnswers)
  hasAnsweredCurrent.value = true
}

function handleNext() {
  hasAnsweredCurrent.value = false
  nextQuestion()
}

function handleRestart() {
  hasAnsweredCurrent.value = false
  startQuiz(questionsPerDomain.value)
}

function handleClose() {
  resetQuiz()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Idle state: Show start options and history -->
    <template v-if="quizState === 'idle'">
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Start quiz panel -->
        <div class="space-y-4">
          <div class="text-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <UIcon name="i-heroicons-academic-cap" class="w-12 h-12 mx-auto mb-3 text-primary-500" />
            <h3 class="text-lg font-medium mb-2">Test Your CPQ Knowledge</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Answer questions about CPQ concepts, terminology, and relationships.
            </p>

            <!-- Questions per domain selector -->
            <div class="flex items-center justify-center gap-3 mb-4">
              <label class="text-sm text-gray-600 dark:text-gray-400">Questions per domain:</label>
              <USelect
                v-model="questionsPerDomain"
                :items="[
                  { label: '1 (Quick)', value: 1 },
                  { label: '2 (Standard)', value: 2 },
                  { label: '3 (Thorough)', value: 3 },
                ]"
                value-key="value"
                class="w-32"
              />
            </div>

            <UButton size="lg" @click="handleStartQuiz">
              <UIcon name="i-heroicons-play" class="w-5 h-5 mr-2" />
              Start Quiz
            </UButton>

            <p class="text-xs text-gray-400 dark:text-gray-500 mt-3">
              ~{{ questionsPerDomain * 14 }} questions across 14 domains
            </p>
          </div>
        </div>

        <!-- History panel -->
        <LearnQuizHistory
          :attempts="history.attempts"
          @clear="clearHistory"
        />
      </div>
    </template>

    <!-- Active state: Show current question -->
    <template v-else-if="quizState === 'active' && currentQuestion">
      <LearnQuizQuestion
        :question="currentQuestion"
        :question-number="progress.current"
        :total-questions="progress.total"
        @answer="handleAnswer"
      />

      <!-- Next button -->
      <div v-if="hasAnsweredCurrent" class="flex justify-end">
        <UButton @click="handleNext">
          {{ isLastQuestion ? 'Finish Quiz' : 'Next Question' }}
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
        </UButton>
      </div>
    </template>

    <!-- Finished state: Show results -->
    <template v-else-if="quizState === 'finished'">
      <LearnQuizResults
        :total-questions="results.totalQuestions"
        :correct-answers="results.correctAnswers"
        :domain-scores="results.domainScores"
        :duration="results.duration"
        @restart="handleRestart"
        @close="handleClose"
      />
    </template>
  </div>
</template>
