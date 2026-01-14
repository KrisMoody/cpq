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
The system SHALL display an ER-style diagram showing CPQ entities as boxes connected by labeled relationship lines, with a tabbed interface to switch between diagram and hierarchy views.

#### Scenario: View ER diagram
- **WHEN** user views the entity relationship diagram
- **THEN** display entities (Product, ProductFeature, ProductOption, PriceBook, PriceBookEntry, PriceTier, Quote, QuoteLineItem, Customer, Rule, Discount, DiscountTier, AppliedDiscount) as labeled boxes
- **AND** show connecting lines with relationship labels (1:N, N:1)
- **AND** group related entities visually (Product group, Pricing group, Quote group, Customer group, Rules group, Discount group)

#### Scenario: Switch visualization view
- **WHEN** user clicks the "ER Diagram" or "Hierarchy" tab
- **THEN** display the selected visualization

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
The system SHALL display a hierarchical tree visualization showing parent-child relationships between CPQ entities.

#### Scenario: View hierarchy tree
- **WHEN** user views the entity hierarchy tree
- **THEN** display Product hierarchy: Product -> ProductFeature -> ProductOption
- **AND** display Quote hierarchy: Quote -> QuoteLineItem -> AppliedDiscount
- **AND** display Pricing hierarchy: PriceBook -> PriceBookEntry -> PriceTier
- **AND** display Customer hierarchy: Customer -> Quotes
- **AND** display Rules hierarchy: Rule (with Condition and Action as children)
- **AND** display Discount hierarchy: Discount -> DiscountTier

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
The system SHALL organize glossary terms into logical groups (Product, Pricing, Quote, Customer, Rules, Discount) with visual headers to help users understand term relationships.

#### Scenario: View grouped glossary
- **WHEN** user views the glossary section
- **THEN** terms are displayed under group headers: "Product Terms", "Pricing Terms", "Quote Terms", "Customer Terms", "Rules Terms", "Discount Terms"
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

