# unit-of-measure Specification

## Purpose
TBD - created by archiving change add-unit-of-measure. Update Purpose after archive.
## Requirements
### Requirement: Unit of Measure Model
The system SHALL support defining units of measure for products.

#### Scenario: Create unit of measure
- **WHEN** user creates a unit of measure
- **THEN** it has a name (e.g., "Each", "Hour", "License", "Box")
- **AND** it has an abbreviation (e.g., "ea", "hr", "lic", "box")
- **AND** it can optionally have a base unit and conversion factor

#### Scenario: Default units
- **WHEN** system is initialized
- **THEN** common units are pre-configured: Each, Hour, Day, Month, Year, License, Seat

### Requirement: Unit Conversion
The system SHALL support converting between related units.

#### Scenario: Define conversion factor
- **WHEN** a unit has a base unit defined
- **THEN** a conversion factor specifies the relationship
- **AND** example: 1 Box = 12 Each (conversionFactor = 12, baseUnit = Each)

#### Scenario: Price per unit conversion
- **WHEN** product is priced per box but sold in each
- **THEN** system can calculate per-unit price using conversion factor

### Requirement: Product Unit Assignment
The system SHALL allow products to specify their unit of measure.

#### Scenario: Assign unit to product
- **WHEN** user creates or edits a product
- **THEN** user can select a unit of measure
- **AND** the default unit is "Each" if not specified

#### Scenario: Unit displayed on product
- **WHEN** viewing a product
- **THEN** the unit of measure is shown (e.g., "Price: $50/hr")

### Requirement: Quote Line Item Units
The system SHALL display units of measure on quote line items.

#### Scenario: Unit on line item
- **WHEN** a product is added to a quote
- **THEN** the line item displays quantity with unit (e.g., "10 hrs")
- **AND** pricing shows rate per unit (e.g., "$50/hr")

#### Scenario: Unit in pricing calculations
- **WHEN** calculating line item total
- **THEN** quantity * unit price = total
- **AND** unit labels are consistent throughout

### Requirement: Unit Management UI
The system SHALL provide management for units of measure.

#### Scenario: List units
- **WHEN** user navigates to units page (or settings)
- **THEN** all units are listed with name, abbreviation, and conversion info

#### Scenario: Create custom unit
- **WHEN** user creates a new unit
- **THEN** user specifies name, abbreviation
- **AND** optionally specifies base unit and conversion factor

#### Scenario: Edit unit
- **WHEN** user edits an existing unit
- **THEN** name and abbreviation can be modified
- **AND** conversion factor can be updated

