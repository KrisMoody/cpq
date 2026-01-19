## ADDED Requirements

### Requirement: Top Navigation Bar with User Controls
The system SHALL display a top navigation bar on desktop that contains user controls (user menu and color mode switcher), positioned to the right of the main content area above the page content.

#### Scenario: Desktop top navigation displays user controls
- **WHEN** user views the application on desktop (lg+ viewport)
- **THEN** a top navigation bar is displayed above the main content
- **AND** the user menu (showing user name/avatar and logout option) is positioned on the right side
- **AND** the color mode toggle is positioned next to the user menu

#### Scenario: Mobile header displays user controls
- **WHEN** user views the application on mobile (below lg breakpoint)
- **THEN** the mobile header displays the user menu and color mode toggle
- **AND** the controls are accessible without opening the mobile sidebar

## MODIFIED Requirements

### Requirement: Hub Pages for Navigation Sections
The system SHALL provide dedicated hub pages for navigation sections (Sales, Admin) and groups (Catalog, Configuration) that display links to their child pages.

#### Scenario: Sales hub page
- **WHEN** user navigates to `/sales`
- **THEN** the page displays links to Quotes, Customers, and Contracts
- **AND** each link navigates to the respective page

#### Scenario: Admin hub page
- **WHEN** user navigates to `/admin`
- **THEN** the page displays links to Catalog and Configuration sections
- **AND** each section shows its child page links

#### Scenario: Catalog hub page
- **WHEN** user navigates to `/admin/catalog`
- **THEN** the page displays links to Products, Categories, Price Books, Attributes, and Units

#### Scenario: Configuration hub page
- **WHEN** user navigates to `/admin/configuration`
- **THEN** the page displays links to Rules, Discounts, Tax Rates, Currencies, Affinities, Questionnaires, and Quote Layouts

#### Scenario: Sidebar footer content
- **WHEN** user views the sidebar (desktop or mobile)
- **THEN** the sidebar footer does NOT contain user menu or color mode controls
- **AND** the sidebar is dedicated solely to navigation items
