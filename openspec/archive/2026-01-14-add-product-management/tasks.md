## 1. API Endpoints

- [x] 1.1 Create `server/api/products/[id].put.ts` for product updates
  - Handle product attribute updates (name, description, sku, type, isActive)
  - Validate product exists, return 404 if not found
  - Validate SKU uniqueness if changed
- [x] 1.2 Create `server/api/products/[id].delete.ts` for soft delete
  - Set isActive to false
  - Return success confirmation

## 2. Feature and Option API Endpoints

- [x] 2.1 Create `server/api/products/[id]/features/index.post.ts` to add features
- [x] 2.2 Create `server/api/products/[id]/features/[featureId].put.ts` to update features
- [x] 2.3 Create `server/api/products/[id]/features/[featureId].delete.ts` to delete features
- [x] 2.4 Create `server/api/products/[id]/features/[featureId]/options/index.post.ts` to add options
- [x] 2.5 Create `server/api/products/[id]/features/[featureId]/options/[optionId].put.ts` to update options
- [x] 2.6 Create `server/api/products/[id]/features/[featureId]/options/[optionId].delete.ts` to delete options

## 3. Composable Updates

- [x] 3.1 Add `updateProduct` function to `useProducts` composable
- [x] 3.2 Add `deleteProduct` function to `useProducts` composable
- [x] 3.3 Add feature management functions: `createFeature`, `updateFeature`, `deleteFeature`
- [x] 3.4 Add option management functions: `createOption`, `updateOption`, `deleteOption`
- [x] 3.5 Update `fetchProducts` to support `includeInactive` parameter

## 4. Product Create Page

- [x] 4.1 Create `app/pages/products/new.vue`
  - Form fields: name (required), sku (required), description, type selector
  - Client-side validation for required fields
  - Handle API errors (duplicate SKU)
  - Navigate to product detail on success

## 5. Products List Page Updates

- [x] 5.1 Add "New Product" button to `/products` page header
- [x] 5.2 Add "Show inactive" checkbox filter
- [x] 5.3 Update product cards to show inactive badge for deactivated products

## 6. Product Detail Page Updates

- [x] 6.1 Add Edit button and edit mode toggle
- [x] 6.2 Create edit form for product attributes
- [x] 6.3 Add Save and Cancel buttons in edit mode
- [x] 6.4 Add Deactivate button with confirmation dialog
- [x] 6.5 Handle navigation back to list after deactivation

## 7. Bundle Feature Management UI

- [x] 7.1 Create feature editor modal for adding/editing features
- [x] 7.2 Add "Add Feature" button to bundle product edit mode
- [x] 7.3 Add edit/delete actions to each feature card
- [x] 7.4 Implement drag-and-drop reordering for features

## 8. Bundle Option Management UI

- [x] 8.1 Create option editor modal for adding/editing options
- [x] 8.2 Add product selector dropdown for option's referenced product
- [x] 8.3 Add edit/delete actions to each option row
- [x] 8.4 Implement drag-and-drop reordering for options

## 9. Testing

- [x] 9.1 Verify create standalone product flow
- [x] 9.2 Verify create bundle product flow
- [x] 9.3 Verify edit product flow
- [x] 9.4 Verify deactivate product flow
- [x] 9.5 Verify feature CRUD operations on bundles
- [x] 9.6 Verify option CRUD operations on features
