import type {
  Questionnaire,
  Question,
  QuestionProductMapping,
  Product,
  QuestionType,
} from '../../app/generated/prisma/client'

export interface QuestionWithMappings extends Question {
  productMappings: Array<QuestionProductMapping & { product: Product }>
}

export interface QuestionnaireWithQuestions extends Questionnaire {
  questions: QuestionWithMappings[]
}

export interface QuestionOption {
  label: string
  value: string
}

export interface Answer {
  questionId: string
  value: string | string[] // string[] for MULTIPLE_CHOICE
}

export interface ProductScore {
  product: Product
  score: number
  matchedQuestions: string[]
}

/**
 * Get the next question in a questionnaire based on current answers
 */
export function getNextQuestion(
  questionnaire: QuestionnaireWithQuestions,
  answers: Answer[]
): QuestionWithMappings | null {
  const answeredIds = new Set(answers.map((a) => a.questionId))
  const sortedQuestions = [...questionnaire.questions].sort((a, b) => a.sortOrder - b.sortOrder)

  // Check for branch logic from the last answer
  const lastAnswer = answers.at(-1)
  if (lastAnswer) {
    const lastQuestion = questionnaire.questions.find((q) => q.id === lastAnswer.questionId)

    if (lastQuestion?.branchLogic) {
      const branchLogic = lastQuestion.branchLogic as unknown
      const answerValue = Array.isArray(lastAnswer.value) ? lastAnswer.value[0] : lastAnswer.value

      // Type guard for branch logic object
      if (typeof branchLogic !== 'object' || branchLogic === null || answerValue === undefined) {
        return sortedQuestions.find((q) => !answeredIds.has(q.id)) || null
      }
      const nextQuestionId = (branchLogic as Record<string, unknown>)[answerValue]

      if (typeof nextQuestionId === 'string') {
        const branchedQuestion = questionnaire.questions.find((q) => q.id === nextQuestionId)
        if (branchedQuestion && !answeredIds.has(branchedQuestion.id)) {
          return branchedQuestion
        }
      }
    }
  }

  // Otherwise, get next unanswered question in order
  return sortedQuestions.find((q) => !answeredIds.has(q.id)) || null
}

/**
 * Calculate product scores based on questionnaire answers
 */
export function calculateProductScores(
  questionnaire: QuestionnaireWithQuestions,
  answers: Answer[]
): ProductScore[] {
  const productScores = new Map<string, { score: number; matchedQuestions: string[]; product: Product }>()

  for (const answer of answers) {
    const question = questionnaire.questions.find((q) => q.id === answer.questionId)
    if (!question) continue

    const answerValues = Array.isArray(answer.value) ? answer.value : [answer.value]

    for (const answerValue of answerValues) {
      // Find mappings that match this answer
      const matchingMappings = question.productMappings.filter(
        (m) => m.answerValue === answerValue
      )

      for (const mapping of matchingMappings) {
        const existing = productScores.get(mapping.productId)
        if (existing) {
          existing.score += mapping.score
          if (!existing.matchedQuestions.includes(question.text)) {
            existing.matchedQuestions.push(question.text)
          }
        } else {
          productScores.set(mapping.productId, {
            score: mapping.score,
            matchedQuestions: [question.text],
            product: mapping.product,
          })
        }
      }
    }
  }

  // Convert to array and sort by score descending
  return Array.from(productScores.values())
    .map(({ score, matchedQuestions, product }) => ({ product, score, matchedQuestions }))
    .sort((a, b) => b.score - a.score)
}

/**
 * Get progress through questionnaire
 */
export function getQuestionnaireProgress(
  questionnaire: QuestionnaireWithQuestions,
  answers: Answer[]
): { current: number; total: number; percentage: number } {
  const total = questionnaire.questions.length
  const current = answers.length
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return { current, total, percentage }
}

/**
 * Type guard for QuestionOption
 */
function isQuestionOption(obj: unknown): obj is QuestionOption {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'label' in obj &&
    typeof (obj as QuestionOption).label === 'string' &&
    'value' in obj &&
    typeof (obj as QuestionOption).value === 'string'
  )
}

/**
 * Parse question options from JSON
 */
export function parseQuestionOptions(question: Question): QuestionOption[] {
  if (!question.options) return []

  const options = question.options as unknown
  if (Array.isArray(options) && options.every(isQuestionOption)) {
    return options
  }
  return []
}

/**
 * Get default options for question types that don't need custom options
 */
export function getDefaultOptions(type: QuestionType): QuestionOption[] {
  if (type === 'YES_NO') {
    return [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ]
  }
  return []
}

/**
 * Validate an answer against a question
 */
export function validateAnswer(question: Question, value: string | string[]): boolean {
  const options = parseQuestionOptions(question)
  const defaultOpts = getDefaultOptions(question.type)
  const allOptions = [...options, ...defaultOpts]
  const validValues = new Set(allOptions.map((o) => o.value))

  if (question.type === 'MULTIPLE_CHOICE') {
    if (!Array.isArray(value)) return false
    return value.every((v) => validValues.has(v))
  }

  if (question.type === 'RANGE') {
    // Range values are typically numeric strings
    const num = parseFloat(value as string)
    return !isNaN(num)
  }

  if (question.type === 'YES_NO') {
    return value === 'yes' || value === 'no'
  }

  // SINGLE_CHOICE
  return validValues.has(value as string)
}

/**
 * Build a questionnaire session state
 */
export interface QuestionnaireSession {
  questionnaireId: string
  answers: Answer[]
  currentQuestion: QuestionWithMappings | null
  progress: { current: number; total: number; percentage: number }
  isComplete: boolean
  results: ProductScore[]
}

export function createSession(questionnaire: QuestionnaireWithQuestions): QuestionnaireSession {
  return {
    questionnaireId: questionnaire.id,
    answers: [],
    currentQuestion: getNextQuestion(questionnaire, []),
    progress: getQuestionnaireProgress(questionnaire, []),
    isComplete: false,
    results: [],
  }
}

export function submitAnswer(
  questionnaire: QuestionnaireWithQuestions,
  session: QuestionnaireSession,
  questionId: string,
  value: string | string[]
): QuestionnaireSession {
  const question = questionnaire.questions.find((q) => q.id === questionId)
  if (!question) return session

  if (!validateAnswer(question, value)) return session

  const newAnswers = [...session.answers, { questionId, value }]
  const nextQuestion = getNextQuestion(questionnaire, newAnswers)
  const progress = getQuestionnaireProgress(questionnaire, newAnswers)
  const isComplete = nextQuestion === null
  const results = isComplete ? calculateProductScores(questionnaire, newAnswers) : []

  return {
    ...session,
    answers: newAnswers,
    currentQuestion: nextQuestion,
    progress,
    isComplete,
    results,
  }
}
