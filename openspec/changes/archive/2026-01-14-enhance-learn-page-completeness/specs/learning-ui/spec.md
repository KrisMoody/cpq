# learning-ui Specification Delta

## ADDED Requirements

### Requirement: Table of Contents Navigation
The system SHALL provide a sticky table of contents for navigating the Learn page sections.

#### Scenario: View table of contents on desktop
- **WHEN** user views the Learn page on a desktop viewport (≥1280px)
- **THEN** display a sticky left sidebar with section links
- **AND** show nested navigation for subsections
- **AND** highlight the currently visible section

#### Scenario: View table of contents on tablet
- **WHEN** user views the Learn page on a tablet viewport (768-1279px)
- **THEN** display a sticky top bar with horizontal section links
- **AND** allow horizontal scroll if links overflow

#### Scenario: View table of contents on mobile
- **WHEN** user views the Learn page on a mobile viewport (<768px)
- **THEN** display a hamburger menu button
- **AND** show slide-out navigation when hamburger is clicked

#### Scenario: Navigate to section via TOC
- **WHEN** user clicks a section link in the table of contents
- **THEN** smooth scroll to the target section
- **AND** briefly highlight the section to indicate location
- **AND** update the URL hash for bookmarking

### Requirement: Collapsible Sections
The system SHALL organize the Learn page into collapsible sections for progressive disclosure.

#### Scenario: View collapsible section
- **WHEN** user views the Learn page
- **THEN** each major section (Workflow, Data Model, Business Logic, Formulas, Example, Glossary, Enums, Relationships, Tips) is wrapped in a collapsible card
- **AND** sections display a header with title, icon, and expand/collapse indicator

#### Scenario: Collapse a section
- **WHEN** user clicks a section header
- **THEN** toggle the section's expanded/collapsed state
- **AND** animate the height transition smoothly

#### Scenario: Expand all sections
- **WHEN** user clicks "Expand All" button
- **THEN** expand all collapsed sections

#### Scenario: Collapse all sections
- **WHEN** user clicks "Collapse All" button
- **THEN** collapse all expanded sections

#### Scenario: Remember section state
- **WHEN** user navigates away and returns to the Learn page
- **THEN** sections retain their expanded/collapsed state within the session

### Requirement: Interactive ER Diagram with Vue Flow
The system SHALL display an interactive entity-relationship diagram using Vue Flow library with zoom, pan, and click-to-explore capabilities.

#### Scenario: View interactive ER diagram
- **WHEN** user views the ER diagram tab in the Data Model section
- **THEN** display all entities as draggable, clickable nodes
- **AND** show relationship lines with cardinality markers
- **AND** color-code entities by their domain group

#### Scenario: Zoom ER diagram
- **WHEN** user scrolls mouse wheel or pinches on the ER diagram
- **THEN** zoom in or out smoothly
- **AND** maintain center point during zoom

#### Scenario: Pan ER diagram
- **WHEN** user drags on the ER diagram background
- **THEN** pan the view in the drag direction

#### Scenario: View minimap
- **WHEN** user views the ER diagram
- **THEN** display a minimap in the corner showing the full diagram
- **AND** highlight the current viewport area
- **AND** allow clicking on minimap to navigate

#### Scenario: Fit diagram to view
- **WHEN** user clicks the "Fit" control button
- **THEN** zoom and pan to fit all entities in the viewport

#### Scenario: Click entity for details
- **WHEN** user clicks an entity node in the ER diagram
- **THEN** open a detail panel showing entity attributes and relationships
- **AND** highlight the selected entity
- **AND** provide a link to view the entity in the glossary

#### Scenario: Filter by domain
- **WHEN** user clicks a domain filter toggle (e.g., "Products", "Quotes")
- **THEN** show or hide entities belonging to that domain
- **AND** update relationship lines accordingly

#### Scenario: Search entities
- **WHEN** user types in the entity search box
- **THEN** highlight matching entity nodes
- **AND** dim non-matching nodes

### Requirement: Guided Selling Glossary Terms
The system SHALL display definitions for guided selling terms explaining the recommendation engine.

