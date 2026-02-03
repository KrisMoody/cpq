# price-books Specification Delta

## MODIFIED Requirements

### Requirement: Price Book Entity
The system SHALL store price books with the following attributes:
- Unique identifier (CUID)
- Name (required)
- Currency reference (optional, for multi-currency support)
- Tax profile reference (optional, for regional tax defaults)
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

#### Scenario: Price book with tax profile
- **WHEN** a price book has a tax profile assigned
- **THEN** quotes using this price book inherit the tax profile
- **AND** the tax profile is used when customer address is incomplete
