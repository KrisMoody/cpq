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
