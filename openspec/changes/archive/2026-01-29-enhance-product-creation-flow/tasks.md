# Implementation Tasks

## 1. API Layer

- [x] 1.1 Extend POST /api/products to accept `categoryIds`, `attributes`, and `features` with nested `options`
- [x] 1.2 Add transaction-based creation that atomically creates product + all associations
- [x] 1.3 Add validation: features only allowed for BUNDLE type
- [x] 1.4 Add validation: option products must exist and be STANDALONE
- [x] 1.5 Add PUT /api/products/:id/categories endpoint for updating product categories
- [x] 1.6 Add GET /api/categories/attributes endpoint to fetch attributes for multiple category IDs

## 2. Reusable Components

- [x] 2.1 Create `CpqCategorySelector.vue` component
  - Multi-select with hierarchical display
  - Shows categories with indentation
  - Removable chips for selected categories
  - Uses `useCategories` composable
- [x] 2.2 Create `CpqBundleFeaturesEditor.vue` component
  - Local state management for features/options
  - Add/edit/delete features inline
  - Add/edit/delete options per feature
  - Drag-and-drop reordering
  - Product selector for options (filters to active STANDALONE)
  - Modals for feature and option editing

## 3. Product Create Page Updates

- [x] 3.1 Add Categories section after Product Type section
  - Uses `CpqCategorySelector`
  - Updates form state with selected category IDs
- [x] 3.2 Add Bundle Features section (conditional on type=BUNDLE)
  - Uses `CpqBundleFeaturesEditor`
  - Appears between Product Type and Categories
  - Updates form state with features/options
- [x] 3.3 Add Attributes section after Categories
  - Fetch category attributes when categories change
  - Show "Suggested Attributes" from selected categories with badge
  - Show expandable "All Attributes" section
  - Uses existing `CpqAttributeInput` component
- [x] 3.4 Update form submission to include all new fields
- [x] 3.5 Update `useProducts.createProduct` to accept new parameters

## 4. Product Detail Page Updates

- [x] 4.1 Add Categories section card showing assigned categories
  - Display categories with hierarchy path (e.g., "Hardware > Storage")
  - "Edit Categories" button opens modal
- [x] 4.2 Add categories edit modal
  - Uses `CpqCategorySelector`
  - Calls PUT /api/products/:id/categories on save
- [x] 4.3 Enhance Attributes section to show category-suggested attributes
  - Fetch category attributes for product's categories
  - Show suggested attributes with visual indicator
  - Group by attribute group as currently done

## 5. Composable Updates

- [x] 5.1 Extend `useProducts.createProduct` signature to accept full payload
- [x] 5.2 Add `updateProductCategories` function to `useProducts`
- [x] 5.3 Add `fetchCategoryAttributesBulk` to `useCategories` or new composable

## 6. Validation & Polish

- [x] 6.1 Add client-side validation for feature names (required)
- [x] 6.2 Add client-side validation for option product selection (required)
- [x] 6.3 Add loading states for category/attribute fetching
- [x] 6.4 Add error handling for failed saves
- [x] 6.5 Test form with various combinations (standalone, bundle, with/without categories)

## 7. Testing

- [x] 7.1 Test creating standalone product with categories and attributes
- [x] 7.2 Test creating bundle product with features, options, categories, and attributes
- [x] 7.3 Test editing categories on product detail page
- [x] 7.4 Test that category-suggested attributes update dynamically
- [x] 7.5 Verify backward compatibility (create product without new fields)

## Dependencies

- Task 2.1 and 2.2 can be done in parallel
- Task 3.x depends on 2.x (needs components)
- Task 4.x depends on 2.1 (reuses category selector)
- Task 1.x can be done in parallel with 2.x
- Task 5.x should be done alongside or before 3.x and 4.x
- Task 6.x and 7.x are final validation steps
