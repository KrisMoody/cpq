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

### Requirement: Glossary Term Grouping
The system SHALL organize glossary terms into logical groups (Product, Pricing, Quote, Customer, Rules, Discount) with visual headers to help users understand term relationships.

#### Scenario: View grouped glossary
- **WHEN** user views the glossary section
- **THEN** terms are displayed under group headers: "Product Terms", "Pricing Terms", "Quote Terms", "Customer Terms", "Rules Terms", "Discount Terms"
- **AND** related terms appear adjacent to each other within groups

#### Scenario: Search within groups
- **WHEN** user searches for a term
- **THEN** matching terms are shown with their group context preserved

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

## ADDED Requirements

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
