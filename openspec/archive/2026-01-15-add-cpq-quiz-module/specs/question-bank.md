# CPQ Quiz Question Bank

This document contains all quiz questions organized by domain. Each question has been validated against the glossary definitions and CPQ industry standards.

## Question Format
- **type**: `single` (one correct answer) or `multiple` (one or more correct answers)
- **options**: 2-4 answer choices
- **correct**: index(es) of correct answer(s)
- **explanation**: shown after answering

---

## Meta / Overview (5 questions)

### Q1: What does CPQ stand for?
- **type**: single
- **options**:
  1. Customer Price Quotation
  2. Configure, Price, Quote ✓
  3. Catalog Product Query
  4. Contract Pricing Qualification
- **correct**: 2
- **explanation**: CPQ stands for Configure, Price, Quote - a three-step sales workflow for configuring products, calculating prices, and generating quotes.

### Q2: What is the correct order of the CPQ workflow?
- **type**: single
- **options**:
  1. Price → Configure → Quote
  2. Quote → Configure → Price
  3. Configure → Price → Quote ✓
  4. Configure → Quote → Price
- **correct**: 3
- **explanation**: The CPQ workflow is: Configure (select and customize products), Price (calculate pricing), Quote (generate the document).

### Q3: Which of these is NOT a core CPQ function?
- **type**: single
- **options**:
  1. Configure products
  2. Generate invoices ✓
  3. Calculate prices
  4. Create quotes
- **correct**: 2
- **explanation**: CPQ focuses on Configure, Price, and Quote. Invoice generation is typically handled by ERP or billing systems, not CPQ.

### Q4: What problem does CPQ solve for sales teams?
- **type**: multiple
- **options**:
  1. Eliminates manual pricing errors ✓
  2. Speeds up quote generation ✓
  3. Replaces the CRM system
  4. Ensures valid product configurations ✓
- **correct**: 1, 2, 4
- **explanation**: CPQ helps eliminate errors, speeds up quoting, and enforces configuration rules. It complements (not replaces) CRM systems.

### Q5: In a CPQ system, what happens during the "Configure" step?
- **type**: single
- **options**:
  1. The final price is calculated
  2. Product options are selected and validated ✓
  3. The quote document is generated
  4. Customer information is entered
- **correct**: 2
- **explanation**: During configuration, users select product options and the system validates that the combination is valid according to business rules.

---

## Product Terms (8 questions)

### Q6: What is the difference between a Product and a Bundle?
- **type**: single
- **options**:
  1. Bundles are more expensive than Products
  2. A Bundle is a Product with type=BUNDLE that has Features and Options ✓
  3. Products can only be sold individually, Bundles can only be sold together
  4. There is no difference - they are the same thing
- **correct**: 2
- **explanation**: A Bundle IS a Product (with type=BUNDLE). Bundles have Features containing Options for customization. Standalone products have no Features.

### Q7: What is a Product Feature in CPQ?
- **type**: single
- **options**:
  1. The price of a product
  2. A category of choice within a Bundle - the question being asked ✓
  3. A product's unique identifier
  4. The description of a product
- **correct**: 2
- **explanation**: A Feature is a category of choice (like "RAM" or "Storage") that contains Options. Think of it as the QUESTION being asked during configuration.

### Q8: What is the relationship between Features and Options?
- **type**: single
- **options**:
  1. Features contain Options - Feature is the question, Option is the answer ✓
  2. Options contain Features - Option is the question, Feature is the answer
  3. They are independent and unrelated
  4. One Option can belong to multiple Features
- **correct**: 1
- **explanation**: Feature is the QUESTION ("Which RAM?"), Option is the ANSWER ("32GB"). One Feature contains many Options, but each Option belongs to exactly one Feature.

### Q9: What does the SKU represent in a CPQ system?
- **type**: single
- **options**:
  1. The product's sale price
  2. A unique alphanumeric code identifying a product ✓
  3. The product category
  4. The vendor's name
- **correct**: 2
- **explanation**: SKU (Stock Keeping Unit) is a unique identifier for each product. It enables inventory tracking, price lookups, and rule conditions.

### Q10: What ProductType values are valid?
- **type**: multiple
- **options**:
  1. STANDALONE ✓
  2. BUNDLE ✓
  3. SUBSCRIPTION
  4. SERVICE
- **correct**: 1, 2
- **explanation**: ProductType has two values: STANDALONE (sold as-is, no configuration) and BUNDLE (has Features and Options for customization).

### Q11: What is a Unit of Measure used for?
- **type**: single
- **options**:
  1. Measuring product dimensions
  2. Standardizing how product quantities are tracked ✓
  3. Calculating shipping costs
  4. Determining product weight
- **correct**: 2
- **explanation**: Unit of Measure standardizes quantity tracking (e.g., "Each", "Box", "License"). Units can have conversion factors to a base unit.

### Q12: If a Unit "Box" has conversionFactor=12 to base unit "Each", how many "Each" are in 5 Boxes?
- **type**: single
- **options**:
  1. 5
  2. 12
  3. 17
  4. 60 ✓
- **correct**: 4
- **explanation**: With conversionFactor=12, each Box equals 12 Each. So 5 Boxes × 12 = 60 Each.

