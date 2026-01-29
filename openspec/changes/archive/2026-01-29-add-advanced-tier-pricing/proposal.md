# Change: Add Advanced Tier Pricing Types

## Why
The current tier pricing model supports only two types (Slab/UNIT_PRICE and Stairstep/FLAT_PRICE). Customers frequently need Graduated pricing (where different portions of quantity are priced at different rates, like tax brackets) and Volume Discount Percentage (where a percentage discount increases based on quantity purchased).

## What Changes
- Add two new tier types to the `TierType` enum: `GRADUATED` and `VOLUME_DISCOUNT_PERCENT`
- Add optional `discountPercent` field to `PriceTier` model for percentage-based discounts
- Update `priceLookup.ts` to calculate graduated and percentage-based pricing
- Update pricing documentation and UI to support the new tier types

## Impact
- Affected specs: `pricing`
- Affected code:
  - `prisma/schema.prisma` (TierType enum, PriceTier model)
  - `server/services/priceLookup.ts` (calculation logic)
  - `server/services/pricingEngine.ts` (if tier calculations are used there)
  - `app/pages/price-books/[id].vue` (tier editing UI)
  - `docs/course/04-price-books.md` (documentation)
