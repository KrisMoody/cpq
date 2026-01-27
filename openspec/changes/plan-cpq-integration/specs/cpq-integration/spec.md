## ADDED Requirements

### Requirement: Release Phase Markers
The CPQ POC SHALL display release phase indicators showing which entities belong to each incremental release phase.

#### Scenario: Phase badge on entity list pages
- **WHEN** a user views an entity list page (e.g., Products, Quotes)
- **THEN** a phase badge is displayed in the page header
- **AND** the badge shows the phase number (P1, P2, etc.)
- **AND** the badge uses color coding to distinguish phases
- **AND** hovering the badge shows a tooltip with the phase name

#### Scenario: Phase badge on entity detail pages
- **WHEN** a user views an entity detail page
- **THEN** a phase badge is displayed in the page header
- **AND** the badge matches the styling of list page badges

#### Scenario: Phase 3 complexity indicator
- **WHEN** an entity belongs to Phase 3 (Subscriptions & Contracts)
- **THEN** the phase badge includes a warning indicator
- **AND** the tooltip mentions integration complexity with GA Contract Management

#### Scenario: Phase configuration centralized
- **WHEN** phase assignments need to be updated
- **THEN** all mappings are maintained in a single configuration file
- **AND** the configuration includes GA entity mappings per CPQ entity
- **AND** changes propagate to all UI components automatically

### Requirement: Interactive Release Roadmap
The CPQ POC SHALL provide an interactive roadmap page showing all release phases and integration documentation.

#### Scenario: Roadmap overview display
- **WHEN** a user navigates to the roadmap page
- **THEN** all five release phases are displayed with names and descriptions
- **AND** each phase lists its included entities
- **AND** the phases are presented in sequential order (1 through 5)

#### Scenario: Phase filtering interaction
- **WHEN** a user clicks on a phase in the roadmap
- **THEN** the entities for that phase are highlighted or filtered
- **AND** clicking again resets the filter

#### Scenario: Entity navigation from roadmap
- **WHEN** a user clicks an entity name in the roadmap
- **THEN** they are navigated to that entity's detail page

#### Scenario: GA entity mapping documentation
- **WHEN** a user views the roadmap page
- **THEN** a table shows CPQ entity to GA entity mappings
- **AND** the relationship type is documented (reference, extend, outputs to, new)
- **AND** a diagram shows the CPQ → GA data flow (Quote outputs to PricingTable)

#### Scenario: Integration strategy options
- **WHEN** a user views the roadmap page
- **THEN** the three integration strategies are documented (Extend, Reference, Hybrid)
- **AND** each strategy shows pros and cons
- **AND** the recommended approach is highlighted

#### Scenario: Uncertainties and decisions documentation
- **WHEN** a user views the roadmap page
- **THEN** decisions needed per phase are listed
- **AND** each decision shows options and impact

#### Scenario: Phase 3 complexity callout
- **WHEN** the roadmap displays Phase 3
- **THEN** a special callout section explains the Contract Management integration complexity
- **AND** the callout lists integration options (extend, reference, sync)

#### Scenario: Extensibility patterns documentation
- **WHEN** a user views the roadmap page
- **THEN** a section documents the extensibility patterns used in the POC
- **AND** patterns include: entityId multi-tenancy, enum-based typing, JSON metadata, nullable FKs, interface-based services, event hooks

#### Scenario: Roadmap in navigation
- **WHEN** a user browses the Learning section
- **THEN** the Release Roadmap page is accessible from the navigation
