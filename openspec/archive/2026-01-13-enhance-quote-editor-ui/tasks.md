# Tasks: Enhance CPQ User Interface

## Phase 1: Navigation & Dashboard
Make new features discoverable from the main UI.

### 1.1 Update main navigation
- [x] Update `app/app.vue` navigation array
- [x] Add: Customers, Discounts, Rules links
- [x] Use appropriate icons (users, tag, cog)
- [x] Ensure mobile dropdown includes all items

### 1.2 Enhance dashboard stats
- [x] Update `app/pages/index.vue`
- [x] Add useCustomers, useDiscounts, useRules composables
- [x] Add stats cards for: Customers, Active Discounts, Active Rules
- [x] Make all stats clickable with "View all" links

### 1.3 Add dashboard quick actions
- [x] Add quick action cards grid (2 rows of 3)
- [x] Cards: Browse Products, Create Quote, Create Customer, Manage Discounts, Configure Rules, Learn CPQ
- [x] Each with icon, title, description, action button

### 1.4 Add recent customers section
- [x] Add "Recent Customers" card alongside "Recent Quotes"
- [x] Show 5 most recent customers
- [x] Display: name, company, quote count
- [x] Link to customer detail page

## Phase 2: API Enhancements
Backend changes needed to support the UI features.

### 2.1 Create apply discount endpoint
- [x] Create `server/api/quotes/[id]/discounts.post.ts`
- [x] Accept: `{ discountId?: string, lineItemId?: string, type?: string, value?: number, reason?: string }`
- [x] Validate discount exists and is applicable
- [x] Create AppliedDiscount record
- [x] Return updated quote

### 2.2 Create remove discount endpoint
- [x] Create `server/api/quotes/[id]/discounts/[appliedDiscountId].delete.ts`
- [x] Delete AppliedDiscount record
- [x] Trigger recalculation
- [x] Return updated quote

### 2.3 Create update line item endpoint
- [x] Create `server/api/quotes/[id]/lines/[lineId].put.ts`
- [x] Accept: `{ quantity: number }`
- [x] Validate quantity >= 1
- [x] Update line item
- [x] Recalculate with price tiers
- [x] Return updated quote

### 2.4 Enhance quote GET endpoint
- [x] Update `server/api/quotes/[id].get.ts`
- [x] Include full customer object in response
- [x] Include appliedDiscounts with discount definition details
- [x] Include priceBook details

### 2.5 Enhance quote calculation endpoint
- [x] Update `server/api/quotes/[id]/calculate.post.ts`
- [x] Include rule evaluation results in response
- [x] Return warnings, errors, and applied actions

## Phase 3: Quote Editor Components
Reusable components for the enhanced editor.

### 3.1 Create QuoteCustomerCard component
- [x] Create `app/components/cpq/QuoteCustomerCard.vue`
- [x] Props: quote, editable
- [x] Display customer info or empty state
- [x] "Change Customer" button triggers CustomerSelector
- [x] Emit customer-change event

### 3.2 Create QuoteDiscountsCard component
- [x] Create `app/components/cpq/QuoteDiscountsCard.vue`
- [x] Props: quote, editable
- [x] List applied discounts grouped by scope
- [x] "Apply Discount" button
- [x] Remove discount button with confirmation

### 3.3 Create ApplyDiscountModal component
- [x] Create `app/components/cpq/ApplyDiscountModal.vue`
- [x] Props: open, quoteId, lineItemId?
- [x] Tabs for Quote vs Line Item discounts
- [x] Search and filter discounts
- [x] Show eligibility status
- [x] Apply button with validation

### 3.4 Create ManualDiscountModal component
- [x] Create `app/components/cpq/ManualDiscountModal.vue`
- [x] Props: open, quoteId, lineItemId?
- [x] Type selector (% or $)
- [x] Value input with validation
- [x] Required reason textarea
- [x] Apply button

### 3.5 Create QuoteRulesPanel component
- [x] Create `app/components/cpq/QuoteRulesPanel.vue`
- [x] Props: evaluationResult
- [x] Collapsible panel
- [x] Sections for warnings, errors, applied actions
- [x] Auto-expand when warnings/errors exist

