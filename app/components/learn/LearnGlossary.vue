<script setup lang="ts">
interface GlossaryTerm {
  term: string
  definition: string
  example: string
  relatedTerms: string[]
  group: 'product' | 'pricing' | 'quote' | 'meta' | 'customer' | 'rules' | 'discount' | 'category' | 'tax' | 'contract' | 'attribute' | 'currency' | 'guided-selling'
  confusedWith?: string
  distinction?: string
}

const glossaryTerms: GlossaryTerm[] = [
  // === META GROUP ===
  {
    term: 'CPQ',
    group: 'meta',
    definition:
      'Configure, Price, Quote - a three-step sales workflow. First, configure a product to match customer needs. Second, calculate the price using price books and adjustments. Third, generate a quote document for the customer.',
    example: 'A sales rep configures a "Laptop Pro Bundle" with i7 CPU and 32GB RAM, the system looks up the list price ($1,299) and adds the RAM adjustment (+$200), then generates Quote #Q-2024-0042 showing $1,499 total.',
    relatedTerms: ['Configuration', 'Quote', 'List Price'],
  },

  // === PRODUCT GROUP ===
  {
    term: 'Product',
    group: 'product',
    definition:
      'The top-level sellable item in the catalog. Every product has a SKU and a type: STANDALONE (sold as-is, no choices) or BUNDLE (has features and options for customization). A Bundle is a type of Product.',
    example: '"USB-C Cable" (SKU: USB-001) is a STANDALONE product. "Laptop Pro Bundle" (SKU: LAP-PRO) is a BUNDLE product with configurable features.',
    relatedTerms: ['SKU', 'Bundle', 'Price Book Entry'],
    confusedWith: 'Bundle',
    distinction: 'Product is the parent concept. Bundle is a Product with type=BUNDLE that has Features and Options.',
  },
  {
    term: 'SKU',
    group: 'product',
    definition:
      'Stock Keeping Unit - a unique alphanumeric code that identifies a specific product in the catalog. Every Product MUST have exactly one SKU. SKUs enable inventory tracking, price lookups, and rule conditions.',
    example: '"LAP-PRO" is the SKU for "Laptop Pro Bundle". "USB-001" is the SKU for "USB-C Cable". When writing a rule condition, you can match by SKU: productSku equals "LAP-PRO".',
    relatedTerms: ['Product', 'Price Book Entry', 'Rule'],
    confusedWith: 'Product',
    distinction: 'SKU is the CODE (the identifier string). Product is the ENTITY (the full record with name, description, features, etc.).',
  },
  {
    term: 'Bundle',
    group: 'product',
    definition:
      'A Product with type=BUNDLE that requires configuration before purchase. Bundles contain Features (the categories of choice) and Options (the specific choices). Think: a Bundle asks questions, the customer picks answers.',
    example: '"Laptop Pro Bundle" has 3 Features: "Processor" (i5/i7/i9), "RAM" (16GB/32GB), "Storage" (256GB/512GB/1TB). Customer picks one Option from each Feature.',
    relatedTerms: ['Product', 'Feature', 'Option'],
    confusedWith: 'Product',
    distinction: 'A Bundle IS a Product (with type=BUNDLE). Not all Products are Bundles - STANDALONE products have no Features.',
  },
  {
    term: 'Feature',
    group: 'product',
    definition:
      'A category of choice within a Bundle - the QUESTION being asked. Each Feature has a name, belongs to one Bundle, and contains multiple Options. Features define min/max selections (e.g., "pick exactly 1" or "pick 0-3").',
    example: 'The "Laptop Pro Bundle" has a Feature called "RAM". This Feature has minOptions=1, maxOptions=1 (must pick exactly one). It contains Options: 16GB, 32GB.',
    relatedTerms: ['Bundle', 'Option'],
    confusedWith: 'Option',
    distinction: 'Feature is the QUESTION ("Which RAM?"). Option is the ANSWER ("32GB"). One Feature contains many Options.',
  },
  {
    term: 'Option',
    group: 'product',
    definition:
      'A specific choice within a Feature - the ANSWER to the question. Each Option references a Product (for pricing lookup) and can have a price adjustment. When selected, Options become part of the Configuration.',
    example: 'The "RAM" Feature has Options: "16GB" (no adjustment, $0) and "32GB" (+$200 adjustment). Both Options reference underlying products for price lookup.',
    relatedTerms: ['Feature', 'Price Adjustment', 'Configuration'],
    confusedWith: 'Feature',
    distinction: 'Option is the ANSWER ("32GB"). Feature is the QUESTION ("Which RAM?"). Options live inside Features.',
  },
  {
    term: 'Unit of Measure',
    group: 'product',
    definition:
      'A standard unit for quantifying products (e.g., "Each", "Box", "Kg", "License"). Units can have base units and conversion factors for automatic quantity conversion. Products can be assigned a default unit of measure.',
    example: 'Unit "Box" has baseUnit="Each" with conversionFactor=12 (1 Box = 12 Each). Product "USB Cables" uses unit "Box".',
    relatedTerms: ['Unit Conversion', 'Product'],
  },
  {
    term: 'Unit Conversion',
    group: 'product',
    definition:
      'The relationship between a derived unit and its base unit, defined by a conversion factor. Enables quantity calculations across different units within the same unit family.',
    example: 'Unit "Dozen" converts to base unit "Each" with factor 12. Unit "Case" converts to "Box" with factor 4, and "Box" converts to "Each" with factor 12.',
    relatedTerms: ['Unit of Measure', 'Product'],
  },

  // === CATEGORY GROUP ===
  {
    term: 'Category',
    group: 'category',
    definition:
      'A hierarchical classification for organizing products in the catalog. Categories can have parent-child relationships forming a tree structure. Products can belong to multiple categories via a many-to-many relationship.',
    example: '"Hardware" is a root category with children "Processors", "Memory", and "Storage". A product like "Intel i7 CPU" belongs to the "Processors" category.',
    relatedTerms: ['Product', 'Product Category', 'Discount Scope'],
  },
  {
    term: 'Product Category',
    group: 'category',
    definition:
      'The junction record linking a Product to a Category. Enables many-to-many relationships where one product can be in multiple categories, and one category can contain multiple products.',
    example: 'A "USB-C Hub" product might be assigned to both "Accessories" and "Hardware" categories via two ProductCategory records.',
    relatedTerms: ['Category', 'Product'],
    confusedWith: 'Category',
    distinction: 'Category is the classification folder. Product Category is the assignment linking a specific product to that folder.',
  },
  {
    term: 'Category Hierarchy',
    group: 'category',
    definition:
      'The parent-child tree structure of categories. Root categories have no parent. Child categories reference a parentId. This enables browsing products by drilling down through nested categories.',
    example: 'Root: "Hardware" → Child: "Storage" → Child: "SSDs". When viewing "Hardware", you see its children. Category discounts can apply to all products in a branch.',
    relatedTerms: ['Category', 'Discount Scope'],
  },

  // === PRICING GROUP ===
  {
    term: 'Price Book',
    group: 'pricing',
    definition:
      'A named container that holds prices for products. Different price books serve different purposes: "Retail 2024" for consumers, "Partner" for resellers, "EMEA" for European pricing. Each Quote uses exactly one Price Book.',
    example: 'Price Book "Retail 2024" contains prices for all products. Price Book "Partner" has the same products at 20% lower prices. Quote #Q-2024-0042 uses "Retail 2024".',
    relatedTerms: ['Price Book Entry', 'Quote'],
    confusedWith: 'Price Book Entry',
    distinction: 'Price Book is the CONTAINER (the whole price list). Price Book Entry is ONE ROW in that container (one product\'s price).',
  },
  {
    term: 'Price Book Entry',
    group: 'pricing',
    definition:
      'A single row linking one Product to one Price Book, storing that product\'s List Price (and optionally Cost). One Product can have entries in multiple Price Books at different prices. The entry is WHERE the List Price lives.',
    example: '"Laptop Pro Bundle" has an entry in "Retail 2024" with List Price $1,299 and Cost $950. The same product has an entry in "Partner" with List Price $1,039.',
    relatedTerms: ['Price Book', 'List Price', 'Product'],
    confusedWith: 'List Price',
    distinction: 'Price Book Entry is the DATABASE ROW (product + price book + list price). List Price is the DOLLAR VALUE stored in that row.',
  },
  {
    term: 'List Price',
    group: 'pricing',
    definition:
      'The base dollar amount for a product, stored inside a Price Book Entry. This is the starting price BEFORE any Option adjustments or discounts are applied. "List" means the catalog/listed price.',
    example: 'The List Price of "Laptop Pro Bundle" is $1,299 (stored in the Price Book Entry). After selecting the +$200 RAM upgrade, the configured price becomes $1,499.',
    relatedTerms: ['Price Book Entry', 'Price Adjustment'],
    confusedWith: 'Price Book Entry',
    distinction: 'List Price is the NUMBER ($1,299). Price Book Entry is the RECORD that contains that number plus the product and price book references.',
  },
  {
    term: 'Price Adjustment',
    group: 'pricing',
    definition:
      'A positive or negative amount that modifies the List Price when an Option is selected. Premium options add (+), budget options may subtract (−). Adjustments stack: selecting multiple upgraded options adds all their adjustments.',
    example: 'List Price: $1,299. Select "32GB RAM": +$200 adjustment. Select "1TB Storage": +$250 adjustment. Final configured price: $1,749.',
    relatedTerms: ['Option', 'List Price'],
  },
  {
    term: 'Price Tier',
    group: 'pricing',
    definition:
      'A quantity-based price break within a Price Book Entry. Price Tiers enable volume pricing where unit cost decreases as quantity increases. Each tier specifies a quantity range and the price for that range.',
    example: 'PriceBookEntry for "USB-C Cable" in "Retail 2024" has tiers: $12/unit (1-9 qty), $10/unit (10-49 qty), $8/unit (50+ qty). Buying 25 cables uses the $10 tier.',
    relatedTerms: ['Price Book Entry', 'List Price'],
    confusedWith: 'Discount Tier',
    distinction: 'Price Tier sets the BASE PRICE at different quantities. Discount Tier applies a REDUCTION to that price. Price Tiers are in Price Book Entries; Discount Tiers are in Discounts.',
  },
  {
    term: 'Tier Type',
    group: 'pricing',
    definition:
      'How a price tier is calculated: UNIT_PRICE (price per unit at this tier level) or FLAT_PRICE (flat price for the entire quantity range regardless of units).',
    example: 'UNIT_PRICE: Qty 10+ at $8/unit means 15 units = $120. FLAT_PRICE: Qty 10+ at $100 flat means 15 units = $100 total.',
    relatedTerms: ['Price Tier', 'Price Book Entry'],
  },
  {
    term: 'Billing Frequency',
    group: 'pricing',
    definition:
      'How often a product is billed: ONE_TIME (single purchase), MONTHLY, QUARTERLY, ANNUAL, or CUSTOM (specify months). Determines recurring revenue calculations and subscription pricing.',
    example: 'Product "Software License" has billingFrequency=ANNUAL. Product "Support" has billingFrequency=MONTHLY. Product "Laptop" has billingFrequency=ONE_TIME.',
    relatedTerms: ['MRR', 'ARR', 'Product'],
  },

  // === QUOTE GROUP ===
  {
    term: 'Quote',
    group: 'quote',
    definition:
      'The sales document sent to a customer listing what they\'re buying and the total price. Contains Quote Line Items (the rows). Has a lifecycle: Draft → Pending → Approved/Rejected → Accepted → Finalized (or Cancelled). Uses one Price Book for all pricing.',
    example: 'Quote #Q-2024-0042 for "Acme Corp" using "Retail 2024" price book. Contains 2 line items. Total: $1,559. Status: Draft.',
    relatedTerms: ['Quote Line Item', 'Price Book'],
    confusedWith: 'Quote Line Item',
    distinction: 'Quote is the DOCUMENT (the whole thing). Quote Line Item is ONE ROW on that document (one product being purchased).',
  },
  {
    term: 'Quote Line Item',
    group: 'quote',
    definition:
      'A single row on a Quote representing one product being purchased. Stores: product reference, quantity, unit price, and subtotal. For Bundles, also stores the Configuration (which Options were selected).',
    example: 'Line 1: "Laptop Pro Bundle" × 1 @ $1,499 = $1,499 (with Configuration: i7, 32GB, 512GB). Line 2: "USB-C Cable" × 5 @ $12 = $60.',
    relatedTerms: ['Quote', 'Configuration', 'Product'],
    confusedWith: 'Configuration',
    distinction: 'Quote Line Item is the ROW (product, qty, price). Configuration is the OPTIONS DATA stored inside that row for bundles.',
  },
  {
    term: 'Configuration',
    group: 'quote',
    definition:
      'The saved record of which Options were selected when configuring a Bundle. Stored as JSON on the Quote Line Item. Captures the exact choices so the order can be fulfilled correctly.',
    example: 'Configuration for "Laptop Pro Bundle": {processor: "i7", ram: "32GB", storage: "512GB"}. This JSON is saved on the Quote Line Item.',
    relatedTerms: ['Bundle', 'Option', 'Quote Line Item'],
    confusedWith: 'Quote Line Item',
    distinction: 'Configuration is the OPTIONS DATA (the JSON of choices). Quote Line Item is the ROW that contains the configuration plus qty, price, etc.',
  },
  {
    term: 'MRR',
    group: 'quote',
    definition:
      'Monthly Recurring Revenue - the normalized monthly value of all recurring line items on a quote. Annual subscriptions are divided by 12, quarterly by 3. One-time items are excluded from MRR.',
    example: 'Quote has: Annual license ($1,200/year = $100 MRR) + Monthly support ($50/month = $50 MRR) + One-time setup ($500 = $0 MRR). Total MRR: $150.',
    relatedTerms: ['ARR', 'TCV', 'Billing Frequency'],
    confusedWith: 'ARR',
    distinction: 'MRR is MONTHLY normalized value. ARR is ANNUAL value (MRR × 12). Both exclude one-time revenue.',
  },
  {
    term: 'ARR',
    group: 'quote',
    definition:
      'Annual Recurring Revenue - the annualized value of recurring revenue, calculated as MRR × 12. Represents the yearly run-rate of subscription revenue if all current subscriptions continue.',
    example: 'Quote has MRR of $150. ARR = $150 × 12 = $1,800/year. This is the projected annual recurring revenue from this quote.',
    relatedTerms: ['MRR', 'TCV', 'Billing Frequency'],
    confusedWith: 'TCV',
    distinction: 'ARR is the ANNUAL recurring run-rate. TCV includes one-time items and the full contract term value.',
  },
  {
    term: 'TCV',
    group: 'quote',
    definition:
      'Total Contract Value - the complete monetary value of a quote including one-time items plus all recurring items for the full contract term. Represents the total revenue expected from the deal.',
    example: 'Quote: Setup fee $500 (one-time) + 12-month license $1,200 + 12-month support $600. TCV = $500 + $1,200 + $600 = $2,300.',
    relatedTerms: ['MRR', 'ARR', 'Quote'],
    confusedWith: 'ARR',
    distinction: 'TCV is the TOTAL deal value including one-time items. ARR is just the recurring portion annualized.',
  },
  {
    term: 'Proration',
    group: 'quote',
    definition:
      'Adjusting a subscription price based on a partial billing period. When a subscription starts mid-period, the first charge is prorated based on remaining days. The proratedAmount field stores this adjusted value.',
    example: 'Monthly subscription ($100/month) starts on Jan 15. Prorated first month: 17 days × ($100/31 days) = $54.84 proratedAmount.',
    relatedTerms: ['Billing Frequency', 'Quote Line Item'],
  },

  // === CUSTOMER GROUP ===
  {
    term: 'Customer',
    group: 'customer',
    definition:
      'A record representing a buyer with contact information (name, email, phone), optional company details, and an assigned Price Book for customer-specific pricing. Customers are linked to Quotes for tracking and reporting.',
    example: '"Acme Corp" (customer) has email sales@acme.com, is assigned to "Partner" price book (20% discount), and has 3 quotes totaling $45,000.',
    relatedTerms: ['Quote', 'Price Book'],
  },

  // === RULES GROUP ===
  {
    term: 'Rule',
    group: 'rules',
    definition:
      'A business rule that automates configuration validation or pricing adjustments. Rules have a type (CONFIGURATION or PRICING), a trigger event, a condition (when to fire), and an action (what to do). Rules are evaluated in priority order.',
    example: 'Rule "RAM requires SSD" (type: CONFIGURATION, trigger: ON_PRODUCT_ADD, priority: 100) checks if 32GB RAM is selected and requires SSD storage option.',
    relatedTerms: ['Rule Type', 'Rule Trigger'],
  },
  {
    term: 'Rule Type',
    group: 'rules',
    definition:
      'The category of rule: CONFIGURATION rules validate product combinations and enforce dependencies. PRICING rules adjust prices, apply automatic discounts, or flag quotes for approval.',
    example: 'CONFIGURATION rule: "Gaming GPU requires 750W PSU". PRICING rule: "Orders over $10,000 require manager approval".',
    relatedTerms: ['Rule', 'Rule Trigger'],
    confusedWith: 'Rule Trigger',
    distinction: 'Rule Type is WHAT the rule does (validate config vs adjust price). Rule Trigger is WHEN the rule runs (on add, on save, etc.).',
  },
  {
    term: 'Rule Trigger',
    group: 'rules',
    definition:
      'The event that causes a Rule to be evaluated: ON_PRODUCT_ADD (product added to quote), ON_QUANTITY_CHANGE (quantity updated), ON_QUOTE_SAVE (quote saved), ON_FINALIZE (quote finalized).',
    example: 'Rule with trigger ON_QUANTITY_CHANGE fires when user changes line item quantity from 5 to 10, recalculating volume discounts.',
    relatedTerms: ['Rule', 'Rule Type'],
    confusedWith: 'Rule Type',
    distinction: 'Rule Trigger is WHEN the rule fires (the event). Rule Type is WHAT it does (configuration vs pricing logic).',
  },

  // === DISCOUNT GROUP ===
  {
    term: 'Discount',
    group: 'discount',
    definition:
      'A reusable discount definition with a type (PERCENTAGE or FIXED_AMOUNT), scope (LINE_ITEM, QUOTE, or PRODUCT_CATEGORY), and optional validity period. Discounts can have tiers for volume-based reductions and can be stackable or exclusive.',
    example: 'Discount "Volume Savings" (type: PERCENTAGE, scope: LINE_ITEM, stackable: false) with tiers: 5% off at 10+ qty, 10% off at 50+ qty.',
    relatedTerms: ['Discount Type', 'Discount Scope', 'Discount Tier', 'Applied Discount'],
    confusedWith: 'Applied Discount',
    distinction: 'Discount is the TEMPLATE (the reusable definition). Applied Discount is the INSTANCE (a specific application to a quote/line).',
  },
  {
    term: 'Discount Type',
    group: 'discount',
    definition:
      'How the discount value is calculated: PERCENTAGE (e.g., 10% off the price) or FIXED_AMOUNT (e.g., $50 off). Percentage discounts scale with price; fixed amounts are constant.',
    example: 'PERCENTAGE: 15% off $1,000 = $150 savings. FIXED_AMOUNT: $50 off $1,000 = $50 savings (same $50 off $500 too).',
    relatedTerms: ['Discount', 'Discount Scope'],
  },
  {
    term: 'Discount Scope',
    group: 'discount',
    definition:
      'Where the discount applies: LINE_ITEM (to a single product line), QUOTE (to the entire order total), or PRODUCT_CATEGORY (to all products in a category).',
    example: 'LINE_ITEM scope: 10% off just the laptop. QUOTE scope: $100 off the entire order. PRODUCT_CATEGORY scope: 15% off all accessories.',
    relatedTerms: ['Discount', 'Discount Type'],
  },
  {
    term: 'Discount Tier',
    group: 'discount',
    definition:
      'A volume-based level within a Discount that increases savings at higher quantities. Each tier specifies a quantity range and the discount value for that range. Tiers are evaluated in order.',
    example: 'Discount "Bulk Buy" has tiers: Tier 1 (10-24 qty): 5% off, Tier 2 (25-49 qty): 10% off, Tier 3 (50+ qty): 15% off.',
    relatedTerms: ['Discount', 'Price Tier'],
    confusedWith: 'Price Tier',
    distinction: 'Discount Tier is a REDUCTION applied on top of the price. Price Tier is the BASE PRICE itself. Both are quantity-based but serve different purposes.',
  },
  {
    term: 'Applied Discount',
    group: 'discount',
    definition:
      'An instance of a Discount applied to a specific Quote or Quote Line Item. Records which discount was used, the calculated amount saved, and when/who applied it. Multiple Applied Discounts can exist on one quote.',
    example: 'Quote #Q-2024-0042 has Applied Discount: "Volume Savings" on Line 1, calculated amount: $149.90 (10% of $1,499). Applied by: System, at: 2024-01-15.',
    relatedTerms: ['Discount', 'Quote', 'Quote Line Item'],
    confusedWith: 'Discount',
    distinction: 'Applied Discount is the INSTANCE (specific to one quote/line with calculated amount). Discount is the TEMPLATE (the reusable definition).',
  },

  // === TAX GROUP ===
  {
    term: 'Tax Rate',
    group: 'tax',
    definition:
      'A tax percentage applied to taxable products based on geographic location (country, state/region) and optionally product category. Tax rates can have effective date ranges and can be linked to specific product categories for specialized taxation.',
    example: 'Tax Rate "CA State Tax" has rate 7.25% for country "US", state "CA". When a quote ships to California, this tax rate is applied to all taxable products.',
    relatedTerms: ['Tax Exemption', 'Category', 'Quote'],
  },
  {
    term: 'Tax Exemption',
    group: 'tax',
    definition:
      'A customer-level flag indicating the customer is exempt from taxes. Tax-exempt customers may require a certificate number, reason, and expiration date. When a quote is created for a tax-exempt customer, no tax is calculated.',
    example: 'Customer "State University" has isTaxExempt=true, reason="Educational Institution", certificate="EDU-2024-12345", expiry=2025-12-31.',
    relatedTerms: ['Tax Rate', 'Customer', 'Quote'],
    confusedWith: 'Tax Rate',
    distinction: 'Tax Rate defines HOW MUCH tax to charge. Tax Exemption defines WHO is exempt from tax entirely.',
  },

  // === CONTRACT GROUP ===
  {
    term: 'Contract',
    group: 'contract',
    definition:
      'A time-bound agreement with a customer that can include negotiated pricing and discount terms. Contracts have a status lifecycle (DRAFT → ACTIVE → EXPIRED) and define a date range during which special pricing applies.',
    example: 'Contract "Acme Corp 2024" for customer "Acme Corp" runs from Jan 1 to Dec 31, 2024, with status ACTIVE and a 15% discount on all products.',
    relatedTerms: ['Contract Price Entry', 'Contract Status', 'Customer'],
  },
  {
    term: 'Contract Price Entry',
    group: 'contract',
    definition:
      'A fixed price for a specific product within a contract. Overrides the standard Price Book Entry pricing when the contract is active. Each entry specifies a product and its negotiated fixed price.',
    example: 'Contract "Acme Corp 2024" has a Contract Price Entry for "Laptop Pro Bundle" with fixedPrice=$1,099 (vs. list price $1,299).',
    relatedTerms: ['Contract', 'Price Book Entry', 'Product'],
    confusedWith: 'Price Book Entry',
    distinction: 'Contract Price Entry is customer-specific negotiated pricing. Price Book Entry is the standard catalog pricing available to all customers.',
  },
  {
    term: 'Contract Status',
    group: 'contract',
    definition:
      'The lifecycle state of a contract: DRAFT (being negotiated, not yet active), ACTIVE (in effect, pricing applies), EXPIRED (past end date, no longer applies). Only ACTIVE contracts affect quote pricing.',
    example: 'Contract transitions: DRAFT (during negotiation) → ACTIVE (once signed and start date reached) → EXPIRED (after end date passes).',
    relatedTerms: ['Contract', 'Quote'],
  },

  // === ATTRIBUTE GROUP ===
  {
    term: 'Attribute',
    group: 'attribute',
    definition:
      'A custom field definition for storing additional product information. Attributes have a type (TEXT, NUMBER, BOOLEAN, SELECT, DATE), can be required, and can have constraints. They are organized into Attribute Groups.',
    example: 'Attribute "Color" (type: SELECT, options: ["Red", "Blue", "Black"]) and Attribute "Weight" (type: NUMBER, constraints: {min: 0, max: 100}).',
    relatedTerms: ['Attribute Group', 'Product Attribute', 'Attribute Type', 'Category Attribute'],
  },
  {
    term: 'Attribute Group',
    group: 'attribute',
    definition:
      'A named container for organizing related attributes. Groups help categorize attributes for display and management. Each attribute can optionally belong to one group.',
    example: 'Attribute Group "Physical Specs" contains attributes: "Weight", "Dimensions", "Color". Group "Technical Specs" contains: "Processor", "Memory", "Storage".',
    relatedTerms: ['Attribute', 'Product Attribute'],
  },
  {
    term: 'Product Attribute',
    group: 'attribute',
    definition:
      'The junction record linking an Attribute to a Product with a specific value. Stores the actual attribute value for that product based on the attribute type (text string, number, boolean, selected option, or date).',
    example: 'Product "Laptop Pro" has Product Attribute values: Color="Black", Weight=2.5, HasTouchscreen=true.',
    relatedTerms: ['Attribute', 'Product'],
    confusedWith: 'Attribute',
    distinction: 'Attribute is the DEFINITION (the field schema). Product Attribute is the VALUE (the actual data for a specific product).',
  },
  {
    term: 'Category Attribute',
    group: 'attribute',
    definition:
      'The junction record linking an Attribute to a Category. When an attribute is assigned to a category, all products in that category inherit the attribute definition, suggesting what values should be provided.',
    example: 'Category "Laptops" has CategoryAttribute for "Screen Size" and "Battery Life". All products in the Laptops category should have these attributes.',
    relatedTerms: ['Attribute', 'Category', 'Product Attribute'],
  },
  {
    term: 'Attribute Type',
    group: 'attribute',
    definition:
      'The data type of an attribute: TEXT (free-form string), NUMBER (numeric with optional min/max), BOOLEAN (true/false), SELECT (dropdown from predefined options), DATE (calendar date).',
    example: 'TEXT: "Description". NUMBER: "Weight (kg)". BOOLEAN: "Is Refurbished". SELECT: "Color" with options. DATE: "Manufacture Date".',
    relatedTerms: ['Attribute', 'Product Attribute'],
  },

  // === CURRENCY GROUP ===
  {
    term: 'Currency',
    group: 'currency',
    definition:
      'A monetary unit identified by ISO 4217 code (USD, EUR, GBP, etc.). Each currency has a code, name, and symbol. One currency is marked as the base currency for reporting. Price books, quotes, and customers can be assigned specific currencies.',
    example: 'Currency "USD" (code: USD, symbol: $, isBase: true) and Currency "EUR" (code: EUR, symbol: €, isBase: false).',
    relatedTerms: ['Exchange Rate', 'Base Currency', 'Price Book'],
  },
  {
    term: 'Exchange Rate',
    group: 'currency',
    definition:
      'The conversion rate between a currency and the base currency at a specific effective date. Allows quotes in foreign currencies to be converted to the base currency for reporting. Multiple rates can exist with different effective dates.',
    example: 'Exchange Rate for EUR: rate=1.08 (1 EUR = 1.08 USD), effectiveDate=2024-01-01. A new rate of 1.10 becomes effective on 2024-04-01.',
    relatedTerms: ['Currency', 'Base Currency', 'Quote'],
  },
  {
    term: 'Base Currency',
    group: 'currency',
    definition:
      'The primary currency used for financial reporting and consolidation. All quote totals are converted to the base currency amount for consistent reporting. Only one currency can be the base currency (isBase=true).',
    example: 'USD is the base currency. A quote in EUR for €1,000 at exchange rate 1.08 has baseAmount=$1,080 for reporting.',
    relatedTerms: ['Currency', 'Exchange Rate', 'Quote'],
    confusedWith: 'Currency',
    distinction: 'Base Currency is the REPORTING standard. Other Currencies are TRANSACTION currencies that get converted to base.',
  },

  // === GUIDED SELLING GROUP ===
  {
    term: 'Product Affinity',
    group: 'guided-selling',
    definition:
      'A directional relationship between products (source → target) that triggers recommendations based on affinity type. When a source product is added to a quote, the system recommends target products. Affinities have a priority for ordering and can have conditions.',
    example: 'ProductAffinity: source="Laptop Pro" → target="Laptop Bag", type=ACCESSORY, priority=50. When Laptop Pro is added, system recommends Laptop Bag.',
    relatedTerms: ['Affinity Type', 'Recommendation Log', 'Questionnaire'],
    confusedWith: 'Questionnaire',
    distinction: 'Affinity is rule-based (triggered by product selection). Questionnaire is needs-based (triggered by user answering questions).',
  },
  {
    term: 'Affinity Type',
    group: 'guided-selling',
    definition:
      'The category of product relationship: CROSS_SELL (complementary product), UPSELL (premium alternative), ACCESSORY (add-on item), REQUIRED (mandatory companion), FREQUENTLY_BOUGHT (popular combination), SUBSCRIPTION_ADDON (recurring add-on).',
    example: 'CROSS_SELL: "Also consider..." UPSELL: "Upgrade to..." ACCESSORY: "Don\'t forget..." REQUIRED: "You\'ll also need..."',
    relatedTerms: ['Product Affinity'],
  },
  {
    term: 'Questionnaire',
    group: 'guided-selling',
    definition:
      'A needs-assessment survey that guides users to appropriate products based on their answers. Contains ordered questions with branching logic that maps answers to product recommendations with relevance scores.',
    example: 'Questionnaire "Find Your Laptop": Question 1 "Primary use?" → "Gaming" maps to gaming laptops with score 100, "Business" maps to business laptops.',
    relatedTerms: ['Question', 'Question Product Mapping', 'Product Affinity'],
    confusedWith: 'Product Affinity',
    distinction: 'Questionnaire asks questions to discover needs. Affinity is rule-based on existing selections.',
  },
  {
    term: 'Question',
    group: 'guided-selling',
    definition:
      'A single question within a questionnaire. Has a type (SINGLE_CHOICE, MULTIPLE_CHOICE, RANGE, YES_NO), display text, answer options, and optional branching logic to control flow based on answers.',
    example: 'Question: "What\'s your budget?" type=RANGE, options=[{label:"Under $500"}, {label:"$500-$1000"}, {label:"Over $1000"}]',
    relatedTerms: ['Questionnaire', 'Question Type', 'Question Product Mapping'],
  },
  {
    term: 'Question Type',
    group: 'guided-selling',
    definition:
      'The answer format for a question: SINGLE_CHOICE (pick one), MULTIPLE_CHOICE (pick many), RANGE (select from range), YES_NO (binary).',
    example: 'SINGLE_CHOICE: "Primary use?" MULTIPLE_CHOICE: "Which features matter?" RANGE: "Budget range?" YES_NO: "Need warranty?"',
    relatedTerms: ['Question'],
  },
  {
    term: 'Question Product Mapping',
    group: 'guided-selling',
    definition:
      'The junction record linking a question\'s answer to a recommended product with a relevance score. Higher scores indicate stronger matches. Multiple products can map to the same answer.',
    example: 'Question "Primary use?" answer "Gaming" maps to: "Gaming Laptop Pro" (score: 100), "Gaming Mouse" (score: 80).',
    relatedTerms: ['Question', 'Product'],
  },
  {
    term: 'Recommendation Log',
    group: 'guided-selling',
    definition:
      'A tracking record for recommendation effectiveness. Logs when a recommendation was SHOWN to user, ACCEPTED (added to quote), or DISMISSED. Includes source (RULE_BASED, AI_GENERATED, QUESTIONNAIRE, MANUAL).',
    example: 'RecommendationLog: quote="Q-2024-001", product="Laptop Bag", source=RULE_BASED, action=ACCEPTED.',
    relatedTerms: ['Product Affinity', 'Recommendation Source', 'Recommendation Action'],
  },
  {
    term: 'Recommendation Source',
    group: 'guided-selling',
    definition:
      'How a recommendation was generated: RULE_BASED (from affinity rules), AI_GENERATED (from ML model), QUESTIONNAIRE (from needs assessment), MANUAL (sales rep entered).',
    example: 'RULE_BASED: triggered by affinity rule. QUESTIONNAIRE: from needs assessment. MANUAL: sales rep suggested.',
    relatedTerms: ['Recommendation Log'],
  },
  {
    term: 'Recommendation Action',
    group: 'guided-selling',
    definition:
      'The user\'s response to a recommendation: SHOWN (displayed to user), ACCEPTED (user added product to quote), DISMISSED (user declined recommendation).',
    example: 'Track conversion: 100 SHOWN → 45 ACCEPTED, 55 DISMISSED = 45% acceptance rate.',
    relatedTerms: ['Recommendation Log'],
  },
]

