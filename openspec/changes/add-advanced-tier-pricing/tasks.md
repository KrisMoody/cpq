# Tasks

## 1. Schema Changes
- [ ] 1.1 Add `GRADUATED` and `VOLUME_DISCOUNT_PERCENT` to `TierType` enum
- [ ] 1.2 Add optional `discountPercent` field to `PriceTier` model
- [ ] 1.3 Generate and apply Prisma migration

## 2. Pricing Logic
- [ ] 2.1 Update `lookupPrice()` to handle `GRADUATED` tier type
- [ ] 2.2 Update `lookupPrice()` to handle `VOLUME_DISCOUNT_PERCENT` tier type
- [ ] 2.3 Update `calculateTotalPrice()` for graduated pricing
- [ ] 2.4 Add unit tests for new tier type calculations

## 3. API Updates
- [ ] 3.1 Update price tier API endpoints to accept new tier types
- [ ] 3.2 Add validation for `discountPercent` when `tierType` is `VOLUME_DISCOUNT_PERCENT`

## 4. UI Updates
- [ ] 4.1 Update tier editing UI to support new tier types
- [ ] 4.2 Add conditional field for `discountPercent` when applicable
- [ ] 4.3 Update tier display to show graduated breakdown

## 5. Documentation
- [ ] 5.1 Update course documentation with new tier types
- [ ] 5.2 Update glossary with new terms
