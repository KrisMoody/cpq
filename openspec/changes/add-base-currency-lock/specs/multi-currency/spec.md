# multi-currency Specification Delta

## ADDED Requirements

### Requirement: Base Currency Lock
The system SHALL prevent changing the base currency once transactions exist to protect data integrity.

#### Scenario: Set base currency with no transactions
- **WHEN** user attempts to set a new base currency
- **AND** no quotes exist in the system
- **THEN** the base currency is updated successfully
- **AND** the previous base currency (if any) is unmarked

#### Scenario: Block base currency change with transactions
- **WHEN** user attempts to change the base currency
- **AND** one or more quotes exist in the system
- **THEN** the change is rejected with an error
- **AND** the error message explains why the change is blocked
- **AND** the current base currency remains unchanged

#### Scenario: Display base currency lock warning
- **WHEN** user views the currency edit page for the base currency
- **AND** transactions exist in the system
- **THEN** a warning is displayed explaining the base currency cannot be changed
- **AND** the base currency toggle is disabled

#### Scenario: Allow non-base currency changes
- **WHEN** user edits a non-base currency
- **THEN** changes are allowed regardless of transaction existence
- **AND** exchange rates can still be updated
