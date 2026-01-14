import type { RuleType, RuleTrigger } from '../generated/prisma'

export interface Rule {
  id: string
  name: string
  description: string | null
  type: RuleType
  trigger: RuleTrigger
  priority: number
  condition: Record<string, any>
  action: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RuleResult {
  ruleId: string
  ruleName: string
  matched: boolean
  action?: Record<string, any>
  error?: string
  warning?: string
}

export interface EvaluationResult {
  success: boolean
  errors: string[]
  warnings: string[]
  appliedActions: Record<string, any>[]
  requiresApproval: boolean
  results: RuleResult[]
}

export function useRules() {
  const rules = useState<Rule[]>('rules', () => [])
  const loading = useState('rules-loading', () => false)
  const error = useState<string | null>('rules-error', () => null)

  async function fetchRules(type?: RuleType) {
    loading.value = true
    error.value = null
    try {
      const params = type ? `?type=${type}` : ''
      const data = await $fetch<Rule[]>(`/api/rules${params}`)
      rules.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch rules'
    } finally {
      loading.value = false
    }
  }

  async function fetchRule(id: string): Promise<Rule | null> {
    try {
      return await $fetch<Rule>(`/api/rules/${id}`)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch rule'
      return null
    }
  }

  async function createRule(data: {
    name: string
    description?: string
    type: RuleType
    trigger: RuleTrigger
    priority?: number
    condition: Record<string, any>
    action: Record<string, any>
    isActive?: boolean
  }): Promise<Rule | null> {
    try {
      const rule = await $fetch<Rule>('/api/rules', {
        method: 'POST',
        body: data,
      })
      await fetchRules()
      return rule
    } catch (e: any) {
      error.value = e.message || 'Failed to create rule'
      return null
    }
  }

  async function updateRule(
    id: string,
    data: Partial<{
      name: string
      description: string | null
      type: RuleType
      trigger: RuleTrigger
      priority: number
      condition: Record<string, any>
      action: Record<string, any>
      isActive: boolean
    }>
  ): Promise<Rule | null> {
    try {
      const rule = await $fetch<Rule>(`/api/rules/${id}`, {
        method: 'PUT',
        body: data,
      })
      await fetchRules()
      return rule
    } catch (e: any) {
      error.value = e.message || 'Failed to update rule'
      return null
    }
  }

  async function deleteRule(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/rules/${id}`, {
        method: 'DELETE',
      })
      await fetchRules()
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to delete rule'
      return false
    }
  }

  async function evaluateRules(
    trigger: RuleTrigger,
    context: Record<string, any>,
    type?: RuleType
  ): Promise<EvaluationResult | null> {
    try {
      return await $fetch<EvaluationResult>('/api/rules/evaluate', {
        method: 'POST',
        body: { trigger, context, type },
      })
    } catch (e: any) {
      error.value = e.message || 'Failed to evaluate rules'
      return null
    }
  }

  return {
    rules,
    loading,
    error,
    fetchRules,
    fetchRule,
    createRule,
    updateRule,
    deleteRule,
    evaluateRules,
  }
}