const groupLabels: Record<GlossaryTerm['group'], string> = {
  'meta': 'Overview',
  'product': 'Product Terms',
  'category': 'Category Terms',
  'pricing': 'Pricing Terms',
  'quote': 'Quote Terms',
  'customer': 'Customer Terms',
  'rules': 'Rules Terms',
  'discount': 'Discount Terms',
  'tax': 'Tax Terms',
  'contract': 'Contract Terms',
  'attribute': 'Attribute Terms',
  'currency': 'Currency Terms',
  'guided-selling': 'Guided Selling Terms',
}

const groupOrder: GlossaryTerm['group'][] = ['meta', 'product', 'category', 'attribute', 'pricing', 'currency', 'quote', 'customer', 'contract', 'tax', 'rules', 'discount', 'guided-selling']

// Glossary state
const searchQuery = ref('')
const compareMode = ref(false)
const selectedTerms = ref<string[]>([])
const highlightedTerm = ref<string | null>(null)

const filteredTerms = computed(() => {
  if (!searchQuery.value.trim()) return glossaryTerms
  const query = searchQuery.value.toLowerCase()
  return glossaryTerms.filter(
    t =>
      t.term.toLowerCase().includes(query)
      || t.definition.toLowerCase().includes(query)
      || t.example.toLowerCase().includes(query)
      || t.relatedTerms.some(rt => rt.toLowerCase().includes(query)),
  )
})

