## MODIFIED Requirements

### Requirement: Tax Rate Management UI
The system SHALL provide a user interface for managing tax rates with sortable columns and search functionality.

#### Scenario: List tax rates
- **WHEN** user navigates to tax settings
- **THEN** all tax rates are listed in a TanStack Table with columns: Name, Rate, Jurisdiction, Category, Status, Actions
- **AND** table supports sorting by clicking column headers
- **AND** table supports global search filtering

#### Scenario: Create tax rate
- **WHEN** user creates a new tax rate
- **THEN** user specifies name, rate, and jurisdiction
- **AND** user can set effective dates

#### Scenario: Edit tax rate
- **WHEN** user edits a tax rate
- **THEN** rate and jurisdiction can be modified
- **AND** changes apply to new quotes only (not existing)
