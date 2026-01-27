# learning-ui Specification Delta

## ADDED Requirements

### Requirement: Enhanced Phase Detail Cards
The roadmap page SHALL display expandable phase cards with detailed information about each release phase.

#### Scenario: View collapsed phase card
- **WHEN** user views the roadmap page
- **THEN** each phase displays as a card with phase number, name, and short description
- **AND** cards show the phase color coding (emerald, blue, purple, orange, pink)
- **AND** cards show the entity count for that phase

#### Scenario: Expand phase card for details
- **WHEN** user clicks on a phase card
- **THEN** the card expands to show detailed description
- **AND** displays list of phase goals
- **AND** displays list of key deliverables
- **AND** for Phase 3, displays "Upcoming Changes" callout about GA Contract Management evolution

#### Scenario: Collapse expanded phase card
- **WHEN** user clicks on an expanded phase card
- **THEN** the card collapses back to summary view

### Requirement: Entity Relationship Diagrams
The roadmap page SHALL display entity relationship diagrams using Mermaid, organized into three views.

#### Scenario: View data model diagram
- **WHEN** user selects the "Data Model" tab in the diagrams section
- **THEN** display a Mermaid ER diagram showing Prisma schema relations for the selected phase
- **AND** show foreign key relationships between entities
- **AND** filter diagram to show only entities for the selected phase (or all if no phase selected)

#### Scenario: View domain flow diagram
- **WHEN** user selects the "Domain Flow" tab in the diagrams section
- **THEN** display a Mermaid flowchart showing business process flow
- **AND** show how data moves through the system (e.g., Product → Quote → Line Items)

#### Scenario: View GA integration diagram
- **WHEN** user selects the "GA Integration" tab in the diagrams section
- **THEN** display a Mermaid diagram showing CPQ to GetAccept entity mapping
- **AND** show relationship types (reference, outputs-to, extends, new)
- **AND** visually distinguish CPQ entities from GA entities using subgraphs

### Requirement: Interactive Strategy Selection
The roadmap page SHALL allow users to select an integration strategy and see how it affects the displayed information.

#### Scenario: Select integration strategy
- **WHEN** user clicks on an Integration Strategy option (A: Extend, B: Reference, or C: Hybrid)
- **THEN** the selected strategy card is highlighted with a prominent border
- **AND** unselected strategy cards become visually faded
- **AND** a "Clear Selection" button appears

#### Scenario: View strategy-filtered extensibility patterns
- **WHEN** a strategy is selected
- **THEN** the Extensibility Patterns section updates to show only patterns relevant to that strategy
- **AND** patterns display strategy-specific guidance and code examples

#### Scenario: View strategy-filtered decisions
- **WHEN** a strategy is selected
- **THEN** the Decisions Needed section updates to show decisions specific to that strategy
- **AND** decisions include strategy-specific options and implications

#### Scenario: View strategy-specific entity notes
- **WHEN** a strategy is selected
- **THEN** entity cards/lists display strategy-specific implementation notes
- **AND** notes explain how each entity would be designed under the selected strategy

#### Scenario: Clear strategy selection
- **WHEN** user clicks the "Clear Selection" button
- **THEN** all strategy cards return to neutral state
- **AND** all sections return to showing default (all) content

### Requirement: Phase Metrics Chart
The roadmap page SHALL display visual charts showing phase statistics using ApexCharts.

#### Scenario: View entity distribution chart
- **WHEN** user views the roadmap page
- **THEN** display a donut chart showing entity count per phase
- **AND** chart uses phase colors (emerald, blue, purple, orange, pink)
- **AND** chart legend shows phase names
- **AND** chart supports dark mode

## MODIFIED Requirements

### Requirement: Phase Badge Display
The phase badge component SHALL display phase indicators without special complexity markers.

#### Scenario: View phase badge
- **WHEN** a phase badge is displayed anywhere in the application
- **THEN** show the phase number (P1, P2, etc.) with phase-specific color
- **AND** show tooltip with phase name and description on hover
- **AND** do NOT display warning icons or "Complex" indicators for any phase

#### Scenario: View Phase 3 badge
- **WHEN** a Phase 3 badge is displayed
- **THEN** show purple coloring consistent with other phases
- **AND** do NOT display a warning indicator
- **AND** tooltip shows "Subscriptions & Contracts" description
