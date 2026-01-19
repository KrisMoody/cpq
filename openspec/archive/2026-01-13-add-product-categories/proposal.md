# Change: Add Product Categories & Hierarchies

## Why
Products currently have no categorization, making it difficult to organize large catalogs, apply category-based discounts, or filter products by type. A category model is essential for navigation, reporting, and the existing `PRODUCT_CATEGORY` discount scope which currently has no category to reference.

## What Changes
- Add `Category` model with hierarchical parent-child support
- Link products to categories (many-to-many for flexibility)
- Add category management UI (CRUD)
- Enable category-based filtering on product lists
- Enable `PRODUCT_CATEGORY` discount scope to reference actual categories
- **BREAKING**: None - additive changes only

## Impact
- Affected specs: `product-catalog` (modified), `product-categories` (new)
- Affected code:
  - `prisma/schema.prisma` - Add Category model
  - `server/api/categories/` (new)
  - `app/composables/useCategories.ts` (new)
  - `app/pages/categories/` (new)
  - `app/pages/products/` (category filter)
