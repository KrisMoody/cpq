# Design: Product Full-Text Search

## Overview
Implement PostgreSQL full-text search for product lookups using `tsvector` and `tsquery` types.

## Database Schema Changes

### New Column
Add a generated `tsvector` column to the Product table:

```sql
ALTER TABLE "Product"
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(sku, '')), 'C')
) STORED;
```

Weights prioritize matches: name (A) > description (B) > sku (C).

### GIN Index
```sql
CREATE INDEX product_search_idx ON "Product" USING GIN (search_vector);
```

## Prisma Migration

Since Prisma doesn't support `GENERATED` columns directly, use a migration with raw SQL:

```prisma
// schema.prisma - for documentation only, column managed via raw SQL
model Product {
  // ... existing fields
  // searchVector is managed by PostgreSQL, not Prisma
}
```

Migration file:
```sql
-- Migration: add_product_search_vector
ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(sku, '')), 'C')
) STORED;

CREATE INDEX IF NOT EXISTS product_search_idx ON "Product" USING GIN (search_vector);
```

## Search Implementation

Replace the current `contains` filter with raw SQL query:

```typescript
async function executeSearchProducts(input) {
  const { query, isActive, limit } = input

  if (query) {
    // Use full-text search
    const products = await prisma.$queryRaw`
      SELECT p.id, p.name, p.sku, p.description, p.type,
             p."billingFrequency", p."isActive"
      FROM "Product" p
      WHERE p."isActive" = ${isActive}
        AND p.search_vector @@ plainto_tsquery('english', ${query})
      ORDER BY ts_rank(p.search_vector, plainto_tsquery('english', ${query})) DESC
      LIMIT ${limit}
    `
    // ... map results
  } else {
    // No query - use standard Prisma findMany
    return prisma.product.findMany({ where: { isActive }, take: limit })
  }
}
```

## Query Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `plainto_tsquery` | Converts plain text to tsquery, handles spaces | "laptop computer" → 'laptop' & 'computer' |
| `to_tsquery` | Requires operator syntax | 'laptop & computer' |
| `ts_rank` | Scores relevance for ordering | Higher = better match |

## Fallback Behavior

If full-text search returns no results, optionally fall back to `ILIKE` for partial matches:

```typescript
if (products.length === 0) {
  // Fallback to substring search
  return prisma.product.findMany({
    where: {
      isActive,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    },
    take: limit
  })
}
```

## Testing

- "laptops" matches "Developer Laptop Pro" (stemming)
- "computer" matches "Computing Services" (stemming)
- "SSD" matches "SSD-1TB-NVME" (sku match)
- Empty query returns all active products
- Weighted ranking: name matches rank higher than description matches

## Alternatives Considered

1. **Application-level fuzzy search (Fuse.js)**: Requires loading all products into memory, doesn't scale.

2. **Trigram similarity (`pg_trgm`)**: Better for typos but requires extension enable. Can be added later as enhancement.

3. **External search service (Algolia, Elasticsearch)**: Overkill for this use case, adds complexity.
