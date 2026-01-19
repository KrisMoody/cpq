# Change: Add table view for products list

## Why
The products page currently only displays products as cards, which becomes harder to scan as the product catalog grows. A table view provides a more compact, scannable format with sortable columns—consistent with how price books are displayed.

## What Changes
- Add a `ProductsTable` component using TanStack Table (following the `PriceBooksTable` pattern)
- Add a view toggle button to switch between table and card views
- Make table view the default display mode
- Persist the user's view preference

## Impact
- Affected specs: `product-catalog` (Products List Page requirement)
- Affected code: `app/pages/products/index.vue`, new `app/components/tables/ProductsTable.vue`
