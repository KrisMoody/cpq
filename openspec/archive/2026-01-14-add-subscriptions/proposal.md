# Change: Add Recurring Revenue / Subscriptions

## Why
Modern CPQ systems must handle subscription-based and recurring revenue models (SaaS, licenses, maintenance contracts). Currently, all pricing is one-time. Subscription support enables modeling monthly/annual fees, contract terms, and MRR/ARR calculations essential for software and service businesses.

## What Changes
- Add billing frequency to products (ONE_TIME, MONTHLY, ANNUAL, CUSTOM)
- Add contract term/duration to products and line items
- Calculate recurring vs. one-time totals separately on quotes
- Display MRR/ARR metrics on quotes
- Support pro-rated pricing for mid-term starts
- **BREAKING**: None - existing products default to ONE_TIME

## Impact
- Affected specs: `product-catalog` (modified), `quotes` (modified), `subscriptions` (new)
- Affected code:
  - `prisma/schema.prisma` - Add billing fields
  - `server/services/pricingEngine.ts` - Recurring calculations
  - Quote components - Show recurring totals
  - Product forms - Billing frequency selector

## Implementation Notes

### Dependencies
- **Requires**: `product-catalog`, `quotes`, `pricing` specs (already implemented)
- **Modifies**: `product-catalog` (adds `billingFrequency`), `quotes` (adds recurring totals display)

### Coordination Points
- **Product entity**: Adds `billingFrequency` field to Product. If `add-product-management` is being implemented in parallel, coordinate on Product model changes - ideally let product-management merge first, or submit the field addition as a coordinated PR.
- **Quote totals display**: Adds recurring vs. one-time breakdown. If `add-multi-currency` runs in parallel, both modify quote total display - subscription totals should be in place before currency formatting is layered on.
- **pricingEngine.ts**: Adds recurring calculations. Keep these in separate methods from contract pricing logic to minimize conflicts.

### Suggested Order
- **Implement before**: `add-multi-currency` (recurring totals should be stable before adding currency formatting)
- **Implement after**: `add-product-management` (if parallel - to avoid Product model conflicts)

### Parallel Development Notes
This proposal focuses on quote behavior and product billing attributes. Pairs well with:
- `add-contract-pricing` (different focus: price resolution vs. totals calculation)
- `add-guided-selling` (completely independent)

Avoid parallel implementation with `add-multi-currency` - both modify quote totals display and pricing engine.