**Guided Selling Terms:**
- Product Affinity: A directional relationship between products (source → target) that triggers recommendations based on affinity type.
- Affinity Type: The category of relationship: CROSS_SELL, UPSELL, ACCESSORY, REQUIRED, FREQUENTLY_BOUGHT, SUBSCRIPTION_ADDON.
- Questionnaire: A needs-assessment survey with ordered questions that guide users to appropriate products.
- Question: A single question with type (SINGLE_CHOICE, MULTIPLE_CHOICE, RANGE, YES_NO), options, and optional branching logic.
- Question Type: The answer format for questions: SINGLE_CHOICE, MULTIPLE_CHOICE, RANGE, YES_NO.
- Question Product Mapping: The junction linking a question's answer to recommended products with relevance scores.
- Recommendation Log: A tracking record for recommendation effectiveness (SHOWN, ACCEPTED, DISMISSED).
- Recommendation Source: How a recommendation was generated: RULE_BASED, AI_GENERATED, QUESTIONNAIRE, MANUAL.
- Recommendation Action: The user's response to a recommendation: SHOWN, ACCEPTED, DISMISSED.

#### Scenario: View guided selling group terms
- **WHEN** user views the Guided Selling Terms group on the learn page
- **THEN** display Product Affinity, Affinity Type, Questionnaire, Question, Question Type, Question Product Mapping, Recommendation Log, Recommendation Source, and Recommendation Action definitions
- **AND** each term includes domain-consistent examples using the laptop bundle scenario
- **AND** terms include "easily confused with" hints where applicable (Affinity vs Questionnaire)

#### Scenario: Navigate to guided selling term
- **WHEN** user searches for "affinity" or "questionnaire" in the glossary
- **THEN** matching guided selling terms appear in results
- **AND** group context "Guided Selling Terms" is preserved

### Requirement: Complete Entity Coverage in ER Diagram
The system SHALL display an ER diagram showing all 31 database models organized by domain with relationship lines and cardinality labels.

**Entity Groups:**
- Currency (2): Currency, ExchangeRate
- Units (1): UnitOfMeasure
- Products (5): Product, ProductFeature, ProductOption, ProductCategory, ProductAttribute
- Categories (2): Category, CategoryAttribute
- Attributes (2): AttributeGroup, Attribute
- Customers (3): Customer, Contract, ContractPriceEntry
- Pricing (3): PriceBook, PriceBookEntry, PriceTier
- Quotes (3): Quote, QuoteLineItem, AppliedDiscount
- Rules (1): Rule
- Discounts (2): Discount, DiscountTier
- Tax (1): TaxRate
- Guided Selling (5): ProductAffinity, Questionnaire, Question, QuestionProductMapping, RecommendationLog

#### Scenario: View full ER diagram
- **WHEN** user selects the "Full" view toggle on the ER diagram
- **THEN** display all 31 entities as labeled boxes
- **AND** color-code entities by their domain group
- **AND** show connecting lines with relationship labels (1:N, N:1, N:N)
- **AND** group related entities visually within domain regions

#### Scenario: Toggle between simplified and full diagram
- **WHEN** user clicks the "Simplified/Full" toggle
- **THEN** switch between the 13-entity simplified view and 31-entity full view
- **AND** the toggle state is preserved during the session

#### Scenario: Identify entity domain by color
- **WHEN** user views the ER diagram
- **THEN** each entity box displays in its domain's color
- **AND** a legend shows color-to-domain mappings

### Requirement: Complete Entity Hierarchy Trees
The system SHALL display hierarchy trees for all entity parent-child relationships including newly added domains.

**Additional Hierarchy Trees:**
- Category hierarchy: Category (parent-child self-reference) → ProductCategory → Product
- Contract hierarchy: Customer → Contract → ContractPriceEntry
- Currency hierarchy: Currency → ExchangeRate
- Attribute hierarchy: AttributeGroup → Attribute → ProductAttribute, Attribute → CategoryAttribute
- Guided Selling hierarchy: Questionnaire → Question → QuestionProductMapping, ProductAffinity (source/target relationships)

#### Scenario: View category hierarchy
- **WHEN** user views the entity hierarchy tree
- **THEN** display Category hierarchy showing parent-child self-reference
- **AND** show ProductCategory as junction to Product

#### Scenario: View contract hierarchy
- **WHEN** user views the entity hierarchy tree
- **THEN** display Customer → Contract → ContractPriceEntry chain
- **AND** tooltip explains how contract pricing overrides price books

