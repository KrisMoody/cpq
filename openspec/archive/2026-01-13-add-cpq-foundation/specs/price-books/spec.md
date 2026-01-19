# Price Books

Manages price books and price book entries for product pricing.

## ADDED Requirements

### Requirement: Price Book Entity
The system SHALL store price books with the following attributes:
- Unique identifier (CUID)
- Name (required)
- Default flag (boolean, only one price book can be default)
- Active status (boolean, default true)
- Valid from date (optional)
- Valid to date (optional)

#### Scenario: Create default price book
- **WHEN** a price book is created with isDefault=true
- **THEN** the price book is stored as the default
- **AND** any existing default price book is updated to isDefault=false

#### Scenario: Price book date validity
- **WHEN** a price book has validFrom and validTo dates set
- **THEN** the price book is only available for quotes within that date range

### Requirement: Price Book Entry Entity
The system SHALL store price book entries linking products to prices:
- Unique identifier (CUID)
- Reference to PriceBook (required)
- Reference to Product (required)
- List price (decimal, required)
- Cost (decimal, optional)
- Unique constraint on (priceBookId, productId) combination

#### Scenario: Create price entry
- **WHEN** a price book entry is created
- **THEN** the product has a specific price within that price book

#### Scenario: Prevent duplicate entries
- **WHEN** attempting to create a price entry for a product already in the price book
- **THEN** the system rejects the duplicate entry

### Requirement: Price Books API
The system SHALL provide REST API endpoints for price book management:
- `GET /api/price-books` - List all price books
- `GET /api/price-books/:id/prices` - Get all price entries in a price book

#### Scenario: List price books
- **WHEN** GET /api/price-books is called
- **THEN** return array of all price books with basic attributes

#### Scenario: Get prices in book
- **WHEN** GET /api/price-books/:id/prices is called
- **THEN** return array of all price book entries with product details
