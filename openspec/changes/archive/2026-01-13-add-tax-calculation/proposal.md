# Change: Add Tax Calculation

## Why
Quote totals currently don't include tax, making them incomplete for real-world use. Tax calculation is essential for accurate quoting, compliance with tax regulations, and supporting customers in different tax jurisdictions. This includes handling tax-exempt customers and different tax rates by product category.

## What Changes
- Add `TaxRate` model with jurisdiction and product category support
- Add tax calculation to pricing engine
- Add tax-exempt flag to customers
- Display tax as separate line on quotes
- Support multiple tax rates per quote (e.g., state + local)
- **BREAKING**: None - tax defaults to 0% for existing data

## Impact
- Affected specs: `quotes` (modified), `tax-calculation` (new)
- Affected code:
  - `prisma/schema.prisma` - Add TaxRate, customer exemption
  - `server/services/taxEngine.ts` (new)
  - `server/services/pricingEngine.ts` - Include tax in totals
  - Quote components - Display tax breakdown
