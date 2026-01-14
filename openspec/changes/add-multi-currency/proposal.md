# Change: Add Multi-Currency Support

## Why
The system currently assumes a single currency. International businesses need to quote in customer's local currency, manage exchange rates, and report in base currency. Multi-currency support is essential for global sales operations.

## What Changes
- Add `Currency` model with exchange rates
- Add currency to price books, quotes, and customers
- Implement currency conversion in pricing engine
- Display currency symbols throughout UI
- Support base currency for reporting
- **BREAKING**: None - defaults to USD/base currency

## Impact
- Affected specs: `price-books` (modified), `quotes` (modified), `multi-currency` (new)
- Affected code:
  - `prisma/schema.prisma` - Add Currency model, currency fields
  - `server/services/currencyService.ts` (new)
  - `server/services/pricingEngine.ts` - Currency conversion
  - All price displays - Currency formatting

## Implementation Notes

### Dependencies
- **Requires**: `price-books`, `quotes`, `pricing` specs (already implemented)
- **Should wait for**: `add-contract-pricing` and `add-subscriptions` to merge first
- **Modifies**: `price-books` (adds currency field), `quotes` (adds currency field and formatting)

### Coordination Points
- **pricingEngine.ts**: Adds currency conversion. This interacts with contract pricing (convert after contract price resolution) and subscription calculations (format recurring totals with currency). Implement after those proposals merge to layer currency on top cleanly.
- **Quote totals display**: Modifies all price displays for currency formatting. If `add-subscriptions` adds recurring totals display, currency formatting should be applied after that's stable.
- **Price book entries**: Adds currency to price books. If `add-contract-pricing` modifies price resolution, currency conversion should happen after contract price is resolved.

### Suggested Order
- **Implement before**: None - this can be the final pricing enhancement
- **Implement after**: `add-contract-pricing`, `add-subscriptions` (to avoid conflicts in pricing engine and quote display)

### Parallel Development Notes
This is a cross-cutting change that touches many files. **Not recommended for parallel development** with other pricing-related proposals.

Safe to implement in parallel with:
- `add-guided-selling` (completely independent domain)
- `add-product-management` (minimal overlap - only product display formatting)

**Avoid parallel implementation with**: `add-contract-pricing`, `add-subscriptions` - all three touch the pricing engine and quote totals.
