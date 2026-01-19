# Change: Add Missing CRUD Operations

## Why

After a comprehensive audit of all parent-child model relationships in the CPQ system, several gaps were identified where child entities cannot be managed from parent context, or where CRUD operations are incomplete. This impacts user workflows that expect to manage related data together.

## What Changes

### Validated Gaps

#### 1. Quote Deletion API - **CONFIRMED** (Priority: High)
- **Evidence**: No `server/api/quotes/[id].delete.ts` file exists
- **Files found**: `[id].get.ts`, `[id].put.ts`, but no delete endpoint
- Currently quotes can only change status (DRAFT → PENDING_APPROVAL → APPROVED/REJECTED)
- No way to remove erroneously created quotes or clean up old drafts

#### 2. Customer Tax Exemption Display - **CONFIRMED** (Priority: Medium)
- **Evidence**: [app/pages/customers/[id].vue](app/pages/customers/[id].vue) lines 288-311
- Read view only shows: email, phone, address, price book
- Missing display of: isTaxExempt status, taxExemptReason, taxExemptCertificate, taxExemptExpiry
- Edit form (lines 259-277) supports these fields, but read view doesn't display them

#### 3. Price Book Entry Tiers UI - **CONFIRMED** (Priority: Medium)
- **Evidence**: [app/pages/price-books/[id].vue](app/pages/price-books/[id].vue) lines 341-435
- Table shows: Product, SKU, List Price, Cost, Margin
- Database has `PriceTier` model (minQuantity, maxQuantity, tierPrice, tierType)
- **No UI exists** for creating, viewing, or managing price tiers on entries
- Volume pricing is a core CPQ feature that is modeled but not exposed

#### 4. Category Attributes Management - **CONFIRMED** (Priority: Medium)
- **Evidence**: [app/pages/categories/[id].vue](app/pages/categories/[id].vue) - no attribute UI
- Database has `CategoryAttribute` model linking categories to attributes
- Category detail page manages products but **not attributes**
- Use case: Define which attributes should be shown/required for products in a category

### Not Gaps (Design Decisions)

The following are intentional design patterns, not gaps:

| Entity | Pattern | Rationale |
|--------|---------|-----------|
| **Product CREATE** | Basic info only, then add children | Common pattern - create parent, then configure details |
| **Quote CREATE** | Name/customer/price book only | Same pattern - quotes are built incrementally |
| **Category CREATE** | No products during creation | Products are added after category exists |
| **PriceBook CREATE** | No entries during creation | Entries reference products, added later |

### Fully Supported Parent-Child Relationships

| Parent | Children | CREATE | Detail View | Notes |
|--------|----------|--------|-------------|-------|
| **Product** | Features | ❌ | ✅ Full CRUD | Add features after creation |
| **Product** | Options | ❌ | ✅ Full CRUD | Managed within features |
| **Product** | Attributes | ❌ | ✅ Full CRUD via modal | Works well |
| **Quote** | LineItems | ❌ | ✅ Full CRUD | Add products after creation |
| **Quote** | AppliedDiscounts | ❌ | ✅ Full CRUD | Predefined + manual |
| **Category** | Products | ❌ | ✅ Full CRUD | Add/remove products |
| **Category** | Children | ❌ | ✅ Display + link | Create via new category form |
| **Discount** | Tiers | ✅ | ✅ Full CRUD | **Excellent** - can add during creation |
| **Attribute** | Options (SELECT) | ✅ | ✅ Full CRUD | Can add during creation |
| **Attribute** | Group | ✅ | ✅ | Assign on create/edit |
| **AttributeGroup** | Attributes | N/A | ✅ Full CRUD via modal | Managed from index page |
| **UnitOfMeasure** | Derived units | N/A | ✅ Display | Created separately with baseUnitId |
| **PriceBook** | Entries | ❌ | ✅ Full CRUD | Works well |
| **PriceBookEntry** | Tiers | ❌ | ❌ **NO UI** | **GAP** |
| **Category** | Attributes | ❌ | ❌ **NO UI** | **GAP** |

## Impact

- **Affected specs**: quotes, price-books, product-categories (new capability: crud-completeness)
- **Affected code**:
  - `server/api/quotes/[id].delete.ts` - New file for quote deletion
  - `app/pages/customers/[id].vue` - Add tax exempt display section
  - `app/pages/price-books/[id].vue` - Add tier management UI per entry
  - `app/pages/categories/[id].vue` - Add category attributes management
  - API endpoints for category attributes (if not existing)

## Summary

| Gap | Type | Priority | Effort |
|-----|------|----------|--------|
| Quote deletion | API | **High** | Low |
| Customer tax exempt display | UI | **Medium** | Low |
| Price book entry tiers | UI + possibly API | **Medium** | Medium |
| Category attributes | UI + API | **Medium** | Medium |
