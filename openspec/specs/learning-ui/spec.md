# learning-ui Specification

## Purpose
TBD - created by archiving change add-cpq-foundation. Update Purpose after archive.
## Requirements
### Requirement: Dashboard Page
The system SHALL provide a dashboard page at `/` with an overview of CPQ concepts and navigation to key areas, accessible via the sidebar navigation.

#### Scenario: View dashboard
- **WHEN** user navigates to /
- **THEN** display welcome message and CPQ overview
- **AND** show quick links to Products, Quotes, and Learn pages
- **AND** display summary statistics (product count, quote count)

#### Scenario: Access dashboard from sidebar
- **WHEN** user clicks Dashboard in the sidebar
- **THEN** navigate to the dashboard page
- **AND** highlight Dashboard as active in the sidebar

### Requirement: Learn Page
The system SHALL provide a learning page at `/learn` with interactive CPQ glossary and entity relationship diagrams.

#### Scenario: View learn page
- **WHEN** user navigates to /learn
- **THEN** display CPQ glossary with term definitions
- **AND** display interactive entity relationship diagram using ApexCharts

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
- Price Tier

**Quote Group:**
- Quote
- Quote Line Item
- Configuration

**Customer Group:**
- Customer

**Rules Group:**
- Rule
- Rule Type
- Rule Trigger

**Discount Group:**
- Discount
- Discount Type
- Discount Scope
- Discount Tier
- Applied Discount

**Meta:**
- CPQ (Configure, Price, Quote)

Each definition SHALL:
- Start with a one-sentence summary of what the term IS
- Explain how it differs from similar terms (e.g., Feature vs Option, Discount vs Applied Discount)
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

#### Scenario: View new entity glossary terms
- **WHEN** user views the glossary section
- **THEN** Customer, Rule, and Discount terms are displayed with their respective groups
- **AND** each term includes domain-consistent examples

### Requirement: Entity Relationship Diagram
The system SHALL display an ER-style diagram showing CPQ entities as boxes connected by labeled relationship lines, with a tabbed interface to switch between simplified, full, and database schema views.

#### Scenario: View ER diagram (MODIFIED)
- **WHEN** user views the entity relationship diagram
- **THEN** display core entities (Product, ProductFeature, ProductOption, PriceBook, PriceBookEntry, PriceTier, Quote, QuoteLineItem, Customer, Rule, Discount, DiscountTier, AppliedDiscount, Category, TaxRate, Contract, Attribute, Currency) as labeled boxes in simplified mode
- **AND** display all 31 entities when in full mode (including ProductCategory, ProductAttribute, CategoryAttribute, AttributeGroup, ExchangeRate, ContractPriceEntry, UnitOfMeasure, ProductAffinity, Questionnaire, Question, QuestionProductMapping, RecommendationLog)
- **AND** show connecting lines with relationship labels (1:N, N:1)
- **AND** group related entities visually
- **AND** provide a toggle to switch between simplified and full views

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

### Requirement: CPQ Flow Diagram
The system SHALL display a workflow diagram showing the complete CPQ process flow including the approval workflow.

The diagram SHALL show:
1. **Setup Phase**: Create Quote with Customer and Price Book selection
2. **Configuration Phase**: Add Products and Configure Bundle Options
3. **Pricing Phase**: Apply Pricing Rules and Discounts
4. **Submission Phase**: Submit for Evaluation (rules check)
5. **Approval Phase**: Either auto-approve or enter approval workflow
6. **Completion Phase**: Accept and Finalize quote

The diagram SHALL visually distinguish:
- The main "happy path" flow (auto-approve)
- The approval-required path (PENDING_APPROVAL → APPROVED/REJECTED)
- Terminal states (FINALIZED, REJECTED)

#### Scenario: View flow diagram
- **WHEN** user views the CPQ flow diagram
- **THEN** display the complete workflow with phases: Setup Quote → Add Products → Configure → Apply Pricing → Submit → Approve → Accept → Finalize
- **AND** show branching for approval-required quotes (PENDING_APPROVAL path)
- **AND** indicate where rules evaluation occurs

