# Tasks: Add Multi-Currency Price Entries

## 1. Database Schema
- [x] 1.1 Add PriceBookEntryCurrency model to Prisma schema
- [x] 1.2 Create unique constraint on (entryId, currencyId)
- [x] 1.3 Run migration and generate Prisma client

## 2. Backend API
- [x] 2.1 Create currency price CRUD endpoints for entries
- [x] 2.2 Update price lookup to check currency-specific prices first
- [x] 2.3 Fall back to conversion when native price unavailable
- [x] 2.4 Update price book entry GET to include currency prices

## 3. Frontend UI
- [x] 3.1 Add currency prices section to price book entry detail
- [x] 3.2 Create currency price add/edit modal
- [x] 3.3 Display currency prices in entry list
- [x] 3.4 Show conversion indicator when native price unavailable

## 4. Validation
- [x] 4.1 Verify currency-specific price lookup
- [x] 4.2 Test fallback to conversion
- [x] 4.3 Verify quote pricing with native currency prices
- [x] 4.4 Test UI currency price management
