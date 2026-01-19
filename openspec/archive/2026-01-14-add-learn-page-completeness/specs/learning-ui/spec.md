## ADDED Requirements

### Requirement: Learn Page Content Accuracy
The system SHALL maintain accurate and up-to-date content on the learn page that reflects the current implementation.

#### Scenario: Glossary terms match schema
- **WHEN** user views any glossary term
- **THEN** all field names, relationships, and enum values mentioned match the current Prisma schema
- **AND** no deprecated or removed concepts are documented

#### Scenario: Diagrams match implementation
- **WHEN** user views the CPQ Flow Diagram, ER Diagram, or Hierarchy Tree
- **THEN** the displayed entities, statuses, and relationships match the current implementation
- **AND** all quote statuses shown match the `QuoteStatus` enum

#### Scenario: Examples are realistic
- **WHEN** user views glossary examples
- **THEN** concrete values (prices, names, SKUs) are consistent across related terms
- **AND** examples use the same domain scenario (laptop bundle) for traceability

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

## MODIFIED Requirements

### Requirement: Glossary Term Grouping
The system SHALL organize glossary terms into logical groups (Product, Pricing, Quote, Customer, Rules, Discount, Category, Tax, Contract, Attribute, Currency) with visual headers to help users understand term relationships.

#### Scenario: View grouped glossary
- **WHEN** user views the glossary section
- **THEN** terms are displayed under group headers: "Overview", "Product Terms", "Category Terms", "Pricing Terms", "Quote Terms", "Customer Terms", "Rules Terms", "Discount Terms", "Tax Terms", "Contract Terms", "Attribute Terms", "Currency Terms"
- **AND** related terms appear adjacent to each other within groups

#### Scenario: Search within groups
- **WHEN** user searches for a term
- **THEN** matching terms are shown with their group context preserved

### Requirement: Entity Relationship Diagram
The system SHALL display an ER-style diagram showing CPQ entities as boxes connected by labeled relationship lines, with a tabbed interface to switch between diagram, hierarchy, and database schema views.

#### Scenario: View ER diagram
- **WHEN** user views the entity relationship diagram
- **THEN** display entities (Product, ProductFeature, ProductOption, PriceBook, PriceBookEntry, PriceTier, Quote, QuoteLineItem, Customer, Rule, Discount, DiscountTier, AppliedDiscount, Category, TaxRate, Contract, Attribute, Currency) as labeled boxes
- **AND** show connecting lines with relationship labels (1:N, N:1)
- **AND** group related entities visually

#### Scenario: Switch visualization view
- **WHEN** user clicks the "ER Diagram", "Hierarchy", or "Database Schema" tab
- **THEN** display the selected visualization
