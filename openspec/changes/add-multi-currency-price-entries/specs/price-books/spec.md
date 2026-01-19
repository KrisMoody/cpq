# price-books Specification Delta

## MODIFIED Requirements

### Requirement: Price Book Entry Entity
The system SHALL store price book entries linking products to prices:
- Unique identifier (CUID)
- Reference to PriceBook (required)
- Reference to Product (required)
- List price (decimal, required) - default price in price book currency
- Cost (decimal, optional)
- Minimum margin (decimal, optional) - for approval rules
- Currency-specific prices (optional) - native prices in other currencies
- Unique constraint on (priceBookId, productId) combination

#### Scenario: Create price entry
- **WHEN** a price book entry is created
- **THEN** the product has a specific price within that price book

#### Scenario: Prevent duplicate entries
- **WHEN** attempting to create a price entry for a product already in the price book
- **THEN** the system rejects the duplicate entry

#### Scenario: Entry with currency-specific prices
- **WHEN** a price book entry has currency-specific prices
- **THEN** those prices are used for quotes in those currencies
- **AND** the default list price is used for unlisted currencies (via conversion)
