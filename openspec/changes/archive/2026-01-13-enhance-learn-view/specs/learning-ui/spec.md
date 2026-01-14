# learning-ui Spec Delta

## ADDED Requirements

### Requirement: Entity Hierarchy Tree
The system SHALL display a hierarchical tree visualization showing parent-child relationships between CPQ entities.

#### Scenario: View hierarchy tree
- **WHEN** user views the entity hierarchy tree
- **THEN** display Product hierarchy: Product → ProductFeature → ProductOption
- **AND** display Quote hierarchy: Quote → QuoteLineItem
- **AND** display Pricing hierarchy: PriceBook → PriceBookEntry

### Requirement: Glossary Examples
The system SHALL display concrete examples for each glossary term to illustrate CPQ concepts.

#### Scenario: View glossary term with example
- **WHEN** user views a glossary term card
- **THEN** display the term name and definition
- **AND** display a concrete example illustrating the concept
- **AND** style the example distinctly from the definition

## MODIFIED Requirements

### Requirement: Entity Relationship Diagram
The system SHALL display an ER-style diagram showing CPQ entities as boxes connected by labeled relationship lines, with a tabbed interface to switch between diagram and hierarchy views.

#### Scenario: View ER diagram
- **WHEN** user views the entity relationship diagram
- **THEN** display entities (Product, ProductFeature, ProductOption, PriceBook, PriceBookEntry, Quote, QuoteLineItem) as labeled boxes
- **AND** show connecting lines with relationship labels (1:N, N:1)
- **AND** group related entities visually (Product group, Pricing group, Quote group)

#### Scenario: Switch visualization view
- **WHEN** user clicks the "ER Diagram" or "Hierarchy" tab
- **THEN** display the selected visualization

### Requirement: Glossary Terms
The system SHALL display definitions and examples for the following CPQ terms:
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
- List Price
- Price Adjustment

#### Scenario: View glossary term
- **WHEN** user views a glossary term
- **THEN** display term name, definition, and example
- **AND** optionally show related terms

## REMOVED Requirements

(none)
