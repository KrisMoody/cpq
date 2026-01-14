/**
 * Domain-specific TypeScript types for the CPQ system.
 * These types replace `any` and `unknown` with proper type definitions.
 */

// =============================================================================
// Attribute Types
// =============================================================================

/**
 * An option for SELECT-type attributes
 */
export interface AttributeOption {
  label: string
  value: string
}

/**
 * Constraints for NUMBER-type attributes
 */
export interface NumberConstraints {
  min?: number
  max?: number
  step?: number
}

/**
 * Constraints for TEXT-type attributes
 */
export interface TextConstraints {
  minLength?: number
  maxLength?: number
  pattern?: string
}

/**
 * Constraints for DATE-type attributes
 */
export interface DateConstraints {
  minDate?: string
  maxDate?: string
}

/**
 * Union of all attribute constraint types
 */
export type AttributeConstraints = NumberConstraints | TextConstraints | DateConstraints | null

/**
 * Valid attribute value types stored in ProductAttribute.value
 */
export type AttributeValue = string | number | boolean | null

// =============================================================================
// Rule Engine Types
// =============================================================================

/**
 * Comparison operators for rule conditions
 */
export type ConditionOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in'

/**
 * Logical operators for compound conditions
 */
export type LogicalOperator = 'and' | 'or' | 'not'

/**
 * A condition expression used in rules.
 * Can be a simple field comparison or a compound condition.
 */
export interface ConditionExpression {
  /** Field name to compare (supports dot notation: 'productAttributes.color') */
  field?: string
  /** Comparison operator */
  op?: ConditionOperator
  /** Value to compare against */
  value?: string | number | boolean | string[]
  /** Logical operator for compound conditions */
  operator?: LogicalOperator
  /** Nested conditions for compound expressions */
  conditions?: ConditionExpression[]
}

/**
 * Rule action types
 */
export type ActionType =
  | 'REQUIRE_OPTION'
  | 'EXCLUDE_OPTION'
  | 'REQUIRE_PRODUCT'
  | 'EXCLUDE_PRODUCT'
  | 'SHOW_WARNING'
  | 'APPLY_DISCOUNT'
  | 'APPLY_MARKUP'
  | 'SET_PRICE'
  | 'REQUIRE_APPROVAL'
  | 'REQUIRE'
  | 'SUGGEST'
  | 'NOTIFY'

/**
 * Scope for pricing actions
 */
export type ActionScope = 'LINE_ITEM' | 'QUOTE'

/**
 * Context object passed to rule evaluation.
 * Contains known fields plus dynamic attribute values.
 */
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

// =============================================================================
// Quote/Pricing Types
// =============================================================================

/**
 * A tax breakdown item showing individual tax components
 */
export interface TaxBreakdownItem {
  name: string
  /** Decimal rate (e.g., 0.0825 for 8.25%) */
  rate: number
  amount: number
}

/**
 * Quote metrics for recurring revenue calculations
 */
export interface QuoteMetrics {
  /** Sum of one-time line items */
  oneTimeTotal: number
  /** Monthly Recurring Revenue */
  mrr: number
  /** Annual Recurring Revenue (mrr × 12) */
  arr: number
  /** Total Contract Value */
  tcv: number
}

// =============================================================================
// Guided Selling Types
// =============================================================================

/**
 * Branch logic for questionnaire steps
 */
export interface BranchLogic {
  conditions?: ConditionExpression[]
  defaultNextStep?: string
  branches?: Array<{
    condition: ConditionExpression
    nextStepId: string
  }>
}

/**
 * Answer option for a questionnaire question
 */
export interface AnswerOption {
  id: string
  label: string
  value: string
  imageUrl?: string
  description?: string
}

// =============================================================================
// Type Guards
// =============================================================================

/**
 * Type guard to check if a value is an AttributeOption
 */
export function isAttributeOption(obj: unknown): obj is AttributeOption {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'label' in obj &&
    typeof (obj as AttributeOption).label === 'string' &&
    'value' in obj &&
    typeof (obj as AttributeOption).value === 'string'
  )
}

/**
 * Type guard to check if an array contains AttributeOptions
 */
export function isAttributeOptionArray(arr: unknown): arr is AttributeOption[] {
  return Array.isArray(arr) && arr.every(isAttributeOption)
}

/**
 * Type guard to check if a value is a valid AttributeValue
 */
export function isAttributeValue(val: unknown): val is AttributeValue {
  return val === null || typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean'
}

/**
 * Type guard for NumberConstraints
 */
export function isNumberConstraints(obj: unknown): obj is NumberConstraints {
  if (typeof obj !== 'object' || obj === null) return false
  const c = obj as NumberConstraints
  return (
    (c.min === undefined || typeof c.min === 'number') &&
    (c.max === undefined || typeof c.max === 'number') &&
    (c.step === undefined || typeof c.step === 'number')
  )
}

/**
 * Type guard for TextConstraints
 */
export function isTextConstraints(obj: unknown): obj is TextConstraints {
  if (typeof obj !== 'object' || obj === null) return false
  const c = obj as TextConstraints
  return (
    (c.minLength === undefined || typeof c.minLength === 'number') &&
    (c.maxLength === undefined || typeof c.maxLength === 'number') &&
    (c.pattern === undefined || typeof c.pattern === 'string')
  )
}

/**
 * Type guard for ConditionExpression
 */
export function isConditionExpression(obj: unknown): obj is ConditionExpression {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false
  const c = obj as Record<string, unknown>

  // A compound condition has an operator
  if ('operator' in c) {
    return (
      (c.operator === 'and' || c.operator === 'or' || c.operator === 'not') &&
      (!('conditions' in c) || (Array.isArray(c.conditions) && c.conditions.every(isConditionExpression)))
    )
  }

  // A simple condition has field and op
  if ('field' in c && 'op' in c) {
    return typeof c.field === 'string' && typeof c.op === 'string'
  }

  // Empty condition is valid (matches everything)
  return Object.keys(c).length === 0
}

/**
 * Type guard for TaxBreakdownItem
 */
export function isTaxBreakdownItem(obj: unknown): obj is TaxBreakdownItem {
  if (typeof obj !== 'object' || obj === null) return false
  const t = obj as TaxBreakdownItem
  return typeof t.name === 'string' && typeof t.rate === 'number' && typeof t.amount === 'number'
}

/**
 * Type guard for TaxBreakdownItem array
 */
export function isTaxBreakdownArray(arr: unknown): arr is TaxBreakdownItem[] {
  return Array.isArray(arr) && arr.every(isTaxBreakdownItem)
}
