# Change: Add Mobile Responsiveness for CPQ Workflow Diagram and Tables

## Why
Several views are not mobile-friendly, making the application difficult to use on smaller screens. The two main culprits are:
1. The CPQ Workflow diagram (used on Dashboard and Learn page) - displays as a horizontal flow that overflows on mobile
2. All TanStack Table components - display as wide tables that require horizontal scrolling

## What Changes
- **CPQ Workflow Diagram**: Implement mobile-responsive layout OR hide on mobile viewports in both locations (Dashboard `/` and Learn page `/learn`)
- **TanStack Tables**: Create a responsive table pattern that adapts to mobile viewports using a card-based layout for small screens

### Specific Components Affected:
1. `app/components/learn/CPQFlowDiagram.vue` - horizontal workflow that overflows
2. `app/pages/index.vue` - uses CPQFlowDiagram
3. `app/pages/learn.vue` - uses CPQFlowDiagram
4. `app/components/tables/ProductsTable.vue`
5. `app/components/tables/CustomersTable.vue`
6. `app/components/tables/QuotesTable.vue`
7. `app/components/tables/RulesTable.vue`
8. `app/components/tables/DiscountsTable.vue`
9. `app/components/tables/PriceBooksTable.vue`
10. `app/components/tables/CurrenciesTable.vue`
11. `app/components/tables/TaxRatesTable.vue`
12. `app/components/tables/UnitsTable.vue`

## Impact
- Affected specs: `learning-ui`
- Affected code: All table components in `app/components/tables/`, CPQFlowDiagram component, Dashboard and Learn pages
- No breaking changes - existing desktop behavior preserved
- Improves accessibility and usability on mobile devices