#### Scenario: View guided selling hierarchy
- **WHEN** user views the entity hierarchy tree
- **THEN** display Questionnaire → Question → QuestionProductMapping chain
- **AND** display ProductAffinity with source/target relationship notation

### Requirement: Business Logic Documentation with Mermaid Flowcharts
The system SHALL display expandable cards explaining core business logic with formulas, Mermaid flowcharts, and examples.

**Business Logic Topics:**
1. Pricing Calculation: Line item pricing from list price, tiers, and adjustments
2. Discount Stacking: How line-level and quote-level discounts combine (with flowchart)
3. Contract Pricing Override: When and how contract prices override price book prices (with flowchart)
4. Tax Calculation: How tax rates are resolved and applied
5. Subscription Metrics: MRR, ARR, TCV calculations

#### Scenario: View pricing calculation logic
- **WHEN** user expands the "Pricing Calculation" card
- **THEN** display the formula: unitPrice = tierPrice ?? listPrice → lineTotal = unitPrice × quantity → netPrice = lineTotal - discounts
- **AND** show a worked example with concrete numbers

#### Scenario: View discount stacking rules
- **WHEN** user expands the "Discount Stacking" card
- **THEN** display a Mermaid flowchart showing the discount evaluation flow
- **AND** explain that line-level discounts apply first, then quote-level
- **AND** explain stackable vs non-stackable behavior
- **AND** show example of multiple discounts applied to same line

#### Scenario: View contract pricing override logic
- **WHEN** user expands the "Contract Pricing Override" card
- **THEN** display a Mermaid flowchart showing the decision tree: Customer Selected? → Has Active Contract? → Contract Price Entry exists? → Override price book
- **AND** explain precedence rules
- **AND** render the flowchart using @vue-storefront/nuxt-mermaid

#### Scenario: View tax calculation logic
- **WHEN** user expands the "Tax Calculation" card
- **THEN** explain jurisdiction resolution from customer address
- **AND** show taxAmount = taxableSubtotal × rate formula
- **AND** explain tax exemption behavior

#### Scenario: View subscription metrics logic
- **WHEN** user expands the "Subscription Metrics" card
- **THEN** display MRR = normalized monthly revenue formula
- **AND** display ARR = MRR × 12 formula
- **AND** display TCV = oneTimeTotal + (MRR × termMonths) formula
- **AND** explain billing frequency normalization

### Requirement: Formula Quick Reference
The system SHALL display a collapsible reference section with all pricing and calculation formulas.

#### Scenario: View formula reference
- **WHEN** user expands the "Formula Reference" section
- **THEN** display line item pricing formulas
- **AND** display quote total formulas
- **AND** display recurring revenue formulas
- **AND** display proration formula
- **AND** display currency conversion formula
- **AND** formulas are displayed in monospace font for clarity

#### Scenario: Copy formula
- **WHEN** user clicks on a formula block
- **THEN** the formula text is copied to clipboard
- **AND** a toast notification confirms the copy

### Requirement: Interactive Worked Example
The system SHALL display an interactive step-by-step example tracing data through a complete quote workflow.

#### Scenario: View worked example
- **WHEN** user views the "Worked Example" section
- **THEN** display a multi-step walkthrough: Setup → Add Product → Configure → Apply Pricing → Apply Discounts → Calculate Tax → Final Totals
- **AND** each step shows relevant data and calculations
- **AND** steps are connected with visual flow indicators

#### Scenario: Step through example
- **WHEN** user clicks "Next" on a worked example step
- **THEN** highlight the next step in the sequence
- **AND** show how data from previous steps flows forward
- **AND** display the calculation being performed

#### Scenario: View data at each step
- **WHEN** user is viewing a worked example step
- **THEN** display the input values (e.g., list price, quantity)
- **AND** display the formula being applied
- **AND** display the result value

### Requirement: Enum Quick Reference
The system SHALL display a reference card showing all enum types with their possible values.

