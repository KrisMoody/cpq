## MODIFIED Requirements

### Requirement: Price Book Entry Tier Management
The system SHALL provide UI for managing volume pricing tiers on price book entries.

#### Scenario: View pricing tiers
- **WHEN** user views a price book entry that has tiers configured
- **THEN** all tiers are displayed showing quantity ranges and tier prices
- **AND** the tier type (UNIT_PRICE, FLAT_PRICE, GRADUATED, or VOLUME_DISCOUNT_PERCENT) is indicated

#### Scenario: Add pricing tier to entry
- **WHEN** user adds a new tier to a price book entry
- **THEN** the tier is saved with minQuantity, maxQuantity, tierPrice, and tierType
- **AND** the tier appears in the entry's tier list

#### Scenario: Validate tier boundaries - overlapping ranges
- **WHEN** user creates a tier with quantity range overlapping an existing tier
- **THEN** the system rejects the creation
- **AND** displays a validation error about overlapping quantities

#### Scenario: Validate tier boundaries - invalid min quantity
- **WHEN** user creates a tier with minQuantity less than 1
- **THEN** the system rejects the creation
- **AND** displays a validation error that minQuantity must be at least 1

#### Scenario: Validate tier boundaries - invalid max quantity
- **WHEN** user creates a tier with maxQuantity less than or equal to minQuantity
- **THEN** the system rejects the creation
- **AND** displays a validation error that maxQuantity must be greater than minQuantity

#### Scenario: Validate GRADUATED tiers - must start at 1
- **WHEN** user creates GRADUATED tiers that don't start at quantity 1
- **THEN** the system rejects the creation
- **AND** displays a validation error that GRADUATED tiers must start at quantity 1

#### Scenario: Validate GRADUATED tiers - must be contiguous
- **WHEN** user creates GRADUATED tiers with gaps between ranges (e.g., 1-10 and 15-20)
- **THEN** the system rejects the creation
- **AND** displays a validation error that GRADUATED tiers must be contiguous

#### Scenario: Delete pricing tier
- **WHEN** user deletes a tier from a price book entry
- **THEN** the tier is removed from the database
- **AND** remaining tiers are displayed correctly
