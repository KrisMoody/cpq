# learning-ui Spec Delta

## MODIFIED Requirements

### Requirement: Sidebar Navigation
The system SHALL provide a persistent left sidebar navigation with grouped menu items organized into SALES and ADMIN sections to distinguish user-facing workflows from administrative configuration.

#### Scenario: View sidebar navigation
- **WHEN** user views any page in the application
- **THEN** display a left sidebar with two labeled sections: SALES and ADMIN
- **AND** display Dashboard as standalone item at the top (before sections)
- **AND** display Learn as standalone item at the bottom (after sections)
- **AND** highlight the active page and its parent group/section

#### Scenario: View SALES section
- **WHEN** user views the sidebar SALES section
- **THEN** display a section header labeled "SALES" with a subtle divider line
- **AND** display Quotes and Customers as top-level items (not nested in a collapsible group)

#### Scenario: View ADMIN section
- **WHEN** user views the sidebar ADMIN section
- **THEN** display a section header labeled "ADMIN" with a subtle divider line
- **AND** display Catalog and Configuration as collapsible groups within this section

### Requirement: Navigation Groups
The system SHALL organize navigation items into logical groups reflecting CPQ workflow stages, nested under section headers.

#### Scenario: View Catalog group
- **WHEN** user views the Catalog navigation group under ADMIN section
- **THEN** display child items: Products, Categories, Price Books, Attributes, Units
- **AND** show group icon (cube or grid)

#### Scenario: View Configuration group
- **WHEN** user views the Configuration navigation group under ADMIN section
- **THEN** display child items: Rules, Discounts, Tax Rates
- **AND** show group icon (cog or sliders)

### Requirement: Section Headers
The system SHALL display visual section headers to separate navigation areas.

#### Scenario: View section header
- **WHEN** user views a section header in the sidebar
- **THEN** display the section label in uppercase, muted text
- **AND** display a horizontal divider line above the label
- **AND** add vertical spacing to visually separate from adjacent items

#### Scenario: Section headers are not interactive
- **WHEN** user views a section header
- **THEN** the header is not clickable or focusable
- **AND** the header does not have hover states
