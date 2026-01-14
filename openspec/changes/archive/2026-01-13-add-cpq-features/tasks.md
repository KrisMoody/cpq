# Implementation Tasks

## 1. Database Schema (Prisma)
- [x] 1.1 Add Customer model with contact fields and priceBookId reference
- [x] 1.2 Add Rule model with type, trigger, priority, condition/action JSON fields
- [x] 1.3 Add Discount model with type, value, scope, validity dates
- [x] 1.4 Add DiscountTier model linked to Discount
- [x] 1.5 Add AppliedDiscount model for tracking discounts on quotes
- [x] 1.6 Add PriceTier model linked to PriceBookEntry for volume pricing
- [x] 1.7 Modify Quote model: add customerId FK, discountTotal, requiresApproval, approvedBy, approvedAt
- [x] 1.8 Add new QuoteStatus values: PENDING_APPROVAL, FINALIZED
- [x] 1.9 Run migration and verify schema

## 2. Customer Capability
- [x] 2.1 Create Customer API routes (GET list, GET/:id, POST, PUT/:id, DELETE/:id)
- [x] 2.2 Create useCustomers composable for state management
- [x] 2.3 Create CustomersTable component
- [x] 2.4 Create /customers list page
- [x] 2.5 Create /customers/new page with form
- [x] 2.6 Create /customers/[id] detail page with edit capability
- [x] 2.7 Add customer selector component for quote creation

## 3. Rules Capability
- [x] 3.1 Create Rule API routes (CRUD + evaluate endpoint)
- [x] 3.2 Create rule evaluation service with condition parser
- [x] 3.3 Create configuration rule actions (require/exclude option)
- [x] 3.4 Create pricing rule actions (apply discount, require approval)
- [x] 3.5 Create useRules composable
- [x] 3.6 Create /rules list page with type filtering
- [x] 3.7 Create rule builder UI component for conditions
- [x] 3.8 Integrate rule evaluation into quote line item addition
- [x] 3.9 Integrate rule evaluation into quote calculation

## 4. Discount Management
- [x] 4.1 Create Discount API routes (CRUD)
- [x] 4.2 Create discount tier CRUD within discount endpoints
- [x] 4.3 Create AppliedDiscount API routes (apply/remove from quote)
- [x] 4.4 Create discount calculation service
- [x] 4.5 Implement stackable vs non-stackable discount logic
- [x] 4.6 Implement discount application strategies (per-line, quote-level)
- [x] 4.7 Create useDiscounts composable
- [x] 4.8 Create /discounts list page
- [x] 4.9 Create discount form with tier builder UI
- [x] 4.10 Create discount breakdown component for quote editor

## 5. Price Book Enhancements
- [x] 5.1 Add PriceTier model support to price book entry endpoints
- [x] 5.2 Create price lookup service with tier evaluation
- [x] 5.3 Create /api/price-books/lookup endpoint
- [x] 5.4 Update price entry form to support tier management
- [x] 5.5 Update quote line item creation to use tiered pricing

## 6. Quote Modifications
- [x] 6.1 Update Quote API to support customerId
- [x] 6.2 Update quote creation to use customer's price book if assigned
- [x] 6.3 Update quote calculation to integrate discount service
- [x] 6.4 Add /api/quotes/:id/submit endpoint with approval logic
- [x] 6.5 Add /api/quotes/:id/approve and /reject endpoints
- [x] 6.6 Implement status transition validation
- [x] 6.7 Update /quotes/new page with customer selector
- [x] 6.8 Update quote editor to show discount breakdown
- [x] 6.9 Add approval UI elements (banner, buttons) to quote editor
- [x] 6.10 Add customer requirement validation for finalization

## 7. Integration Testing
- [x] 7.1 Test customer-to-quote association flow
- [x] 7.2 Test rule evaluation on product addition
- [x] 7.3 Test volume tier pricing calculations
- [x] 7.4 Test discount stacking and conflict resolution
- [x] 7.5 Test approval workflow transitions
- [x] 7.6 Test quote finalization with customer requirement

## 8. Data Migration
- [x] 8.1 Remove deprecated customerName field
  - [x] 8.1.1 Update server/api/quotes/index.get.ts - Remove customerName from select, use customer.name
  - [x] 8.1.2 Update server/api/quotes/index.post.ts - Remove customerName from create
  - [x] 8.1.3 Update server/api/quotes/[id].get.ts - Remove customerName fallback
  - [x] 8.1.4 Update server/api/quotes/[id].put.ts - Remove customerName from update
  - [x] 8.1.5 Update server/api/quotes/[id]/approve.post.ts - Remove customerName from response
  - [x] 8.1.6 Update server/api/quotes/[id]/reject.post.ts - Remove customerName from response
  - [x] 8.1.7 Update server/api/quotes/[id]/submit.post.ts - Remove customerName from response
  - [x] 8.1.8 Update app/composables/useQuotes.ts - Remove customerName from Quote type
  - [x] 8.1.9 Update app/components/tables/QuotesTable.vue - Use customer?.name
  - [x] 8.1.10 Update app/pages/index.vue - Use customer?.name in dashboard
  - [x] 8.1.11 Remove customerName field from prisma/schema.prisma
  - [x] 8.1.12 Create Prisma migration (schema updated, migration pending deployment)
  - [x] 8.1.13 Regenerate Prisma client
- [x] 8.2 Seed sample customers for testing
- [x] 8.3 Seed sample rules (config and pricing)
- [x] 8.4 Seed sample discounts with tiers
