# Quotes

Manages quotes and quote line items for customer pricing proposals.

## ADDED Requirements

### Requirement: Quote Entity
The system SHALL store quotes with the following attributes:
- Unique identifier (CUID)
- Name (required)
- Customer name (optional)
- Status (DRAFT, PENDING, APPROVED, REJECTED, ACCEPTED)
- Reference to PriceBook (required)
- Valid from date (default: creation date)
- Valid to date (required)
- Subtotal (decimal, calculated)
- Discount (decimal, default 0)
- Total (decimal, calculated)
- Creation and update timestamps

#### Scenario: Create draft quote
- **WHEN** a quote is created
- **THEN** status is set to DRAFT
- **AND** subtotal, discount, and total are initialized to 0

#### Scenario: Quote references price book
- **WHEN** a quote is created
- **THEN** it MUST reference an active price book for pricing lookups

### Requirement: Quote Line Item Entity
The system SHALL store quote line items with the following attributes:
- Unique identifier (CUID)
- Reference to Quote (required, cascade delete)
- Reference to Product (required)
- Reference to parent QuoteLineItem (optional, for bundle components)
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

#### Scenario: Cascade delete line items
- **WHEN** a quote is deleted
- **THEN** all associated line items are deleted

### Requirement: Quotes API
The system SHALL provide REST API endpoints for quote management:
- `GET /api/quotes` - List all quotes
- `GET /api/quotes/:id` - Get quote with line items
- `POST /api/quotes` - Create a new quote
- `PUT /api/quotes/:id` - Update quote attributes
- `POST /api/quotes/:id/lines` - Add line item to quote
- `DELETE /api/quotes/:id/lines/:lineId` - Remove line item from quote
- `POST /api/quotes/:id/calculate` - Recalculate quote totals

#### Scenario: List quotes
- **WHEN** GET /api/quotes is called
- **THEN** return array of all quotes with summary attributes

#### Scenario: Get quote with line items
- **WHEN** GET /api/quotes/:id is called
- **THEN** return the quote with nested line items
- **AND** line items include product details and parent/child relationships

#### Scenario: Add product to quote
- **WHEN** POST /api/quotes/:id/lines is called with productId and quantity
- **THEN** create line item with pricing from quote's price book
- **AND** recalculate quote totals

#### Scenario: Calculate quote totals
- **WHEN** POST /api/quotes/:id/calculate is called
- **THEN** sum all line item net prices to get subtotal
- **AND** apply quote-level discount
- **AND** update quote total

### Requirement: Quotes List Page
The system SHALL provide a quotes list page at `/quotes` displaying all quotes in a sortable, filterable table using TanStack Table.

#### Scenario: View quotes table
- **WHEN** user navigates to /quotes
- **THEN** display a table with columns: Name, Customer, Status, Total, Valid To
- **AND** table supports sorting and filtering

### Requirement: Create Quote Page
The system SHALL provide a page at `/quotes/new` to create a new quote.

#### Scenario: Create new quote
- **WHEN** user navigates to /quotes/new
- **THEN** display form with quote name, customer name, price book selection, and validity dates
- **AND** on submit, create quote and redirect to quote editor

### Requirement: Quote Editor Page
The system SHALL provide a quote editor page at `/quotes/[id]` for managing quote line items.

#### Scenario: View quote editor
- **WHEN** user navigates to /quotes/:id
- **THEN** display quote header information
- **AND** display line items in TanStack Table with columns: Product, Quantity, List Price, Discount, Net Price
- **AND** show quote summary with subtotal, discount, and total

#### Scenario: Add product from editor
- **WHEN** user clicks "Add Product" in quote editor
- **THEN** display product selector
- **AND** for bundles, display configuration UI before adding

#### Scenario: Remove line item
- **WHEN** user clicks remove on a line item
- **THEN** delete the line item and recalculate totals
