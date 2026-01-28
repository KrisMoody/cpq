## ADDED Requirements

### Requirement: Semantic Feature Flags
The system SHALL provide semantic feature flags via the `usePhaseContext()` composable that indicate which CPQ features are available at the current phase.

#### Scenario: Accessing feature flags in components
- **WHEN** a component calls `usePhaseContext()`
- **THEN** it receives a `features` object with boolean properties
- **AND** each property indicates whether that feature is visible at the current phase
- **AND** the mapping is: Phase 2 (bundles, discounts, unitsOfMeasure), Phase 3 (subscriptions, contracts, taxes), Phase 4 (attributes, rules), Phase 5 (affinities, questionnaires, quoteLayouts)

#### Scenario: Feature flag values for Phase 1
- **WHEN** Phase 1 is selected
- **THEN** `features.bundles`, `features.discounts`, `features.unitsOfMeasure` are `false`
- **AND** `features.subscriptions`, `features.contracts`, `features.taxes` are `false`
- **AND** `features.attributes`, `features.rules` are `false`
- **AND** `features.affinities`, `features.questionnaires`, `features.quoteLayouts` are `false`

#### Scenario: Feature flag values for Phase 3
- **WHEN** Phase 3 is selected
- **THEN** `features.bundles`, `features.discounts`, `features.unitsOfMeasure` are `true`
- **AND** `features.subscriptions`, `features.contracts`, `features.taxes` are `true`
- **AND** `features.attributes`, `features.rules` are `false`
- **AND** `features.affinities`, `features.questionnaires`, `features.quoteLayouts` are `false`

### Requirement: Quote Detail Phase-Aware Sections
The system SHALL conditionally render sections on the quote detail page based on the current phase.

#### Scenario: Quote detail in Phase 1
- **WHEN** Phase 1 is selected and user views a quote detail page
- **THEN** the discount card is NOT displayed
- **AND** the recommendations section is NOT displayed
- **AND** the rules panel is NOT displayed
- **AND** the contract pricing banner is NOT displayed

#### Scenario: Quote detail in Phase 2
- **WHEN** Phase 2 is selected and user views a quote detail page
- **THEN** the discount card IS displayed
- **AND** the discount application button IS displayed
- **AND** bundle line items show expansion toggles for bundle children

#### Scenario: Quote detail in Phase 3
- **WHEN** Phase 3 is selected and user views a quote detail page
- **THEN** the contract pricing banner IS displayed (if applicable)
- **AND** tax sections are visible in pricing summary

#### Scenario: Quote detail in Phase 4
- **WHEN** Phase 4 is selected and user views a quote detail page
- **THEN** the rules panel IS displayed

#### Scenario: Quote detail in Phase 5
- **WHEN** Phase 5 is selected and user views a quote detail page
- **THEN** the recommendations section IS displayed

### Requirement: Product Form Phase-Aware Fields
The system SHALL conditionally render form fields on product creation/edit pages based on the current phase.

#### Scenario: Product form in Phase 1
- **WHEN** Phase 1 is selected and user creates/edits a product
- **THEN** the product type selector only shows "Standalone" (no "Bundle" option)
- **AND** the unit of measure field is NOT displayed
- **AND** the billing frequency field is NOT displayed
- **AND** the attributes section is NOT displayed

#### Scenario: Product form in Phase 2
- **WHEN** Phase 2 is selected and user creates/edits a product
- **THEN** the product type selector shows "Standalone" and "Bundle" options
- **AND** the unit of measure field IS displayed
- **AND** bundle features editor IS displayed for bundle products

#### Scenario: Product form in Phase 3
- **WHEN** Phase 3 is selected and user creates/edits a product
- **THEN** the billing frequency field IS displayed
- **AND** the default term months field IS displayed for recurring products

#### Scenario: Product form in Phase 4
- **WHEN** Phase 4 is selected and user creates/edits a product
- **THEN** the attributes section IS displayed
- **AND** the "Add Attributes" button is available

### Requirement: Customer Form Phase-Aware Fields
The system SHALL conditionally render form fields on customer pages based on the current phase.

#### Scenario: Customer page in Phase 1-2
- **WHEN** Phase 1 or 2 is selected and user views/edits a customer
- **THEN** the tax exemption section is NOT displayed
- **AND** the contracts section is NOT displayed

#### Scenario: Customer page in Phase 3+
- **WHEN** Phase 3 is selected and user views/edits a customer
- **THEN** the tax exemption section IS displayed
- **AND** the contracts section IS displayed

### Requirement: Pricing Summary Phase-Aware Sections
The system SHALL conditionally render sections in the pricing summary component based on the current phase.

#### Scenario: Pricing summary in Phase 1
- **WHEN** Phase 1 is selected
- **THEN** the discount breakdown section is NOT displayed
- **AND** the tax section is NOT displayed
- **AND** the recurring revenue metrics (MRR/ARR/TCV) are NOT displayed

#### Scenario: Pricing summary in Phase 2
- **WHEN** Phase 2 is selected
- **THEN** the discount breakdown section IS displayed
- **AND** applied discounts show their values

#### Scenario: Pricing summary in Phase 3
- **WHEN** Phase 3 is selected
- **THEN** the tax section IS displayed
- **AND** the recurring revenue metrics (MRR/ARR/TCV) ARE displayed for quotes with recurring items

### Requirement: Quote Line Item Phase-Aware Display
The system SHALL conditionally render elements in quote line item rows based on the current phase.

#### Scenario: Line item in Phase 1
- **WHEN** Phase 1 is selected
- **THEN** unit abbreviation is NOT displayed after quantity
- **AND** line-level discount amounts are NOT displayed
- **AND** bundle expansion toggles are NOT displayed
- **AND** key attributes badges are NOT displayed
- **AND** recurring product badges are NOT displayed

#### Scenario: Line item in Phase 2
- **WHEN** Phase 2 is selected
- **THEN** unit abbreviation IS displayed after quantity
- **AND** line-level discount amounts ARE displayed
- **AND** bundle expansion toggles ARE displayed for bundle products

#### Scenario: Line item in Phase 3
- **WHEN** Phase 3 is selected
- **THEN** recurring product badges ARE displayed
- **AND** term column IS displayed for subscription products
- **AND** contract pricing indicator IS displayed when applicable

#### Scenario: Line item in Phase 4
- **WHEN** Phase 4 is selected
- **THEN** key attributes badges ARE displayed