#### Scenario: Understand approval branching
- **WHEN** user views the approval section of the flow diagram
- **THEN** display that quotes may auto-approve (if no rules trigger approval)
- **OR** enter PENDING_APPROVAL status requiring manual approval
- **AND** show REJECTED as a terminal state alongside FINALIZED

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

### Requirement: Glossary Term Grouping
The system SHALL organize glossary terms into logical groups (Product, Pricing, Quote, Customer, Rules, Discount, Category, Tax, Contract, Attribute, Currency, Guided Selling) with visual headers to help users understand term relationships.

#### Scenario: View grouped glossary (MODIFIED)
- **WHEN** user views the glossary section
- **THEN** terms are displayed under group headers: "Overview", "Product Terms", "Category Terms", "Attribute Terms", "Pricing Terms", "Currency Terms", "Quote Terms", "Customer Terms", "Contract Terms", "Tax Terms", "Rules Terms", "Discount Terms", "Guided Selling Terms"
- **AND** related terms appear adjacent to each other within groups
- **AND** the Guided Selling Terms group appears after Discount Terms

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

### Requirement: Customer Glossary Terms
The system SHALL display definitions for customer-related terms explaining how customers integrate with the CPQ workflow.

**Customer Terms:**
- Customer: A record representing a buyer with contact information, optional company details, and an assigned price book for customer-specific pricing.

#### Scenario: View customer term
- **WHEN** user views the Customer glossary term
- **THEN** display how customers link to quotes and price books
- **AND** show example: "Acme Corp (customer) is assigned to 'Partner' price book and has 3 quotes"

### Requirement: Rules Glossary Terms
The system SHALL display definitions for rules-related terms explaining the business rules engine.

**Rules Terms:**
- Rule: A business rule that automates configuration validation or pricing adjustments based on conditions and triggers.
- Rule Type: CONFIGURATION rules validate product combinations; PRICING rules adjust prices or flag approval requirements.
- Rule Trigger: The event that activates a rule (ON_PRODUCT_ADD, ON_QUANTITY_CHANGE, ON_QUOTE_SAVE, ON_FINALIZE).

#### Scenario: View rule terms
- **WHEN** user views Rules group terms
- **THEN** display how rules automate CPQ logic
- **AND** show example: "Rule 'RAM requires SSD' (type: CONFIGURATION, trigger: ON_PRODUCT_ADD) ensures 32GB RAM selection requires SSD storage"

### Requirement: Discount Glossary Terms
The system SHALL display definitions for discount-related terms explaining the discount management system.

**Discount Terms:**
- Discount: A reusable discount definition with a type (percentage or fixed), scope (line, quote, category), and optional validity period.
- Discount Type: PERCENTAGE (e.g., 10% off) or FIXED_AMOUNT (e.g., $50 off).
- Discount Scope: LINE_ITEM (per product), QUOTE (entire order), or PRODUCT_CATEGORY (group of products).
- Discount Tier: Volume-based discount levels within a discount (e.g., 5% off 10+ units, 10% off 50+ units).
- Applied Discount: An instance of a discount applied to a specific quote or line item, recording the calculated amount.

#### Scenario: View discount terms
- **WHEN** user views Discount group terms
- **THEN** display how discounts are defined and applied
- **AND** show example: "Discount 'Volume Savings' (type: PERCENTAGE, scope: LINE_ITEM) with tiers: 5% @ 10+ qty, 10% @ 50+ qty"

### Requirement: Price Tier Glossary Term
The system SHALL display a definition for price tiers explaining volume-based pricing within price book entries.

**Pricing Term:**
- Price Tier: A quantity-based price break within a price book entry (e.g., $100/unit for 1-9, $90/unit for 10+).

#### Scenario: View price tier term
- **WHEN** user views the Price Tier glossary term
- **THEN** display how price tiers provide volume pricing
- **AND** show example: "PriceBookEntry for 'USB-C Cable' in 'Retail 2024' has tiers: $12/unit (1-9), $10/unit (10-49), $8/unit (50+)"

### Requirement: Quick Tips for New Features
The system SHALL display quick tips explaining how to use customers, rules, and discounts effectively.

#### Scenario: View customer tips
- **WHEN** user views quick tips
- **THEN** display tip about assigning customers to quotes for tracking and customer-specific pricing

