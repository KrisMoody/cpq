# Proposal: add-table-text-truncation

## Summary
Enable text truncation in table cells across all data tables, ensuring long content is clipped with ellipsis while providing access to the full text via tooltips.

## Problem
Currently, most table cells use `whitespace-nowrap` which prevents text wrapping but doesn't truncate long content. This can cause:
- Tables to become excessively wide when content is long (e.g., descriptions, names, emails)
- Horizontal scrolling on smaller screens
- Inconsistent column widths across different data sets

Only `ProductsTable.vue` implements truncation for the description column. Other tables like `CustomersTable`, `QuotesTable`, `DiscountsTable`, etc. don't have truncation capabilities.

## Solution
Add consistent text truncation support to all TanStack Table-based components:
1. Apply truncation CSS classes (`truncate`, `max-w-*`, `overflow-hidden`) to text-heavy columns
2. Add `title` attributes or tooltips to reveal full content on hover
3. Define which columns should be truncatable per table (typically: name, description, company, email)

## Scope
- **In scope**: All 9 data table components in `app/components/tables/`
- **Out of scope**: Mobile card views (already handle content differently), non-table components

## Affected Files
- `app/components/tables/ProductsTable.vue` - Already has partial truncation, standardize
- `app/components/tables/CustomersTable.vue` - Add truncation for name, company, email
- `app/components/tables/QuotesTable.vue` - Add truncation for quote name, customer name
- `app/components/tables/DiscountsTable.vue` - Add truncation for name
- `app/components/tables/PriceBooksTable.vue` - Add truncation for name, description
- `app/components/tables/RulesTable.vue` - Add truncation for name
- `app/components/tables/TaxRatesTable.vue` - Add truncation for name
- `app/components/tables/UnitsTable.vue` - Add truncation for name, symbol
- `app/components/tables/CurrenciesTable.vue` - Add truncation for name
- `app/components/tables/QuoteLinesTable.vue` - Add truncation for product name

## Dependencies
None - uses existing Tailwind CSS utilities.
