## MODIFIED Requirements

### Requirement: Glossary Terms
The system SHALL display definitions and examples for the following CPQ terms, organized into logical groups:

**Product Group:**
- Product
- Bundle
- Product Feature
- Product Option

**Pricing Group:**
- Price Book
- Price Book Entry
- List Price
- Price Adjustment

**Quote Group:**
- Quote
- Quote Line Item
- Configuration

**Meta:**
- CPQ (Configure, Price, Quote)

Each definition SHALL:
- Start with a one-sentence summary of what the term IS
- Explain how it differs from similar terms (e.g., Feature vs Option)
- Use consistent terminology across all definitions

Each example SHALL:
- Use the same domain scenario (laptop bundle configuration) for traceability
- Show concrete values (names, prices, quantities)
- Demonstrate the term's relationship to related terms

#### Scenario: View glossary term
- **WHEN** user views a glossary term
- **THEN** display term name, definition, and example
- **AND** optionally show related terms
- **AND** the definition clearly distinguishes the term from similar concepts

### Requirement: Glossary Examples
The system SHALL display concrete examples for each glossary term using a consistent laptop bundle scenario to illustrate CPQ concepts and their relationships.

#### Scenario: View glossary term with example
- **WHEN** user views a glossary term card
- **THEN** display the term name and definition
- **AND** display a concrete example using the laptop bundle scenario
- **AND** style the example distinctly from the definition

#### Scenario: Trace relationships across examples
- **WHEN** user reads examples across multiple glossary terms
- **THEN** they can follow the same laptop bundle through Product → Feature → Option → Price Book Entry → Quote Line Item

## ADDED Requirements

### Requirement: Glossary Term Grouping
The system SHALL organize glossary terms into logical groups (Product, Pricing, Quote) with visual headers to help users understand term relationships.

#### Scenario: View grouped glossary
- **WHEN** user views the glossary section
- **THEN** terms are displayed under group headers: "Product Terms", "Pricing Terms", "Quote Terms"
- **AND** related terms appear adjacent to each other within groups

#### Scenario: Search within groups
- **WHEN** user searches for a term
- **THEN** matching terms are shown with their group context preserved

### Requirement: Term Comparison Mode
The system SHALL provide a comparison mode allowing users to view 2-3 similar terms side-by-side to understand their differences.

#### Scenario: Enter comparison mode
- **WHEN** user clicks "Compare Terms" button
- **THEN** the UI enters comparison mode with term selection checkboxes

#### Scenario: Select terms to compare
- **WHEN** user selects 2-3 terms in comparison mode
- **THEN** display selected terms in a side-by-side layout
- **AND** highlight the key differences in their definitions

#### Scenario: Exit comparison mode
- **WHEN** user clicks "Exit Comparison" or clears selections
- **THEN** return to the standard grouped glossary view

### Requirement: Confusable Terms Highlights
The system SHALL display "Easily confused with" hints on terms that are commonly mistaken for each other.

#### Scenario: View confusable term warning
- **WHEN** user views a term that is commonly confused with another (e.g., Feature)
- **THEN** display a hint: "Easily confused with: Option"
- **AND** provide a brief distinction: "Feature is the QUESTION, Option is the ANSWER"

#### Scenario: Navigate to confusable term
- **WHEN** user clicks on a confusable term hint
- **THEN** scroll to or highlight that term in the glossary
