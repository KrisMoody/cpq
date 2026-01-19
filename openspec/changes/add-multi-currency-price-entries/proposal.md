# Change: Add Multi-Currency Price Entries

## Why
Currently, each price book is tied to a single currency, requiring duplicate price books for each region. For products with identical relative pricing across regions, this creates maintenance overhead. Multi-currency price entries allow a single price book to store native prices in multiple currencies, reducing duplication while supporting region-specific pricing where needed.

## What Changes
- Add `PriceBookEntryCurrency` table for native prices per currency
- Allow price book entries to have multiple currency-specific prices
- Fall back to currency conversion when native price not available
- Provide UI for managing currency-specific prices per entry

## Impact
- Affected specs: `price-books`, new `multi-currency-pricing` capability
- Affected code:
  - `prisma/schema.prisma` - New PriceBookEntryCurrency model
  - `server/services/priceLookup.ts` - Currency-aware price lookup
  - `server/api/price-books/[id]/entries/[entryId]/currencies.ts` - New endpoints
  - `app/pages/price-books/[id].vue` - Currency price management UI
