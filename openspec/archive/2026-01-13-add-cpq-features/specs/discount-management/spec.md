## ADDED Requirements

### Requirement: Discount Entity
The system SHALL store discount definitions with the following attributes:
- Unique identifier (CUID)
- Name (required)
- Description (optional)
- Type: PERCENTAGE or FIXED_AMOUNT (required)
- Value (decimal, required - percentage as 0-100 or fixed amount)
- Scope: LINE_ITEM, QUOTE, or PRODUCT_CATEGORY (required)
- Minimum quantity threshold (optional, for volume discounts)
- Maximum quantity threshold (optional, for tiered ranges)
- Minimum order value (optional, for value-based qualification)
- Valid from date (optional)
- Valid to date (optional)
- Active status (boolean, default true)
- Stackable flag (boolean, default false - can combine with other discounts)
- Priority (integer, default 100 - for application order)
- Creation and update timestamps

#### Scenario: Create percentage discount
- **WHEN** a discount is created with type PERCENTAGE and value 15
- **THEN** the discount applies 15% off to qualifying items

#### Scenario: Create fixed amount discount
- **WHEN** a discount is created with type FIXED_AMOUNT and value 50
- **THEN** the discount applies $50 off to qualifying items

#### Scenario: Volume tier discount
- **WHEN** a discount has minQuantity 10 and maxQuantity 24
- **THEN** the discount only applies when line item quantity is between 10-24 inclusive

### Requirement: Discount Tier Entity
The system SHALL support tiered discount structures with multiple tiers per discount:
- Reference to parent Discount (required)
- Tier number (integer, required)
- Minimum quantity (required)
- Maximum quantity (optional, null = unlimited)
- Discount percentage or amount for this tier

#### Scenario: Multi-tier volume pricing
- **WHEN** a discount has tiers: 1-9 units (0%), 10-24 units (10%), 25+ units (20%)
- **AND** line item quantity is 15
- **THEN** the 10% tier discount applies

#### Scenario: Tier escalation
- **WHEN** quantity increases from 9 to 10
- **THEN** the applicable tier changes and discount recalculates

### Requirement: Applied Discount Entity
The system SHALL track discounts applied to quotes with:
- Unique identifier (CUID)
- Reference to Quote (required)
- Reference to QuoteLineItem (optional, null for quote-level discounts)
- Reference to Discount definition (optional, null for manual discounts)
- Type: PERCENTAGE or FIXED_AMOUNT
- Value applied (decimal)
- Calculated amount (decimal, the actual $ reduction)
- Reason/notes (optional)
- Applied by user (optional, for audit)
- Applied timestamp

#### Scenario: Track automatic discount
- **WHEN** a volume discount is automatically applied
- **THEN** create AppliedDiscount record linking to the Discount definition
- **AND** store the calculated amount for audit trail

#### Scenario: Track manual discount
- **WHEN** user manually adds a discount to a line item
- **THEN** create AppliedDiscount record with no Discount reference
- **AND** require a reason note for audit

### Requirement: Discount Calculation Service
The system SHALL provide a discount calculation service that:
- Evaluates all applicable discounts for a quote
- Applies discounts in priority order
- Handles non-stackable discount conflicts (highest value wins)
- Calculates final amounts after all discounts

#### Scenario: Apply single discount
- **WHEN** one discount qualifies for a line item
- **THEN** apply the discount and update netPrice

#### Scenario: Stackable discounts
- **WHEN** multiple stackable discounts qualify
- **THEN** apply all discounts in priority order (compounding)

#### Scenario: Non-stackable conflict resolution
- **WHEN** multiple non-stackable discounts qualify
- **THEN** apply only the discount providing the best value to customer

#### Scenario: Percentage then fixed application order
- **WHEN** both percentage and fixed discounts apply
- **THEN** apply percentage discounts first, then fixed amounts

### Requirement: Discount Application Strategies
The system SHALL support different discount application strategies:
- PER_LINE: Apply discount to each qualifying line item independently
- QUOTE_LEVEL: Apply discount to quote subtotal
- BEST_LINE: Apply discount to highest-value qualifying line only
- PROPORTIONAL: Distribute quote discount proportionally across lines

#### Scenario: Per-line application
- **WHEN** discount scope is LINE_ITEM with strategy PER_LINE
- **AND** 3 line items qualify
- **THEN** apply discount to each of the 3 line items

#### Scenario: Quote-level application
- **WHEN** discount scope is QUOTE
- **THEN** apply discount to the quote subtotal after line calculations

### Requirement: Discounts API
The system SHALL provide REST API endpoints for discount management:
- `GET /api/discounts` - List all discount definitions
- `GET /api/discounts/:id` - Get discount with tiers
- `POST /api/discounts` - Create a new discount
- `PUT /api/discounts/:id` - Update discount
- `DELETE /api/discounts/:id` - Delete discount
- `POST /api/quotes/:id/discounts` - Apply discount to quote
- `DELETE /api/quotes/:id/discounts/:discountId` - Remove applied discount

#### Scenario: List active discounts
- **WHEN** GET /api/discounts is called
- **THEN** return array of active discounts within valid date range

#### Scenario: Apply discount to quote
- **WHEN** POST /api/quotes/:id/discounts is called with discountId
- **THEN** validate discount applicability
- **AND** create AppliedDiscount record
- **AND** recalculate quote totals

### Requirement: Discounts Management Page
The system SHALL provide a discounts management page at `/discounts` for viewing and managing discount definitions.

#### Scenario: View discounts table
- **WHEN** user navigates to /discounts
- **THEN** display a table with columns: Name, Type, Value, Scope, Valid Dates, Active
- **AND** table supports sorting and filtering

#### Scenario: Create tiered discount
- **WHEN** user creates a discount with tiers enabled
- **THEN** display tier builder UI to define quantity ranges and values

### Requirement: Quote Discount Summary
The system SHALL display discount breakdown on quote editor showing:
- List of all applied discounts with names and amounts
- Subtotal before discounts
- Total discount amount
- Final total after discounts

#### Scenario: View discount breakdown
- **WHEN** user views a quote with multiple discounts applied
- **THEN** display itemized list of each discount and its contribution
- **AND** show savings percentage
