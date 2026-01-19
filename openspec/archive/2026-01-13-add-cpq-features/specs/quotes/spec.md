## MODIFIED Requirements

### Requirement: Quote Entity
The system SHALL store quotes with the following attributes:
- Unique identifier (CUID)
- Name (required)
- Reference to Customer (optional for DRAFT, required for finalization)
- Customer name (deprecated, kept for backward compatibility)
- Status (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, ACCEPTED, FINALIZED)
- Reference to PriceBook (required)
- Valid from date (default: creation date)
- Valid to date (required)
- Subtotal (decimal, calculated from line items before discounts)
- Discount total (decimal, sum of all applied discounts)
- Total (decimal, calculated as subtotal - discountTotal)
- Requires approval flag (boolean, set by pricing rules)
- Approved by user (optional)
- Approval timestamp (optional)
- Creation and update timestamps

#### Scenario: Create draft quote
- **WHEN** a quote is created
- **THEN** status is set to DRAFT
- **AND** subtotal, discountTotal, and total are initialized to 0
- **AND** customerId is optional

#### Scenario: Quote references price book
- **WHEN** a quote is created
- **THEN** it MUST reference an active price book for pricing lookups

#### Scenario: Quote inherits customer price book
- **WHEN** a quote is created with a customerId
- **AND** the customer has an assigned price book
- **THEN** the quote uses the customer's price book by default

#### Scenario: Finalize quote requires customer
- **WHEN** a quote status is changed to FINALIZED
- **AND** customerId is null
- **THEN** the operation fails with error "Customer required for finalization"

#### Scenario: Quote requiring approval
- **WHEN** pricing rules flag a quote for approval
- **THEN** requiresApproval is set to true
- **AND** status cannot change to APPROVED without approval workflow

### Requirement: Quote Status Workflow
The system SHALL enforce the following status transitions:
- DRAFT -> PENDING_APPROVAL (when quote requires approval)
- DRAFT -> APPROVED (when no approval required)
- PENDING_APPROVAL -> APPROVED (after approval granted)
- PENDING_APPROVAL -> REJECTED (if approval denied)
- APPROVED -> ACCEPTED (customer accepts)
- APPROVED -> REJECTED (customer declines or expires)
- ACCEPTED -> FINALIZED (order created)

#### Scenario: Submit for approval
- **WHEN** a DRAFT quote with requiresApproval=true is submitted
- **THEN** status changes to PENDING_APPROVAL

#### Scenario: Direct approval
- **WHEN** a DRAFT quote with requiresApproval=false is submitted
- **THEN** status changes directly to APPROVED

#### Scenario: Invalid status transition
- **WHEN** an invalid status transition is attempted
- **THEN** the operation fails with error describing valid transitions

### Requirement: Quotes API
The system SHALL provide REST API endpoints for quote management:
- `GET /api/quotes` - List all quotes
- `GET /api/quotes/:id` - Get quote with line items and applied discounts
- `POST /api/quotes` - Create a new quote
- `PUT /api/quotes/:id` - Update quote attributes
- `POST /api/quotes/:id/lines` - Add line item to quote
- `DELETE /api/quotes/:id/lines/:lineId` - Remove line item from quote
- `POST /api/quotes/:id/calculate` - Recalculate quote totals with rules and discounts
- `POST /api/quotes/:id/submit` - Submit quote for approval or direct approval
- `POST /api/quotes/:id/approve` - Approve a pending quote
- `POST /api/quotes/:id/reject` - Reject a pending quote

#### Scenario: List quotes
- **WHEN** GET /api/quotes is called
- **THEN** return array of all quotes with summary attributes
- **AND** include customer name from linked Customer record

#### Scenario: Get quote with line items
- **WHEN** GET /api/quotes/:id is called
- **THEN** return the quote with nested line items
- **AND** include applied discounts breakdown
- **AND** line items include product details and parent/child relationships

#### Scenario: Add product to quote
- **WHEN** POST /api/quotes/:id/lines is called with productId and quantity
- **THEN** create line item with pricing from quote's price book
- **AND** evaluate pricing rules for applicable discounts
- **AND** recalculate quote totals

#### Scenario: Calculate quote totals
- **WHEN** POST /api/quotes/:id/calculate is called
- **THEN** evaluate all pricing rules
- **AND** apply qualifying discounts
- **AND** sum all line item net prices to get subtotal
- **AND** calculate discountTotal from all applied discounts
- **AND** update quote total as subtotal - discountTotal

#### Scenario: Submit quote for approval
- **WHEN** POST /api/quotes/:id/submit is called
- **THEN** validate customer is assigned (required for submission)
- **AND** evaluate approval rules
- **AND** transition to appropriate status

### Requirement: Create Quote Page
The system SHALL provide a page at `/quotes/new` to create a new quote.

#### Scenario: Create new quote
- **WHEN** user navigates to /quotes/new
- **THEN** display form with quote name, customer selection dropdown, price book selection, and validity dates
- **AND** customer selection shows searchable list from /api/customers
- **AND** on submit, create quote and redirect to quote editor

### Requirement: Quote Editor Page
The system SHALL provide a quote editor page at `/quotes/[id]` for managing quote line items.

#### Scenario: View quote editor
- **WHEN** user navigates to /quotes/:id
- **THEN** display quote header information with customer details
- **AND** display line items in TanStack Table with columns: Product, Quantity, List Price, Discounts, Net Price
- **AND** show quote summary with subtotal, discount breakdown, and total

#### Scenario: Add product from editor
- **WHEN** user clicks "Add Product" in quote editor
- **THEN** display product selector
- **AND** for bundles, display configuration UI before adding
- **AND** after adding, recalculate and show any applied discounts

#### Scenario: Remove line item
- **WHEN** user clicks remove on a line item
- **THEN** delete the line item and recalculate totals

#### Scenario: Submit quote from editor
- **WHEN** user clicks Submit on a DRAFT quote
- **AND** customer is not assigned
- **THEN** prompt user to select a customer before submission

#### Scenario: View approval status
- **WHEN** viewing a quote with status PENDING_APPROVAL
- **THEN** display approval required banner with reason
- **AND** show approve/reject buttons for authorized users
