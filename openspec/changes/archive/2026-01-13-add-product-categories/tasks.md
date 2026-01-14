## 1. Database Schema

- [x] 1.1 Add `Category` model to Prisma schema (id, name, description, parentId, isActive)
- [x] 1.2 Add `ProductCategory` junction table for many-to-many relationship
- [x] 1.3 Add `categoryId` field to `Discount` model for category-based discounts
- [x] 1.4 Run migration

## 2. Backend API

- [x] 2.1 Create `GET /api/categories` - List categories (hierarchical)
- [x] 2.2 Create `POST /api/categories` - Create category
- [x] 2.3 Create `GET /api/categories/:id` - Get category with products
- [x] 2.4 Create `PUT /api/categories/:id` - Update category
- [x] 2.5 Create `DELETE /api/categories/:id` - Deactivate category
- [x] 2.6 Create `POST /api/categories/:id/products` - Assign product to category
- [x] 2.7 Create `DELETE /api/categories/:id/products/:productId` - Remove product from category

## 3. Frontend

- [x] 3.1 Create `useCategories` composable
- [x] 3.2 Create categories list page with tree view
- [x] 3.3 Create category detail/edit page
- [x] 3.4 Add category selector to product forms
- [x] 3.5 Add category filter dropdown to products list page

## 4. Integration

- [x] 4.1 Update discount service to resolve category-based discounts
- [x] 4.2 Add seed data with sample categories
- [x] 4.3 Update learn page with category documentation
