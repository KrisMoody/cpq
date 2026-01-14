# Learning UI

Provides interactive educational content explaining CPQ concepts.

## ADDED Requirements

### Requirement: Dashboard Page
The system SHALL provide a dashboard page at `/` with an overview of CPQ concepts and navigation to key areas.

#### Scenario: View dashboard
- **WHEN** user navigates to /
- **THEN** display welcome message and CPQ overview
- **AND** show quick links to Products, Quotes, and Learn pages
- **AND** display summary statistics (product count, quote count)

### Requirement: Learn Page
The system SHALL provide a learning page at `/learn` with interactive CPQ glossary and entity relationship diagrams.

#### Scenario: View learn page
- **WHEN** user navigates to /learn
- **THEN** display CPQ glossary with term definitions
- **AND** display interactive entity relationship diagram using ApexCharts

### Requirement: Glossary Terms
The system SHALL display definitions for the following CPQ terms:
- CPQ (Configure, Price, Quote)
- Product
- Bundle
- Product Feature
- Product Option
- Price Book
- Price Book Entry
- Quote
- Quote Line Item
- Configuration

#### Scenario: View glossary term
- **WHEN** user views a glossary term
- **THEN** display term name and definition
- **AND** optionally show related terms

### Requirement: Entity Relationship Diagram
The system SHALL display an interactive diagram showing relationships between CPQ entities using ApexCharts.

#### Scenario: View entity diagram
- **WHEN** user views the entity relationship diagram
- **THEN** display visual representation of Product, PriceBook, Quote, and related entities
- **AND** show relationship cardinalities (1:N, N:1)

#### Scenario: Interactive diagram exploration
- **WHEN** user clicks on an entity in the diagram
- **THEN** highlight related entities and relationships
- **AND** display entity description

### Requirement: CPQ Flow Diagram
The system SHALL display a workflow diagram showing the typical CPQ process flow.

#### Scenario: View flow diagram
- **WHEN** user views the CPQ flow diagram
- **THEN** display steps: Browse Products → Configure Bundle → Add to Quote → Review Pricing → Finalize Quote
