# learning-ui Spec Delta

## MODIFIED Requirements

### Requirement: Entity Relationship Diagram
The system SHALL display an ER-style diagram showing CPQ entities as boxes connected by labeled relationship lines, with a tabbed interface to switch between diagram, hierarchy, and database schema views.

#### Scenario: View ER diagram
- **WHEN** user views the entity relationship diagram
- **THEN** display entities (Product, ProductFeature, ProductOption, PriceBook, PriceBookEntry, PriceTier, Quote, QuoteLineItem, Customer, Rule, Discount, DiscountTier, AppliedDiscount, Category, TaxRate, Contract, Attribute, Currency) as labeled boxes
- **AND** show connecting lines with relationship labels (1:N, N:1)
- **AND** group related entities visually

#### Scenario: Switch visualization view
- **WHEN** user clicks the "ER Diagram", "Hierarchy", or "Database Schema" tab
- **THEN** display the selected visualization

#### Scenario: Interactive database schema navigation
- **WHEN** user views the Database Schema tab
- **THEN** display an interactive diagram built with Vue Flow
- **AND** entities are rendered as draggable table cards showing model name
- **AND** relationships are shown as edges with cardinality labels

#### Scenario: Zoom and pan schema diagram
- **WHEN** user scrolls mouse wheel on the schema diagram
- **THEN** zoom in or out centered on cursor position
- **WHEN** user drags on the diagram background
- **THEN** pan the viewport to explore the schema

#### Scenario: Drag schema entities
- **WHEN** user drags an entity node
- **THEN** the node moves to the new position
- **AND** connected edges update to follow the node

#### Scenario: View entity field details
- **WHEN** user clicks on an entity node
- **THEN** expand the node to show all fields with their types
- **AND** indicate primary keys, foreign keys, and required fields visually

#### Scenario: Navigate large schema with minimap
- **WHEN** user views the schema diagram with many entities
- **THEN** display a minimap showing the full schema overview
- **AND** the minimap highlights the current viewport
- **WHEN** user clicks on the minimap
- **THEN** navigate to that area of the schema

#### Scenario: Use diagram controls
- **WHEN** user views the schema diagram
- **THEN** display zoom controls (zoom in, zoom out, fit view)
- **WHEN** user clicks fit view
- **THEN** adjust zoom and position to show all entities
