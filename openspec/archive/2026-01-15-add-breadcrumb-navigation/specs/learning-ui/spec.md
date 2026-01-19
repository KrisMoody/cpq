## ADDED Requirements

### Requirement: Breadcrumb Navigation
The application SHALL display breadcrumb navigation showing the user's current location within the navigation hierarchy.

#### Scenario: View breadcrumbs on list page
- **WHEN** user navigates to a list page (e.g., `/products`)
- **THEN** breadcrumbs display the full navigation path (e.g., "Admin > Catalog > Products")
- **AND** each breadcrumb segment except the current page is a clickable link

#### Scenario: View breadcrumbs on detail page
- **WHEN** user navigates to a detail page (e.g., `/products/abc123`)
- **THEN** breadcrumbs display the path with a generic "View" label (e.g., "Admin > Catalog > Products > View")
- **AND** the entity name is not fetched or displayed in breadcrumbs

#### Scenario: View breadcrumbs on new page
- **WHEN** user navigates to a new entity page (e.g., `/products/new`)
- **THEN** breadcrumbs display the path with "New" label (e.g., "Admin > Catalog > Products > New")

#### Scenario: View breadcrumbs on nested route
- **WHEN** user navigates to a nested route (e.g., `/quotes/abc123/preview`)
- **THEN** breadcrumbs display the full nested path (e.g., "Sales > Quotes > View > Preview")

#### Scenario: Navigate via breadcrumb
- **WHEN** user clicks a breadcrumb segment
- **THEN** user is navigated to that section
- **AND** the clicked segment is not the current page

#### Scenario: Breadcrumbs on dashboard
- **WHEN** user is on the dashboard (`/`)
- **THEN** breadcrumbs display only "Dashboard"
- **AND** "Dashboard" is not a clickable link (current page)