#### Scenario: View rules tips
- **WHEN** user views quick tips
- **THEN** display tip about configuration rules validating product combinations
- **AND** display tip about pricing rules triggering approval workflows

#### Scenario: View discount tips
- **WHEN** user views quick tips
- **THEN** display tip about discount types and when to use each
- **AND** display tip about discount stacking and priority

### Requirement: Sidebar Navigation
The system SHALL provide a persistent left sidebar navigation with grouped menu items organized by CPQ workflow stage.

#### Scenario: View sidebar navigation
- **WHEN** user views any page in the application
- **THEN** display a left sidebar with navigation groups: Sales, Catalog, Configuration
- **AND** display standalone items: Dashboard (top), Learn (bottom)
- **AND** highlight the active page and its parent group

#### Scenario: Navigate within group
- **WHEN** user clicks a navigation item within a group
- **THEN** navigate to the selected page
- **AND** keep the parent group expanded
- **AND** visually indicate the active item

### Requirement: Navigation Groups
The system SHALL organize navigation items into logical groups reflecting CPQ workflow stages.

#### Scenario: View Sales group
- **WHEN** user views the Sales navigation group
- **THEN** display child items: Quotes, Customers
- **AND** show group icon (document or briefcase)

#### Scenario: View Catalog group
- **WHEN** user views the Catalog navigation group
- **THEN** display child items: Products, Price Books
- **AND** show group icon (cube or grid)

#### Scenario: View Configuration group
- **WHEN** user views the Configuration navigation group
- **THEN** display child items: Rules, Discounts
- **AND** show group icon (cog or sliders)

### Requirement: Collapsible Navigation Groups
The system SHALL allow users to expand and collapse navigation groups to reduce visual clutter.

#### Scenario: Collapse a group
- **WHEN** user clicks a group header
- **THEN** hide the child items within that group
- **AND** show a collapsed indicator (chevron pointing right)

#### Scenario: Expand a group
- **WHEN** user clicks a collapsed group header
- **THEN** reveal the child items within that group
- **AND** show an expanded indicator (chevron pointing down)

#### Scenario: Auto-expand active group
- **WHEN** user navigates to a page within a collapsed group
- **THEN** automatically expand that group to show the active item

### Requirement: Responsive Sidebar Behavior
The system SHALL adapt sidebar display based on viewport size to optimize screen real estate.

#### Scenario: Desktop viewport
- **WHEN** viewport width is 1024px or greater
- **THEN** display full sidebar with icons and labels
- **AND** sidebar is always visible

#### Scenario: Tablet viewport
- **WHEN** viewport width is between 768px and 1023px
- **THEN** display collapsed sidebar with icons only
- **AND** expand to show labels on hover or click

#### Scenario: Mobile viewport
- **WHEN** viewport width is less than 768px
- **THEN** hide sidebar by default
- **AND** show hamburger menu button in header
- **AND** display sidebar as slide-out drawer when hamburger is clicked

### Requirement: Sidebar Header
The system SHALL display the application logo and title in the sidebar header area.

#### Scenario: View sidebar header
- **WHEN** user views the sidebar
- **THEN** display CPQ Learning logo and application name at the top
- **AND** clicking the logo navigates to the dashboard

### Requirement: Cancel Button Behavior
The system SHALL implement consistent cancel button behavior across all forms and modals based on the context of the cancellation.

#### Scenario: Cancel from new entity form with unsaved changes
- **WHEN** user clicks Cancel on a new entity form (e.g., /customers/new, /products/new)
- **AND** the form has unsaved changes (any field differs from initial empty/default state)
- **THEN** display a confirmation dialog asking "You have unsaved changes. Are you sure you want to leave?"
- **AND** if user confirms, navigate to the entity list page
- **AND** if user cancels the dialog, remain on the form

#### Scenario: Cancel from new entity form without changes
- **WHEN** user clicks Cancel on a new entity form
- **AND** no fields have been modified
- **THEN** immediately navigate to the entity list page without confirmation

#### Scenario: Cancel from edit mode on detail page
- **WHEN** user clicks Cancel while in edit mode on an entity detail page (e.g., /customers/[id], /products/[id])
- **THEN** immediately exit edit mode
- **AND** reset all form fields to the current entity's saved values
- **AND** remain on the same page

