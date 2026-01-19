## ADDED Requirements

### Requirement: Sidebar Navigation
The system SHALL provide a persistent left sidebar navigation with grouped menu items organized by CPQ workflow stage.

#### Scenario: View sidebar navigation
- **WHEN** user views any page in the application
- **THEN** display a left sidebar with navigation groups: Sales, Catalog, Configuration
- **AND** display standalone items: Dashboard (top), Learn (bottom)
- **AND** highlight the active page and its parent group

#### Scenario: Navigate within group
- **WHEN** user clicks a navigation item within a group
- **THEN** navigate to the selected page
- **AND** keep the parent group expanded
- **AND** visually indicate the active item

### Requirement: Navigation Groups
The system SHALL organize navigation items into logical groups reflecting CPQ workflow stages.

#### Scenario: View Sales group
- **WHEN** user views the Sales navigation group
- **THEN** display child items: Quotes, Customers
- **AND** show group icon (document or briefcase)

#### Scenario: View Catalog group
- **WHEN** user views the Catalog navigation group
- **THEN** display child items: Products, Price Books
- **AND** show group icon (cube or grid)

#### Scenario: View Configuration group
- **WHEN** user views the Configuration navigation group
- **THEN** display child items: Rules, Discounts
- **AND** show group icon (cog or sliders)

### Requirement: Collapsible Navigation Groups
The system SHALL allow users to expand and collapse navigation groups to reduce visual clutter.

#### Scenario: Collapse a group
- **WHEN** user clicks a group header
- **THEN** hide the child items within that group
- **AND** show a collapsed indicator (chevron pointing right)

#### Scenario: Expand a group
- **WHEN** user clicks a collapsed group header
- **THEN** reveal the child items within that group
- **AND** show an expanded indicator (chevron pointing down)

#### Scenario: Auto-expand active group
- **WHEN** user navigates to a page within a collapsed group
- **THEN** automatically expand that group to show the active item

### Requirement: Responsive Sidebar Behavior
The system SHALL adapt sidebar display based on viewport size to optimize screen real estate.

#### Scenario: Desktop viewport
- **WHEN** viewport width is 1024px or greater
- **THEN** display full sidebar with icons and labels
- **AND** sidebar is always visible

#### Scenario: Tablet viewport
- **WHEN** viewport width is between 768px and 1023px
- **THEN** display collapsed sidebar with icons only
- **AND** expand to show labels on hover or click

#### Scenario: Mobile viewport
- **WHEN** viewport width is less than 768px
- **THEN** hide sidebar by default
- **AND** show hamburger menu button in header
- **AND** display sidebar as slide-out drawer when hamburger is clicked

### Requirement: Sidebar Header
The system SHALL display the application logo and title in the sidebar header area.

#### Scenario: View sidebar header
- **WHEN** user views the sidebar
- **THEN** display CPQ Learning logo and application name at the top
- **AND** clicking the logo navigates to the dashboard

## MODIFIED Requirements

### Requirement: Dashboard Page
The system SHALL provide a dashboard page at `/` with an overview of CPQ concepts and navigation to key areas, accessible via the sidebar navigation.

#### Scenario: View dashboard
- **WHEN** user navigates to /
- **THEN** display welcome message and CPQ overview
- **AND** show quick links to Products, Quotes, and Learn pages
- **AND** display summary statistics (product count, quote count)

#### Scenario: Access dashboard from sidebar
- **WHEN** user clicks Dashboard in the sidebar
- **THEN** navigate to the dashboard page
- **AND** highlight Dashboard as active in the sidebar
