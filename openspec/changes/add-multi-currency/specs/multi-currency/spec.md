## ADDED Requirements

### Requirement: Currency Model
The system SHALL support multiple currencies with exchange rate management.

#### Scenario: Create currency
- **WHEN** user creates a currency
- **THEN** it has ISO code (e.g., USD, EUR, GBP), name, and symbol
- **AND** it can be marked as base currency

#### Scenario: Base currency
- **WHEN** one currency is marked as base
- **THEN** it is used for reporting and default pricing
- **AND** only one currency can be base at a time

#### Scenario: Exchange rates
- **WHEN** currency has exchange rate defined
- **THEN** rate is relative to base currency
- **AND** rate has an effective date

### Requirement: Exchange Rate Management
The system SHALL support managing exchange rates.

#### Scenario: Set exchange rate
- **WHEN** user sets exchange rate for a currency
- **THEN** rate is stored with effective date
- **AND** previous rates are preserved for historical quotes

#### Scenario: Rate history
- **WHEN** viewing currency
- **THEN** historical exchange rates are accessible
- **AND** can see rate at any point in time

#### Scenario: Default rate lookup
- **WHEN** no rate exists for current date
- **THEN** most recent rate is used
- **AND** system indicates rate date for transparency

### Requirement: Price Book Currency
The system SHALL associate price books with specific currencies.

#### Scenario: Price book currency
- **WHEN** creating a price book
- **THEN** user specifies the currency for all prices in that book
- **AND** all price entries are in that currency

#### Scenario: Multiple currency price books
- **WHEN** selling internationally
- **THEN** separate price books can exist per currency (e.g., "US Retail", "EU Retail")

### Requirement: Quote Currency
The system SHALL support quotes in different currencies.

#### Scenario: Quote currency from customer
- **WHEN** creating quote for customer
- **THEN** quote defaults to customer's preferred currency
- **AND** currency can be overridden on quote

#### Scenario: Quote currency from price book
- **WHEN** quote uses a specific price book
- **THEN** quote currency matches price book currency
- **AND** all line items are in quote currency

#### Scenario: Currency display on quote
- **WHEN** viewing quote
- **THEN** all amounts show appropriate currency symbol
- **AND** currency code is displayed in summary

### Requirement: Currency Conversion
The system SHALL convert prices between currencies when needed.

#### Scenario: Cross-currency pricing
- **WHEN** product price exists in different currency than quote
- **THEN** price is converted using current exchange rate
- **AND** conversion is noted for transparency

#### Scenario: Quote to base currency
- **WHEN** reporting quote values
- **THEN** amounts can be converted to base currency
- **AND** using rate at quote creation date

### Requirement: Customer Currency Preference
The system SHALL store customer currency preferences.

#### Scenario: Set customer currency
- **WHEN** editing customer
- **THEN** user can set preferred currency
- **AND** new quotes default to this currency

### Requirement: Currency Display Formatting
The system SHALL format currency displays appropriately.

#### Scenario: Symbol formatting
- **WHEN** displaying amounts
- **THEN** use correct currency symbol position (prefix/suffix)
- **AND** use correct decimal separator for locale

#### Scenario: Quote preview currency
- **WHEN** viewing quote preview/document
- **THEN** currency is clearly indicated
- **AND** all amounts consistently formatted

### Requirement: Currency Management UI
The system SHALL provide interfaces for managing currencies.

#### Scenario: List currencies
- **WHEN** user navigates to currency settings
- **THEN** all currencies shown with code, name, rate

#### Scenario: Create currency
- **WHEN** user creates a currency
- **THEN** specify ISO code, name, symbol
- **AND** set initial exchange rate

#### Scenario: Update exchange rate
- **WHEN** user updates exchange rate
- **THEN** new rate is effective from specified date
- **AND** historical rates preserved
