## MODIFIED Requirements

### Requirement: Quote Editor Page
The system SHALL provide an enhanced quote editor page at `/quotes/[id]` with integrated customer, discount, and rules management.

#### Scenario: View quote with customer
- **WHEN** user views a quote with an assigned customer
- **THEN** display customer card showing name, company, email, and linked price book
- **AND** show "View Customer" link to customer detail page
- **AND** show "Change Customer" button when quote is DRAFT

#### Scenario: View quote without customer
- **WHEN** user views a quote without an assigned customer
- **THEN** display customer card with "No customer selected" message
- **AND** show "Select Customer" button when quote is DRAFT
- **AND** show warning icon indicating customer required for finalization

#### Scenario: Change customer on quote
- **WHEN** user clicks "Change Customer" on a DRAFT quote
- **THEN** open customer selector modal with search functionality
- **AND** when customer is selected, update quote's customerId
- **AND** if new customer has a different price book, prompt to recalculate prices

#### Scenario: View applied discounts
- **WHEN** user views a quote with applied discounts
- **THEN** display discounts card showing all applied discounts
- **AND** group discounts by scope (Quote-level vs Line Item)
- **AND** show discount name, type badge (% or $), value, and calculated amount

#### Scenario: View line item discounts
- **WHEN** viewing a line item with applied discounts
- **THEN** show discount pills/badges below the price
- **AND** show total discount amount for that line
- **AND** hovering shows discount breakdown tooltip

### Requirement: Discount Application UI
The system SHALL provide UI for applying discounts to quotes and line items.

#### Scenario: Open apply discount modal
- **WHEN** user clicks "Apply Discount" button
- **THEN** open modal with tabs for Quote Discounts and Line Item Discounts
- **AND** show searchable list of available discounts
- **AND** filter discounts by scope matching the selected tab

#### Scenario: View discount eligibility
- **WHEN** viewing a discount in the apply modal
- **THEN** show discount name, description, type, and value
- **AND** show eligibility criteria (min quantity, min order value, date range)
- **AND** indicate if discount is currently applicable with checkmark or warning

#### Scenario: Apply discount to quote
- **WHEN** user selects a quote-level discount and clicks Apply
- **THEN** validate discount applicability against quote state
- **AND** if valid, create AppliedDiscount record
- **AND** recalculate quote totals
- **AND** close modal and refresh discount display

#### Scenario: Apply discount to line item
- **WHEN** user selects a line-item discount from a line's context menu
- **THEN** open discount selector filtered to LINE_ITEM scope
- **AND** when discount selected, apply to that specific line item
- **AND** recalculate line and quote totals

#### Scenario: Remove applied discount
- **WHEN** user clicks remove on an applied discount
- **THEN** show confirmation dialog
- **AND** on confirm, delete AppliedDiscount record
- **AND** recalculate quote totals

#### Scenario: Add manual discount
- **WHEN** user clicks "Add Manual Discount"
- **THEN** open form with type selector, value input, and reason textarea
- **AND** reason field is required
- **AND** on submit, create AppliedDiscount without discountId reference
- **AND** store reason for audit trail

### Requirement: Line Item Inline Editing
The system SHALL support inline editing of line item quantities.

#### Scenario: Edit line item quantity
- **WHEN** user clicks on quantity field in a line item
- **THEN** display editable number input
- **AND** accept values >= 1
- **AND** on blur or Enter, save new quantity

#### Scenario: Quantity change triggers recalculation
- **WHEN** line item quantity is changed
- **THEN** call API to update line item quantity
- **AND** recalculate line item pricing with volume tiers
- **AND** re-evaluate pricing rules
- **AND** update quote totals

#### Scenario: Quantity change respects rules
- **WHEN** quantity change triggers a rule
- **THEN** display rule result (warning, discount applied, etc.)
- **AND** if rule blocks the change, revert quantity and show error

### Requirement: Rules Evaluation Panel
The system SHALL display rule evaluation results in the quote editor.

#### Scenario: View rules panel
- **WHEN** user views a quote that has been calculated
- **THEN** display collapsible rules panel
- **AND** panel is expanded by default if warnings or errors exist

#### Scenario: View warnings
- **WHEN** rules evaluation returned warnings
- **THEN** display warnings section with amber styling
- **AND** show each warning with rule name and message
- **AND** warnings do not block quote progression

