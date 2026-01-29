# Change: Fix Bundle Recalculation

## Why
When clicking "Recalculate" on a quote containing bundle products, the recalculation logic treats all line items (including bundle children like features and options) as standalone products. This breaks the bundle parent-child relationship and makes bundle components appear as separate products on the quote, corrupting the quote structure and pricing.

Bundle products use a parent-child line item structure where:
- The bundle parent (type: BUNDLE) should have netPrice = 0 (pricing comes from components)
- Bundle children (features/options) have parentLineId set and contribute their pricing to the bundle total
- The parentLineId field is what distinguishes bundle components from standalone products

The bug occurs in `server/api/quotes/[id]/calculate.post.ts` where the recalculation loop treats all line items equally without checking:
- Whether a product is a bundle (type === 'BUNDLE')
- Whether a line item is a bundle child (parentLineId !== null)
- Bundle-specific pricing rules (parent netPrice = 0)

This causes bundle children to lose their relationship context and get repriced as if they were standalone products.

## What Changes
- Fix recalculation logic to properly handle bundle parent and child line items
- Ensure bundle parents maintain netPrice = 0 during recalculation
- Fix bundle creation to set netPrice = 0 initially (not just during recalculation)
- Fix calculate endpoint to return hierarchical line items (matching GET endpoint)
- Preserve parentLineId relationships during price updates
- Add proper bundle type checking in the recalculation loop

## Impact
- Affected specs: `quotes`
- Affected code:
  - `server/api/quotes/[id]/calculate.post.ts` - Fix recalculation logic to respect bundle structure AND return hierarchical line items
  - `server/api/quotes/[id]/bundles.post.ts` - Fix initial bundle creation to set netPrice = 0
