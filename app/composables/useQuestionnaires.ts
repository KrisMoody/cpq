import type { QuestionType } from '../generated/prisma/client.js'
import type { ProductSummary } from '../types/cpq'

export interface QuestionOption {
  label: string
  value: string
}

export interface QuestionProductMapping {
  id: string
  questionId: string
  answerValue: string
  productId: string
  score: number
  product: ProductSummary
}

export interface Question {
  id: string
  questionnaireId: string
  text: string
  type: QuestionType
  options: QuestionOption[] | null
  sortOrder: number
  branchLogic: Record<string, string> | null
  createdAt: string
  updatedAt: string
  productMappings: QuestionProductMapping[]
}

export interface Questionnaire {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  questions: Question[]
  questionCount?: number
}

export function useQuestionnaires() {
  const questionnaires = useState<Questionnaire[]>('questionnaires', () => [])
  const loading = useState('questionnaires-loading', () => false)
  const error = useState<string | null>('questionnaires-error', () => null)

  async function fetchQuestionnaires(includeInactive = false) {
    loading.value = true
    error.value = null
    try {
      const params = includeInactive ? '?includeInactive=true' : ''
      const data = await $fetch<Questionnaire[]>(`/api/questionnaires${params}`)
      questionnaires.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch questionnaires'
    } finally {
      loading.value = false
    }
  }

  async function fetchQuestionnaire(id: string): Promise<Questionnaire | null> {
    try {
      return await $fetch<Questionnaire>(`/api/questionnaires/${id}`)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch questionnaire'
      return null
    }
  }

  async function createQuestionnaire(data: {
    name: string
    description?: string
    isActive?: boolean
  }): Promise<Questionnaire | null> {
    try {
      const questionnaire = await $fetch<Questionnaire>('/api/questionnaires', {
        method: 'POST',
        body: data,
      })
      await fetchQuestionnaires()
      return questionnaire
    } catch (e: any) {
      error.value = e.message || 'Failed to create questionnaire'
      return null
    }
  }

  async function updateQuestionnaire(
    id: string,
    data: Partial<{
      name: string
      description: string | null
      isActive: boolean
    }>
  ): Promise<Questionnaire | null> {
    try {
      const questionnaire = await $fetch<Questionnaire>(`/api/questionnaires/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchQuestionnaires()
      return questionnaire
    } catch (e: any) {
      error.value = e.message || 'Failed to update questionnaire'
      return null
    }
  }

  async function deleteQuestionnaire(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/questionnaires/${id}`, {
        method: 'DELETE',
      })
      await fetchQuestionnaires()
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to delete questionnaire'
      return false
    }
  }

  async function addQuestion(
    questionnaireId: string,
    data: {
      text: string
      type: QuestionType
      options?: QuestionOption[]
      sortOrder?: number
      branchLogic?: Record<string, string>
    }
  ): Promise<Question | null> {
    try {
      return await $fetch<Question>(`/api/questionnaires/${questionnaireId}/questions`, {
        method: 'POST',
        body: data,
      })
    } catch (e: any) {
      error.value = e.message || 'Failed to add question'
      return null
    }
  }

  async function updateQuestion(
    questionnaireId: string,
    questionId: string,
    data: Partial<{
      text: string
      type: QuestionType
      options: QuestionOption[] | null
      sortOrder: number
      branchLogic: Record<string, string> | null
    }>
  ): Promise<Question | null> {
    try {
      return await $fetch<Question>(`/api/questionnaires/${questionnaireId}/questions/${questionId}`, {
        method: 'PUT',
        body: data,
      })
    } catch (e: any) {
      error.value = e.message || 'Failed to update question'
      return null
    }
  }

  async function deleteQuestion(questionnaireId: string, questionId: string): Promise<boolean> {
    try {
      await $fetch(`/api/questionnaires/${questionnaireId}/questions/${questionId}`, {
        method: 'DELETE',
      })
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to delete question'
      return false
    }
  }

  async function addProductMapping(
    questionnaireId: string,
    questionId: string,
    data: {
      answerValue: string
      productId: string
      score?: number
    }
  ): Promise<QuestionProductMapping | null> {
    try {
      return await $fetch<QuestionProductMapping>(
        `/api/questionnaires/${questionnaireId}/questions/${questionId}/mappings`,
        {
          method: 'POST',
          body: data,
        }
      )
    } catch (e: any) {
      error.value = e.message || 'Failed to add product mapping'
      return null
    }
  }

  async function deleteProductMapping(
    questionnaireId: string,
    questionId: string,
    mappingId: string
  ): Promise<boolean> {
    try {
      await $fetch(
        `/api/questionnaires/${questionnaireId}/questions/${questionId}/mappings/${mappingId}`,
        { method: 'DELETE' }
      )
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to delete product mapping'
      return false
    }
  }

  return {
    questionnaires,
    loading,
    error,
    fetchQuestionnaires,
    fetchQuestionnaire,
    createQuestionnaire,
    updateQuestionnaire,
    deleteQuestionnaire,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addProductMapping,
    deleteProductMapping,
  }
}
