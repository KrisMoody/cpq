# Change: Add Contract Term Pricing

## Why
Enterprise customers often negotiate contract-based pricing with specific validity periods. Currently, price books have validity dates but there's no customer-specific contract pricing that automatically applies different prices during contract terms. This is essential for B2B sales where negotiated rates differ from standard pricing.

## What Changes
- Add `Contract` model linking customers to special pricing terms
- Contracts have start/end dates and associated price adjustments
- Pricing engine automatically applies contract pricing when active
- Add contract management UI
- **BREAKING**: None - additive changes only

## Impact
- Affected specs: `price-books` (minor), `contract-pricing` (new)
- Affected code:
  - `prisma/schema.prisma` - Add Contract model
  - `server/services/priceLookup.ts` - Contract price resolution
  - `server/api/contracts/` (new)
  - `app/composables/useContracts.ts` (new)
  - `app/pages/contracts/` (new)
  - `app/pages/customers/[id].vue` - Show contracts

## Implementation Notes

### Dependencies
- **Requires**: `price-books`, `pricing` specs (already implemented)
- **Modifies**: `price-books` spec (minor - adds contract as price source), creates new `contract-pricing` spec

### Coordination Points
- **PriceBook/priceLookup.ts**: If implementing `add-multi-currency` in parallel, both proposals modify price resolution logic. Coordinate on the resolution order: contract pricing should resolve before currency conversion is applied.
- **Customer entity**: Minor touch point - adds contract display to customer detail page

### Suggested Order
- **Implement before**: `add-multi-currency` (contract pricing should be stable before adding currency layer)
- **Implement after**: None - can start immediately

### Parallel Development Notes
This proposal focuses on the pricing domain. Pairs well with:
- `add-subscriptions` (different focus: quote totals vs. price resolution)
- `add-guided-selling` (completely independent)

Avoid parallel implementation with `add-multi-currency` - both touch the pricing engine and price resolution logic.
