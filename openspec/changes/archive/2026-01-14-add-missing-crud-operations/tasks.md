# Tasks: Add Missing CRUD Operations

## 1. Quote Deletion API (Priority: High) ✅
- [x] 1.1 Create `server/api/quotes/[id].delete.ts` endpoint
- [x] 1.2 Implement soft delete (set status to CANCELLED or add isDeleted flag)
- [x] 1.3 Add delete button to quote detail page with confirmation modal
- [x] 1.4 Update quotes list to filter out deleted/cancelled quotes by default
- [x] 1.5 Add ability to view deleted quotes with a toggle

## 2. Customer Tax Exemption Display (Priority: Medium) ✅
- [x] 2.1 Add tax exemption section to customer detail read view (after address section)
- [x] 2.2 Display "Tax Exempt" badge when customer.isTaxExempt is true
- [x] 2.3 Show exemption reason, certificate number, and expiry date
- [x] 2.4 Add visual warning when exemption is expired (taxExemptExpiry < today)

## 3. Price Book Entry Tiers UI (Priority: Medium) ✅
- [x] 3.1 Check if tier CRUD API endpoints exist, create if needed
- [x] 3.2 Add expandable tier section to price book entry rows
- [x] 3.3 Create inline tier editor (add/edit/remove tiers)
- [x] 3.4 Display tier pricing: quantity range and price per tier
- [x] 3.5 Validate tier boundaries (no overlapping quantity ranges)
- [x] 3.6 Show tier type indicator (UNIT_PRICE vs FLAT_PRICE)

## 4. Category Attributes Management (Priority: Medium) ✅
- [x] 4.1 Check if category attribute API endpoints exist, create if needed
- [x] 4.2 Add "Attributes" section to category detail page
- [x] 4.3 Create UI to add/remove attributes from category
- [x] 4.4 Display currently assigned attributes with their types
- [x] 4.5 Consider: Show attribute inheritance from parent categories (not implemented - can be added later if needed)
