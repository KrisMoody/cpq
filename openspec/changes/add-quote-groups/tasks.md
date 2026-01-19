# Tasks: Add Quote Groups

## 1. Database Schema
- [ ] 1.1 Add QuoteGroup model to Prisma schema
- [ ] 1.2 Add groupId foreign key to QuoteLineItem
- [ ] 1.3 Add group totals fields to Quote model
- [ ] 1.4 Run migration and generate Prisma client

## 2. Backend API
- [ ] 2.1 Create group management endpoints (CRUD)
- [ ] 2.2 Update quote service to handle group operations
- [ ] 2.3 Update pricing engine for group-level calculations
- [ ] 2.4 Update quote total calculation for grand totals
- [ ] 2.5 Add API for moving line items between groups

## 3. Frontend UI
- [ ] 3.1 Add group management UI to quote editor
- [ ] 3.2 Implement drag-and-drop for line items between groups
- [ ] 3.3 Display group subtotals in quote summary
- [ ] 3.4 Add optional group toggle (include/exclude)
- [ ] 3.5 Update quote preview to show grouped sections

## 4. Validation
- [ ] 4.1 Verify group creation and deletion
- [ ] 4.2 Test line item movement between groups
- [ ] 4.3 Verify subtotal calculations per group
- [ ] 4.4 Test optional group inclusion/exclusion
- [ ] 4.5 Verify quote preview renders groups correctly
