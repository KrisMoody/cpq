# Tasks: Type Safety Improvements

## Phase 1: Foundation

- [x] 1.1 Create `types/domain.ts` with domain-specific interfaces
  - AttributeOption, AttributeConstraints types
  - ConditionExpression refinements
  - AttributeValue union type
  - QuoteMetrics type (oneTimeTotal, mrr, arr, tcv)
  - TaxBreakdownItem type

- [x] 1.2 Create `utils/errors.ts` with error handling utility
  - `getErrorMessage(error: unknown): string` function
  - Handle Error instances, strings, and Nuxt error format

- [x] 1.3 Create `composables/useRouteParams.ts`
  - `useRequiredParam(name: string): string` function
  - Throws 400 error if param missing or invalid

## Phase 2: Server Services

- [x] 2.1 Update `server/services/ruleEngine.ts`
  - Change `RuleContext[key: string]: any` to `unknown`
  - Change `ConditionExpression.value` from `any` to typed union
  - Change `getNestedValue` return type from `any` to `unknown`
  - Replace `catch (e: any)` with `unknown`

- [x] 2.2 Update `server/services/pricingEngine.ts`
  - Fix `taxBreakdown as unknown as object` cast (documented with ASSERTION comment)
  - Use TaxBreakdownItem[] type

- [x] 2.3 Update `server/services/guidedSellingEngine.ts`
  - Fix JSON field casts for `branchLogic`, `options`
  - Use type guards instead of `as`

- [x] 2.4 Update `server/services/recommendationEngine.ts`
  - Already properly typed with `Record<string, unknown>`

## Phase 3: Server API Routes

- [x] 3.1 Update query builder patterns
  - `server/api/products/index.get.ts` - use `Prisma.ProductWhereInput`
  - Remaining files have warnings documented for future cleanup

- [x] 3.2 Update discount API routes
  - `server/api/discounts/[id].put.ts` - fix tier mapping
  - `server/api/discounts/index.post.ts` - fix tier mapping

- [x] 3.3 Update product attribute API route
  - `server/api/products/[id]/attributes.put.ts` - properly typed with `AttributeValue` and `AttributeInput` interface

- [x] 3.4 Replace `catch (e: any)` in API routes
  - `server/api/cron/contracts.post.ts`

## Phase 4: Composables

- [x] 4.1 Update `app/composables/useAttributes.ts`
  - Change `ProductAttribute.value: any` to `AttributeValue`
  - Change `constraints: Record<string, any>` to `AttributeConstraints`
  - Replace all `catch (e: any)` blocks

- [x] 4.2 Update `app/composables/useProducts.ts`
  - Replace all `catch (e: any)` blocks
  - Note: Some `($fetch as any)` workarounds remain (documented as warnings)

- [x] 4.3 Update `app/composables/useQuotes.ts`
  - Replace all `catch (e: any)` blocks

- [x] 4.4 Update remaining composables
  - `useCategories.ts` - catch blocks updated
  - `useContracts.ts` - catch blocks updated
  - `useCustomers.ts` - catch blocks updated
  - `useCurrencies.ts` - catch blocks updated
  - `useDiscounts.ts` - catch blocks updated
  - `usePricing.ts` - catch blocks updated
  - `useRules.ts` - catch blocks updated (interface types have warnings)
  - `useTaxRates.ts` - catch blocks updated
  - `useUnits.ts` - catch blocks updated
  - `useAffinities.ts` - catch blocks updated
  - `useQuestionnaires.ts` - catch blocks updated
  - `useRecommendations.ts` - catch blocks updated

## Phase 5: Page Components

- [x] 5.1 Update product pages
  - `app/pages/products/[id].vue`
    - Replace route param `as string` with useRequiredParam
    - Replace catch blocks
    - Note: Some `any` types remain in function signatures (documented as warnings)
  - `app/pages/products/new.vue` - catch blocks updated
  - `app/pages/products/index.vue` - warning documented

- [x] 5.2 Update attribute pages
  - `app/pages/attributes/[id].vue`
    - Replace catch blocks
    - Route params updated
    - Note: Some constraint casts remain (warnings)
  - `app/pages/attributes/new.vue` - similar fixes

- [x] 5.3 Update quote pages
  - `app/pages/quotes/[id]/index.vue`
    - Replace catch blocks
    - Route params updated
  - `app/pages/quotes/new.vue` - catch blocks updated

- [x] 5.4 Update contract pages
  - `app/pages/contracts/[id].vue` - catch blocks updated, route params
  - `app/pages/contracts/index.vue` - no changes needed
  - `app/pages/contracts/new.vue` - catch blocks updated

- [x] 5.5 Update remaining entity pages
  - `app/pages/categories/[id].vue`, `new.vue` - updated
  - `app/pages/customers/[id].vue`, `new.vue` - updated
  - `app/pages/discounts/[id].vue`, `new.vue` - updated
  - `app/pages/price-books/[id].vue`, `new.vue` - updated
  - `app/pages/rules/[id].vue`, `new.vue` - updated
  - `app/pages/units/[id].vue`, `new.vue` - updated
  - `app/pages/currencies/[id].vue`, `new.vue` - updated
  - `app/pages/tax-rates/[id].vue`, `new.vue` - updated
  - `app/pages/affinities/[id].vue`, `new.vue` - updated
  - `app/pages/questionnaires/[id].vue` - updated

## Phase 6: Components

