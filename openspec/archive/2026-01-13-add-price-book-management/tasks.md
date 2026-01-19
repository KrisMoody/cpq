## 1. Price Book API Endpoints
- [x] 1.1 Create `POST /api/price-books` endpoint for creating price books
- [x] 1.2 Create `GET /api/price-books/:id` endpoint for fetching single price book
- [x] 1.3 Create `PUT /api/price-books/:id` endpoint for updating price books
- [x] 1.4 Create `DELETE /api/price-books/:id` endpoint for deleting price books

## 2. Price Book Entry API Endpoints
- [x] 2.1 Create `POST /api/price-books/:id/entries` endpoint for adding entries
- [x] 2.2 Create `PUT /api/price-books/:id/entries/:entryId` endpoint for updating entries
- [x] 2.3 Create `DELETE /api/price-books/:id/entries/:entryId` endpoint for removing entries

## 3. Composable Updates
- [x] 3.1 Add `createPriceBook` function to usePricing
- [x] 3.2 Add `fetchPriceBook` function for single price book
- [x] 3.3 Add `updatePriceBook` function to usePricing
- [x] 3.4 Add `deletePriceBook` function to usePricing
- [x] 3.5 Add `addPriceBookEntry` function to usePricing
- [x] 3.6 Add `updatePriceBookEntry` function to usePricing
- [x] 3.7 Add `deletePriceBookEntry` function to usePricing

## 4. Price Books List Page
- [x] 4.1 Create `/price-books/index.vue` with table showing all price books
- [x] 4.2 Display name, default status, active status, validity dates, entry count
- [x] 4.3 Add "New Price Book" button linking to create page
- [x] 4.4 Add row click navigation to detail page

## 5. Price Book Detail Page
- [x] 5.1 Create `/price-books/[id].vue` with price book details form
- [x] 5.2 Display and edit name, default flag, active status, validity dates
- [x] 5.3 Show entries table with product name, SKU, list price, cost
- [x] 5.4 Add inline editing for entry prices
- [x] 5.5 Add "Add Product" functionality to add entries
- [x] 5.6 Add delete entry functionality
- [x] 5.7 Add Save and Delete buttons for price book

## 6. New Price Book Page
- [x] 6.1 Create `/price-books/new.vue` with creation form
- [x] 6.2 Include fields for name, default flag, active status, validity dates
- [x] 6.3 Add save functionality that redirects to detail page on success