### 3.6 Create QuoteApprovalBanner component
- [x] Create `app/components/cpq/QuoteApprovalBanner.vue`
- [x] Props: quote
- [x] Show approval required reason
- [x] Approve/Reject buttons
- [x] Rejection reason modal

### 3.7 Enhance QuoteLineItem component
- [x] Update `app/components/cpq/QuoteLineItem.vue`
- [x] Add inline quantity editing
- [x] Show applied discounts as pills
- [x] Add "Apply Discount" context action
- [x] Debounced quantity update

### 3.8 Enhance PricingSummary component
- [x] Update `app/components/cpq/PricingSummary.vue`
- [x] Add discount breakdown section
- [x] Show savings percentage
- [x] Add "Apply Discount" action when empty

## Phase 4: Quote Editor Integration
Integrate components into the quote editor page.

### 4.1 Add customer section to editor
- [x] Update `app/pages/quotes/[id].vue`
- [x] Add QuoteCustomerCard to right column
- [x] Handle customer change event
- [x] Prompt for recalculation on price book change

### 4.2 Add discounts section to editor
- [x] Add QuoteDiscountsCard to right column
- [x] Wire up apply/remove discount handlers
- [x] Refresh quote data after changes

### 4.3 Add rules panel to editor
- [x] Add QuoteRulesPanel below pricing summary
- [x] Populate from calculation response
- [x] Auto-expand on warnings

### 4.4 Add approval workflow UI
- [x] Add QuoteApprovalBanner when status requires it
- [x] Update dropdown menu with proper submit action
- [x] Handle approval/rejection flow

### 4.5 Integrate line item editing
- [x] Replace QuoteLineItem with editable version
- [x] Handle quantity change events
- [x] Show loading state during updates

### 4.6 Wire up discount modals
- [x] Add ApplyDiscountModal to editor
- [x] Add ManualDiscountModal to editor
- [x] Connect button clicks to modal opens

## Phase 5: Composable Enhancements
Update composables to support new features.

### 5.1 Enhance useQuotes composable
- [x] Add `applyDiscount(quoteId, discountId, lineItemId?)` method
- [x] Add `applyManualDiscount(quoteId, data)` method
- [x] Add `removeDiscount(quoteId, appliedDiscountId)` method
- [x] Add `updateLineItem(quoteId, lineId, data)` method
- [x] Update `calculateQuote` to return evaluation results

### 5.2 Add TypeScript interfaces
- [x] Add `RuleEvaluationResult` interface
- [x] Add `ApplyDiscountRequest` interface
- [x] Update `QuoteWithLineItems` to include evaluation results

## Phase 6: Polish and Validation

### 6.1 Add loading states
- [x] Add loading indicators for all async operations
- [x] Disable buttons during operations
- [x] Show skeleton loaders where appropriate

### 6.2 Add error handling
- [x] Display user-friendly error messages
- [x] Handle discount validation errors
- [x] Handle customer change errors
- [x] Handle quantity update errors

### 6.3 Add confirmation dialogs
- [x] Confirm discount removal
- [x] Confirm customer change if prices will change
- [x] Confirm rejection with reason

### 6.4 Add keyboard navigation
- [x] Enter to save quantity
- [x] Escape to cancel edits
- [x] Tab through editable fields

### 6.5 Manual testing
- [x] Test navigation to all new pages
- [x] Test dashboard stats and quick actions
- [x] Test full discount application flow
- [x] Test customer change with price book change
- [x] Test approval workflow end-to-end
- [x] Test inline quantity editing
- [x] Test rule evaluation display

## Dependencies
- Phase 2 can run parallel to Phase 1
- Phase 3 depends on Phase 2 (APIs must exist)
- Phase 4 depends on Phase 3 (components must exist)
- Phase 5 can run parallel to Phase 3-4
- Phase 6 depends on Phase 4-5

## Parallelization
- Tasks 1.1-1.4 can run in parallel
- Tasks 2.1-2.5 can run in parallel
- Tasks 3.1-3.8 can run in parallel
- Tasks 4.1-4.6 can run in parallel after Phase 3
- Tasks 6.1-6.5 can run in parallel
