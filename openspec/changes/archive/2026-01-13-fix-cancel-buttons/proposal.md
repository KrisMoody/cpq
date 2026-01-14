# Change: Fix Cancel Button Behavior Across Application

## Why
Cancel buttons in the application have inconsistent behavior patterns. Some buttons navigate away (via `to="/path"`) losing unsaved changes without warning, while others properly reset form state before closing modals or exiting edit mode. This inconsistency creates a poor user experience and potential data loss.

## What Changes
- Standardize cancel button behavior for **navigation cancels** (new entity forms) to warn about unsaved changes before navigating
- Standardize cancel button behavior for **edit mode cancels** (existing entity edit forms) to properly reset form state
- Standardize cancel button behavior for **modal cancels** to close the modal and reset any form state
- Ensure all cancel buttons respect the `disabled` state during save/loading operations

## Impact
- Affected specs: `specs/learning-ui/spec.md`
- Affected code:
  - `app/pages/customers/new.vue` - navigation cancel
  - `app/pages/customers/[id].vue` - edit mode cancel (already correct)
  - `app/pages/products/new.vue` - navigation cancel
  - `app/pages/products/[id].vue` - edit mode cancel (already correct), modal cancels (already correct)
  - `app/pages/quotes/new.vue` - navigation cancel
  - `app/pages/quotes/[id]/index.vue` - modal cancels (already correct)
  - `app/pages/price-books/new.vue` - navigation cancel
  - `app/pages/price-books/[id].vue` - edit mode cancel (already correct), modal cancel (already correct)
  - `app/pages/discounts/new.vue` - navigation cancel
  - `app/pages/discounts/[id].vue` - navigation cancel (should be edit mode)
  - `app/pages/units/new.vue` - navigation cancel
  - `app/pages/attributes/new.vue` - navigation cancel
  - `app/pages/attributes/[id].vue` - edit mode cancel (already correct)
  - `app/pages/attributes/index.vue` - modal cancel (already correct)
  - `app/pages/tax-rates/new.vue` - navigation cancel
  - `app/pages/tax-rates/[id].vue` - edit mode cancel (already correct)
  - `app/pages/rules/new.vue` - navigation cancel
  - `app/pages/rules/[id].vue` - navigation cancel (should be edit mode or have form reset)
  - `app/pages/categories/new.vue` - navigation cancel
  - `app/pages/categories/[id].vue` - edit mode cancel (already correct), modal cancel (already correct)
  - `app/components/cpq/ApplyDiscountModal.vue` - modal cancel (already correct)
  - `app/components/cpq/ManualDiscountModal.vue` - modal cancel (already correct)
  - `app/components/cpq/QuoteApprovalBanner.vue` - modal cancel (already correct)
  - `app/components/cpq/QuoteLineItem.vue` - inline edit cancel (already correct)