- [x] 6.1 Update quote components
  - `app/components/cpq/QuotePreview.vue` - has some remaining warnings
  - `app/components/cpq/QuoteLineItem.vue` - fix `value: any` prop with `AttributeValue`
  - `app/components/cpq/ManualDiscountModal.vue` - catch block updated
  - `app/components/cpq/ApplyDiscountModal.vue` - catch block updated
  - `app/components/cpq/AttributeInput.vue` - fix `modelValue: any`, constraints

- [x] 6.2 Update table components
  - `app/components/tables/*.vue` - reviewed, no `any` types present

- [x] 6.3 Update learn/diagram components
  - `app/components/learn/EntityHierarchy.vue` - documented with ASSERTION comment for third-party library limitation

## Phase 7: Enforcement

- [x] 7.1 Add ESLint rules to prevent regression
  - Add `@typescript-eslint/no-explicit-any`: warn
  - Note: Set to warn instead of error to allow incremental cleanup
  - TODO: Upgrade to 'error' once remaining ~45 warnings are resolved

- [x] 7.2 Document remaining necessary assertions
  - Create `// ASSERTION: reason` comment pattern (used in pricingEngine.ts, products API)

- [x] 7.3 Final verification
  - `npm run typecheck` passes with no errors
  - `npm run lint` passes with 0 errors, 45 warnings (documented for future cleanup)

## Completed Work (Phases 8-13)

All phases have been completed:

### Phase 8: Interface Extensions ✅

- [x] 8.1 Extend Quote interface with metrics
  - Added `oneTimeTotal`, `mrr`, `arr`, `tcv` to Quote type in `useQuotes.ts`
  - Fixed 8 occurrences in:
    - `app/components/cpq/QuotePreview.vue` (4 casts removed)
    - `app/pages/quotes/[id]/index.vue` (4 casts removed)

- [x] 8.2 Extend Product interface with billing fields
  - `Product` interface already had billing fields in `useProducts.ts`
  - Added `ProductAttribute` and `attributes` to `ProductWithFeatures`
  - Fixed 8 occurrences in `app/pages/products/[id].vue`

- [x] 8.3 Extend PriceBookEntry interface
  - Added `PriceTier` interface and `priceTiers` to `PriceBookEntry` in `usePricing.ts`
  - Fixed 1 occurrence in `app/pages/price-books/[id].vue`

### Phase 9: API Route Type Safety ✅

- [x] 9.1 Fix query builder types
  - `server/api/contracts/index.get.ts` - using `Prisma.ContractWhereInput` + enum validation
  - `server/api/attributes/index.get.ts` - using `Prisma.AttributeWhereInput`

- [x] 9.2 Create enum validation functions
  - Added inline type guards in API routes (following existing pattern)
  - `server/api/affinities/index.get.ts` - `isValidAffinityType()` type guard
  - `server/api/rules/index.get.ts` - `isValidRuleType()` type guard
  - `server/api/contracts/index.get.ts` - `isValidContractStatus()` type guard

- [x] 9.3 Type product attributes API
  - `server/api/products/[id]/attributes.put.ts` - using `AttributeValue` type via `AttributeInput` interface

### Phase 10: Composable Types ✅

- [x] 10.1 Type rule conditions and actions
  - `app/composables/useRules.ts` - using `ConditionExpression` and `RuleAction` from domain types
  - Added `RuleAction` interface to `app/types/domain.ts`

- [x] 10.2 Fix $fetch DELETE return types
  - `app/composables/useProducts.ts` - removed `<void>` generic (not needed, causes ESLint error)

### Phase 11: Page Component Types ✅

- [x] 11.1 Fix attribute constraints typing
  - `app/pages/attributes/[id].vue` - using `NumberConstraints` and `TextConstraints` from domain types
  - Added computed helpers `numberConstraints` and `textConstraints`

- [x] 11.2 Fix products index filter
  - `app/pages/products/index.vue` - using `ProductCategory` type

### Phase 12: Component & Badge Types ✅

- [x] 12.1 Fix UBadge color type
  - `app/composables/useContracts.ts` - return type narrowed to `'success' | 'warning' | 'neutral'`
  - Removed `as any` casts from:
    - `app/pages/customers/[id].vue`
    - `app/pages/contracts/[id].vue`
    - `app/pages/contracts/index.vue`

- [x] 12.2 Fix ApexChart type prop
  - `app/components/learn/EntityHierarchy.vue` - documented with ASSERTION comment
  - Third-party library limitation (vue3-apexcharts types don't include 'treemap')

### Phase 13: Verification ✅

- [x] 13.1 Final verification
  - `npm run typecheck` passes with no errors
  - `npm run lint` passes with 0 errors, 13 warnings

---

## Remaining Work (Deferred)

The following warnings remain and are deferred for future cleanup:

| File | Issue | Notes |
|------|-------|-------|
| `useRules.ts` | 5 warnings | Create/update rule API request body types |
| `useUnsavedChanges.ts` | 1 warning | Generic watcher callback type |
| `attributes/[id].vue` | 1 warning | Create rule modal condition type |
| `attributes/new.vue` | 1 warning | Create rule modal condition type |
| `products/[id].vue` | 1 warning | `openEditOption` function parameter |
| `rules/[id].vue` | 2 warnings | Rule form condition/action types |
| `rules/new.vue` | 1 warning | Rule form condition type |
| `EntityHierarchy.vue` | 1 eslint-disable | vue3-apexcharts library limitation |

**Total: 13 warnings remaining (down from 45)**
