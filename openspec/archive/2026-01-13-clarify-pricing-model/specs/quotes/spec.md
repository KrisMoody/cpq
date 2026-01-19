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
- Requires approval flag
- Approval tracking (approvedBy, approvedAt)
- Creation and update timestamps

#### Scenario: Create draft quote
- **WHEN** a quote is created
- **THEN** status is set to DRAFT
- **AND** subtotal, discountTotal, and total are initialized to 0

#### Scenario: Quote references price book
- **WHEN** a quote is created
- **THEN** it MUST reference an active price book for pricing lookups