#### Scenario: Cancel from modal
- **WHEN** user clicks Cancel in a modal dialog
- **THEN** close the modal without applying any changes
- **AND** any form state within the modal is reset when the modal reopens

#### Scenario: Cancel button disabled during save
- **WHEN** a save/submit operation is in progress (loading state)
- **THEN** the Cancel button SHALL be disabled to prevent navigation during the operation

### Requirement: Unsaved Changes Composable
The system SHALL provide a reusable composable `useUnsavedChanges` for tracking form modifications and confirming navigation away from dirty forms.

#### Scenario: Track form dirtiness
- **WHEN** a component uses `useUnsavedChanges(formRef, initialValuesRef)`
- **THEN** provide a computed `isDirty` property that returns true if formRef differs from initialValuesRef
- **AND** use deep comparison via JSON serialization for object comparison

#### Scenario: Confirm navigation away
- **WHEN** a component calls `confirmLeave()` from the composable
- **AND** the form is dirty (has unsaved changes)
- **THEN** display a browser confirmation dialog
- **AND** return true if user confirms, false if user cancels

#### Scenario: Allow navigation when clean
- **WHEN** a component calls `confirmLeave()` from the composable
- **AND** the form is not dirty (no unsaved changes)
- **THEN** return true immediately without showing any dialog

### Requirement: Modal Accessibility Titles
The system SHALL provide accessible titles for all modal dialogs using the UModal `title` prop to ensure screen readers can announce the modal's purpose.

#### Scenario: Modal announces title to screen reader
- **WHEN** a modal opens
- **THEN** the modal has a `title` prop that describes its purpose
- **AND** assistive technologies can read the modal title

#### Scenario: Feature modal has accessible title
- **WHEN** user opens the Feature modal on the product page
- **THEN** the modal has title "Add Feature" or "Edit Feature" depending on mode

#### Scenario: Option modal has accessible title
- **WHEN** user opens the Option modal on the product page
- **THEN** the modal has title "Add Option" or "Edit Option" depending on mode

#### Scenario: Attributes modal has accessible title
- **WHEN** user opens the Attributes modal on the product page
- **THEN** the modal has title "Edit Product Attributes"

#### Scenario: Add Product modal has accessible title
- **WHEN** user opens the Add Product modal on quote, category, or price book pages
- **THEN** the modal has a title describing its context (e.g., "Add Product to Quote", "Add Product to Category", "Add Product to Price Book")

#### Scenario: Customer Selector modal has accessible title
- **WHEN** user opens the Customer Selector modal
- **THEN** the modal has title "Select Customer"

#### Scenario: Group modal has accessible title
- **WHEN** user opens the Group modal on attributes page
- **THEN** the modal has title "New Group" or "Edit Group" depending on mode

#### Scenario: Discount modals have accessible titles
- **WHEN** user opens the Apply Discount or Manual Discount modal
- **THEN** the modal has title describing the action and scope (e.g., "Apply Quote Discount", "Apply Manual Line Item Discount")

#### Scenario: Reject Quote modal has accessible title
- **WHEN** user opens the Reject Quote modal
- **THEN** the modal has title "Reject Quote"

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

### Requirement: Auto-Generated ERD Visualization
The system SHALL display the auto-generated Prisma ERD diagram on the learn page as a third visualization tab.

#### Scenario: View database schema tab
- **WHEN** user clicks the "Database Schema" tab in the Data Model section
- **THEN** display the auto-generated Prisma ERD from `/prisma-erd.svg`
- **AND** the diagram shows all database entities and their relationships

#### Scenario: ERD is responsive
- **WHEN** user views the ERD on different screen sizes
- **THEN** the diagram scales appropriately
- **AND** horizontal scrolling is available if needed on small screens

### Requirement: Tax Glossary Terms
The system SHALL display definitions for tax-related terms explaining the tax management system.

**Tax Terms:**
- Tax Rate: A percentage rate applied to taxable products based on customer location (country/state) with optional category specificity and validity periods.
- Tax Exemption: A customer status that exempts them from tax charges, with optional certificate tracking and expiration dates.

