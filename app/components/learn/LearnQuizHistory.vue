<script setup lang="ts">
import type { QuizAttempt } from '~/composables/useQuiz'

const props = defineProps<{
  attempts: QuizAttempt[]
}>()

const emit = defineEmits<{
  clear: []
}>()

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (minutes === 0) return `${secs}s`
  return `${minutes}m ${secs}s`
}

function getScoreColor(correct: number, total: number) {
  const percent = total > 0 ? (correct / total) * 100 : 0
  if (percent >= 80) return 'text-green-500'
  if (percent >= 60) return 'text-yellow-500'
  return 'text-red-500'
}

const sortedAttempts = computed(() => {
  return [...props.attempts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})

const averageScore = computed(() => {
  if (props.attempts.length === 0) return 0
  const totalCorrect = props.attempts.reduce((sum, a) => sum + a.correctAnswers, 0)
  const totalQuestions = props.attempts.reduce((sum, a) => sum + a.totalQuestions, 0)
  return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
})

const bestScore = computed(() => {
  if (props.attempts.length === 0) return 0
  return Math.max(...props.attempts.map(a =>
    a.totalQuestions > 0 ? Math.round((a.correctAnswers / a.totalQuestions) * 100) : 0
  ))
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h4 class="font-medium">Quiz History</h4>
      <UButton
        v-if="attempts.length > 0"
        variant="ghost"
        size="xs"
        color="neutral"
        @click="emit('clear')"
      >
        Clear History
      </UButton>
    </div>

    <div v-if="attempts.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
      <UIcon name="i-heroicons-clipboard-document-list" class="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p class="text-sm">No quiz attempts yet</p>
      <p class="text-xs">Start a quiz to track your progress!</p>
    </div>

    <template v-else>
      <!-- Stats summary -->
      <div class="grid grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center text-sm">
        <div>
          <div class="text-lg font-semibold">{{ attempts.length }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Attempts</div>
        </div>
        <div>
          <div class="text-lg font-semibold">{{ averageScore }}%</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Average</div>
        </div>
        <div>
          <div class="text-lg font-semibold text-green-500">{{ bestScore }}%</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Best</div>
        </div>
      </div>

      <!-- Recent attempts -->
      <div class="space-y-2 max-h-48 overflow-y-auto">
        <div
          v-for="(attempt, index) in sortedAttempts"
          :key="attempt.id"
          class="flex items-center justify-between p-2 rounded border border-gray-200 dark:border-gray-700 text-sm"
          :class="index === 0 ? 'bg-primary-500/5 border-primary-500/30' : ''"
        >
          <div class="flex items-center gap-2">
            <span class="text-gray-500 dark:text-gray-400 text-xs">
              {{ formatDate(attempt.date) }}
            </span>
            <span v-if="index === 0" class="text-xs bg-primary-500/20 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded">
              Latest
            </span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-400">{{ formatDuration(attempt.duration) }}</span>
            <span :class="getScoreColor(attempt.correctAnswers, attempt.totalQuestions)" class="font-medium">
              {{ attempt.correctAnswers }}/{{ attempt.totalQuestions }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
