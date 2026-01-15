import type { QuizDomain, QuizQuestion } from '~/data/quizQuestions'
import { getAvailableDomains, quizQuestions } from '~/data/quizQuestions'

export interface QuizAttempt {
  id: string
  date: string
  totalQuestions: number
  correctAnswers: number
  duration: number
  domainScores: Record<string, { correct: number; total: number }>
}

export interface QuizStorage {
  attempts: QuizAttempt[]
  lastAttemptDate: string | null
}

const STORAGE_KEY = 'cpq-quiz-history'
const MAX_ATTEMPTS = 10

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j] as T
    shuffled[j] = temp as T
  }
  return shuffled
}

export function useQuiz() {
  // State
  const quizState = ref<'idle' | 'active' | 'finished'>('idle')
  const currentQuestions = ref<QuizQuestion[]>([])
  const currentQuestionIndex = ref(0)
  const answers = ref<Map<string, number[]>>(new Map())
  const startTime = ref<number>(0)

  // Load history from localStorage
  const history = ref<QuizStorage>({
    attempts: [],
    lastAttemptDate: null,
  })

  function loadHistory() {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          history.value = JSON.parse(stored)
        }
      } catch {
        console.warn('Failed to load quiz history')
      }
    }
  }

  function saveHistory() {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
      } catch {
        console.warn('Failed to save quiz history')
      }
    }
  }

  // Initialize on mount
  onMounted(() => {
    loadHistory()
  })

  // Generate quiz questions (1-3 random per domain)
  function generateQuiz(questionsPerDomain: number = 2): QuizQuestion[] {
    const domains = getAvailableDomains()
    const selected: QuizQuestion[] = []

    for (const domain of domains) {
      const domainQuestions = quizQuestions.filter(q => q.domain === domain)
      const shuffled = shuffleArray(domainQuestions)
      const count = Math.min(questionsPerDomain, shuffled.length)
      selected.push(...shuffled.slice(0, count))
    }

    return shuffleArray(selected)
  }

  // Start a new quiz
  function startQuiz(questionsPerDomain: number = 2) {
    currentQuestions.value = generateQuiz(questionsPerDomain)
    currentQuestionIndex.value = 0
    answers.value = new Map()
    startTime.value = Date.now()
    quizState.value = 'active'
  }

  // Submit answer for current question
  function submitAnswer(selectedAnswers: number[]) {
    const question = currentQuestions.value[currentQuestionIndex.value]
    if (question) {
      answers.value.set(question.id, selectedAnswers)
    }
  }

  // Move to next question
  function nextQuestion() {
    if (currentQuestionIndex.value < currentQuestions.value.length - 1) {
      currentQuestionIndex.value++
    } else {
      finishQuiz()
    }
  }

  // Check if answer is correct
  function isAnswerCorrect(questionId: string): boolean {
    const question = currentQuestions.value.find(q => q.id === questionId)
    const answer = answers.value.get(questionId)
    if (!question || !answer) return false

    const correct = question.correctAnswers
    if (answer.length !== correct.length) return false
    return correct.every(i => answer.includes(i)) && answer.every(i => correct.includes(i))
  }

  // Calculate results
  const results = computed(() => {
    const domainScores: Record<string, { correct: number; total: number }> = {}

    for (const question of currentQuestions.value) {
      let score = domainScores[question.domain]
      if (!score) {
        score = { correct: 0, total: 0 }
        domainScores[question.domain] = score
      }
      score.total++
      if (isAnswerCorrect(question.id)) {
        score.correct++
      }
    }

    const totalQuestions = currentQuestions.value.length
    const correctAnswers = Object.values(domainScores).reduce((sum, d) => sum + d.correct, 0)
    const duration = Math.floor((Date.now() - startTime.value) / 1000)

    return {
      totalQuestions,
      correctAnswers,
      duration,
      domainScores: Object.entries(domainScores).map(([domain, scores]) => ({
        domain: domain as QuizDomain,
        ...scores,
      })),
    }
  })

  // Finish quiz and save to history
  function finishQuiz() {
    const attempt: QuizAttempt = {
      id: generateId(),
      date: new Date().toISOString(),
      totalQuestions: results.value.totalQuestions,
      correctAnswers: results.value.correctAnswers,
      duration: results.value.duration,
      domainScores: results.value.domainScores.reduce(
        (acc, d) => {
          acc[d.domain] = { correct: d.correct, total: d.total }
          return acc
        },
        {} as Record<string, { correct: number; total: number }>
      ),
    }

    history.value.attempts.unshift(attempt)
    history.value.lastAttemptDate = attempt.date

    // Keep only last MAX_ATTEMPTS
    if (history.value.attempts.length > MAX_ATTEMPTS) {
      history.value.attempts = history.value.attempts.slice(0, MAX_ATTEMPTS)
    }

    saveHistory()
    quizState.value = 'finished'
  }

  // Reset to idle state
  function resetQuiz() {
    quizState.value = 'idle'
    currentQuestions.value = []
    currentQuestionIndex.value = 0
    answers.value = new Map()
  }

  // Clear history
  function clearHistory() {
    history.value = {
      attempts: [],
      lastAttemptDate: null,
    }
    saveHistory()
  }

  // Computed values
  const currentQuestion = computed(() => currentQuestions.value[currentQuestionIndex.value])
  const isLastQuestion = computed(() => currentQuestionIndex.value >= currentQuestions.value.length - 1)
  const progress = computed(() => ({
    current: currentQuestionIndex.value + 1,
    total: currentQuestions.value.length,
  }))

  return {
    // State
    quizState,
    currentQuestion,
    currentQuestionIndex,
    currentQuestions,
    history,
    results,
    progress,
    isLastQuestion,

    // Actions
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz,
    clearHistory,
    isAnswerCorrect,
  }
}
