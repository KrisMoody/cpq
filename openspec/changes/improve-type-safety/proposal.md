# Change: Improve Type Safety Across the Codebase

## Why

The codebase uses TypeScript with strict mode enabled (`strict: true`, `noUncheckedIndexedAccess: true`), but there are patterns that undermine type safety:

1. **`any` type usage** (~180 instances) - Bypasses type checking entirely
2. **`as` type assertions** (~230 instances) - Many are unnecessary escape hatches
3. **Inconsistent nullish handling** - Mixed use of `null`, `undefined`, and empty strings for "absence of value"

These patterns create:
- Runtime errors that TypeScript could have caught
- Inconsistent API contracts between frontend and backend
- Maintenance burden when types drift from reality
- Lost IDE autocomplete and refactoring support

## What Changes

### 1. Eliminate Explicit `any` Types

**Categories identified:**

| Category | Count | Resolution |
|----------|-------|------------|
| Catch block `(e: any)` | ~95 | Use `unknown` + type guard |
| JSON/Prisma `JsonValue` fields | ~20 | Create proper type definitions |
| Dynamic key access `Record<string, any>` | ~15 | Use discriminated unions or generics |
| Component props `value: any` | ~8 | Use generics or specific union types |
| Query builders `where: any` | ~6 | Use Prisma's generated types |

**Key files affected:**
- `server/services/ruleEngine.ts` - RuleContext, ConditionExpression
- `app/composables/useAttributes.ts` - ProductAttribute.value, constraints
- All composables and pages - catch blocks
- `server/api/products/index.get.ts`, `server/api/attributes/index.get.ts` - query builders

### 2. Reduce Unnecessary `as` Assertions

**Categories identified:**

| Category | Count | Resolution |
|----------|-------|------------|
| Route params `route.params.id as string` | ~25 | Use type-safe routing or runtime validation |
| Prisma JSON casts `(x as any).field` | ~35 | Define proper interfaces |
| Enum initializers `'VALUE' as EnumType` | ~30 | Use imported enum values |
| Badge color casts `as any` | ~8 | Type badge props correctly |
| Decimal handling | ~10 | Use utility types/functions |
| $fetch type workarounds | ~4 | Fix API response types |

### 3. Standardize Nullish Value Conventions

**Current state:**
- Database nullable fields → `null`
- Optional form fields → `undefined`
- Empty string used for "clear this field" in some places
- Inconsistent conversion between the three

**Proposed convention:**
- **Database layer**: `null` for absence (matches Prisma/PostgreSQL)
- **API layer**: Omit field or use `null` (never `undefined` in JSON)
- **Frontend layer**: `null` for "no value", `undefined` for "not set yet"
- **Form submission**: Convert empty strings to `null` at API boundary
- **Never use empty string** to represent "no value" for non-string fields

## Impact

- **Affected specs**: `tooling` (new TypeScript conventions)
- **Affected code**:
  - All composables (`app/composables/*.ts`)
  - All page components (`app/pages/**/*.vue`)
  - Server services (`server/services/*.ts`)
  - Server API routes (`server/api/**/*.ts`)
  - Shared type definitions
- **Risk**: Low - changes are internal type improvements, no API changes
- **Migration**: Can be done incrementally by file/module

## Success Criteria

1. Zero explicit `any` types in codebase (except generated code)
2. `as` assertions reduced by ~70% with remaining ones documented
3. Consistent nullish handling pattern enforced by linting
4. All catch blocks use `unknown` type
5. No TypeScript errors with strict mode enabled
