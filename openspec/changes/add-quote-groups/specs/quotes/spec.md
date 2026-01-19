# quotes Specification Delta

## MODIFIED Requirements

### Requirement: Quote Entity
The system SHALL store quotes with the following attributes:
- Unique identifier (CUID)
- Name (required)
- Customer name (optional)
- Status (DRAFT, PENDING, PENDING_APPROVAL, APPROVED, REJECTED, ACCEPTED, FINALIZED)
- Reference to PriceBook (required)
- Valid from date (default: creation date)
- Valid to date (required)
- Subtotal (decimal, calculated as sum of line item netPrices)
- Discount total (decimal, sum of all applied discounts)
- Tax amount (decimal, calculated tax)
- Tax breakdown (JSON, array of applied taxes)
- Total (decimal, calculated as subtotal - quote-level discounts + tax)
- Grand subtotal (decimal, sum of selected groups' subtotals plus ungrouped items)
- Grand discount total (decimal, sum of selected groups' discount totals)
- Grand tax amount (decimal, sum of selected groups' tax amounts)
- Grand total (decimal, sum of selected groups' totals plus ungrouped items)
- Requires approval flag
- Approval tracking (approvedBy, approvedAt)
- Creation and update timestamps

#### Scenario: Create draft quote
- **WHEN** a quote is created
- **THEN** status is set to DRAFT
- **AND** subtotal, discountTotal, total, and grand totals are initialized to 0

#### Scenario: Quote references price book
- **WHEN** a quote is created
- **THEN** it MUST reference an active price book for pricing lookups

#### Scenario: Quote with groups
- **WHEN** a quote has groups
- **THEN** grand totals reflect sum of selected groups plus ungrouped items
- **AND** legacy totals (subtotal, total) remain for backward compatibility

### Requirement: Quote Line Item Entity
The system SHALL store quote line items with the following attributes:
- Unique identifier (CUID)
- Reference to Quote (required, cascade delete)
- Reference to Product (required)
- Reference to parent QuoteLineItem (optional, for bundle components)
- Reference to QuoteGroup (optional, for grouped items)
- Quantity (integer, default 1)
- List price (decimal, from price book)
- Discount (decimal, default 0)
- Net price (decimal, calculated as listPrice - discount)
- Sort order for display (default 0)

#### Scenario: Standalone product line item
- **WHEN** a standalone product is added to a quote
- **THEN** a line item is created with no parentLineId
- **AND** listPrice is looked up from the quote's price book

#### Scenario: Bundle line item with children
- **WHEN** a bundle product is added to a quote with configured options
- **THEN** a parent line item is created for the bundle
- **AND** child line items are created for each selected option
- **AND** child line items reference the parent via parentLineId

#### Scenario: Grouped line item
- **WHEN** a line item is added to a group
- **THEN** it has a groupId reference
- **AND** it contributes to the group's totals

#### Scenario: Cascade delete line items
- **WHEN** a quote is deleted
- **THEN** all associated line items are deleted
