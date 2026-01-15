# Change: Add TanStack Table to tax rates and currencies

## Why
The tax rates and currencies pages use plain HTML tables without sorting or search capabilities. Adding TanStack Table will provide a consistent experience with other list pages (products, price books) and make it easier to find specific entries as the data grows.

## What Changes
- Create `TaxRatesTable.vue` component using TanStack Table pattern
  - Columns: Name (linked), Rate, Jurisdiction, Category, Status, Actions
  - Sortable columns
  - Global search filter
- Create `CurrenciesTable.vue` component using TanStack Table pattern
  - Columns: Code (linked), Name, Symbol, Exchange Rate, Status, Actions
  - Sortable columns
  - Global search filter
- Replace inline HTML tables in index pages with new table components

## Impact
- Affected code: `app/pages/tax-rates/index.vue`, `app/pages/currencies/index.vue`
- New files: `app/components/tables/TaxRatesTable.vue`, `app/components/tables/CurrenciesTable.vue`
