# Spec Delta: Quotes UI - Enhanced Pricing Context

## ADDED Requirements

### Requirement: Tax Exemption Indicator in Quote Customer Card
The system SHALL display customer tax exemption status prominently in the quote editor.

#### Scenario: Tax-exempt customer assigned to quote
- **WHEN** a quote has a customer assigned
- **AND** the customer has `isTaxExempt = true`
- **THEN** a "Tax Exempt" badge is displayed in the customer card
- **AND** the badge is colored green for active exemption

#### Scenario: Expired tax exemption warning
- **WHEN** a quote has a customer with expired tax exemption
- **THEN** the "Tax Exempt" badge shows "(Expired)" suffix
- **AND** the badge is colored yellow/warning
- **AND** hovering shows the expiry date

#### Scenario: Tax exemption with expiry date
- **WHEN** viewing a quote with tax-exempt customer
- **AND** the exemption has a future expiry date
- **THEN** the badge or tooltip shows "Expires: {date}"

### Requirement: Unit of Measure Display in Quote Line Items
The system SHALL display unit of measure information on quote line items.

#### Scenario: Product with unit of measure
- **WHEN** a product with a unit of measure is added to a quote
- **THEN** the quantity shows with unit abbreviation (e.g., "10 hrs")
- **AND** the unit price shows per-unit rate (e.g., "$50/hr")

#### Scenario: Product without unit of measure
- **WHEN** a product without a unit of measure is added to a quote
- **THEN** the quantity shows as a plain number
- **AND** the unit price shows without unit suffix

### Requirement: Contract Pricing Indicator on Line Items
The system SHALL indicate when contract pricing overrides standard pricing on quote line items.

#### Scenario: Line item with contract pricing
- **WHEN** a quote line item is priced from an active contract
- **THEN** a "Contract Price" badge appears on the line item
- **AND** the original list price is shown for comparison (e.g., "was $100.00")
- **AND** clicking the badge navigates to the contract detail page

#### Scenario: Contract percentage discount applied
- **WHEN** a contract applies a percentage discount (not a fixed price)
- **THEN** the badge shows "Contract: -{percent}%"
- **AND** the original price is visible for reference

#### Scenario: Line item without contract pricing
- **WHEN** a quote line item uses standard price book pricing
- **THEN** no contract badge is shown
- **AND** the line item displays normally

### Requirement: Price Source Visibility
The system SHALL make it clear where prices originate from.

#### Scenario: Standard price book pricing
- **WHEN** viewing a quote line item priced from the standard price book
- **THEN** hovering over the price shows "Price Book: {name}"

#### Scenario: Tier pricing applied
- **WHEN** a line item quantity triggers tier pricing
- **THEN** an indicator shows the tier being applied (e.g., "Tier: 10-50 @ $80")
- **AND** this appears in a tooltip or small text below the price
