## 1. Database Schema

- [x] 1.1 Add `AttributeGroup` model (id, name, sortOrder)
- [x] 1.2 Add `Attribute` model (id, name, code, type, groupId, options JSON, constraints JSON, isRequired)
- [x] 1.3 Add `AttributeType` enum (TEXT, NUMBER, BOOLEAN, SELECT, DATE)
- [x] 1.4 Add `ProductAttribute` model (productId, attributeId, value JSON)
- [x] 1.5 Add `CategoryAttribute` model (categoryId, attributeId) for category-level attributes
- [x] 1.6 Run migration (Prisma generate completed)

## 2. Backend API

- [x] 2.1 Create `GET /api/attributes` - List attributes (with optional grouping)
- [x] 2.2 Create `POST /api/attributes` - Create attribute
- [x] 2.3 Create `PUT /api/attributes/:id` - Update attribute
- [x] 2.4 Create `DELETE /api/attributes/:id` - Delete attribute (only if unused)
- [x] 2.5 Create `GET /api/attribute-groups` - List groups
- [x] 2.6 Create `POST /api/attribute-groups` - Create group
- [x] 2.7 Update `GET /api/products/:id` to include attributes
- [x] 2.8 Create `PUT /api/products/:id/attributes` - Set product attributes

## 3. Frontend

- [x] 3.1 Create `useAttributes` composable
- [x] 3.2 Create attribute management page
- [x] 3.3 Create attribute group management
- [x] 3.4 Add attribute value inputs to product edit form
- [x] 3.5 Create dynamic attribute input component (handles all types)
- [x] 3.6 Add attribute display to product detail page
- [x] 3.7 Add attribute badges to product cards (key attributes)
- [x] 3.8 Add attribute filters to product list page

## 4. Rules Integration

- [x] 4.1 Update rule engine context to include product attributes
- [x] 4.2 Add attribute field references in rule conditions
- [x] 4.3 Document attribute-based rule examples (via RuleContext interface)

## 5. Quote Integration

- [x] 5.1 Display key attributes on quote line items
- [x] 5.2 Include attributes in quote preview/document

## 6. Seed Data

- [x] 6.1 Create sample attribute groups (Physical, Technical, Warranty)
- [x] 6.2 Create sample attributes (color, weight, warranty_months, etc.)
- [x] 6.3 Assign attributes to sample products
