# multi-currency-ui Specification

## Purpose
Provide user interfaces for managing currencies, selecting currencies on entities, and displaying currency information throughout the CPQ application.

## ADDED Requirements

### Requirement: Currency Management Page
The system SHALL provide a page to manage currencies and exchange rates.

#### Scenario: List currencies
- **WHEN** user navigates to `/currencies`
- **THEN** all currencies are displayed in a table
- **AND** each row shows code, name, symbol, current rate, and base indicator
- **AND** base currency is visually distinguished

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

### Requirement: Currency Selector on Customer
The system SHALL allow selecting a preferred currency for customers.

#### Scenario: New customer form
- **WHEN** creating a new customer
- **THEN** currency selector appears in the Pricing section
- **AND** defaults to base currency if not selected

#### Scenario: Edit customer form
- **WHEN** editing an existing customer
- **THEN** current currency is pre-selected
- **AND** can change to different currency

### Requirement: Currency Selector on Quote
The system SHALL allow selecting a currency for quotes.

#### Scenario: New quote form
- **WHEN** creating a new quote
- **THEN** currency selector appears
- **AND** defaults to customer's preferred currency if customer selected
- **AND** can override currency selection

### Requirement: Currency Selector on Price Book
The system SHALL allow associating a currency with price books.

#### Scenario: New price book form
- **WHEN** creating a new price book
- **THEN** currency selector appears
- **AND** defaults to base currency

#### Scenario: Edit price book form
- **WHEN** editing an existing price book
- **THEN** current currency is displayed
- **AND** can change currency

### Requirement: Currency in Navigation
The system SHALL include currencies in the application navigation.

#### Scenario: Sidebar navigation
- **WHEN** viewing the sidebar
- **THEN** "Currencies" link appears in Configuration group
- **AND** links to `/currencies`

### Requirement: Currency Display in Lists
The system SHALL display currency information in relevant list views.

#### Scenario: Customers list
- **WHEN** viewing customers list
- **THEN** preferred currency is shown for each customer (if set)

#### Scenario: Quotes list
- **WHEN** viewing quotes list
- **THEN** quote currency is displayed with amount
