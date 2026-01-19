# Change: Add Product Attributes

## Why
Products currently have only basic fields (name, SKU, description). Real-world products have configurable attributes like color, size, weight, dimensions, warranty period, etc. Attribute support enables richer product data, attribute-based filtering, and attribute-driven pricing rules.

## What Changes
- Add `Attribute` model for defining attribute types
- Add `ProductAttribute` for product-attribute values
- Support different attribute types (text, number, boolean, select)
- Add attribute display on product details
- Enable attribute-based filtering and rules
- **BREAKING**: None - additive feature

## Impact
- Affected specs: `product-catalog` (modified), `product-attributes` (new)
- Affected code:
  - `prisma/schema.prisma` - Add Attribute models
  - `server/api/attributes/` (new)
  - `app/composables/useAttributes.ts` (new)
  - Product forms and detail pages