#### Scenario: View errors
- **WHEN** rules evaluation returned errors
- **THEN** display errors section with red styling
- **AND** show each error with rule name and message
- **AND** errors block status transitions until resolved

#### Scenario: View applied rule actions
- **WHEN** rules applied automatic discounts or adjustments
- **THEN** display applied actions section with green styling
- **AND** show what each rule did (e.g., "Applied 10% volume discount")

#### Scenario: Understand approval requirement
- **WHEN** quote has requiresApproval flag set
- **THEN** show which rule(s) triggered the approval requirement
- **AND** display the rule's message explaining why

### Requirement: Quote Approval Workflow UI
The system SHALL provide UI for the quote approval workflow.

#### Scenario: Submit quote for approval
- **WHEN** user clicks Submit on a DRAFT quote
- **AND** quote requires approval (requiresApproval = true)
- **THEN** validate customer is assigned
- **AND** change status to PENDING_APPROVAL
- **AND** display "Pending Approval" banner with reason

#### Scenario: Submit quote directly
- **WHEN** user clicks Submit on a DRAFT quote
- **AND** quote does not require approval
- **THEN** validate customer is assigned
- **AND** change status directly to APPROVED

#### Scenario: Submit without customer
- **WHEN** user clicks Submit without a customer assigned
- **THEN** show error message "Please select a customer before submitting"
- **AND** open customer selector modal

#### Scenario: Approve pending quote
- **WHEN** user clicks Approve on a PENDING_APPROVAL quote
- **THEN** change status to APPROVED
- **AND** record approvedBy and approvedAt
- **AND** display success confirmation

#### Scenario: Reject pending quote
- **WHEN** user clicks Reject on a PENDING_APPROVAL quote
- **THEN** open rejection reason modal
- **AND** require reason input
- **AND** change status to REJECTED
- **AND** store rejection reason

#### Scenario: View approval status
- **WHEN** viewing an APPROVED quote
- **THEN** show who approved and when
- **WHEN** viewing a REJECTED quote
- **THEN** show who rejected, when, and the rejection reason

### Requirement: Enhanced Pricing Summary
The system SHALL display an enhanced pricing summary with discount breakdown.

#### Scenario: View pricing breakdown
- **WHEN** viewing quote with applied discounts
- **THEN** show subtotal (before discounts)
- **AND** show itemized list of applied discounts with amounts
- **AND** show total discount amount with savings percentage
- **AND** show final total

#### Scenario: View empty discount state
- **WHEN** viewing quote without discounts
- **THEN** show subtotal equals total
- **AND** show "No discounts applied" message
- **AND** show "Apply Discount" action button

## ADDED Requirements

### Requirement: Quote Discount API
The system SHALL provide API endpoints for managing quote discounts.

#### Scenario: Apply discount endpoint
- **WHEN** POST /api/quotes/:id/discounts is called with discountId
- **THEN** validate discount exists and is active
- **AND** validate discount scope matches target (quote or line item)
- **AND** validate discount eligibility criteria
- **AND** create AppliedDiscount record
- **AND** return updated quote with new discount

#### Scenario: Apply manual discount endpoint
- **WHEN** POST /api/quotes/:id/discounts is called without discountId
- **THEN** require type, value, and reason in body
- **AND** create AppliedDiscount record with reason
- **AND** return updated quote

#### Scenario: Remove discount endpoint
- **WHEN** DELETE /api/quotes/:id/discounts/:appliedDiscountId is called
- **THEN** delete the AppliedDiscount record
- **AND** recalculate quote totals
- **AND** return updated quote

### Requirement: Line Item Update API
The system SHALL provide API endpoint for updating line item quantity.

#### Scenario: Update line item quantity
- **WHEN** PUT /api/quotes/:id/lines/:lineId is called with quantity
- **THEN** update line item quantity
- **AND** recalculate line item pricing with new quantity
- **AND** apply volume tier pricing if applicable
- **AND** re-evaluate pricing rules
- **AND** recalculate quote totals
- **AND** return updated quote

#### Scenario: Invalid quantity
- **WHEN** quantity is less than 1
- **THEN** return 400 error with message "Quantity must be at least 1"
