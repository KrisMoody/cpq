## ADDED Requirements

### Requirement: CPQ Workflow Diagram Mobile Responsiveness
The CPQ Workflow Diagram SHALL adapt its layout for mobile viewports to prevent horizontal overflow and ensure usability on small screens.

#### Scenario: View CPQ workflow on mobile
- **WHEN** user views the CPQ workflow diagram on a viewport less than 768px wide
- **THEN** display the main flow steps in a vertical stacked layout instead of horizontal
- **AND** each step shows icon, title, and description in a card-like format
- **AND** helper badges remain visible below each step
- **AND** no horizontal scrolling is required

#### Scenario: View CPQ workflow branching on mobile
- **WHEN** user views the CPQ workflow diagram branching section on mobile
- **THEN** display the auto-approve and approval-required paths in a stacked vertical layout
- **AND** each path is clearly labeled and visually separated

#### Scenario: View CPQ workflow on desktop
- **WHEN** user views the CPQ workflow diagram on a viewport 768px or wider
- **THEN** display the original horizontal layout with arrows between steps
- **AND** show the branching section in a two-column grid layout

### Requirement: Responsive Data Tables
All TanStack Table-based data tables SHALL provide a mobile-friendly card-based layout on small viewports while preserving the full table layout on desktop.

#### Scenario: View table on desktop
- **WHEN** user views a data table (Products, Customers, Quotes, etc.) on a viewport 768px or wider
- **THEN** display the full table with all columns, headers, sorting, and pagination
- **AND** maintain current TanStack Table functionality

#### Scenario: View table on mobile
- **WHEN** user views a data table on a viewport less than 768px wide
- **THEN** display data as a list of cards instead of a table
- **AND** each card shows the primary identifier prominently
- **AND** each card shows 1-2 key secondary fields
- **AND** each card shows status badge (if applicable)
- **AND** each card provides an action to view/edit the item
- **AND** no horizontal scrolling is required

#### Scenario: Search and filter on mobile
- **WHEN** user uses search/filter on a mobile data table view
- **THEN** the search input remains accessible above the card list
- **AND** filtering applies to the card list results
- **AND** results update in real-time as the user types

#### Scenario: Empty state on mobile
- **WHEN** a data table has no items on mobile viewport
- **THEN** display the same empty state message as desktop
- **AND** the empty state fits within the mobile viewport

### Requirement: Products Table Mobile Layout
The Products table SHALL display a mobile card layout showing product name, SKU, type, and status.

#### Scenario: View product card on mobile
- **WHEN** user views products list on mobile
- **THEN** each card displays product name as primary text (clickable link)
- **AND** displays SKU below the name
- **AND** displays type badge (Bundle/Standalone)
- **AND** displays status badge (Active/Inactive)
- **AND** provides action button to view product

### Requirement: Customers Table Mobile Layout
The Customers table SHALL display a mobile card layout showing customer name, company, and status.

#### Scenario: View customer card on mobile
- **WHEN** user views customers list on mobile
- **THEN** each card displays customer name as primary text
- **AND** displays company name below (or "No company")
- **AND** displays quote count
- **AND** displays status badge (Active/Inactive)
- **AND** provides action button to view customer

### Requirement: Quotes Table Mobile Layout
The Quotes table SHALL display a mobile card layout showing quote name, customer, status, and total.

#### Scenario: View quote card on mobile
- **WHEN** user views quotes list on mobile
- **THEN** each card displays quote name as primary text
- **AND** displays customer name below (or "No customer")
- **AND** displays line item count
- **AND** displays status badge with appropriate color
- **AND** provides action button to view quote

### Requirement: Rules Table Mobile Layout
The Rules table SHALL display a mobile card layout showing rule name, type, trigger, and status.

#### Scenario: View rule card on mobile
- **WHEN** user views rules list on mobile
- **THEN** each card displays rule name as primary text
- **AND** displays rule type (Configuration/Pricing)
- **AND** displays trigger type
- **AND** displays status badge (Active/Inactive)
- **AND** provides action button to view rule

### Requirement: Discounts Table Mobile Layout
The Discounts table SHALL display a mobile card layout showing discount name, type, scope, and status.

#### Scenario: View discount card on mobile
- **WHEN** user views discounts list on mobile
- **THEN** each card displays discount name as primary text
- **AND** displays discount type and value
- **AND** displays scope badge
- **AND** displays status badge (Active/Inactive)
- **AND** provides action button to view discount

### Requirement: Price Books Table Mobile Layout
The Price Books table SHALL display a mobile card layout showing price book name, currency, and entry count.

#### Scenario: View price book card on mobile
- **WHEN** user views price books list on mobile
- **THEN** each card displays price book name as primary text
- **AND** displays currency code
- **AND** displays entry count
- **AND** displays default badge if applicable
- **AND** provides action button to view price book

### Requirement: Currencies Table Mobile Layout
The Currencies table SHALL display a mobile card layout showing currency code, name, symbol, and base status.

#### Scenario: View currency card on mobile
- **WHEN** user views currencies list on mobile
- **THEN** each card displays currency code as primary text
- **AND** displays currency name and symbol
- **AND** displays base currency badge if applicable
- **AND** provides action button to view currency

### Requirement: Tax Rates Table Mobile Layout
The Tax Rates table SHALL display a mobile card layout showing tax rate name, rate percentage, and region.

#### Scenario: View tax rate card on mobile
- **WHEN** user views tax rates list on mobile
- **THEN** each card displays tax rate name as primary text
- **AND** displays rate percentage prominently
- **AND** displays country/state region
- **AND** displays active status
- **AND** provides action button to view tax rate

### Requirement: Units Table Mobile Layout
The Units of Measure table SHALL display a mobile card layout showing unit name, abbreviation, and conversion info.

#### Scenario: View unit card on mobile
- **WHEN** user views units list on mobile
- **THEN** each card displays unit name as primary text
- **AND** displays abbreviation
- **AND** displays base unit and conversion factor if applicable
- **AND** provides action button to view unit
