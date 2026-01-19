## MODIFIED Requirements

### Requirement: Price Book Entry Entity
The system SHALL store price book entries linking products to prices:
- Unique identifier (CUID)
- Reference to PriceBook (required)
- Reference to Product (required)
- List price (decimal, required)
- Cost (decimal, optional, for margin calculations)
- Minimum margin percentage (optional, for approval rules)
- Unique constraint on (priceBookId, productId) combination

#### Scenario: Create price entry
- **WHEN** a price book entry is created
- **THEN** the product has a specific price within that price book

#### Scenario: Prevent duplicate entries
- **WHEN** attempting to create a price entry for a product already in the price book
- **THEN** the system rejects the duplicate entry

#### Scenario: Cost-based margin calculation
- **WHEN** a price entry has both listPrice and cost set
- **THEN** the system can calculate margin as (listPrice - cost) / listPrice * 100

## ADDED Requirements

### Requirement: Price Tier Entity
The system SHALL support volume pricing tiers within price book entries:
- Unique identifier (CUID)
- Reference to PriceBookEntry (required)
- Minimum quantity (required)
- Maximum quantity (optional, null = unlimited)
- Tier price (decimal, required - price per unit at this tier)
- Tier type: UNIT_PRICE or FLAT_PRICE (default UNIT_PRICE)

#### Scenario: Tiered unit pricing
- **WHEN** a price entry has tiers and quantity is 15
- **AND** tiers are: 1-9 @ $100, 10-24 @ $90, 25+ @ $80
- **THEN** unit price is $90 (tier 2)
- **AND** line total is 15 * $90 = $1,350

#### Scenario: Flat tier pricing
- **WHEN** a tier has type FLAT_PRICE
- **THEN** the tier price is the total for that tier, not per-unit

#### Scenario: No matching tier uses list price
- **WHEN** quantity does not match any tier
- **THEN** use the base listPrice from price book entry

### Requirement: Customer Price Book Assignment
The system SHALL support assigning price books to customers:
- Customer entity has optional priceBookId reference
- When customer is assigned to quote, their price book is used by default
- Override allowed when creating/editing quote

#### Scenario: Customer-specific pricing
- **WHEN** a customer has priceBookId assigned
- **AND** a quote is created for that customer
- **THEN** the quote defaults to using the customer's price book

#### Scenario: Override customer price book
- **WHEN** creating a quote for a customer with assigned price book
- **THEN** user can select a different price book if needed

### Requirement: Price Lookup Service
The system SHALL provide a price lookup service that:
- Finds the correct price for a product in a price book
- Applies volume tier pricing based on quantity
- Returns the effective unit price and any tier information

#### Scenario: Lookup with volume tiers
- **WHEN** getPriceForProduct is called with quantity 20
- **AND** product has volume tiers in the price book
- **THEN** return the tier-appropriate unit price

#### Scenario: Lookup without tiers
- **WHEN** getPriceForProduct is called
- **AND** no tiers exist for the product
- **THEN** return the base list price

### Requirement: Price Books API
The system SHALL provide REST API endpoints for price book management:
- `GET /api/price-books` - List all price books
- `GET /api/price-books/:id/prices` - Get all price entries with tiers in a price book
- `POST /api/price-books/:id/prices` - Add or update price entry
- `PUT /api/price-books/:id/prices/:entryId` - Update price entry
- `POST /api/price-books/:id/prices/:entryId/tiers` - Add tier to price entry
- `GET /api/price-books/lookup` - Lookup price for product/quantity/pricebook

#### Scenario: List price books
- **WHEN** GET /api/price-books is called
- **THEN** return array of all price books with basic attributes

#### Scenario: Get prices in book with tiers
- **WHEN** GET /api/price-books/:id/prices is called
- **THEN** return array of all price book entries with product details
- **AND** include nested tiers for each entry

#### Scenario: Price lookup endpoint
- **WHEN** GET /api/price-books/lookup is called with productId, quantity, priceBookId
- **THEN** return effective unit price considering tiers
- **AND** return tier information if applicable

### Requirement: Price Book Entry Edit UI
The system SHALL provide UI for managing price book entries with volume tiers.

#### Scenario: Add volume tiers to entry
- **WHEN** editing a price book entry
- **THEN** display tier management section
- **AND** allow adding/removing/editing tiers
- **AND** validate tier ranges don't overlap

#### Scenario: View effective pricing
- **WHEN** viewing a price book entry with tiers
- **THEN** display tier table showing quantity ranges and prices
- **AND** show pricing curve visualization
