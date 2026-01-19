# Change: Fix USelect value binding across all forms

## Why
USelect components using object items `{ label, value }` require the `value-key="value"` prop to correctly bind model values. Many USelect instances in the codebase are missing this prop, which can cause the v-model to bind the entire object instead of just the value property, leading to broken form submissions and display issues.

## What Changes
- Add `value-key="value"` to all USelect components using object-based items
- Standardize patterns for optional/nullable select fields
- No behavioral changes for components already working correctly (defensive fix)

## Impact
- Affected specs: `learning-ui` (form components pattern)
- Affected code:
  - `app/pages/categories/[id].vue` (lines 274, 423, 451)
  - `app/pages/categories/new.vue` (line 107)
  - `app/pages/rules/[id].vue` (lines 184, 188)
  - `app/pages/rules/new.vue` (lines 174, 178, 199, 203, 223)
  - `app/pages/attributes/[id].vue` (lines 318, 329)
  - `app/pages/attributes/new.vue` (lines 180, 184)
  - `app/pages/units/[id].vue` (line 186)
  - `app/pages/units/new.vue` (line 112)
  - `app/pages/discounts/[id].vue` (lines 228, 237)
  - `app/pages/discounts/new.vue` (lines 141, 155)
  - `app/pages/price-books/[id].vue` (lines 380, 606, 667)
  - `app/pages/price-books/new.vue` (line 93)
  - `app/pages/contracts/[id].vue` (lines 334, 361, 438)
  - `app/pages/contracts/new.vue` (lines 128, 172)
  - `app/pages/tax-rates/[id].vue` (line 189)
  - `app/pages/tax-rates/new.vue` (line 126)
  - `app/pages/products/[id].vue` (lines 690, 694, 716, 977)
  - `app/pages/products/new.vue` (lines 152, 170, 201)
  - `app/pages/products/index.vue` (line 80)
  - `app/components/cpq/AttributeInput.vue` (line 61)

## Files Not Requiring Changes (Already Correct)
- `app/pages/customers/[id].vue` (lines 271, 280) - already has `value-key="value"`
- `app/pages/customers/new.vue` (lines 173, 182) - already has `value-key="value"`
- `app/pages/quotes/new.vue` - uses USelectMenu correctly

## Analysis Summary
Found **~35 USelect instances** across the codebase:
- **~5 correct** (have `value-key="value"`)
- **~30 need fixing** (missing `value-key` with object items)
- **22 USelectMenu instances** (separate component, not part of this fix)
