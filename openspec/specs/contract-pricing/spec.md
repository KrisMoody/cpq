# contract-pricing Specification

## Purpose
TBD - created by archiving change add-contract-pricing. Update Purpose after archive.
## Requirements
### Requirement: Contract Model
The system SHALL support customer-specific pricing contracts with defined validity periods.

#### Scenario: Create contract
- **WHEN** user creates a contract for a customer
- **THEN** the contract has a start date and end date
- **AND** the contract is linked to a specific customer
- **AND** the contract has a unique identifier/name

#### Scenario: Contract attributes
- **WHEN** a contract is created
- **THEN** it includes: name, customerId, startDate, endDate, status (DRAFT/ACTIVE/EXPIRED)
- **AND** it can optionally reference a dedicated price book

### Requirement: Contract Price Entries
The system SHALL allow contracts to define product-specific pricing.

#### Scenario: Add contract price
- **WHEN** user adds a product price to a contract
- **THEN** the contract price overrides standard price book pricing
- **AND** the price is only valid during the contract term

#### Scenario: Contract price percentage adjustment
- **WHEN** user specifies a percentage discount on contract
- **THEN** all products are discounted by that percentage from the base price book
- **AND** individual product prices can still be overridden

#### Scenario: Contract price fixed amount
- **WHEN** user specifies a fixed price for a product on contract
- **THEN** that fixed price is used instead of price book price

### Requirement: Automatic Contract Price Application
The system SHALL automatically apply contract pricing during quote creation.

#### Scenario: Active contract pricing
- **WHEN** creating a quote for a customer with an active contract
- **AND** the current date is within the contract validity period
- **THEN** contract prices are automatically applied to eligible products

#### Scenario: Expired contract fallback
- **WHEN** creating a quote for a customer
- **AND** their contract has expired
- **THEN** standard price book pricing is used
- **AND** user is notified that contract has expired

#### Scenario: No contract fallback
- **WHEN** creating a quote for a customer without a contract
- **THEN** standard price book pricing is used

### Requirement: Contract Management UI
The system SHALL provide a user interface for managing contracts.

#### Scenario: List contracts
- **WHEN** user navigates to contracts page
- **THEN** contracts are listed with customer, dates, and status
- **AND** contracts can be filtered by status (Active/Expired/Draft)

#### Scenario: Create contract
- **WHEN** user creates a new contract
- **THEN** user selects a customer
- **AND** user specifies validity dates
- **AND** user can add product-specific prices

#### Scenario: View customer contracts
- **WHEN** user views a customer detail page
- **THEN** active and historical contracts are displayed

#### Scenario: Contract renewal
- **WHEN** user renews an expiring contract
- **THEN** a new contract is created with updated dates
- **AND** pricing terms can be copied from the previous contract

### Requirement: Contract Status Lifecycle
The system SHALL manage contract status transitions automatically.

#### Scenario: Contract activation
- **WHEN** contract start date is reached
- **AND** contract is in DRAFT status
- **THEN** contract transitions to ACTIVE status

#### Scenario: Contract expiration
- **WHEN** contract end date passes
- **THEN** contract transitions to EXPIRED status
- **AND** contract pricing no longer applies to new quotes

