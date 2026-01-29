# Tasks

## Implementation Tasks

- [x] **Add back button to breadcrumbs in default.vue**
  - Add an icon-only `<UButton>` with `i-heroicons-arrow-left` as the first element in the breadcrumb `<ol>`
  - Only show when `breadcrumbs.length > 1`
  - Navigate to the parent route (second-to-last breadcrumb with a `to` value)
  - Style to match breadcrumb aesthetic (ghost variant, appropriate sizing)

- [x] **Remove back buttons from detail pages**
  - Remove "Back to X" `<UButton>` from all `[id].vue` pages:
    - `products/[id].vue`
    - `categories/[id].vue`
    - `price-books/[id].vue`
    - `attributes/[id].vue`
    - `units/[id].vue`
    - `rules/[id].vue`
    - `discounts/[id].vue`
    - `tax-rates/[id].vue`
    - `currencies/[id].vue`
    - `customers/[id].vue`
    - `contracts/[id].vue`
    - `quotes/[id]/index.vue`
    - `quote-layouts/[id].vue` (no nav back button - only error state button retained)

- [x] **Remove back buttons from new/create pages**
  - Remove "Back to X" `<UButton>` from all `new.vue` pages:
    - `products/new.vue`
    - `categories/new.vue`
    - `price-books/new.vue`
    - `attributes/new.vue`
    - `units/new.vue`
    - `rules/new.vue`
    - `discounts/new.vue`
    - `tax-rates/new.vue`
    - `currencies/new.vue`
    - `customers/new.vue`
    - `contracts/new.vue`
    - `quotes/new.vue`

- [x] **Remove back buttons from other pages**
  - `quotes/preview-[id].vue`
  - `learn/course/[moduleId].vue`
  - Any other pages with "Back to" buttons

## Validation

- [x] **Verify breadcrumb back navigation works correctly**
  - Navigate to a detail page (e.g., `/products/abc123`)
  - Confirm back button appears as first breadcrumb element
  - Click back button and verify navigation to parent (`/products`)
  - Repeat for new pages and nested routes