#### Scenario: View tax terms
- **WHEN** user views Tax Terms group
- **THEN** display Tax Rate and Tax Exemption definitions
- **AND** show example: "Tax Rate 'California Sales Tax' (rate: 8.25%, country: US, state: CA) applies to all taxable products shipped to California"

### Requirement: Contract Glossary Terms
The system SHALL display definitions for contract-related terms explaining the contract management system.

**Contract Terms:**
- Contract: An agreement with a customer for a defined period (start/end dates) that can override standard pricing and include a contract-wide discount percentage.
- Contract Price Entry: A fixed price override for a specific product within a contract, used instead of the standard price book price.
- Contract Status: The lifecycle state of a contract: DRAFT (being prepared), ACTIVE (in effect), or EXPIRED (past end date).

#### Scenario: View contract terms
- **WHEN** user views Contract Terms group
- **THEN** display Contract, Contract Price Entry, and Contract Status definitions
- **AND** show example: "Contract 'Acme 2024 Agreement' (status: ACTIVE, discount: 15%) with fixed price $999 for 'Laptop Pro Bundle' overriding the $1,299 list price"

### Requirement: Unit of Measure Glossary Terms
The system SHALL display definitions for unit of measure terms explaining quantity tracking.

**Product Terms (additions):**
- Unit of Measure: A standard unit for measuring product quantities (e.g., "Each", "Box", "License"), with abbreviation and optional conversion to a base unit.
- Unit Conversion: The mathematical relationship between derived units and their base unit, enabling quantity conversions (e.g., 1 Box = 12 Each).

#### Scenario: View unit of measure terms
- **WHEN** user views Unit of Measure in Product Terms group
- **THEN** display how units standardize quantity tracking
- **AND** show example: "Product 'USB-C Cable' uses unit 'Each' (abbrev: 'ea'). Product 'Paper' uses unit 'Box' with conversion factor 500 to base unit 'Sheet'"

### Requirement: Attribute Glossary Terms
The system SHALL display definitions for product attribute terms explaining the flexible attribute system.

**Attribute Terms:**
- Attribute: A flexible product property with a defined type (TEXT, NUMBER, BOOLEAN, SELECT, DATE) and optional constraints like min/max values or allowed options.
- Attribute Group: An organizational container for related attributes, enabling logical grouping in the UI (e.g., "Technical Specs", "Marketing Info").
- Product Attribute: The junction record linking an Attribute to a Product, storing the actual value (as JSON to support any type).

#### Scenario: View attribute terms
- **WHEN** user views Attribute Terms group
- **THEN** display Attribute, Attribute Group, and Product Attribute definitions
- **AND** show example: "Attribute 'Screen Size' (type: NUMBER, constraints: min=10, max=32) in group 'Technical Specs' has value 15.6 for 'Laptop Pro Bundle'"

### Requirement: Currency Glossary Terms
The system SHALL display definitions for multi-currency terms explaining international pricing support.

**Currency Terms:**
- Currency: A monetary unit identified by ISO 4217 code (e.g., USD, EUR, GBP) with a display symbol, used by price books, quotes, and customers.
- Exchange Rate: The conversion rate from a currency to the base currency, with an effective date for historical rate tracking.
- Base Currency: The designated reporting currency (isBase=true) used for financial consolidation; all amounts can be converted to base currency for comparison.

#### Scenario: View currency terms
- **WHEN** user views Currency Terms group
- **THEN** display Currency, Exchange Rate, and Base Currency definitions
- **AND** show example: "Currency 'EUR' (symbol: '€') has exchange rate 1.08 to base currency 'USD' effective 2024-01-01"

### Requirement: Subscription Glossary Terms
The system SHALL display definitions for subscription and recurring revenue terms.

**Pricing Terms (additions):**
- Billing Frequency: How often a product is billed: ONE_TIME (single charge), MONTHLY, QUARTERLY, ANNUAL, or CUSTOM (user-defined months).

**Quote Terms (additions):**
- MRR (Monthly Recurring Revenue): The normalized monthly revenue from subscription products on a quote, calculated by converting all billing frequencies to monthly amounts.
- ARR (Annual Recurring Revenue): The annualized recurring revenue, calculated as MRR multiplied by 12.
- TCV (Total Contract Value): The total value of a quote over its full term, including one-time charges plus recurring charges for the contract duration.
- Proration: Partial billing for a subscription that starts mid-period, calculated as (daily rate × remaining days in period).

