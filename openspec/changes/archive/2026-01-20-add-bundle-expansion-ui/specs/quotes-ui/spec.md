# quotes-ui Specification Delta

## ADDED Requirements

### Requirement: Bundle Line Item Expansion
The system SHALL provide expandable/collapsible bundle line items in the quote editor to reveal component products.

#### Scenario: Bundle with child products displays expand control
- **WHEN** a quote contains a bundle product with child line items
- **THEN** the bundle line item displays an expand/collapse chevron icon
- **AND** the icon indicates the current expansion state (right chevron = collapsed, down chevron = expanded)

#### Scenario: Expanding a bundle reveals child products
- **WHEN** user clicks the expand control on a collapsed bundle
- **THEN** the bundle expands to show all child product line items
- **AND** child items are visually indented under the parent bundle
- **AND** child items have a subtle background differentiation

#### Scenario: Collapsing a bundle hides child products
- **WHEN** user clicks the collapse control on an expanded bundle
- **THEN** the child product line items are hidden
- **AND** only the parent bundle row remains visible

#### Scenario: Bundle without child products
- **WHEN** a bundle product has no child line items (empty bundle)
- **THEN** no expand/collapse control is displayed
- **AND** the bundle displays as a regular line item

### Requirement: Bundle Expansion State Persistence
The system SHALL maintain bundle expansion state during the quote editing session.

#### Scenario: Expansion state preserved on data refresh
- **WHEN** user expands a bundle
- **AND** performs an action that refreshes quote data (e.g., quantity change, add product)
- **THEN** the bundle remains expanded after the refresh

#### Scenario: Newly added bundles auto-expand
- **WHEN** user adds a new bundle product to the quote
- **THEN** the bundle is automatically expanded to show its components
- **AND** user can see the bundle configuration immediately

### Requirement: Global Bundle Expansion Toggle
The system SHALL provide a toggle to expand or collapse all bundles at once.

#### Scenario: Show all bundle contents
- **WHEN** user clicks "Show All Bundle Contents" toggle
- **AND** some or all bundles are collapsed
- **THEN** all bundles in the quote expand to show their child products

#### Scenario: Hide all bundle contents
- **WHEN** user clicks "Hide All Bundle Contents" toggle
- **AND** some or all bundles are expanded
- **THEN** all bundles in the quote collapse to hide their child products

#### Scenario: Toggle visibility based on bundle presence
- **WHEN** quote has no bundle products
- **THEN** the global toggle is not displayed
- **AND** no empty state message is shown for the toggle

### Requirement: Bundle Component Count Badge
The system SHALL display a badge showing the number of components in a collapsed bundle.

#### Scenario: Collapsed bundle shows component count
- **WHEN** a bundle is collapsed
- **AND** the bundle has child line items
- **THEN** a badge displays the count of child items (e.g., "3 items")

#### Scenario: Expanded bundle hides component count
- **WHEN** a bundle is expanded
- **THEN** the component count badge is hidden
- **AND** the actual child items are visible instead

### Requirement: Bundle Expansion Accessibility
The system SHALL ensure bundle expansion controls are accessible.

#### Scenario: Keyboard navigation for expand/collapse
- **WHEN** user focuses on a bundle line item with keyboard
- **AND** presses Enter or Space
- **THEN** the bundle toggles its expansion state

#### Scenario: Screen reader announces expansion state
- **WHEN** a bundle line item is focused by a screen reader
- **THEN** the screen reader announces whether the bundle is expanded or collapsed
- **AND** announces "X child items" for context
