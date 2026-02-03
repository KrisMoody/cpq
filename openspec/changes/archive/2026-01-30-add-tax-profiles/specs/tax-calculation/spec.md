# tax-calculation Specification Delta

## MODIFIED Requirements

### Requirement: Tax Jurisdiction Resolution
The system SHALL determine applicable tax rates based on customer location and price book tax profile.

#### Scenario: Resolve by customer address
- **WHEN** calculating tax for a quote
- **AND** customer has a complete address
- **THEN** customer's address determines jurisdiction
- **AND** matching tax rates are applied

#### Scenario: Resolve by price book tax profile
- **WHEN** calculating tax for a quote
- **AND** customer address is incomplete or missing
- **AND** price book has a tax profile assigned
- **THEN** tax profile rates are applied as fallback

#### Scenario: Country-level tax
- **WHEN** tax rate is defined for a country only
- **THEN** it applies to all customers in that country
- **AND** more specific regional rates take precedence if defined

#### Scenario: State/region tax
- **WHEN** tax rate is defined for a specific state/region
- **THEN** it applies only to customers in that state
- **AND** it stacks with country-level taxes if applicable

#### Scenario: No tax when no jurisdiction
- **WHEN** customer has no address
- **AND** price book has no tax profile
- **THEN** no tax is calculated
- **AND** a warning is displayed to the user
