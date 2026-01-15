## MODIFIED Requirements

### Requirement: Products List Page
The system SHALL provide a products list page at `/products` displaying all products in a sortable, filterable view with management actions. Users can switch between table and card views, with table view as the default.

#### Scenario: View products in table view (default)
- **WHEN** user navigates to /products
- **THEN** display products in a TanStack Table with columns: Name, SKU, Type, Description, Status, Actions
- **AND** table supports sorting by clicking column headers
- **AND** table supports global search filtering

#### Scenario: View products in card view
- **WHEN** user clicks the card view toggle button
- **THEN** display product cards with Name, SKU, Type, Active status in a responsive grid

#### Scenario: Switch between views
- **WHEN** user clicks the view toggle button
- **THEN** switch between table and card views
- **AND** persist the preference for future visits

#### Scenario: Create new product action
- **WHEN** user clicks "New Product" button
- **THEN** navigate to /products/new

#### Scenario: Show inactive products
- **WHEN** user enables "Show inactive" filter
- **THEN** display both active and inactive products in either view
