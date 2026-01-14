## MODIFIED Requirements

### Requirement: Application Navigation
The system SHALL provide navigation to all major features in the application header.

#### Scenario: View main navigation
- **WHEN** user views the application header
- **THEN** display navigation links for: Dashboard, Products, Quotes, Customers, Discounts, Rules, Learn
- **AND** highlight the active section based on current route

#### Scenario: Navigate to customers
- **WHEN** user clicks "Customers" in navigation
- **THEN** navigate to /customers page showing customer list

#### Scenario: Navigate to discounts
- **WHEN** user clicks "Discounts" in navigation
- **THEN** navigate to /discounts page showing discount list

#### Scenario: Navigate to rules
- **WHEN** user clicks "Rules" in navigation
- **THEN** navigate to /rules page showing rules list

#### Scenario: Mobile navigation
- **WHEN** user views navigation on mobile
- **THEN** show all navigation items in the mobile dropdown menu

### Requirement: Dashboard Overview
The system SHALL display an overview of all CPQ entities on the dashboard.

#### Scenario: View dashboard stats
- **WHEN** user views the dashboard
- **THEN** display stats cards for: Products, Active Quotes, Price Books, Bundles, Customers, Active Discounts, Active Rules
- **AND** each stat shows count and icon
- **AND** clickable stats link to their respective list pages

#### Scenario: View customer stats
- **WHEN** dashboard loads
- **THEN** show count of active customers
- **AND** link to /customers page

#### Scenario: View discount stats
- **WHEN** dashboard loads
- **THEN** show count of active discounts (within valid date range)
- **AND** link to /discounts page

#### Scenario: View rule stats
- **WHEN** dashboard loads
- **THEN** show count of active rules
- **AND** link to /rules page

### Requirement: Dashboard Quick Actions
The system SHALL provide quick action links on the dashboard for common tasks.

#### Scenario: View quick action cards
- **WHEN** user views the dashboard
- **THEN** display quick action cards for: Browse Products, Create Quote, Create Customer, Manage Discounts, Configure Rules, Learn CPQ
- **AND** each card has icon, title, description, and action button

#### Scenario: Create customer from dashboard
- **WHEN** user clicks "Create Customer" quick action
- **THEN** navigate to /customers/new page

#### Scenario: Manage discounts from dashboard
- **WHEN** user clicks "Manage Discounts" quick action
- **THEN** navigate to /discounts page

#### Scenario: Configure rules from dashboard
- **WHEN** user clicks "Configure Rules" quick action
- **THEN** navigate to /rules page

### Requirement: Recent Activity Section
The system SHALL display recent activity on the dashboard.

#### Scenario: View recent quotes
- **WHEN** user views the dashboard
- **THEN** display up to 5 recent quotes with name, line item count, status, and link to editor

#### Scenario: View recent customers
- **WHEN** user views the dashboard
- **THEN** display up to 5 recent customers with name, company, and quote count
- **AND** each customer links to customer detail page