#### Scenario: View subscription terms
- **WHEN** user views Billing Frequency in Pricing Terms and MRR/ARR/TCV in Quote Terms
- **THEN** display subscription and recurring revenue definitions
- **AND** show example: "Quote with monthly 'Software License' ($100/mo) and annual 'Support' ($600/yr) has MRR=$150, ARR=$1,800, TCV=$1,800 for 12-month term"

### Requirement: Quick Tips for Tax and Contracts
The system SHALL display quick tips explaining how to use tax management and contracts effectively.

#### Scenario: View tax quick tip
- **WHEN** user views quick tips
- **THEN** display tip about setting up tax rates by region and marking products as taxable/non-taxable
- **AND** display tip about customer tax exemptions with certificate tracking

#### Scenario: View contract quick tip
- **WHEN** user views quick tips
- **THEN** display tip about using contracts for negotiated pricing with specific customers
- **AND** display tip about contract status lifecycle (DRAFT → ACTIVE → EXPIRED)

### Requirement: Quick Tips for Currency and Subscriptions
The system SHALL display quick tips explaining multi-currency and subscription features.

#### Scenario: View currency quick tip
- **WHEN** user views quick tips
- **THEN** display tip about setting up multiple currencies for international pricing
- **AND** display tip about base currency for consolidated reporting

#### Scenario: View subscription quick tip
- **WHEN** user views quick tips
- **THEN** display tip about using billing frequencies for recurring products
- **AND** display tip about understanding MRR, ARR, and TCV on quotes

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

### Requirement: USelect Value Binding Pattern
All USelect components using object-based items SHALL include the `value-key` prop to ensure correct model binding.

#### Scenario: USelect with object items
- **WHEN** a USelect component uses items in `{ label: string, value: any }` format
- **THEN** the component MUST include `value-key="value"`
- **AND** the v-model will bind only the `value` property, not the entire object

#### Scenario: USelect with primitive items
- **WHEN** a USelect component uses items as primitive strings or numbers
- **THEN** the `value-key` prop is not required
- **AND** the v-model binds the primitive value directly

#### Scenario: Optional/nullable select field
- **WHEN** a select field allows "no selection" or "use default"
- **THEN** include a first option with an empty value: `{ label: 'None' | 'Use default', value: null | '' }`
- **AND** the form handles `null` or empty string appropriately on submission

### Requirement: Breadcrumb Navigation
The application SHALL display breadcrumb navigation showing the user's current location within the navigation hierarchy.

#### Scenario: View breadcrumbs on list page
- **WHEN** user navigates to a list page (e.g., `/products`)
- **THEN** breadcrumbs display the full navigation path (e.g., "Admin > Catalog > Products")
- **AND** each breadcrumb segment except the current page is a clickable link

#### Scenario: View breadcrumbs on detail page
- **WHEN** user navigates to a detail page (e.g., `/products/abc123`)
- **THEN** breadcrumbs display the path with a generic "View" label (e.g., "Admin > Catalog > Products > View")
- **AND** the entity name is not fetched or displayed in breadcrumbs

#### Scenario: View breadcrumbs on new page
- **WHEN** user navigates to a new entity page (e.g., `/products/new`)
- **THEN** breadcrumbs display the path with "New" label (e.g., "Admin > Catalog > Products > New")

#### Scenario: View breadcrumbs on nested route
- **WHEN** user navigates to a nested route (e.g., `/quotes/abc123/preview`)
- **THEN** breadcrumbs display the full nested path (e.g., "Sales > Quotes > View > Preview")

#### Scenario: Navigate via breadcrumb
- **WHEN** user clicks a breadcrumb segment
- **THEN** user is navigated to that section
- **AND** the clicked segment is not the current page

#### Scenario: Breadcrumbs on dashboard
- **WHEN** user is on the dashboard (`/`)
- **THEN** breadcrumbs display only "Dashboard"
- **AND** "Dashboard" is not a clickable link (current page)

