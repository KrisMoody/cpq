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
