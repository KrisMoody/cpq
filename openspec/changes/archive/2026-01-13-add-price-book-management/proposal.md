# Change: Add Price Book Management

## Why
The current system only supports reading price books and their entries. Users cannot create, edit, or manage price books through the UI or API, requiring direct database access for price management. Price book management is a core CPQ capability needed for maintaining product pricing across different customer segments and time periods.

## What Changes
- Add REST API endpoints for full CRUD on price books (`POST`, `PUT`, `DELETE /api/price-books`)
- Add REST API endpoints for managing price book entries (`POST`, `PUT`, `DELETE /api/price-books/:id/entries`)
- Extend `usePricing` composable with `createPriceBook`, `updatePriceBook`, `deletePriceBook`, and entry management functions
- Create price books list page at `/price-books` with table view
- Create price book detail/edit page at `/price-books/[id]` showing entries with inline editing
- Create new price book page at `/price-books/new`
- Support managing price book entries: add products, set prices, remove entries
- **BREAKING**: None - additive changes only

## Impact
- Affected specs: `price-books`
- Affected code:
  - `server/api/price-books/index.post.ts` (new)
  - `server/api/price-books/[id].get.ts` (new)
  - `server/api/price-books/[id].put.ts` (new)
  - `server/api/price-books/[id].delete.ts` (new)
  - `server/api/price-books/[id]/entries.post.ts` (new)
  - `server/api/price-books/[id]/entries/[entryId].put.ts` (new)
  - `server/api/price-books/[id]/entries/[entryId].delete.ts` (new)
  - `app/composables/usePricing.ts`
  - `app/pages/price-books/index.vue` (new)
  - `app/pages/price-books/[id].vue` (new)
  - `app/pages/price-books/new.vue` (new)
