# multi-currency-pricing Specification

## Purpose
Enable native currency prices for price book entries to reduce exchange rate dependency and price book duplication.

## Requirements

### Requirement: Currency-Specific Price Entry
The system SHALL support storing native prices in multiple currencies for each price book entry.

#### Scenario: Add currency price to entry
- **WHEN** a currency-specific price is added to a price book entry
- **THEN** it stores the native list price in that currency
- **AND** optionally stores currency-specific cost

#### Scenario: One price per currency per entry
- **WHEN** attempting to add a currency price
- **AND** a price for that currency already exists on the entry
- **THEN** the operation is rejected as a duplicate

#### Scenario: Delete currency price
- **WHEN** a currency-specific price is deleted
- **THEN** price lookup falls back to conversion for that currency

### Requirement: Currency-Aware Price Lookup
The system SHALL use native currency prices when available, falling back to conversion.

#### Scenario: Lookup with native price
- **WHEN** price is requested for product in currency X
- **AND** entry has a native price in currency X
- **THEN** return the native price
- **AND** indicate price is native (not converted)

#### Scenario: Lookup with conversion fallback
- **WHEN** price is requested for product in currency X
- **AND** entry does not have a native price in currency X
- **THEN** convert the entry's default list price using exchange rate
- **AND** indicate price is converted (not native)

#### Scenario: Conversion uses current exchange rate
- **WHEN** price is converted from default to quote currency
- **THEN** the most recent exchange rate is used
- **AND** the rate effective date is recorded for transparency

### Requirement: Currency Price API
The system SHALL provide REST API endpoints for managing currency-specific prices:
- `GET /api/price-books/:id/entries/:entryId/currencies` - List currency prices
- `POST /api/price-books/:id/entries/:entryId/currencies` - Add currency price
- `PUT /api/price-books/:id/entries/:entryId/currencies/:currencyId` - Update
- `DELETE /api/price-books/:id/entries/:entryId/currencies/:currencyId` - Remove

#### Scenario: List currency prices
- **WHEN** GET currencies endpoint is called
- **THEN** return all currency-specific prices for the entry

#### Scenario: Add currency price
- **WHEN** POST currencies endpoint is called with currencyId and listPrice
- **THEN** create the currency-specific price
- **AND** reject if currency price already exists

### Requirement: Currency Price UI
The system SHALL provide UI for managing currency-specific prices in price book entries.

#### Scenario: View currency prices
- **WHEN** user views price book entry detail
- **THEN** display list of currency-specific prices
- **AND** indicate which currencies have native prices

#### Scenario: Add currency price
- **WHEN** user adds a currency price to an entry
- **THEN** show currency selector (excluding existing currencies)
- **AND** allow entering list price and optional cost

#### Scenario: Price indicator in quote
- **WHEN** viewing quote line items
- **AND** a price was converted (not native)
- **THEN** display an indicator showing the price is converted
