# Change: Standardize Units table to match other admin tables

## Why
The Units table uses inline plain HTML while all other admin tables (Price Books, Customers, Discounts, Quotes, Rules) use TanStack Vue Table with consistent styling and features. This creates visual inconsistency and lacks sorting/filtering functionality.

## What Changes
- Extract Units table to a dedicated `UnitsTable.vue` component
- Implement TanStack Vue Table with sorting and filtering
- Apply consistent styling (header backgrounds, dividers, spacing)
- Add search input for filtering units

## Impact
- Affected specs: `unit-of-measure` (Unit Management UI requirement)
- Affected code:
  - `app/pages/units/index.vue` - refactor to use new table component
  - `app/components/tables/UnitsTable.vue` - new component
