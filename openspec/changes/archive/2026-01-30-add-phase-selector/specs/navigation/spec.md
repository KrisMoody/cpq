## MODIFIED Requirements

### Requirement: Hub Pages for Navigation Sections
The system SHALL provide dedicated hub pages for navigation sections (Sales, Admin) and groups (Catalog, Configuration) that display links to their child pages, filtered by the currently selected phase.

#### Scenario: Sales hub page
- **WHEN** user navigates to `/sales`
- **THEN** the page displays links to Quotes and Customers (Phase 1)
- **AND** Contracts link is shown only if current phase >= 3
- **AND** each visible link navigates to the respective page

#### Scenario: Admin hub page
- **WHEN** user navigates to `/admin`
- **THEN** the page displays links to Catalog and Configuration sections
- **AND** each section shows its child page links filtered by current phase

#### Scenario: Catalog hub page
- **WHEN** user navigates to `/admin/catalog`
- **THEN** the page displays links to Products, Categories, and Price Books (Phase 1)
- **AND** Units link is shown only if current phase >= 2
- **AND** Attributes link is shown only if current phase >= 4

#### Scenario: Configuration hub page
- **WHEN** user navigates to `/admin/configuration`
- **THEN** the page displays links to Currencies (Phase 1)
- **AND** Discounts link is shown only if current phase >= 2
- **AND** Tax Rates link is shown only if current phase >= 3
- **AND** Rules link is shown only if current phase >= 4
- **AND** Affinities, Questionnaires, and Quote Layouts links are shown only if current phase >= 5

#### Scenario: Sidebar footer content
- **WHEN** user views the sidebar (desktop or mobile)
- **THEN** the sidebar footer does NOT contain user menu or color mode controls
- **AND** the sidebar is dedicated solely to navigation items

## ADDED Requirements

### Requirement: Phase-Filtered Sidebar Navigation
The system SHALL filter sidebar navigation items based on the currently selected phase, hiding items that belong to phases above the current selection.

#### Scenario: Navigation in Phase 1
- **WHEN** Phase 1 is selected
- **THEN** sidebar shows: Dashboard, Quotes, Customers, Products, Categories, Price Books, Currencies
- **AND** sidebar does NOT show: Contracts, Discounts, Units, Tax Rates, Attributes, Rules, Affinities, Questionnaires, Quote Layouts

#### Scenario: Navigation in Phase 3
- **WHEN** Phase 3 is selected
- **THEN** sidebar shows all Phase 1 items plus: Contracts, Discounts, Units, Tax Rates
- **AND** sidebar does NOT show: Attributes, Rules, Affinities, Questionnaires, Quote Layouts

#### Scenario: Navigation in Phase 5
- **WHEN** Phase 5 is selected
- **THEN** sidebar shows all navigation items
- **AND** phase badges continue to display on each item

#### Scenario: Group visibility based on children
- **WHEN** a phase is selected where all children of a group are hidden
- **THEN** the group header is also hidden
- **AND** the group reappears when switching to a phase that shows at least one child

### Requirement: Phase Selector in Sidebar Header
The system SHALL display the phase selector component in the sidebar header area, below the logo/brand.

#### Scenario: Phase selector placement on desktop
- **WHEN** user views the sidebar on desktop
- **THEN** the phase selector appears directly below the "CPQ Learning" logo
- **AND** the selector is visually distinct from navigation items

#### Scenario: Phase selector placement on mobile
- **WHEN** user opens the mobile sidebar
- **THEN** the phase selector appears in the same position as desktop
- **AND** selecting a phase closes the mobile sidebar and applies the selection
