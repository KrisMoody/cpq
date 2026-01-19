# Design: Type Safety Improvements

## Context

This project uses:
- **Nuxt 4** with TypeScript strict mode
- **Prisma** with generated types for database models
- **Vue 3 Composition API** with `<script setup>`

TypeScript strict mode is already enabled with good settings, but escape hatches (`any`, `as`) have accumulated. This document outlines patterns to replace them.

## Goals

- Eliminate `any` types throughout the codebase
- Minimize `as` assertions to only truly necessary cases
- Establish consistent nullish value handling
- Create reusable patterns for common type challenges

## Non-Goals

- Changing runtime behavior (type-only changes)
- Modifying Prisma schema or database structure
- Adding runtime validation libraries (use native TypeScript narrowing)

## Decisions

### 1. Error Handling Pattern

**Decision**: Replace `catch (e: any)` with `catch (e: unknown)` + type guard utility.

**Rationale**: TypeScript 4.4+ supports `catch (e: unknown)`. Using `any` defeats the purpose of type checking. A small utility function provides consistent error message extraction.

**Pattern**:
```typescript
// utils/errors.ts
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object') {
    // Handle Nuxt/H3 error format
    const e = error as { data?: { message?: string }; message?: string }
    return e.data?.message || e.message || 'An unknown error occurred'
  }
  return 'An unknown error occurred'
}

// Usage
} catch (e: unknown) {
  error.value = getErrorMessage(e)
}
```

**Alternatives considered**:
- `catch (e)` without type annotation - works but less explicit
- Runtime error validation library - over-engineering for this use case

### 2. Prisma JSON Field Types

**Decision**: Create domain-specific interfaces for each JSON field pattern.

**Rationale**: Prisma's `JsonValue` is intentionally loose. We know the actual shapes stored in each JSON field.

**Pattern**:
```typescript
// types/domain.ts

// For Attribute.options field
export interface AttributeOption {
  label: string
  value: string
}

// For Attribute.constraints field
export interface NumberConstraints {
  min?: number
  max?: number
}

export interface TextConstraints {
  minLength?: number
  maxLength?: number
}

export type AttributeConstraints = NumberConstraints | TextConstraints

// For Rule.condition field
export interface ConditionExpression {
  field?: string
  op?: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in'
  value?: string | number | boolean | string[]
  operator?: 'and' | 'or' | 'not'
  conditions?: ConditionExpression[]
}

// For Rule.action field (already defined in ruleEngine.ts)
```

**Migration**: Create type guards to validate JSON at runtime boundaries:
```typescript
function isAttributeOption(obj: unknown): obj is AttributeOption {
  return typeof obj === 'object' && obj !== null
    && 'label' in obj && typeof obj.label === 'string'
    && 'value' in obj && typeof obj.value === 'string'
}
```

### 3. Dynamic Context Objects (RuleContext)

**Decision**: Use index signature with `unknown` + type narrowing, not `any`.

**Rationale**: `RuleContext` intentionally accepts dynamic fields. Using `unknown` preserves flexibility while requiring explicit narrowing.

**Pattern**:
```typescript
export interface RuleContext {
  // Known fields
  productId?: string
  quantity?: number
  lineTotal?: number
  // Dynamic fields (product attributes, etc.)
  [key: string]: unknown
}

// Accessor with narrowing
function getContextValue(ctx: RuleContext, key: string): unknown {
  return ctx[key]
}

function getContextNumber(ctx: RuleContext, key: string): number | undefined {
  const val = ctx[key]
  return typeof val === 'number' ? val : undefined
}
```

### 4. Route Parameter Handling

**Decision**: Create validated route param composable.

**Rationale**: `route.params.id as string` is unsafe - params could be arrays or undefined. Nuxt doesn't generate proper types for dynamic routes.

**Pattern**:
```typescript
// composables/useRouteParams.ts
export function useRequiredParam(name: string): string {
  const route = useRoute()
  const param = route.params[name]
  if (typeof param !== 'string' || !param) {
    throw createError({
      statusCode: 400,
      message: `Missing required route parameter: ${name}`
    })
  }
  return param
}

// Usage in pages
const productId = useRequiredParam('id')
```

### 5. Enum Type Assertions in Reactive State

**Decision**: Use imported enum values directly instead of string literals with `as`.

**Current problematic pattern**:
```typescript
const form = reactive({
  type: 'STANDALONE' as ProductType,  // Assertion needed
})
```

**Improved pattern**:
```typescript
import { ProductType } from '~/generated/prisma/client'

const form = reactive({
  type: ProductType.STANDALONE,  // No assertion needed
})
```

### 6. Component Props with Dynamic Types

**Decision**: Use generics for components that accept multiple value types.

**Example**: `AttributeInput` component accepts `any` because attribute values vary by type.

**Pattern**:
```typescript
// AttributeInput.vue
interface Props {
  attribute: Attribute
  modelValue: AttributeValue  // Union type instead of any
}

type AttributeValue = string | number | boolean | null
```

### 7. Nullish Value Conventions

**Decision**: Establish clear boundaries.

| Layer | "No value" | "Not provided" |
|-------|------------|----------------|
| Database (Prisma) | `null` | Field omitted |
| API Request Body | `null` or omit | N/A |
| API Response | `null` | N/A |
| Vue Refs | `null` | Initial `null` |
| Form State | `null` | `undefined` (before user interaction) |
| Empty Inputs | Convert to `null` | N/A |

**Rule**: Never use empty string (`''`) to mean "no value" for non-string fields.

**Utility for form submission**:
```typescript
function cleanFormData<T extends object>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, v === '' ? null : v])
  ) as T
}
```

### 8. Prisma Query Builder Types

**Decision**: Use Prisma's generated `WhereInput` types.

**Current problematic pattern**:
```typescript
const where: any = {}
if (filter) where.status = filter
```

**Improved pattern**:
```typescript
import type { Prisma } from '~/generated/prisma/client'

const where: Prisma.ProductWhereInput = {}
if (filter) where.status = filter
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Verbose type guards for JSON | Create once, reuse; guards also provide runtime safety |
| Some `as` assertions truly needed | Document with inline comment explaining why |
| Migration scope is large | Incremental approach: composables → services → pages |
| Breaking IDE during migration | Make atomic commits that keep builds passing |

## Migration Plan

### Phase 1: Foundation (Non-breaking)
1. Create `types/domain.ts` with shared type definitions
2. Create `utils/errors.ts` with error handling utility
3. Create `composables/useRouteParams.ts` for validated params

### Phase 2: Services (Server-side)
1. Update `ruleEngine.ts` - replace `any` with proper types
2. Update other services one at a time
3. Fix API route query builders

### Phase 3: Composables (Shared)
1. Update all composables with `unknown` catch blocks
2. Add proper return types where missing

### Phase 4: Pages/Components (Frontend)
1. Update page components incrementally
2. Fix remaining `as any` casts

### Phase 5: Enforcement
1. Add ESLint rules to prevent regression:
   - `@typescript-eslint/no-explicit-any`
   - `@typescript-eslint/no-unnecessary-type-assertion`

## Open Questions

1. Should we add Zod or similar for runtime validation of API inputs?
   - Current thinking: No, use TypeScript narrowing; keep dependencies minimal
2. Should `$fetch` response types be generated from API routes?
   - Current thinking: Yes eventually, but out of scope for this change
