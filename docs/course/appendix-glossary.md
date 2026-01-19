# Appendix: CPQ Glossary

Definitions of CPQ terms and concepts used throughout this course.

---

## A

### Affinity
A relationship between products that suggests one when another is selected. Types include cross-sell, upsell, and accessory.

### Applied Discount
A record of a discount actually applied to a quote or line item, including the calculated amount saved.

### ARR (Annual Recurring Revenue)
The annualized value of recurring revenue. Calculated as MRR × 12.

### Attribute
A flexible metadata field attached to products. Can be TEXT, NUMBER, BOOLEAN, SELECT, or DATE type.

### Attribute Group
A logical grouping of related attributes for organization (e.g., "Physical Specs", "Technical Specs").

---

## B

### Base Amount
A quote total converted to the base currency for reporting and comparison purposes.

### Base Currency
The primary currency used for consolidated reporting. All quotes are converted to base currency.

### Billing Frequency
How often a product is charged: ONE_TIME, MONTHLY, QUARTERLY, ANNUAL, or CUSTOM.

### Blanket Discount
A percentage discount applied to all products in a contract, not specific to individual items.

### Bundle
A product type that requires configuration through features and options before purchase.

---

## C

### Category
A hierarchical classification for organizing products (e.g., Hardware > Computers > Laptops).

### Configure
The "C" in CPQ. The process of selecting products and options to meet customer requirements.

### Contract
A pricing agreement with a customer specifying fixed prices and/or blanket discounts for a time period.

### Contract Price Entry
A specific product's negotiated price within a contract.

### Cost
The amount paid to acquire or produce a product, used for margin calculations.

### CPQ
Configure, Price, Quote - software that automates product configuration, pricing calculation, and proposal generation.

### Cross-Sell
Recommending complementary products (e.g., laptop → external monitor).

---

## D

### Default Price Book
The fallback price book used when no customer-specific or quote-specific book is assigned.

### Discount
A reduction in price, either as a percentage or fixed amount.

### Discount Scope
Where a discount applies: LINE_ITEM (specific product), QUOTE (entire order), or PRODUCT_CATEGORY (all items in category).

### Discount Tier
Volume-based discount levels (e.g., 5% off for 10+, 10% off for 25+).

---

## E

### Effective Date
The date an exchange rate or price becomes active.

### Exchange Rate
The conversion factor between a currency and the base currency.

---

## F

### Feature
A configuration "question" on a bundle product (e.g., "Select RAM").

### Fixed Price
A contract-specified price that overrides price book pricing for a specific product.

### Flat Price
A tier pricing type where the total price is fixed regardless of quantity within the tier. Also known as **Stairstep Pricing** or **Block Pricing**.

---

## G

### Guided Selling
Features that help sales reps find appropriate products through recommendations and questionnaires.

---

## L

### Line Item
An individual product entry on a quote, with quantity, price, and discount details.

### List Price
The base selling price from a price book entry.

---

## M

### Margin
The difference between selling price and cost, often expressed as a percentage.

### Min Margin
The minimum acceptable margin percentage, used to trigger approval requirements.

### MRR (Monthly Recurring Revenue)
The monthly value of recurring charges, normalized from different billing frequencies.

### Multi-Tenancy
Supporting multiple organizations in a single system, isolated by entityId.

---

## N

### Net Price
The final price for a line item: quantity × (listPrice - discount).

### Nexus
Tax law concept determining where a business must collect sales tax.

---

## O

### Option
A configuration "answer" in a bundle feature, typically referencing another product.

---

## P

### Parent Line
The bundle product's line item, containing child lines for selected options.

### Price
The "P" in CPQ. The calculation of product costs with tiers, discounts, and taxes.

### Price Book
A collection of product prices for a specific segment, region, or time period.

### Price Book Entry
A single product's pricing within a price book.

### Price Tier
Volume-based pricing levels for a product.

### Priority
A number determining processing order (lower = higher priority).

### Proration
Adjusting charges for partial billing periods (e.g., starting mid-month).

---

## Q

### Questionnaire
A guided selling tool that asks questions to determine product recommendations.

### Quote
The "Q" in CPQ. A formal proposal document with products, pricing, and terms.

### Quote Status
The current state in the quote lifecycle (DRAFT, PENDING, APPROVED, etc.).

---

## R

### Recommendation
A suggested product based on affinity rules or questionnaire responses.

### Recommendation Log
A record of recommendations shown, accepted, or dismissed for analytics.

### Required Approval
A flag indicating a quote needs manager review before proceeding.

### Rule
Business logic encoded in the system (configuration validation or pricing adjustment).

### Rule Action
What happens when a rule's condition is met (require product, apply discount, etc.).

### Rule Condition
The criteria that must be true for a rule to fire.

### Rule Trigger
The event that causes rule evaluation (product add, save, finalize).

---

## S

### SKU (Stock Keeping Unit)
A unique product identifier.

### Stackable
Whether a discount can combine with other discounts.

### Standalone
A product type sold as-is without configuration options.

### Subtotal
Sum of all line item net prices before quote-level discounts and taxes.

---

## T

### Tax Breakdown
Detailed listing of taxes applied, showing each jurisdiction's rate and amount.

### Tax Exempt
A customer status indicating they don't pay sales tax.

### Tax Rate
A percentage charged for a jurisdiction and/or product category.

### TCV (Total Contract Value)
The complete value of a deal over the contract term.

### Tier
A quantity range with specific pricing or discount.

### Tier Type
How tier pricing is calculated: UNIT_PRICE (per item, also known as Slab Pricing) or FLAT_PRICE (total for range, also known as Stairstep Pricing).

---

## U

### Unit of Measure
How a product is quantified (each, hour, license, etc.).

### Unit Price
The price per single unit of a product.

### Upsell
Recommending a premium version of what's being purchased.

---

## V

### Valid From/To
Date range when a price book, discount, or tax rate is effective.

### VAT (Value Added Tax)
European consumption tax similar to sales tax.

### Volume Discount
Price reduction based on quantity purchased.

### Volume Pricing
Price tiers based on quantity ordered.

---

## W

### Webhook
An HTTP callback triggered by an event (e.g., quote.approved).

---

## Quick Reference: Formulas

| Metric | Formula |
|--------|---------|
| Net Price | quantity × (listPrice - discount) |
| Margin % | ((listPrice - cost) / listPrice) × 100 |
| MRR (Monthly) | netPrice |
| MRR (Quarterly) | netPrice / 3 |
| MRR (Annual) | netPrice / 12 |
| ARR | MRR × 12 |
| TCV | oneTimeTotal + (MRR × termMonths) |
| Tax Amount | taxableAmount × rate |
| Base Amount | total / exchangeRate |

---

## Quick Reference: Status Flows

### Quote Status
```
DRAFT → PENDING → PENDING_APPROVAL → APPROVED → ACCEPTED → FINALIZED
                           ↓
                       REJECTED → DRAFT (revise)
```

### Contract Status
```
DRAFT → ACTIVE → EXPIRED
```

---

## Quick Reference: Priority Guidelines

| Range | Use For |
|-------|---------|
| 1-20 | Critical configuration rules |
| 21-50 | Standard configuration rules |
| 51-80 | Pricing adjustments |
| 81-100 | Approval rules |

Lower number = higher priority (evaluated first).
