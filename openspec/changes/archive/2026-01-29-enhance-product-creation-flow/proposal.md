# Change: Enhance Product Creation Flow with Categories, Attributes, and Bundle Configuration

## Why
Currently, when creating a product, users cannot assign categories, populate attribute values, or configure bundle features/options. This requires navigating to separate pages after creation, which fragments the workflow and increases the chance of incomplete product data. By allowing full product setup during creation, we improve data quality and streamline the product setup process.

## What Changes
- Add a "Categories" section to the product creation form allowing multi-select of categories
- Add an "Attributes" section that dynamically shows:
  - Attributes suggested based on selected categories (with visual indicator)
  - Option to expand and see all available attributes
- Add a "Bundle Features" section (shown when type=BUNDLE) allowing:
  - Creating features with name, min/max options
  - Adding options to features (selecting products, setting defaults, quantities)
  - Reordering features and options via drag-and-drop
- Add category management to the product detail page for editing
- Ensure attributes section on product detail page respects category-suggested attributes
- Update API to accept categories, attributes, features, and options during product creation

## Impact
- Affected specs: `product-catalog`
- Affected code:
  - `app/pages/products/new.vue` - add categories, attributes, and bundle configuration sections
  - `app/pages/products/[id].vue` - add category management UI
  - `app/composables/useProducts.ts` - extend createProduct to accept all associations
  - `server/api/products/index.post.ts` - handle all associations in creation
  - New component: `CpqCategorySelector.vue` - reusable category multi-select
  - New component: `CpqBundleFeaturesEditor.vue` - inline feature/option editor

## Dependencies
- Categories → Attributes: When categories change, suggested attributes update
- Product Type → Features: Bundle Features section only visible when type=BUNDLE
- Features → Options: Options depend on their parent feature existing
- Options → Products: Options reference existing standalone products

## UX Flow
1. User fills basic product info (name, SKU, description)
2. User selects product type (STANDALONE or BUNDLE)
3. **If BUNDLE**: User can add features and options inline
4. User optionally selects categories (multi-select with hierarchy display)
5. If categories selected, attributes section shows suggested attributes from those categories
6. User can fill attribute values or skip
7. User completes billing/pricing info
8. Product created with all associations in one API call
