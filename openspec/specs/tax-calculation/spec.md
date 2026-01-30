# tax-calculation Specification

## Purpose
TBD - created by archiving change add-tax-calculation. Update Purpose after archive.
## Requirements
### Requirement: Tax Rate Model
The system SHALL support defining tax rates for different jurisdictions and categories.

#### Scenario: Create tax rate
- **WHEN** user creates a tax rate
- **THEN** it has a name, rate percentage, and jurisdiction info
- **AND** it can optionally be linked to specific product categories

#### Scenario: Tax rate attributes
- **WHEN** a tax rate is defined
- **THEN** it includes: name, rate (%), country, state/region (optional), isActive
- **AND** it can have an effective date range

#### Scenario: Multiple tax rates
- **WHEN** jurisdiction requires multiple taxes (e.g., state + county)
- **THEN** multiple tax rates can be configured and stacked

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

#### Scenario: No tax when no jurisdiction
- **WHEN** customer has no address
- **AND** price book has no tax profile
- **THEN** no tax is calculated
- **AND** a warning is displayed to the user

#### Scenario: Country-level tax
- **WHEN** tax rate is defined for a country only
- **THEN** it applies to all customers in that country
- **AND** more specific regional rates take precedence if defined

#### Scenario: State/region tax
- **WHEN** tax rate is defined for a specific state/region
- **THEN** it applies only to customers in that state
- **AND** it stacks with country-level taxes if applicable

### Requirement: Tax-Exempt Customers
The system SHALL support tax-exempt customers.

#### Scenario: Mark customer tax-exempt
- **WHEN** customer is marked as tax-exempt
- **THEN** their quotes do not include tax charges
- **AND** exemption reason can be recorded

#### Scenario: Tax exemption certificate
- **WHEN** customer has tax exemption
- **THEN** exemption certificate number can be stored
- **AND** exemption expiry date can be tracked

#### Scenario: Expired exemption
- **WHEN** tax exemption has expired
- **THEN** tax is calculated normally
- **AND** user is warned about expired exemption

### Requirement: Tax Calculation in Quotes
The system SHALL calculate and display tax on quotes.

#### Scenario: Calculate tax
- **WHEN** quote total is calculated
- **THEN** applicable tax rates are applied to taxable items
- **AND** tax amount is shown separately from subtotal

#### Scenario: Tax breakdown display
- **WHEN** viewing quote with taxes
- **THEN** each applicable tax is itemized (e.g., "State Tax 6%: $60")
- **AND** total tax amount is shown
- **AND** grand total includes taxes

#### Scenario: Non-taxable products
- **WHEN** products are marked as non-taxable
- **THEN** tax is not calculated on those line items
- **AND** only taxable subtotal is used for tax calculation

### Requirement: Tax on Quote Preview
The system SHALL include tax information on the quote document preview.

#### Scenario: Tax in quote preview
- **WHEN** viewing or printing quote preview
- **THEN** tax breakdown is clearly shown
- **AND** tax rates and amounts are itemized
- **AND** customer tax exemption status is noted if applicable

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

