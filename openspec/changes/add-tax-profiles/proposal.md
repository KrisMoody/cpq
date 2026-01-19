# Change: Add Tax Profiles to Price Books

## Why
Different regions have different tax rules (VAT in EU, sales tax in US, GST in Australia). Currently, tax rates are resolved only by customer address. Associating tax profiles with price books enables region-specific pricing and tax handling in a single configuration, simplifying international sales operations.

## What Changes
- Add `TaxProfile` entity to group tax rules by region/jurisdiction
- Link tax profiles to price books for regional tax defaults
- Use price book tax profile when customer address is incomplete
- Provide UI for managing tax profiles and assigning to price books

## Impact
- Affected specs: `price-books`, `tax-calculation`, new `tax-profiles` capability
- Affected code:
  - `prisma/schema.prisma` - New TaxProfile model, PriceBook relation
  - `server/services/taxEngine.ts` - Tax profile resolution
  - `server/api/tax-profiles/` - New API endpoints
  - `app/pages/settings/tax-profiles/` - New management UI
  - `app/pages/price-books/[id].vue` - Tax profile selector
