# navigation Spec Delta

## ADDED Requirements

### Requirement: Back Button in Breadcrumb Navigation
The system SHALL display a back navigation button as the first element of the breadcrumb bar when a parent page exists.

#### Scenario: Back button appears on detail pages
- **WHEN** user is on a detail page (e.g., `/products/abc123`)
- **AND** breadcrumbs show a navigation path with a parent
- **THEN** a back button icon (left arrow) appears as the first element before the breadcrumb trail
- **AND** clicking the back button navigates to the parent page (`/products`)

#### Scenario: Back button appears on new/create pages
- **WHEN** user is on a new page (e.g., `/products/new`)
- **AND** breadcrumbs show "Admin > Catalog > Products > New"
- **THEN** a back button icon appears before the breadcrumb trail
- **AND** clicking the back button navigates to `/products`

#### Scenario: Back button not shown on root pages
- **WHEN** user is on a root page (e.g., `/products`)
- **AND** breadcrumbs show only the current section
- **THEN** no back button is displayed

#### Scenario: Back button styling
- **WHEN** the back button is displayed
- **THEN** it renders as an icon-only button with no text label
- **AND** it uses the left arrow icon (`i-heroicons-arrow-left` or similar)
- **AND** it is styled consistently with the breadcrumb aesthetic

## REMOVED Requirements

### Requirement: Standalone Back Buttons on Pages
Detail and edit pages SHALL NOT contain standalone "Back to {route}" buttons above the page content. Back navigation is handled exclusively through the breadcrumb back button.

#### Scenario: Detail pages have no back button
- **WHEN** user views a detail page (e.g., `/products/[id]`)
- **THEN** there is no "Back to Products" button before the page header
- **AND** back navigation is provided only via the breadcrumb back button

#### Scenario: New pages have no back button
- **WHEN** user views a new/create page (e.g., `/products/new`)
- **THEN** there is no "Back to Products" button before the form
- **AND** back navigation is provided only via the breadcrumb back button