**Enums to Document:**
- ProductType: STANDALONE, BUNDLE
- BillingFrequency: ONE_TIME, MONTHLY, QUARTERLY, ANNUAL, CUSTOM
- QuoteStatus: DRAFT, PENDING, PENDING_APPROVAL, APPROVED, REJECTED, ACCEPTED, FINALIZED, CANCELLED
- DiscountType: PERCENTAGE, FIXED_AMOUNT
- DiscountScope: LINE_ITEM, QUOTE, PRODUCT_CATEGORY
- ContractStatus: DRAFT, ACTIVE, EXPIRED
- AttributeType: TEXT, NUMBER, BOOLEAN, SELECT, DATE
- RuleType: CONFIGURATION, PRICING
- RuleTrigger: ON_PRODUCT_ADD, ON_QUANTITY_CHANGE, ON_QUOTE_SAVE, ON_FINALIZE
- AffinityType: CROSS_SELL, UPSELL, ACCESSORY, REQUIRED, FREQUENTLY_BOUGHT, SUBSCRIPTION_ADDON
- QuestionType: SINGLE_CHOICE, MULTIPLE_CHOICE, RANGE, YES_NO
- RecommendationSource: RULE_BASED, AI_GENERATED, QUESTIONNAIRE, MANUAL
- RecommendationAction: SHOWN, ACCEPTED, DISMISSED
- TierType: UNIT_PRICE, FLAT_PRICE

#### Scenario: View enum reference
- **WHEN** user views the "Enum Reference" section
- **THEN** display all enum types grouped by domain
- **AND** each enum shows its possible values
- **AND** enum names match Prisma schema exactly (SCREAMING_CASE)

#### Scenario: Search enums
- **WHEN** user searches for an enum value (e.g., "PENDING")
- **THEN** highlight matching enum types and values
- **AND** display which enum(s) contain that value

#### Scenario: View enum usage hint
- **WHEN** user hovers over an enum value
- **THEN** display a tooltip explaining when this value is used
- **AND** example: "PENDING_APPROVAL: Quote is awaiting manager approval"

### Requirement: Relationship Explanation Cards
The system SHALL display visual cards explaining complex entity relationships with flowcharts.

**Relationship Cards:**
1. Contract Pricing Flow: When does contract pricing apply?
2. Discount Stacking Flow: How do multiple discounts combine?
3. Product Affinity Flow: How do affinities trigger recommendations?
4. Questionnaire Scoring Flow: How do answers map to products?

#### Scenario: View contract pricing flow card
- **WHEN** user views the "Contract Pricing Flow" card
- **THEN** display a flowchart: Customer selected → Has active contract? → Contract has price entry for product? → Use contract price : Use price book price
- **AND** annotate decision points with conditions

#### Scenario: View discount stacking flow card
- **WHEN** user views the "Discount Stacking Flow" card
- **THEN** display a diagram showing line-level vs quote-level application
- **AND** show stackable vs non-stackable resolution
- **AND** annotate with priority evaluation order

#### Scenario: View product affinity flow card
- **WHEN** user views the "Product Affinity Flow" card
- **THEN** display: Source product added → Find active affinities → Filter by conditions → Display recommendations by type
- **AND** show different affinity types with visual distinction

#### Scenario: View questionnaire scoring flow card
- **WHEN** user views the "Questionnaire Scoring Flow" card
- **THEN** display: User answers question → Answer maps to products via QuestionProductMapping → Aggregate scores across questions → Rank products by total score
- **AND** show example with concrete scores

### Requirement: Quick Tips for Guided Selling
The system SHALL display quick tips explaining how to use guided selling features effectively.

#### Scenario: View affinity tips
- **WHEN** user views quick tips
- **THEN** display tip about creating product affinities for cross-sell opportunities
- **AND** display tip about using REQUIRED affinity type for mandatory companions
- **AND** display tip about setting priority for recommendation ordering

#### Scenario: View questionnaire tips
- **WHEN** user views quick tips
- **THEN** display tip about designing questionnaires for needs discovery
- **AND** display tip about using branching logic for personalized flows
- **AND** display tip about scoring products to improve recommendation accuracy

### Requirement: Learn Page Section Navigation
The system SHALL provide quick navigation to major sections within the learn page.

#### Scenario: View section navigation
- **WHEN** user views the learn page header area
- **THEN** display anchor links to major sections: Workflow, Data Model, Business Logic, Formulas, Example, Glossary, Enums, Relationships, Tips

