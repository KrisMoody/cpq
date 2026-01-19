# Change: Update Learn Page with New CPQ Entities

## Why

The database schema has been significantly expanded with new models for Customers, Rules, Discounts, and Pricing Tiers. The Learn page glossary, ER diagram, hierarchy visualization, and quick tips currently only cover the original CPQ concepts and don't explain these new entities. Users need documentation and visual aids to understand how these new features fit into the CPQ workflow.

## What Changes

### Glossary Additions

Add new glossary terms organized into expanded groups:

**Customer Group (NEW):**
- Customer - Customer records with contact info and price book assignment

**Pricing Group (EXPANDED):**
- Price Tier - Volume-based pricing tiers within price book entries

**Rules Group (NEW):**
- Rule - Business rules for configuration and pricing automation
- Rule Type - Configuration vs Pricing rules
- Rule Trigger - Events that activate rules (ON_PRODUCT_ADD, ON_QUANTITY_CHANGE, etc.)

**Discount Group (NEW):**
- Discount - Reusable discount definitions (percentage or fixed amount)
- Discount Type - Percentage vs Fixed Amount discounts
- Discount Scope - Line item, quote, or product category level
- Discount Tier - Volume-based discount tiers
- Applied Discount - Instance of a discount applied to a quote or line item

### ER Diagram Updates

- Add Customer entity connected to Quote (1:N) and PriceBook (N:1)
- Add Rule entity (standalone, no direct relationships)
- Add Discount entity with DiscountTier (1:N)
- Add AppliedDiscount connecting Quote/QuoteLineItem to Discount
- Add PriceTier connecting to PriceBookEntry (1:N)
- Create new visual groups: "Customer", "Rules & Discounts"

### Hierarchy Tree Updates

- Add Customer hierarchy section
- Add Rules hierarchy: Rule → (Condition, Action)
- Add Discounts hierarchy: Discount → DiscountTier, Quote → AppliedDiscount
- Add Pricing Tiers: PriceBookEntry → PriceTier

### Quick Tips Updates

Add tips for:
- Working with Customers (assigning to quotes, customer-specific pricing)
- Understanding Rules (configuration vs pricing rules, trigger events)
- Applying Discounts (types, scopes, stacking behavior)
- Volume Pricing (price tiers, quantity breaks)

## Impact

- **Affected specs**: learning-ui (MODIFIED)
- **Affected code**:
  - `app/pages/learn.vue` - Add new glossary terms and group
  - `app/components/LearnEntityDiagram.vue` - Add new entities and relationships
  - `app/components/LearnEntityHierarchy.vue` - Add new hierarchy sections
- **No database changes** - This is a documentation/UI-only change
