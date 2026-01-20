# Change: Add Bundle Expansion UI in Quote Editor

## Why
When creating or editing quotes, users need visibility into what products are included in bundles. Currently, bundle line items show only the bundle name without revealing the component products. This makes it difficult for sales reps to verify bundle contents, explain bundle value to customers, and ensure the correct configuration was selected.

## What Changes
- Add expandable/collapsible bundle line items in the quote editor
- Display child products nested under their parent bundle when expanded
- Provide a global toggle to expand/collapse all bundles
- Persist expansion state during the editing session
- Style child items distinctly to show hierarchy

## Impact
- Affected specs: `quotes-ui`
- Affected code:
  - `app/components/cpq/QuoteLineItem.vue` (main component changes)
  - `app/pages/quotes/[id]/index.vue` (global toggle, state management)
  - `app/composables/useQuotes.ts` (types already support childLines)

## Design Considerations

### Best Practices Applied
1. **Default collapsed** - Bundles start collapsed to keep the quote list scannable, matching patterns from Salesforce CPQ and Oracle CPQ
2. **Visual hierarchy** - Child items are indented and styled differently to clearly show the parent-child relationship
3. **Non-destructive** - Expansion state is UI-only; no data model changes required
4. **Accessible** - Expand/collapse uses proper ARIA attributes and keyboard navigation
5. **Progressive disclosure** - Users see summary by default, details on demand

### UX Pattern Choice
We chose an **inline expandable row** pattern over alternatives:
- **Modal/drawer**: Rejected because it breaks flow; users want to scan multiple bundles quickly
- **Always expanded**: Rejected because it creates visual clutter on quotes with many bundles
- **Separate tab**: Rejected because it requires context switching

### Global Toggle Rationale
A "Show/Hide All Bundle Contents" toggle is included for power users who want to:
- Review all bundle contents at once before finalizing a quote
- Quickly collapse everything to see the quote summary view