### Q13: In a Bundle configuration, what do minOptions and maxOptions on a Feature control?
- **type**: single
- **options**:
  1. The price range for options
  2. How many options must/can be selected from that feature ✓
  3. The quantity limits for the product
  4. The number of options that can be created
- **correct**: 2
- **explanation**: minOptions sets the minimum selections required, maxOptions sets the maximum allowed. For example, minOptions=1, maxOptions=1 means "pick exactly one."

---

## Category Terms (5 questions)

### Q14: What is a Category in CPQ?
- **type**: single
- **options**:
  1. A type of discount
  2. A hierarchical classification for organizing products ✓
  3. A pricing tier
  4. A customer segment
- **correct**: 2
- **explanation**: Categories organize products hierarchically (like folders). Categories can have parent-child relationships forming a tree structure.

### Q15: What is a ProductCategory record?
- **type**: single
- **options**:
  1. A special type of category for bundles
  2. The junction record linking a Product to a Category ✓
  3. The main category of a product
  4. A category that contains other categories
- **correct**: 2
- **explanation**: ProductCategory is a junction table enabling many-to-many relationships. One product can be in multiple categories, and one category can contain multiple products.

### Q16: How does the category hierarchy work?
- **type**: single
- **options**:
  1. Categories are flat with no nesting
  2. Each category references a parentId to create parent-child relationships ✓
  3. Categories automatically inherit products from children
  4. Only two levels of nesting are allowed
- **correct**: 2
- **explanation**: Categories use parentId for hierarchy. Root categories have no parent. Child categories reference their parent's ID, enabling unlimited nesting depth.

### Q17: What can category hierarchies be used for?
- **type**: multiple
- **options**:
  1. Organizing products for browsing ✓
  2. Applying category-scoped discounts ✓
  3. Automatically setting prices
  4. Filtering products by classification ✓
- **correct**: 1, 2, 4
- **explanation**: Category hierarchies organize products, enable category-scoped discounts, and allow filtering. They don't automatically set prices (that's done via Price Books).

### Q18: Can a product belong to multiple categories?
- **type**: single
- **options**:
  1. No, each product can only be in one category
  2. Yes, via multiple ProductCategory junction records ✓
  3. Only Bundle products can be in multiple categories
  4. Only if the categories have the same parent
- **correct**: 2
- **explanation**: Products can belong to multiple categories through the ProductCategory junction table. Each assignment creates a separate record.

---

## Attribute Terms (6 questions)

### Q19: What is an Attribute in CPQ?
- **type**: single
- **options**:
  1. A fixed product field like name or SKU
  2. A flexible custom field with a defined type and optional constraints ✓
  3. A category classification
  4. A pricing rule condition
- **correct**: 2
- **explanation**: Attributes are flexible product properties with types (TEXT, NUMBER, BOOLEAN, SELECT, DATE) and optional constraints. They extend products beyond fixed fields.

### Q20: What AttributeType values are available?
- **type**: multiple
- **options**:
  1. TEXT ✓
  2. NUMBER ✓
  3. BOOLEAN ✓
  4. SELECT ✓
- **correct**: 1, 2, 3, 4
- **explanation**: AttributeType includes TEXT, NUMBER, BOOLEAN, SELECT, and DATE. Each type determines how values are stored and validated.

### Q21: What is an AttributeGroup used for?
- **type**: single
- **options**:
  1. Grouping products with similar attributes
  2. Organizing related attributes for display and management ✓
  3. Creating attribute inheritance
  4. Setting default attribute values
- **correct**: 2
- **explanation**: AttributeGroup is an organizational container for related attributes. Groups help categorize attributes in the UI (e.g., "Technical Specs", "Marketing Info").

### Q22: What is the difference between Attribute and ProductAttribute?
- **type**: single
- **options**:
  1. They are the same thing
  2. Attribute is the definition, ProductAttribute stores the actual value for a product ✓
  3. ProductAttribute is for Bundle products only
  4. Attribute is required, ProductAttribute is optional
- **correct**: 2
- **explanation**: Attribute defines the field (type, constraints). ProductAttribute is the junction record storing the actual value for a specific product.

### Q23: What is a CategoryAttribute?
- **type**: single
- **options**:
  1. An attribute that can only have category values
  2. A link suggesting which attributes products in a category should have ✓
  3. A category's description field
  4. An attribute that changes the category
- **correct**: 2
- **explanation**: CategoryAttribute links Attributes to Categories. When an attribute is assigned to a category, products in that category are suggested to have values for those attributes.

### Q24: For a NUMBER type attribute, what can constraints specify?
- **type**: multiple
- **options**:
  1. Minimum value ✓
  2. Maximum value ✓
  3. Number of decimal places
  4. Currency symbol
- **correct**: 1, 2
- **explanation**: NUMBER attributes can have min and max constraints. For example, "Screen Size" might have min=10 and max=32 inches.

---

## Pricing Terms (8 questions)

### Q25: What is a Price Book?
- **type**: single
- **options**:
  1. A physical book with prices
  2. A named container holding prices for products ✓
  3. A list of discounts
  4. A pricing algorithm
