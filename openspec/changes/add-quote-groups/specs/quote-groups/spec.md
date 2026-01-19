# quote-groups Specification

## Purpose
Enable organizing quote line items into logical groups for complex deal structures.

## ADDED Requirements

### Requirement: Quote Group Entity
The system SHALL store quote groups with the following attributes:
- Unique identifier (CUID)
- Reference to Quote (required, cascade delete)
- Name (required)
- Description (optional)
- Sort order for display (default 0)
- Optional flag (boolean, default false)
- Selected flag (boolean, default true, only relevant when optional)
- Subtotal (decimal, sum of line item net prices in group)
- Discount total (decimal, sum of discounts in group)
- Tax amount (decimal, calculated tax for group)
- Group total (decimal, subtotal - discounts + tax)

#### Scenario: Create quote group
- **WHEN** a group is created for a quote
- **THEN** the group is associated with the quote
- **AND** the group has default values (sortOrder=0, isOptional=false, isSelected=true)

#### Scenario: Optional group selection
- **WHEN** a group is marked as optional
- **THEN** it can be selected or deselected
- **AND** only selected groups contribute to quote grand totals

#### Scenario: Cascade delete groups
- **WHEN** a quote is deleted
- **THEN** all associated groups are deleted

### Requirement: Quote Group API
The system SHALL provide REST API endpoints for group management:
- `GET /api/quotes/:id/groups` - List groups with line items
- `POST /api/quotes/:id/groups` - Create a new group
- `PUT /api/quotes/:id/groups/:groupId` - Update group attributes
- `DELETE /api/quotes/:id/groups/:groupId` - Delete a group

#### Scenario: List quote groups
- **WHEN** GET /api/quotes/:id/groups is called
- **THEN** return array of groups with their line items
- **AND** groups are ordered by sortOrder

#### Scenario: Create quote group
- **WHEN** POST /api/quotes/:id/groups is called with name
- **THEN** create and return the new group
- **AND** recalculate quote totals

#### Scenario: Delete group with line items
- **WHEN** DELETE /api/quotes/:id/groups/:groupId is called
- **AND** the group contains line items
- **THEN** move line items to ungrouped (groupId = null)
- **AND** delete the group
- **AND** recalculate quote totals

### Requirement: Line Item Grouping
The system SHALL allow line items to belong to groups.

#### Scenario: Add line item to group
- **WHEN** a line item is added with a groupId
- **THEN** the line item belongs to that group
- **AND** group totals are recalculated

#### Scenario: Move line item between groups
- **WHEN** a line item's groupId is updated
- **THEN** the item moves to the new group
- **AND** both old and new group totals are recalculated

#### Scenario: Ungrouped line items
- **WHEN** a line item has no groupId (null)
- **THEN** it appears in a default "Ungrouped" section in the UI
- **AND** it still contributes to quote totals

### Requirement: Group Total Calculation
The system SHALL calculate totals for each group and roll up to quote grand totals.

#### Scenario: Calculate group subtotal
- **WHEN** group totals are calculated
- **THEN** group subtotal equals sum of all line item net prices in the group

#### Scenario: Calculate quote grand total
- **WHEN** quote grand totals are calculated
- **THEN** grand total equals sum of all selected groups' group totals
- **AND** ungrouped line items are included in grand total

#### Scenario: Optional group excluded from totals
- **WHEN** an optional group is deselected (isSelected=false)
- **THEN** its totals are not included in quote grand totals
- **AND** quote grand totals are recalculated

### Requirement: Quote Groups UI
The system SHALL provide UI for managing quote groups in the quote editor.

#### Scenario: View grouped line items
- **WHEN** user views quote editor with groups
- **THEN** line items are displayed organized by group
- **AND** each group shows name and subtotals
- **AND** ungrouped items appear in a default section

#### Scenario: Create group from editor
- **WHEN** user creates a new group
- **THEN** group appears in the quote editor
- **AND** user can drag line items into the group

#### Scenario: Toggle optional group
- **WHEN** user toggles an optional group's selection
- **THEN** quote grand totals update immediately
- **AND** visual indicator shows selected/deselected state
