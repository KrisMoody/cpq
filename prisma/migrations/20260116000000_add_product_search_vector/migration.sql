-- Add full-text search vector column to Product table
-- Uses PostgreSQL GENERATED ALWAYS column with weighted tsvector

ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(sku, '')), 'C')
) STORED;

-- Create GIN index for fast full-text search queries
CREATE INDEX IF NOT EXISTS product_search_idx ON "Product" USING GIN (search_vector);
