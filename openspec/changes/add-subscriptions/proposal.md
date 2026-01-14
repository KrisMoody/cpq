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
