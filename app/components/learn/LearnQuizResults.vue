<script setup lang="ts">
import type { QuizDomain } from '~/data/quizQuestions'
import { domainLabels } from '~/data/quizQuestions'

export interface DomainScore {
  domain: QuizDomain
  correct: number
  total: number
}

const props = defineProps<{
  totalQuestions: number
  correctAnswers: number
  domainScores: DomainScore[]
  duration: number // seconds
}>()

const emit = defineEmits<{
  restart: []
  close: []
}>()

const percentage = computed(() => {
  if (props.totalQuestions === 0) return 0
  return Math.round((props.correctAnswers / props.totalQuestions) * 100)
})

const formattedDuration = computed(() => {
  const minutes = Math.floor(props.duration / 60)
  const seconds = props.duration % 60
  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${seconds}s`
})

const scoreColor = computed(() => {
  if (percentage.value >= 80) return 'text-green-500'
  if (percentage.value >= 60) return 'text-yellow-500'
  return 'text-red-500'
})

const scoreMessage = computed(() => {
  if (percentage.value >= 90) return 'Excellent! You really know your CPQ!'
  if (percentage.value >= 80) return 'Great job! You have a solid understanding.'
  if (percentage.value >= 70) return 'Good work! Some areas could use review.'
  if (percentage.value >= 60) return 'Not bad, but there\'s room for improvement.'
  return 'Keep studying! Review the glossary and try again.'
})

// Sort domains by score (lowest first to highlight areas needing review)
const sortedDomainScores = computed(() => {
  return [...props.domainScores].sort((a, b) => {
    const aPercent = a.total > 0 ? a.correct / a.total : 0
    const bPercent = b.total > 0 ? b.correct / b.total : 0
    return aPercent - bPercent
  })
})

function getDomainScoreColor(score: DomainScore) {
  const percent = score.total > 0 ? (score.correct / score.total) * 100 : 0
  if (percent >= 80) return 'text-green-500'
  if (percent >= 60) return 'text-yellow-500'
  return 'text-red-500'
}

function getDomainLabel(domain: QuizDomain) {
  return domainLabels[domain] || domain
}
</script>

<template>
  <div class="space-y-6">
    <!-- Overall score -->
    <div class="text-center">
      <div class="text-6xl font-bold" :class="scoreColor">
        {{ percentage }}%
      </div>
      <div class="text-lg text-ga-gray-700 mt-2">
        {{ correctAnswers }} / {{ totalQuestions }} correct
      </div>
      <div class="text-sm text-ga-gray-600 mt-1">
        Time: {{ formattedDuration }}
      </div>
      <p class="mt-4 text-ga-gray-800">
        {{ scoreMessage }}
      </p>
    </div>

    <!-- Domain breakdown -->
    <div class="border-t border-ga-gray-300 pt-4">
      <h4 class="font-medium mb-3">Score by Domain</h4>
      <div class="space-y-2">
        <div
          v-for="score in sortedDomainScores"
          :key="score.domain"
          class="flex items-center justify-between text-sm"
        >
          <span class="text-ga-gray-700">
            {{ getDomainLabel(score.domain) }}
          </span>
          <span :class="getDomainScoreColor(score)" class="font-medium">
            {{ score.correct }}/{{ score.total }}
          </span>
        </div>
      </div>

      <!-- Areas to review -->
      <div
        v-if="sortedDomainScores.some(s => s.total > 0 && s.correct / s.total < 0.6)"
        class="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
      >
        <p class="text-sm text-yellow-700 font-medium">
          Areas to review:
        </p>
        <ul class="text-sm text-ga-gray-700 mt-1 list-disc list-inside">
          <li
            v-for="score in sortedDomainScores.filter(s => s.total > 0 && s.correct / s.total < 0.6)"
            :key="score.domain"
          >
            {{ getDomainLabel(score.domain) }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 justify-center pt-4 border-t border-ga-gray-300">
      <UButton variant="outline" @click="emit('close')">
        Close
      </UButton>
      <UButton @click="emit('restart')">
        Take Another Quiz
      </UButton>
    </div>
  </div>
</template>
