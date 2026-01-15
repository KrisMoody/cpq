## MODIFIED Requirements

### Requirement: Currency Management Page
The system SHALL provide a page to manage currencies and exchange rates with sortable columns and search functionality.

#### Scenario: List currencies
- **WHEN** user navigates to `/currencies`
- **THEN** all currencies are displayed in a TanStack Table with columns: Code, Name, Symbol, Exchange Rate, Status, Actions
- **AND** each row shows code, name, symbol, current rate, and base indicator
- **AND** base currency is visually distinguished
- **AND** table supports sorting by clicking column headers
- **AND** table supports global search filtering

#### Scenario: Create currency
- **WHEN** user clicks "Add Currency" on the currencies page
- **THEN** a form appears for ISO code, name, symbol, and initial exchange rate
- **AND** submitting creates the currency and refreshes the list

#### Scenario: Edit currency
- **WHEN** user clicks on a currency row
- **THEN** navigates to currency detail page (`/currencies/[id]`)
- **AND** can edit name, symbol, active status
- **AND** can view and add exchange rates

#### Scenario: Add exchange rate
- **WHEN** user adds exchange rate on currency detail page
- **THEN** specify rate value and effective date
- **AND** rate history is displayed in chronological order

#### Scenario: Set base currency
- **WHEN** user marks a currency as base
- **THEN** previous base currency is unmarked
- **AND** base currency shows rate of 1.0