- **correct**: 2
- **explanation**: A Price Book is a named container for product prices. Different price books serve different purposes: regional pricing, customer tiers, promotions, etc.

### Q26: What is the relationship between Price Book and Price Book Entry?
- **type**: single
- **options**:
  1. Price Book Entry contains multiple Price Books
  2. Price Book is the container, Price Book Entry is one row (one product's price) ✓
  3. They are independent entities
  4. Each Price Book can only have one Price Book Entry
- **correct**: 2
- **explanation**: Price Book is the CONTAINER (the whole price list). Price Book Entry is ONE ROW linking a product to a price book with a specific list price.

### Q27: What is a List Price?
- **type**: single
- **options**:
  1. The final price after discounts
  2. The base catalog price stored in a Price Book Entry ✓
  3. A discount amount
  4. The cost to manufacture
- **correct**: 2
- **explanation**: List Price is the base dollar amount for a product, stored in a Price Book Entry. It's the starting price BEFORE any adjustments or discounts.

### Q28: What is a Price Tier?
- **type**: single
- **options**:
  1. A customer loyalty level
  2. A quantity-based price break within a Price Book Entry ✓
  3. A discount percentage
  4. A tax bracket
- **correct**: 2
- **explanation**: Price Tiers enable volume pricing where unit cost decreases at higher quantities. Each tier specifies a quantity range and the price for that range.

### Q29: What BillingFrequency values indicate recurring revenue?
- **type**: multiple
- **options**:
  1. ONE_TIME
  2. MONTHLY ✓
  3. QUARTERLY ✓
  4. ANNUAL ✓
- **correct**: 2, 3, 4
- **explanation**: MONTHLY, QUARTERLY, and ANNUAL indicate recurring billing. ONE_TIME is a single charge, not recurring revenue.

### Q30: What is the difference between Price Tier and Discount Tier?
- **type**: single
- **options**:
  1. They are the same thing
  2. Price Tier sets the base price at quantities, Discount Tier applies reductions to prices ✓
  3. Price Tier is for products, Discount Tier is for services
  4. Discount Tier is always a percentage, Price Tier is always fixed
- **correct**: 2
- **explanation**: Price Tier sets the BASE PRICE at different quantities (e.g., $10/unit at qty 10+). Discount Tier applies a REDUCTION (e.g., 5% off at qty 10+). Both are quantity-based but serve different purposes.

### Q31: What does TierType=FLAT_PRICE mean?
- **type**: single
- **options**:
  1. The price per unit at this tier level
  2. A flat total price for the quantity range regardless of units ✓
  3. The price cannot be changed
  4. The tier has no quantity limits
- **correct**: 2
- **explanation**: FLAT_PRICE means a fixed total for the tier, not per-unit. For example, qty 10+ at $100 flat means 15 units still costs $100 total. UNIT_PRICE would be $8/unit × 15 = $120.

### Q32: Can a product have different prices in different Price Books?
- **type**: single
- **options**:
  1. No, each product has one fixed price
  2. Yes, each Price Book Entry links a product to a price book with a specific price ✓
  3. Only Bundle products can have multiple prices
  4. Only if the price books are in different currencies
- **correct**: 2
- **explanation**: A product can have Price Book Entries in multiple Price Books at different prices. This enables scenarios like retail vs. partner pricing.

---

## Currency Terms (5 questions)

### Q33: What identifies a Currency in a CPQ system?
- **type**: single
- **options**:
  1. The currency name only
  2. An ISO 4217 code (e.g., USD, EUR, GBP) ✓
  3. A numeric ID
  4. The country name
- **correct**: 2
- **explanation**: Currencies use ISO 4217 codes as unique identifiers. Each currency also has a name, symbol, and isBase flag.

### Q34: What is a Base Currency?
- **type**: single
- **options**:
  1. The cheapest currency
  2. The primary currency for financial reporting and consolidation ✓
  3. The currency used for costs only
  4. The default currency for new customers
- **correct**: 2
- **explanation**: Base Currency (isBase=true) is used for financial reporting. All amounts can be converted to base currency for comparison and consolidated reporting.

### Q35: What is an Exchange Rate used for?
- **type**: single
- **options**:
  1. Setting interest rates on contracts
  2. Converting between a currency and the base currency ✓
  3. Calculating tax rates
  4. Determining discount percentages
- **correct**: 2
- **explanation**: Exchange Rate defines the conversion between a currency and the base currency. Rates have effective dates for historical tracking.

### Q36: If EUR has exchange rate 1.08 to USD (base), what is €1,000 in USD?
- **type**: single
- **options**:
  1. $925.93
  2. $1,000.00
  3. $1,080.00 ✓
  4. $1,800.00
- **correct**: 3
- **explanation**: With rate 1.08, €1,000 × 1.08 = $1,080 USD. The exchange rate multiplies the foreign currency amount to get base currency.

### Q37: Why do Exchange Rates have effective dates?
- **type**: single
- **options**:
  1. To track when rates were entered
  2. To support historical rate tracking as rates change over time ✓
  3. To automatically update rates daily
  4. To expire old currencies
- **correct**: 2
- **explanation**: Effective dates allow historical rate tracking. Quotes created in January might use January rates, while new quotes use current rates.

---

## Quote Terms (8 questions)

### Q38: What is a Quote in CPQ?
- **type**: single
- **options**:
  1. A price estimate that never changes
  2. The sales document listing products, prices, and terms sent to a customer ✓
  3. A discount approval request
  4. A product configuration
- **correct**: 2
- **explanation**: A Quote is the sales document sent to customers listing what they're buying and the total price. It contains line items, uses a Price Book, and has a lifecycle status.

### Q39: What is the Quote lifecycle in order?
- **type**: single
- **options**:
  1. Draft → Finalized → Approved
  2. Draft → Pending → Approved → Finalized ✓
  3. Pending → Draft → Approved → Finalized
  4. Approved → Draft → Pending → Finalized
- **correct**: 2
- **explanation**: The quote lifecycle is: DRAFT (being created) → PENDING → PENDING_APPROVAL (if needed) → APPROVED → ACCEPTED → FINALIZED. Quotes can also be REJECTED or CANCELLED.

### Q40: What is a Quote Line Item?
- **type**: single
- **options**:
  1. The total of a quote
  2. A single row representing one product being purchased ✓
  3. A discount applied to the quote
  4. A customer's signature line
- **correct**: 2
- **explanation**: Quote Line Item is a single row on a Quote representing one product with quantity, unit price, and subtotal. For Bundles, child lines track selected options.

### Q41: What is MRR?
- **type**: single
- **options**:
  1. Maximum Revenue Rate
  2. Monthly Recurring Revenue ✓
  3. Minimum Required Revenue
  4. Multiple Rate Reduction
- **correct**: 2
- **explanation**: MRR (Monthly Recurring Revenue) is the normalized monthly value of all recurring line items. Annual subscriptions are divided by 12, quarterly by 3.

### Q42: How is ARR calculated from MRR?
- **type**: single
- **options**:
  1. ARR = MRR ÷ 12
  2. ARR = MRR × 12 ✓
  3. ARR = MRR + 12
  4. ARR = MRR × 4
- **correct**: 2
- **explanation**: ARR (Annual Recurring Revenue) = MRR × 12. It represents the yearly run-rate of subscription revenue.

### Q43: What does TCV include that ARR does not?
- **type**: single
- **options**:
  1. Monthly subscriptions
  2. One-time charges ✓
  3. Annual subscriptions
  4. Customer discounts
- **correct**: 2
- **explanation**: TCV (Total Contract Value) includes one-time items plus recurring revenue for the full term. ARR only includes recurring revenue annualized.

### Q44: What is Proration?
- **type**: single
- **options**:
  1. A type of discount
  2. Adjusting subscription price for partial billing periods ✓
  3. Splitting a quote between customers
  4. Converting currencies
- **correct**: 2
- **explanation**: Proration adjusts subscription prices when starting mid-period. For example, starting a $100/month subscription on the 15th charges ~$50 for the remaining days.

### Q45: What QuoteStatus indicates a quote needs manager review?
- **type**: single
- **options**:
  1. DRAFT
  2. PENDING
  3. PENDING_APPROVAL ✓
  4. APPROVED
- **correct**: 3
- **explanation**: PENDING_APPROVAL indicates the quote is awaiting manager/approval workflow review before proceeding to APPROVED status.

---

## Customer Terms (5 questions)

### Q46: What information does a Customer record contain?
- **type**: multiple
- **options**:
  1. Contact information (name, email, phone) ✓
  2. Optional company details ✓
  3. Assigned Price Book reference ✓
  4. Product inventory levels
- **correct**: 1, 2, 3
- **explanation**: Customer records have contact info, optional company details, and can be assigned a Price Book for customer-specific pricing. Inventory is not tracked on customers.

### Q47: How does assigning a Price Book to a Customer help?
- **type**: single
- **options**:
  1. It limits which products they can buy
  2. It enables customer-specific pricing automatically ✓
  3. It changes their tax rate
  4. It sets their credit limit
- **correct**: 2
- **explanation**: Assigning a Price Book to a Customer enables automatic customer-specific pricing. When creating quotes for that customer, the assigned price book's prices are used.

### Q48: What does isTaxExempt=true on a Customer mean?
- **type**: single
- **options**:
  1. The customer pays extra tax
  2. The customer is exempt from tax charges ✓
  3. The customer only buys taxable products
  4. The customer is in a tax-free country
- **correct**: 2
- **explanation**: Tax-exempt customers don't get tax charges on their quotes. They may have a certificate number, reason, and expiration date for the exemption.

### Q49: What is the relationship between Customer and Quote?
- **type**: single
- **options**:
  1. One Quote can have multiple Customers
  2. One Customer can have multiple Quotes ✓
  3. Each Customer has exactly one Quote
  4. Customers and Quotes are not related
- **correct**: 2
- **explanation**: One Customer can have many Quotes (1:N relationship). Each Quote optionally references one Customer for tracking and customer-specific pricing.

### Q50: Can a Quote be created without a Customer?
- **type**: single
- **options**:
  1. No, a Customer is always required
  2. Yes, the customerId field is optional ✓
  3. Only for Draft quotes
  4. Only for internal quotes
- **correct**: 2
- **explanation**: Quotes have an optional customerId. Quotes can be created without a customer assigned, though linking to a customer enables tracking and customer-specific pricing.

---

## Contract Terms (6 questions)

### Q51: What is a Contract in CPQ?
- **type**: single
- **options**:
  1. A signed quote document
  2. A time-bound agreement with a customer that can override standard pricing ✓
  3. A product warranty
  4. A payment agreement
- **correct**: 2
- **explanation**: A Contract is an agreement with a customer for a defined period (start/end dates) that can include negotiated pricing overrides and contract-wide discounts.

### Q52: What are the Contract Status values?
- **type**: single
- **options**:
  1. OPEN, CLOSED, PENDING
  2. DRAFT, ACTIVE, EXPIRED ✓
  3. NEW, IN_PROGRESS, COMPLETE
  4. PENDING, APPROVED, REJECTED
- **correct**: 2
- **explanation**: ContractStatus has three values: DRAFT (being prepared), ACTIVE (in effect), EXPIRED (past end date). Only ACTIVE contracts affect pricing.

### Q53: What is a Contract Price Entry?
- **type**: single
- **options**:
  1. A record of contract payments
  2. A fixed price override for a specific product within a contract ✓
  3. The contract's total value
  4. A log of price changes
- **correct**: 2
- **explanation**: Contract Price Entry specifies a fixed price for a product that overrides the standard Price Book Entry price when the contract is active.

### Q54: When does Contract pricing override Price Book pricing?
- **type**: single
- **options**:
  1. Always
  2. Only when the contract status is ACTIVE ✓
  3. Only for Bundle products
  4. Only when the contract has a discount percent
- **correct**: 2
- **explanation**: Contract prices only apply when the contract status is ACTIVE (not DRAFT or EXPIRED) and a Contract Price Entry exists for the product.

### Q55: What does the discountPercent field on a Contract represent?
- **type**: single
- **options**:
  1. A markup on all prices
  2. An optional percentage discount applied to all products ✓
  3. The profit margin
  4. A required approval threshold
- **correct**: 2
- **explanation**: Contract discountPercent is an optional percentage discount that applies to all products when that contract is active, in addition to any specific Contract Price Entries.

### Q56: What is the relationship between Customer and Contract?
- **type**: single
- **options**:
  1. Each Customer can have exactly one Contract
  2. One Customer can have multiple Contracts ✓
  3. Contracts are not linked to Customers
  4. Multiple Customers share one Contract
- **correct**: 2
- **explanation**: One Customer can have multiple Contracts (1:N relationship). Each Contract belongs to exactly one Customer.

---

## Tax Terms (5 questions)

### Q57: What determines which Tax Rate applies to a Quote?
- **type**: multiple
- **options**:
  1. Customer's location (country/state) ✓
  2. Product category (optional) ✓
  3. Product's billing frequency
  4. Quote's status
- **correct**: 1, 2
- **explanation**: Tax Rate is determined by geographic location (country, state/region) and optionally by product category for specialized taxation.

### Q58: What does isTaxExempt on a Customer enable?
- **type**: single
- **options**:
  1. Applying extra taxes
  2. Skipping tax calculation entirely for that customer ✓
  3. Using a different tax rate
  4. Requiring tax approval
- **correct**: 2
- **explanation**: When isTaxExempt=true, no tax is calculated on quotes for that customer. The exemption can have a certificate number, reason, and expiration date.

### Q59: What fields can a Tax Rate have?
- **type**: multiple
- **options**:
  1. Rate percentage ✓
  2. Country ✓
  3. State/region (optional) ✓
  4. Customer name
- **correct**: 1, 2, 3
- **explanation**: TaxRate includes rate (percentage), country (required), state (optional), and optionally a category link. Customer is linked to quotes, not tax rates.

### Q60: If a Tax Rate has country="US" and state="CA", when does it apply?
- **type**: single
- **options**:
  1. To all US customers
  2. Only to customers with California shipping address ✓
  3. To all quotes in USD
  4. To California-based products only
- **correct**: 2
- **explanation**: Tax rates with state specified apply only to that state. A "CA" rate applies to California shipments. Country-level rates (no state) apply nationwide.

### Q61: What is the difference between Tax Rate and Tax Exemption?
- **type**: single
- **options**:
  1. They are the same thing
  2. Tax Rate defines how much tax, Tax Exemption defines who is exempt ✓
  3. Tax Rate is for products, Tax Exemption is for services
  4. Tax Exemption is always higher than Tax Rate
- **correct**: 2
- **explanation**: Tax Rate defines HOW MUCH tax to charge. Tax Exemption (on Customer) defines WHO doesn't pay tax at all.

---

## Rules Terms (6 questions)

### Q62: What is a Rule in CPQ?
- **type**: single
- **options**:
  1. A pricing guideline document
  2. A business rule that automates validation or pricing adjustments ✓
  3. A user permission setting
  4. A product specification
- **correct**: 2
- **explanation**: Rules automate configuration validation (enforce dependencies) or pricing adjustments (apply discounts, flag approvals) based on conditions and triggers.

### Q63: What are the two RuleType values?
- **type**: single
- **options**:
  1. REQUIRED, OPTIONAL
  2. CONFIGURATION, PRICING ✓
  3. PRODUCT, QUOTE
  4. AUTOMATIC, MANUAL
- **correct**: 2
- **explanation**: RuleType has two values: CONFIGURATION (validate product combinations) and PRICING (adjust prices or flag approval requirements).

### Q64: What does RuleTrigger determine?
- **type**: single
- **options**:
  1. The action the rule takes
  2. When the rule is evaluated ✓
  3. Who can modify the rule
  4. The rule's priority
- **correct**: 2
- **explanation**: RuleTrigger determines WHEN a rule fires: ON_PRODUCT_ADD, ON_QUANTITY_CHANGE, ON_QUOTE_SAVE, or ON_FINALIZE.

### Q65: What is an example of a CONFIGURATION rule?
- **type**: single
- **options**:
  1. "Apply 10% discount on orders over $10,000"
  2. "32GB RAM requires SSD storage option" ✓
  3. "Flag quotes over $50,000 for approval"
  4. "Convert prices to customer currency"
- **correct**: 2
- **explanation**: CONFIGURATION rules validate product combinations and enforce dependencies. "32GB RAM requires SSD" ensures valid configurations.

### Q66: What is an example of a PRICING rule?
- **type**: single
- **options**:
  1. "Processor requires motherboard"
  2. "Monitor cannot be sold with tablet"
  3. "Orders over $10,000 require manager approval" ✓
  4. "GPU requires 750W power supply"
- **correct**: 3
- **explanation**: PRICING rules adjust prices or flag approval requirements. "Orders over $10,000 require approval" is a pricing rule that affects the quote workflow.

### Q67: What does the priority field on a Rule control?
- **type**: single
- **options**:
  1. Which users can edit the rule
  2. The order in which rules are evaluated ✓
  3. Whether the rule is required
  4. The severity of rule violations
- **correct**: 2
- **explanation**: Rules are evaluated in priority order. Lower priority numbers run first. This controls which rules take precedence when multiple rules could apply.

---

## Discount Terms (7 questions)

### Q68: What is the difference between Discount and Applied Discount?
- **type**: single
- **options**:
  1. They are the same thing
  2. Discount is the template definition, Applied Discount is a specific instance on a quote ✓
  3. Discount is automatic, Applied Discount is manual
  4. Discount is for products, Applied Discount is for services
- **correct**: 2
- **explanation**: Discount is the reusable TEMPLATE (definition with type, scope, value). Applied Discount is the INSTANCE recording a specific application to a quote/line with calculated amount.

### Q69: What are the DiscountType values?
- **type**: single
- **options**:
  1. AUTOMATIC, MANUAL
  2. PERCENTAGE, FIXED_AMOUNT ✓
  3. LINE, QUOTE, CATEGORY
  4. VOLUME, PROMOTIONAL
- **correct**: 2
- **explanation**: DiscountType has two values: PERCENTAGE (e.g., 10% off) and FIXED_AMOUNT (e.g., $50 off). This determines how the value is calculated.

### Q70: What are the DiscountScope values?
- **type**: single
- **options**:
  1. PERCENTAGE, FIXED
  2. AUTOMATIC, MANUAL, HYBRID
  3. LINE_ITEM, QUOTE, PRODUCT_CATEGORY ✓
  4. PRODUCT, SERVICE, BUNDLE
- **correct**: 3
- **explanation**: DiscountScope determines WHERE the discount applies: LINE_ITEM (one product line), QUOTE (entire order), or PRODUCT_CATEGORY (all products in a category).

### Q71: What is a Discount Tier?
- **type**: single
- **options**:
  1. A customer loyalty level
  2. A volume-based discount level within a Discount ✓
  3. A pricing category
  4. A product classification
- **correct**: 2
- **explanation**: Discount Tiers enable volume-based discounts. Each tier specifies a quantity range and discount value (e.g., 5% off at 10+ qty, 10% off at 50+ qty).

### Q72: What does the stackable field on a Discount mean?
- **type**: single
- **options**:
  1. The discount can be applied multiple times
  2. The discount can combine with other discounts ✓
  3. The discount applies to stacked products
  4. The discount has multiple tiers
- **correct**: 2
- **explanation**: stackable=true means this discount can combine with other discounts. stackable=false (exclusive) means only this discount applies, not others.

### Q73: In what order are discounts applied?
- **type**: single
- **options**:
  1. Alphabetically by name
  2. Line-level first, then quote-level ✓
  3. Quote-level first, then line-level
  4. Randomly
- **correct**: 2
- **explanation**: Line-level discounts apply first to individual line items, then quote-level discounts apply to the adjusted totals. Priority determines order within each level.

### Q74: What does an Applied Discount record store?
- **type**: multiple
- **options**:
  1. Reference to the original Discount template ✓
  2. Calculated amount saved ✓
  3. When and who applied it ✓
  4. Customer's payment method
- **correct**: 1, 2, 3
- **explanation**: AppliedDiscount stores: the discount reference, type, calculated amount, reason, who applied it, and when. Payment method is not part of discounts.

---

## Guided Selling Terms (8 questions)

### Q75: What is Product Affinity?
- **type**: single
- **options**:
  1. How much a customer likes a product
  2. A directional relationship between products that triggers recommendations ✓
  3. A product's position in the catalog
  4. A product's sales performance
- **correct**: 2
- **explanation**: Product Affinity is a source→target relationship that triggers recommendations. When the source product is added, the system recommends the target product.

### Q76: What AffinityType means the target product is required with the source?
- **type**: single
- **options**:
  1. CROSS_SELL
  2. UPSELL
  3. REQUIRED ✓
  4. ACCESSORY
- **correct**: 3
- **explanation**: REQUIRED affinity type indicates the target product is mandatory with the source. Other types (CROSS_SELL, UPSELL, ACCESSORY) are suggestions, not requirements.

### Q77: What is the difference between Affinity-based and Questionnaire-based recommendations?
- **type**: single
- **options**:
  1. Affinity is faster, Questionnaire is slower
  2. Affinity is triggered by product selection, Questionnaire is triggered by user answers ✓
  3. Affinity is for upsells, Questionnaire is for cross-sells
  4. They work the same way
- **correct**: 2
- **explanation**: Affinity is rule-based (triggered by adding products). Questionnaire is needs-based (triggered by users answering questions). Both generate recommendations differently.

### Q78: What is a Questionnaire in CPQ?
- **type**: single
- **options**:
  1. A customer feedback form
  2. A needs-assessment survey that guides users to appropriate products ✓
  3. A product configuration wizard
  4. A quote approval form
- **correct**: 2
- **explanation**: A Questionnaire is a needs-assessment survey with questions that map answers to product recommendations, helping users discover the right products.

### Q79: What QuestionType allows selecting multiple options?
- **type**: single
- **options**:
  1. SINGLE_CHOICE
  2. MULTIPLE_CHOICE ✓
  3. YES_NO
  4. RANGE
- **correct**: 2
- **explanation**: MULTIPLE_CHOICE allows selecting multiple options. SINGLE_CHOICE allows only one. YES_NO is binary. RANGE is for selecting from a range of values.

### Q80: What does QuestionProductMapping link?
- **type**: single
- **options**:
  1. Questions to questionnaires
  2. Answers to recommended products with scores ✓
  3. Products to categories
  4. Questions to rules
- **correct**: 2
- **explanation**: QuestionProductMapping links a question's answer value to a product with a relevance score. Higher scores mean stronger matches.

### Q81: What does a RecommendationLog track?
- **type**: multiple
- **options**:
  1. Which recommendations were shown ✓
  2. Whether user accepted or dismissed ✓
  3. The source of the recommendation ✓
  4. The product's inventory level
- **correct**: 1, 2, 3
- **explanation**: RecommendationLog tracks: recommendation source (rule, questionnaire, AI, manual), action (SHOWN, ACCEPTED, DISMISSED), and context. Not inventory.

### Q82: What RecommendationSource indicates the recommendation came from product affinities?
- **type**: single
- **options**:
  1. QUESTIONNAIRE
  2. RULE_BASED ✓
  3. AI_GENERATED
  4. MANUAL
- **correct**: 2
- **explanation**: RULE_BASED indicates the recommendation came from affinity rules. QUESTIONNAIRE is from needs assessment. AI_GENERATED is from ML. MANUAL is from sales rep input.

---

## Relationship Questions (15 questions)

### Q83: What is the hierarchy from Product to Option?
- **type**: single
- **options**:
  1. Product → Option → Feature
  2. Product → Feature → Option ✓
  3. Feature → Product → Option
  4. Option → Feature → Product
- **correct**: 2
- **explanation**: The hierarchy is: Product (Bundle) contains Features, Features contain Options. Products own Features, Features own Options.

### Q84: What is the pricing hierarchy from Price Book to Price Tier?
- **type**: single
- **options**:
  1. Price Book → Price Tier → Price Book Entry
  2. Price Tier → Price Book → Price Book Entry
  3. Price Book → Price Book Entry → Price Tier ✓
  4. Price Book Entry → Price Book → Price Tier
- **correct**: 3
- **explanation**: The hierarchy is: Price Book contains Price Book Entries, Price Book Entries can have Price Tiers for volume pricing.

### Q85: How does Contract pricing flow to a Quote?
- **type**: single
- **options**:
  1. Contract → Quote → Price Book
  2. Customer → Contract → Quote (via Contract Price Entries) ✓
  3. Quote → Contract → Customer
  4. Price Book → Contract → Quote
- **correct**: 2
- **explanation**: Customer has Contracts. When a Quote is for that customer and has an active contract with price entries, those prices override the Price Book.

### Q86: What connects a Product to a Category?
- **type**: single
- **options**:
  1. Direct foreign key
  2. ProductCategory junction table ✓
  3. Category contains productId
  4. Product contains categoryId
- **correct**: 2
- **explanation**: ProductCategory is the junction table enabling many-to-many relationships. One product can be in multiple categories.

### Q87: How do Applied Discounts relate to Quotes and Line Items?
- **type**: single
- **options**:
  1. Applied Discounts only attach to Quotes
  2. Applied Discounts only attach to Line Items
  3. Applied Discounts attach to Quotes, optionally to specific Line Items ✓
  4. Applied Discounts are independent of Quotes
- **correct**: 3
- **explanation**: AppliedDiscount always references a Quote. It optionally references a LineItem (for line-level discounts). Quote-level discounts have null lineItemId.

### Q88: What is the relationship between Attribute and AttributeGroup?
- **type**: single
- **options**:
  1. One Attribute belongs to many Groups
  2. One Attribute optionally belongs to one Group ✓
  3. One Group belongs to one Attribute
  4. They are not related
- **correct**: 2
- **explanation**: An Attribute has an optional groupId. One AttributeGroup can contain many Attributes. An Attribute can exist without a group.

### Q89: How does Currency relate to Price Book?
- **type**: single
- **options**:
  1. Price Books don't have currencies
  2. Each Price Book can be assigned a Currency ✓
  3. All Price Books share one Currency
  4. Currencies replace Price Books
- **correct**: 2
- **explanation**: PriceBook has an optional currencyId. This allows different price books for different currencies (USD price book, EUR price book, etc.).

### Q90: What entities can have a Currency assigned?
- **type**: multiple
- **options**:
  1. Price Book ✓
  2. Quote ✓
  3. Customer ✓
  4. Product
- **correct**: 1, 2, 3
- **explanation**: PriceBook, Quote, and Customer can have a currencyId. Products don't have a currency - their prices come from Price Book Entries.

### Q91: How do line-level and quote-level discounts differ in their relationships?
- **type**: single
- **options**:
  1. Line-level discounts have lineItemId, quote-level have lineItemId=null ✓
  2. They reference different discount tables
  3. Quote-level discounts have higher priority
  4. Line-level discounts can't be percentage-based
- **correct**: 1
- **explanation**: Both use AppliedDiscount. Line-level has lineItemId set to the specific line. Quote-level has lineItemId=null (applies to whole quote).

### Q92: What is the parent-child relationship on QuoteLineItem used for?
- **type**: single
- **options**:
  1. Linking quotes to customers
  2. Tracking Bundle option selections as child lines ✓
  3. Creating discount hierarchies
  4. Grouping products by category
- **correct**: 2
- **explanation**: parentLineId creates parent-child relationships. When a Bundle is added, the main line is parent, selected options become child lines.

### Q93: How does Tax Rate relate to Category?
- **type**: single
- **options**:
  1. Tax Rates are always category-specific
  2. Tax Rate can optionally link to a Category for specialized taxation ✓
  3. Categories set the tax rate
  4. They are not related
- **correct**: 2
- **explanation**: TaxRate has an optional categoryId. Category-specific tax rates apply only to products in that category (e.g., reduced rate for food items).

### Q94: What is the complete quote totals flow?
- **type**: single
- **options**:
  1. subtotal → total → discountTotal → taxAmount
  2. subtotal → discountTotal → taxAmount → total ✓
  3. total → subtotal → discountTotal → taxAmount
  4. taxAmount → subtotal → discountTotal → total
- **correct**: 2
- **explanation**: The calculation flow is: subtotal (sum of lines) → minus discountTotal → plus taxAmount → equals total.

### Q95: How do Questionnaire, Question, and QuestionProductMapping relate?
- **type**: single
- **options**:
  1. Questionnaire → Question → QuestionProductMapping ✓
  2. Question → Questionnaire → QuestionProductMapping
  3. QuestionProductMapping → Question → Questionnaire
  4. They are all independent
- **correct**: 1
- **explanation**: Questionnaire contains Questions (1:N). Questions have ProductMappings (1:N) that link answers to products with scores.

### Q96: What entities does ProductAffinity connect?
- **type**: single
- **options**:
  1. Only Products
  2. Only Categories
  3. Products and/or Categories (source and target can be either) ✓
  4. Products and Quotes
- **correct**: 3
- **explanation**: ProductAffinity can link: product→product, product→category, category→product, or category→category. Each has source and target that can be either entity type.

### Q97: How does the Customer → Contract → ContractPriceEntry hierarchy work?
- **type**: single
- **options**:
  1. Customer owns Contracts, Contracts own Price Entries for specific products ✓
  2. Contract owns Customers and Price Entries
  3. Price Entries own Contracts and Customers
  4. They are all independent with no hierarchy
- **correct**: 1
- **explanation**: Customer has many Contracts. Each Contract has many ContractPriceEntries. Each entry specifies a fixed price for a specific product.

---

## Validation Complete

Total Questions: 97
- Meta/Overview: 5
- Product Terms: 8
- Category Terms: 5
- Attribute Terms: 6
- Pricing Terms: 8
- Currency Terms: 5
- Quote Terms: 8
- Customer Terms: 5
- Contract Terms: 6
- Tax Terms: 5
- Rules Terms: 6
- Discount Terms: 7
- Guided Selling Terms: 8
- Relationships: 15

All questions have been validated against:
1. Glossary definitions in learn.vue
2. Prisma schema models and enums
3. Industry-standard CPQ terminology
