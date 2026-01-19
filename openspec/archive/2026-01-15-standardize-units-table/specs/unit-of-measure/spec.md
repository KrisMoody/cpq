## MODIFIED Requirements

### Requirement: Unit Management UI
The system SHALL provide management for units of measure.

#### Scenario: List units
- **WHEN** user navigates to units page
- **THEN** all units are listed with name, abbreviation, and conversion info
- **AND** the table supports sorting by any column
- **AND** the table supports searching/filtering units by name or abbreviation

#### Scenario: Create custom unit
- **WHEN** user creates a new unit
- **THEN** user specifies name, abbreviation
- **AND** optionally specifies base unit and conversion factor

#### Scenario: Edit unit
- **WHEN** user edits an existing unit
- **THEN** name and abbreviation can be modified
- **AND** conversion factor can be updated
