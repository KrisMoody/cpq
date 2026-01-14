# Change: Add Product and Bundle Management

## Why
The current system only supports viewing and configuring products. Users cannot create, edit, or deactivate products and bundles through the UI, limiting the ability to manage the product catalog without direct database access. This is a core CPQ capability needed for self-service product administration.

## What Changes
- Add REST API endpoints for product update (`PUT /api/products/:id`) and delete (`DELETE /api/products/:id`)
- Add `updateProduct` and `deleteProduct` functions to `useProducts` composable
- Create new product page at `/products/new` with form for standalone products and bundles
- Enhance product detail page `/products/[id]` with edit mode and deactivate action
- Add "New Product" button to products list page
- Support bundle configuration: create/edit features and options when product type is BUNDLE
- **BREAKING**: None - additive changes only

## Impact
- Affected specs: `product-catalog`
- Affected code:
  - `server/api/products/[id].put.ts` (new)
  - `server/api/products/[id].delete.ts` (new)
  - `app/composables/useProducts.ts`
  - `app/pages/products/index.vue`
  - `app/pages/products/[id].vue`
  - `app/pages/products/new.vue` (new)

## Implementation Notes

### Dependencies
- **Requires**: None - can start immediately
- **Modifies**: `product-catalog` spec only

### Coordination Points
- **Product entity**: This proposal owns Product model changes. If implementing `add-subscriptions` in parallel, coordinate on adding the `billingFrequency` field - that proposal should wait for this one to merge first, or submit the field addition as a separate PR for review here.

### Suggested Order
- **Implement before**: `add-subscriptions` (if parallel development)
- **Implement after**: None - no blockers

### Parallel Development Notes
This is a good starting point with no external dependencies. If working in parallel with another developer, this proposal pairs well with `add-guided-selling` (completely independent) or `add-contract-pricing` (different domain).