#### Scenario: Navigate to section
- **WHEN** user clicks a section anchor link
- **THEN** scroll smoothly to that section
- **AND** highlight the section briefly to indicate location

#### Scenario: Sticky navigation on scroll
- **WHEN** user scrolls down the learn page
- **THEN** the section navigation becomes sticky at the top
- **AND** the currently visible section is highlighted in the navigation

## MODIFIED Requirements

### Requirement: Entity Relationship Diagram
The system SHALL display an ER-style diagram showing CPQ entities as boxes connected by labeled relationship lines, with a tabbed interface to switch between simplified, full, and database schema views.

#### Scenario: View ER diagram (MODIFIED)
- **WHEN** user views the entity relationship diagram
- **THEN** display core entities (Product, ProductFeature, ProductOption, PriceBook, PriceBookEntry, PriceTier, Quote, QuoteLineItem, Customer, Rule, Discount, DiscountTier, AppliedDiscount, Category, TaxRate, Contract, Attribute, Currency) as labeled boxes in simplified mode
- **AND** display all 31 entities when in full mode (including ProductCategory, ProductAttribute, CategoryAttribute, AttributeGroup, ExchangeRate, ContractPriceEntry, UnitOfMeasure, ProductAffinity, Questionnaire, Question, QuestionProductMapping, RecommendationLog)
- **AND** show connecting lines with relationship labels (1:N, N:1)
- **AND** group related entities visually
- **AND** provide a toggle to switch between simplified and full views

### Requirement: Glossary Term Grouping
The system SHALL organize glossary terms into logical groups (Product, Pricing, Quote, Customer, Rules, Discount, Category, Tax, Contract, Attribute, Currency, Guided Selling) with visual headers to help users understand term relationships.

#### Scenario: View grouped glossary (MODIFIED)
- **WHEN** user views the glossary section
- **THEN** terms are displayed under group headers: "Overview", "Product Terms", "Category Terms", "Attribute Terms", "Pricing Terms", "Currency Terms", "Quote Terms", "Customer Terms", "Contract Terms", "Tax Terms", "Rules Terms", "Discount Terms", "Guided Selling Terms"
- **AND** related terms appear adjacent to each other within groups
- **AND** the Guided Selling Terms group appears after Discount Terms

### Requirement: Entity Hierarchy Tree
The system SHALL display a hierarchical tree visualization showing parent-child relationships between all CPQ entities including newly added domains.

#### Scenario: View hierarchy tree (MODIFIED)
- **WHEN** user views the entity hierarchy tree
- **THEN** display Product hierarchy: Product -> ProductFeature -> ProductOption
- **AND** display Quote hierarchy: Quote -> QuoteLineItem -> AppliedDiscount
- **AND** display Pricing hierarchy: PriceBook -> PriceBookEntry -> PriceTier
- **AND** display Customer hierarchy: Customer -> Quote, Customer -> Contract -> ContractPriceEntry
- **AND** display Rules hierarchy: Rule (with Condition and Action as children)
- **AND** display Discount hierarchy: Discount -> DiscountTier
- **AND** display Category hierarchy: Category (parent-child) -> ProductCategory
- **AND** display Attribute hierarchy: AttributeGroup -> Attribute -> ProductAttribute
- **AND** display Currency hierarchy: Currency -> ExchangeRate
- **AND** display Guided Selling hierarchy: Questionnaire -> Question -> QuestionProductMapping, ProductAffinity

### Requirement: Learn Page Content Accuracy
The system SHALL maintain accurate and up-to-date content on the learn page that reflects the current implementation including all 31 database models.

#### Scenario: Glossary terms match schema (MODIFIED)
- **WHEN** user views any glossary term
- **THEN** all field names, relationships, and enum values mentioned match the current Prisma schema
- **AND** no deprecated or removed concepts are documented
- **AND** all 31 models have corresponding glossary entries (some junction tables may be covered in parent entity descriptions)

#### Scenario: Diagrams match implementation (MODIFIED)
- **WHEN** user views the CPQ Flow Diagram, ER Diagram, or Hierarchy Tree
- **THEN** the displayed entities, statuses, and relationships match the current implementation
- **AND** all quote statuses shown match the `QuoteStatus` enum including CANCELLED
- **AND** all 31 models appear in the full ER diagram view
