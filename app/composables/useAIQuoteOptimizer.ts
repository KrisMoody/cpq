import { getErrorMessage } from '~/utils/errors'

// =============================================================================
// Types
// =============================================================================

export type RecommendationType = 'ADD_PRODUCT' | 'APPLY_DISCOUNT' | 'ADJUST_QUANTITY' | 'REMOVE_PRODUCT'
export type RecommendationPriority = 'HIGH' | 'MEDIUM' | 'LOW'
export type OptimizationGoal = 'maximize_revenue' | 'maximize_margin' | 'increase_win_probability'
export type AIActionConfirmation = 'always' | 'destructive_only' | 'never'

export interface RecommendationImpact {
  revenueChange?: number
  marginChange?: number
  winProbabilityChange?: number
}

export interface AIRecommendation {
  type: RecommendationType
  productId?: string
  productName?: string
  discountId?: string
  discountName?: string
  quantity?: number
  lineItemId?: string
  reason: string
  impact?: RecommendationImpact
  priority: RecommendationPriority
  confidence: number
}

export interface OptimizationAnalysis {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  risks: string[]
}

export interface OptimizationResponse {
  overallScore: number
  recommendations: AIRecommendation[]
  analysis: OptimizationAnalysis
  summary: string
}

export interface GeneratedLineItem {
  productId: string
  productName: string
  quantity: number
  reason?: string
}

export interface GenerateQuoteResponse {
  suggestedName: string
  lineItems: GeneratedLineItem[]
  summary: string
  estimatedTotal?: number | null
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AIUserSettings {
  confirmActions: AIActionConfirmation
}

// =============================================================================
// Composable
// =============================================================================

export function useAIQuoteOptimizer() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const chatMessages = ref<ChatMessage[]>([])
  const isStreaming = ref(false)
  const streamingContent = ref('')

  // User settings - default to always confirm
  const userSettings = useState<AIUserSettings>('ai-user-settings', () => ({
    confirmActions: 'always',
  }))

  /**
   * Optimize a quote using AI analysis
   */
  async function optimizeQuote(
    quoteId: string,
    options?: {
      goals?: OptimizationGoal[]
      constraints?: {
        maxDiscount?: number
        minMargin?: number
      }
    }
  ): Promise<OptimizationResponse | null> {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<OptimizationResponse>('/api/ai/optimize-quote', {
        method: 'POST',
        body: {
          quoteId,
          goals: options?.goals,
          constraints: options?.constraints,
        },
      })
      return response
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to optimize quote')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Generate a quote from natural language description
   */
  async function generateQuote(
    description: string,
    options?: {
      customerId?: string
      priceBookId?: string
    }
  ): Promise<GenerateQuoteResponse | null> {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<GenerateQuoteResponse>('/api/ai/generate-quote', {
        method: 'POST',
        body: {
          description,
          customerId: options?.customerId,
          priceBookId: options?.priceBookId,
        },
      })
      return response
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to generate quote')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Get AI recommendations for products
   */
  async function getRecommendations(options: {
    quoteId?: string
    customerId?: string
    productIds?: string[]
    context?: string
  }): Promise<{
    recommendations: Array<{
      productId: string
      productName: string
      type: string
      reason: string
      confidence: number
      estimatedValue?: number
    }>
    summary: string
  } | null> {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/ai/recommendations', {
        method: 'POST',
        body: options,
      })
      return response as {
        recommendations: Array<{
          productId: string
          productName: string
          type: string
          reason: string
          confidence: number
          estimatedValue?: number
        }>
        summary: string
      }
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to get recommendations')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Send a chat message and stream the response
   */
  async function sendChatMessage(
    message: string,
    options?: {
      quoteId?: string
      customerId?: string
    }
  ): Promise<void> {
    // Add user message to chat
    chatMessages.value.push({
      role: 'user',
      content: message,
    })

    isStreaming.value = true
    streamingContent.value = ''
    error.value = null

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: chatMessages.value,
          quoteId: options?.quoteId,
          customerId: options?.customerId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No reader available')
      }

      const decoder = new TextDecoder()
      let assistantContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        // Parse the AI SDK data stream format
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('0:')) {
            // Text delta
            try {
              const text = JSON.parse(line.slice(2))
              assistantContent += text
              streamingContent.value = assistantContent
            } catch {
              // Ignore parse errors for incomplete JSON
            }
          }
        }
      }

      // Add assistant message to chat
      if (assistantContent) {
        chatMessages.value.push({
          role: 'assistant',
          content: assistantContent,
        })
      }
    } catch (e: unknown) {
      error.value = getErrorMessage(e, 'Failed to send message')
      // Remove the user message if request failed
      chatMessages.value.pop()
    } finally {
      isStreaming.value = false
      streamingContent.value = ''
    }
  }

  /**
   * Clear chat history
   */
  function clearChat() {
    chatMessages.value = []
    streamingContent.value = ''
  }

  /**
   * Check if action requires confirmation based on user settings
   */
  function requiresConfirmation(recommendationType: RecommendationType): boolean {
    const settings = userSettings.value

    if (settings.confirmActions === 'always') {
      return true
    }

    if (settings.confirmActions === 'never') {
      return false
    }

    // destructive_only
    const destructiveTypes: RecommendationType[] = ['REMOVE_PRODUCT', 'ADJUST_QUANTITY']
    return destructiveTypes.includes(recommendationType)
  }

  /**
   * Update user AI settings
   */
  function updateSettings(settings: Partial<AIUserSettings>) {
    userSettings.value = { ...userSettings.value, ...settings }
  }

  return {
    // State
    loading,
    error,
    chatMessages,
    isStreaming,
    streamingContent,
    userSettings,

    // Methods
    optimizeQuote,
    generateQuote,
    getRecommendations,
    sendChatMessage,
    clearChat,
    requiresConfirmation,
    updateSettings,
  }
}
