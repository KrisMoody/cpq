# quote-layout Specification

## Purpose
TBD - created by archiving change add-quote-layout-builder. Update Purpose after archive.
## Requirements
### Requirement: QuoteLayout Builder Component
The system SHALL provide a visual builder component for creating and editing QuoteLayouts with:
- Side-by-side layout: configuration panel and live preview
- Section management (add, remove, reorder sections)
- Column configuration per section
- Theme customization
- Summary configuration

#### Scenario: Open builder for new layout
- **WHEN** user navigates to /layouts/new
- **THEN** the builder opens with a default empty layout
- **AND** a single default section is created
- **AND** live preview shows sample quote data

#### Scenario: Open builder for existing layout
- **WHEN** user navigates to /layouts/:id
- **THEN** the builder loads the existing layout configuration
- **AND** live preview renders with the loaded settings

### Requirement: Section Management in Builder
The builder SHALL allow users to manage layout sections:
- Add new sections with default configuration
- Remove existing sections (with confirmation if has content)
- Reorder sections via drag-and-drop
- Expand/collapse sections for editing
- Configure section name and description

#### Scenario: Add new section
- **WHEN** user clicks "Add Section"
- **THEN** a new section is added to the layout
- **AND** the section is expanded for editing
- **AND** default columns are pre-selected

#### Scenario: Remove section
- **WHEN** user clicks remove on a section
- **THEN** the section is removed from the layout
- **AND** live preview updates immediately

#### Scenario: Reorder sections
- **WHEN** user drags a section to a new position
- **THEN** the section order updates
- **AND** live preview reflects new order

### Requirement: Column Configuration in Builder
The builder SHALL allow users to configure columns for each section:
- Display available columns as selectable chips
- Select/deselect columns to show in section
- Reorder selected columns via drag-and-drop
- Set custom labels for columns
- Configure column alignment

#### Scenario: Select columns
- **WHEN** user clicks on a column chip
- **THEN** the column is added to or removed from the section
- **AND** live preview updates to show/hide the column

#### Scenario: Reorder columns
- **WHEN** user drags a selected column to a new position
- **THEN** the column order updates in the table
- **AND** live preview reflects new column order

#### Scenario: Custom column label
- **WHEN** user edits a column's label
- **THEN** the custom label appears in the preview table header

### Requirement: Section Filter Configuration
The builder SHALL allow users to configure which line items appear in each section:
- Filter type selector (All items, By product type, By category)
- Multi-select for product types when filtering by type
- Multi-select for categories when filtering by category

#### Scenario: Configure product type filter
- **WHEN** user selects "By product type" and chooses "HARDWARE"
- **THEN** only hardware line items appear in that section's preview
- **AND** the filter is saved with the layout

#### Scenario: Show all items
- **WHEN** user selects "All items" filter
- **THEN** all quote line items appear in that section

### Requirement: Theme Editor in Builder
The builder SHALL provide theme customization:
- Theme presets (Professional, Modern, Minimal, Classic)
- Color pickers for primary and secondary colors
- Font family selector with web-safe fonts
- Table styling options (borders, alternate row colors)
- Header style selector

#### Scenario: Apply theme preset
- **WHEN** user selects "Modern" theme preset
- **THEN** preset colors and fonts are applied
- **AND** live preview updates with new theme

#### Scenario: Customize colors
- **WHEN** user picks a custom primary color
- **THEN** section headers and accents update to that color
- **AND** live preview reflects the color change

### Requirement: Summary Configuration in Builder
The builder SHALL allow users to configure the quote summary section:
- Toggle visibility of subtotal
- Toggle visibility of discounts line
- Toggle visibility of tax breakdown
- Toggle visibility of final total

#### Scenario: Configure minimal summary
- **WHEN** user unchecks all options except "Total"
- **THEN** live preview shows only the final total
- **AND** configuration is saved with layout

### Requirement: Live Preview in Builder
The builder SHALL display a live preview of the quote layout:
- Render using QuoteRenderer component
- Display sample quote data with various line item types
- Update preview as configuration changes
- Support zoom/scale adjustment

#### Scenario: Preview updates on change
- **WHEN** user makes any configuration change
- **THEN** the preview updates within 300ms
- **AND** shows the change reflected in the rendered quote

#### Scenario: Sample data coverage
- **WHEN** preview renders
- **THEN** sample data includes standalone products, bundles, services
- **AND** sample data includes discounts and taxes
- **AND** all layout features can be demonstrated

### Requirement: Layout Management Pages
The system SHALL provide pages for managing layouts:
- Index page at `/layouts` listing all layouts
- Create page at `/layouts/new`
- Edit page at `/layouts/:id`

#### Scenario: View layouts list
- **WHEN** user navigates to /layouts
- **THEN** display table of layouts with columns: Name, Type (Template/Custom), Updated
- **AND** provide actions: Edit, Clone, Delete

#### Scenario: Create new layout
- **WHEN** user clicks "New Layout" on layouts page
- **THEN** navigate to /layouts/new with empty builder

#### Scenario: Edit existing layout
- **WHEN** user clicks Edit on a layout row
- **THEN** navigate to /layouts/:id with builder loaded

### Requirement: Builder Save and Navigation
The builder SHALL handle saving and navigation properly:
- Save button persists layout to API
- Warn user about unsaved changes when navigating away
- Show success confirmation on save
- Handle save errors gracefully

#### Scenario: Save new layout
- **WHEN** user clicks Save on a new layout
- **THEN** POST to /api/quote-layouts creates the layout
- **AND** show success toast
- **AND** redirect to /layouts/:newId

#### Scenario: Unsaved changes warning
- **WHEN** user has unsaved changes and tries to navigate away
- **THEN** show confirmation dialog
- **AND** allow user to stay and save or discard and leave

