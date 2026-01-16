# Tasks: Add Product Full-Text Search

## Implementation Checklist

### Database
- [x] Create Prisma migration with raw SQL to add `search_vector` column
- [x] Create GIN index on `search_vector` column
- [x] Run migration and verify column is populated

### Backend
- [x] Update `executeSearchProducts` in `aiQuoteService.ts` to use `$queryRaw` with FTS
- [x] Add result mapping to convert raw query results to expected type
- [x] Implement fallback to ILIKE search when FTS returns no results
- [x] Remove the manual plural normalization workaround

### Validation
- [x] Test search with plural terms ("laptops" → "Laptop")
- [x] Test search with stemmed terms ("computing" → "computer")
- [x] Test search by SKU
- [x] Test empty query returns all products
- [x] Test weighted ranking (name matches rank higher)
- [x] Verify AI generate-quote feature works with natural language queries

### Cleanup
- [x] Remove debug console.log from searchProducts
