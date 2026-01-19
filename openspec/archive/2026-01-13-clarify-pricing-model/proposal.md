# Change: Clarify Pricing and Calculation Model

## Why
The current pricing architecture for bundles, line items, and discounts is confusing. Key issues:

1. **Bundle pricing is ambiguous**: Bundles have a price, and their components have prices, but it's unclear if bundle price is additive or just metadata
2. **Duplicate discount fields**: `Quote.discount` (legacy) vs `Quote.discountTotal` (used) creates confusion
3. **Line item fields are unclear**: `listPrice`, `discount`, `netPrice` meanings are not documented
4. **Discount calculation flow is complex**: Stackable vs non-stackable, LINE_ITEM vs QUOTE scope interactions are hard to follow
5. **Price tiers not integrated**: `priceLookup.ts` handles tiers, but `pricingEngine.ts` ignores them

## What Changes
- **BREAKING**: Remove legacy `Quote.discount` field (migrate to `discountTotal`)
- Add new `pricing` capability spec documenting the complete pricing model
- Clarify bundle pricing strategy (component-sum model)
- Document line item price calculation formula
- Document discount application order and precedence
- Integrate price tiers into main pricing flow
- Add UI improvements to show price breakdown clearly

## Impact
- Affected specs: `quotes`, `price-books`, new `pricing` capability
- Affected code:
  - `prisma/schema.prisma` (remove `discount` field)
  - `server/services/pricingEngine.ts` (integrate tiers)
  - `server/services/quoteService.ts` (clarify bundle pricing)
  - `app/components/cpq/PricingSummary.vue` (better breakdown)
  - `app/components/cpq/QuoteLineItem.vue` (show price details)