const groupedTerms = computed(() => {
  const groups: Record<GlossaryTerm['group'], GlossaryTerm[]> = {
    'meta': [],
    'product': [],
    'category': [],
    'pricing': [],
    'quote': [],
    'customer': [],
    'rules': [],
    'discount': [],
    'tax': [],
    'contract': [],
    'attribute': [],
    'currency': [],
    'guided-selling': [],
  }
  for (const term of filteredTerms.value) {
    groups[term.group].push(term)
  }
  return groups
})

const selectedTermsData = computed(() => {
  return glossaryTerms.filter(t => selectedTerms.value.includes(t.term))
})

function toggleTermSelection(term: string) {
  const index = selectedTerms.value.indexOf(term)
  if (index === -1) {
    if (selectedTerms.value.length < 3) {
      selectedTerms.value.push(term)
    }
  }
  else {
    selectedTerms.value.splice(index, 1)
  }
}

function exitCompareMode() {
  compareMode.value = false
  selectedTerms.value = []
}

function scrollToTerm(term: string) {
  highlightedTerm.value = term
  const element = document.getElementById(`glossary-term-${term.toLowerCase().replace(/\s+/g, '-')}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => {
      highlightedTerm.value = null
    }, 2000)
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton
          v-if="!compareMode"
          variant="outline"
          size="sm"
          icon="i-heroicons-arrows-right-left"
          @click="compareMode = true"
        >
          Compare Terms
        </UButton>
        <UButton
          v-else
          variant="soft"
          color="error"
          size="sm"
          icon="i-heroicons-x-mark"
          @click="exitCompareMode"
        >
          Exit Compare
        </UButton>
        <UInput
          v-model="searchQuery"
          placeholder="Search terms..."
          icon="i-heroicons-magnifying-glass"
          class="w-64"
        />
      </div>
    </div>

    <!-- Compare mode hint -->
    <div v-if="compareMode && selectedTerms.length < 2" class="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
      Select 2-3 terms to compare them side-by-side. Click on the cards below to select.
      <span v-if="selectedTerms.length === 1" class="font-medium">({{ selectedTerms.length }}/3 selected)</span>
    </div>

    <!-- Comparison view -->
    <LearnGlossaryComparison
      v-if="compareMode && selectedTerms.length >= 2"
      :terms="selectedTermsData"
      @close="exitCompareMode"
    />

    <div v-if="filteredTerms.length === 0" class="text-center py-8 text-ga-gray-600">
      No terms found matching "{{ searchQuery }}"
    </div>

    <!-- Grouped glossary terms -->
    <div v-else class="space-y-8">
      <div
        v-for="group in groupOrder"
        :key="group"
      >
        <template v-if="groupedTerms[group].length > 0">
          <h3 class="text-lg font-medium text-ga-gray-800 mb-3 pb-2 border-b border-ga-gray-300">
            {{ groupLabels[group] }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LearnGlossaryTerm
              v-for="item in groupedTerms[group]"
              :id="`glossary-term-${item.term.toLowerCase().replace(/\s+/g, '-')}`"
              :key="item.term"
              :term="item.term"
              :definition="item.definition"
              :example="item.example"
              :related-terms="item.relatedTerms"
              :confused-with="item.confusedWith"
              :distinction="item.distinction"
              :compare-mode="compareMode"
              :selected="selectedTerms.includes(item.term)"
              :highlighted="highlightedTerm === item.term"
              @toggle-select="toggleTermSelection(item.term)"
              @navigate-to-term="scrollToTerm"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
