import type { Rule, RuleTrigger, RuleType, Prisma } from '../../app/generated/prisma/client.js'
import type { AttributeValue } from '../../app/types/domain.js'
import { getErrorMessage } from '../../app/utils/errors.js'

type JsonValue = Prisma.JsonValue

export interface RuleContext {
  productId?: string
  productSku?: string
  quantity?: number
  lineTotal?: number
  quoteTotal?: number
  customerId?: string
  optionId?: string
  discountPercentage?: number
  /** Product attributes keyed by attribute code */
  productAttributes?: Record<string, AttributeValue>
  /** Allow additional dynamic fields */
  [key: string]: unknown
}

/** Comparison operators for rule conditions */
export type ConditionOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in'

/** Logical operators for compound conditions */
export type LogicalOperator = 'and' | 'or' | 'not'

/** Valid condition value types */
export type ConditionValue = string | number | boolean | string[]

export interface ConditionExpression {
  field?: string
  op?: ConditionOperator
  value?: ConditionValue
  operator?: LogicalOperator
  conditions?: ConditionExpression[]
}

export interface ActionExpression {
  type: 'REQUIRE_OPTION' | 'EXCLUDE_OPTION' | 'REQUIRE_PRODUCT' | 'EXCLUDE_PRODUCT' |
        'SHOW_WARNING' | 'APPLY_DISCOUNT' | 'APPLY_MARKUP' | 'SET_PRICE' | 'REQUIRE_APPROVAL' |
        'REQUIRE' | 'SUGGEST' | 'NOTIFY'
  targetId?: string
  discountId?: string
  value?: number
  message?: string
  scope?: 'LINE_ITEM' | 'QUOTE'
  products?: string[]
  approverRole?: string
}

/**
 * Safely parse a JSON value as a ConditionExpression
 */
function parseCondition(json: JsonValue): ConditionExpression | null {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return null
  return json as unknown as ConditionExpression
}

/**
 * Safely parse a JSON value as an ActionExpression
 */
function parseAction(json: JsonValue): ActionExpression | null {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return null
  const obj = json as Record<string, unknown>
  if (typeof obj.type !== 'string') return null
  return obj as unknown as ActionExpression
}

/**
 * Get a nested value from an object using dot notation
 * e.g., getNestedValue({ productAttributes: { color: 'red' } }, 'productAttributes.color') => 'red'
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    if (typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return current
}

export interface RuleResult {
  ruleId: string
  ruleName: string
  matched: boolean
  action?: ActionExpression
  error?: string
  warning?: string
}

export interface EvaluationResult {
  success: boolean
  errors: string[]
  warnings: string[]
  appliedActions: ActionExpression[]
  requiresApproval: boolean
  results: RuleResult[]
}

/**
 * Evaluate a single condition against a context
 */
function evaluateCondition(condition: ConditionExpression, context: RuleContext): boolean {
  // Handle compound conditions
  if (condition.operator) {
    const { operator, conditions } = condition
    if (!conditions || conditions.length === 0) return true

    switch (operator) {
      case 'and':
        return conditions.every((c) => evaluateCondition(c, context))
      case 'or':
        return conditions.some((c) => evaluateCondition(c, context))
      case 'not':
        return conditions[0] ? !evaluateCondition(conditions[0], context) : true
      default:
        return false
    }
  }

  // Handle simple field comparisons
  const { field, op, value } = condition
  if (!field || !op) return false

  // Support nested field access (e.g., "productAttributes.color" or "product.warranty")
  const contextValue = getNestedValue(context, field)

  switch (op) {
    case 'eq':
      return contextValue === value
    case 'neq':
      return contextValue !== value
    case 'gt':
      return typeof contextValue === 'number' && typeof value === 'number' && contextValue > value
    case 'lt':
      return typeof contextValue === 'number' && typeof value === 'number' && contextValue < value
    case 'gte':
      return typeof contextValue === 'number' && typeof value === 'number' && contextValue >= value
    case 'lte':
      return typeof contextValue === 'number' && typeof value === 'number' && contextValue <= value
    case 'contains':
      return typeof contextValue === 'string' && typeof value === 'string' && contextValue.includes(value)
    case 'in':
      return Array.isArray(value) && value.includes(contextValue as string)
    default:
      return false
  }
}

/**
 * Evaluate a single rule against a context
 */
export function evaluateRule(rule: Rule, context: RuleContext): RuleResult {
  const result: RuleResult = {
    ruleId: rule.id,
    ruleName: rule.name,
    matched: false,
  }

  try {
    const condition = parseCondition(rule.condition)
    if (!condition) {
      result.error = `Invalid condition format for rule: ${rule.name}`
      return result
    }

    const matched = evaluateCondition(condition, context)
    result.matched = matched

    if (matched) {
      const action = parseAction(rule.action)
      if (!action) {
        result.error = `Invalid action format for rule: ${rule.name}`
        return result
      }
      result.action = action

      if (action.type === 'SHOW_WARNING' || action.type === 'NOTIFY') {
        result.warning = action.message || `Warning from rule: ${rule.name}`
      }
    }
  } catch (e: unknown) {
    result.error = `Error evaluating rule: ${getErrorMessage(e)}`
  }

  return result
}

/**
 * Evaluate all rules of a specific trigger against a context
 */
export function evaluateRules(
  rules: Rule[],
  trigger: RuleTrigger,
  context: RuleContext,
  type?: RuleType
): EvaluationResult {
  const result: EvaluationResult = {
    success: true,
    errors: [],
    warnings: [],
    appliedActions: [],
    requiresApproval: false,
    results: [],
  }

  // Filter and sort rules by trigger, type, and priority
  const applicableRules = rules
    .filter((r) => r.isActive && r.trigger === trigger && (!type || r.type === type))
    .sort((a, b) => a.priority - b.priority)

  for (const rule of applicableRules) {
    const ruleResult = evaluateRule(rule, context)
    result.results.push(ruleResult)

    if (ruleResult.error) {
      result.errors.push(ruleResult.error)
      continue
    }

    if (ruleResult.matched && ruleResult.action) {
      result.appliedActions.push(ruleResult.action)

      // Handle specific action types
      switch (ruleResult.action.type) {
        case 'REQUIRE_OPTION':
        case 'REQUIRE_PRODUCT':
        case 'REQUIRE':
          // These will be validated elsewhere
          break
        case 'EXCLUDE_OPTION':
        case 'EXCLUDE_PRODUCT':
          result.errors.push(`${rule.name}: ${ruleResult.action.message || 'Selection not allowed'}`)
          result.success = false
          break
        case 'SHOW_WARNING':
        case 'NOTIFY':
        case 'SUGGEST':
          if (ruleResult.warning) {
            result.warnings.push(ruleResult.warning)
          }
          break
        case 'REQUIRE_APPROVAL':
          result.requiresApproval = true
          result.warnings.push(`Approval required: ${ruleResult.action.message || rule.name}`)
          break
      }
    }
  }

  return result
}

/**
 * Get all configuration rule results for validation feedback
 */
export function validateConfiguration(
  rules: Rule[],
  context: RuleContext
): EvaluationResult {
  return evaluateRules(rules, 'ON_PRODUCT_ADD', context, 'CONFIGURATION')
}

/**
 * Get all pricing rule results
 */
export function evaluatePricingRules(
  rules: Rule[],
  trigger: RuleTrigger,
  context: RuleContext
): EvaluationResult {
  return evaluateRules(rules, trigger, context, 'PRICING')
}
