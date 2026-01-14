# Change: Add accessible titles to all modals

## Why
Currently, modals in the application use custom `#content` slots with manual `<h3>` headers. This bypasses Nuxt UI's built-in `DialogTitle` component, which is critical for screen reader accessibility. Without a proper `title` prop, assistive technologies cannot announce the modal's purpose when it opens.

## What Changes
- Add the `title` prop to all `<UModal>` components for accessibility
- Keep existing visual layout using `#content` slot with UCard
- Titles will be visually hidden but accessible to screen readers

## Impact
- Affected specs: learning-ui (new requirement for modal titles)
- Affected code:
  - `app/pages/products/[id].vue` (3 modals: Feature, Option, Attributes)
  - `app/pages/quotes/[id]/index.vue` (2 modals: Add Product, Customer Selector)
  - `app/pages/categories/[id].vue` (1 modal: Add Product)
  - `app/pages/attributes/index.vue` (1 modal: Group)
  - `app/pages/price-books/[id].vue` (1 modal: Add Entry)
  - `app/components/cpq/ApplyDiscountModal.vue` (1 modal)
  - `app/components/cpq/ManualDiscountModal.vue` (1 modal)
  - `app/components/cpq/QuoteApprovalBanner.vue` (1 modal: Reject Quote)
