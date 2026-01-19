# Proposal: Enhance UI Pricing Features

## Change ID
`enhance-ui-pricing-features`

## Summary
Add missing UI elements for taxes, discounts, rules, units, and pricebooks across Quotes, Customers, and Contracts pages to ensure consistent availability and usability of pricing-related features.

## Problem Statement
A thorough analysis of the CPQ UI reveals several gaps in feature availability:

### Taxes
1. **Product `isTaxable` field not exposed in UI** - The schema has `isTaxable` on products (default true), but neither the product creation nor edit pages expose this setting. Users cannot mark products as non-taxable (e.g., services, digital goods in some jurisdictions).

2. **Tax rate preview missing in quote editor** - While tax breakdown appears in the pricing summary, users cannot see which tax rates will apply before calculating. This makes it hard to understand the tax impact upfront.

3. **No category-specific tax indication on products** - Tax rates can be category-specific, but products don't show if they fall under a special tax category.

### Discounts
4. **Discount scope PRODUCT_CATEGORY not fully usable** - The schema supports `PRODUCT_CATEGORY` discount scope with a `categoryId` field, but the discount create/edit UI only shows LINE_ITEM and QUOTE scopes.

5. **Line-item discount visibility in quote line items** - Quote line items don't show their individual applied discounts inline; users must check the separate discounts card.

### Rules
6. **No rule preview before quote calculation** - Users can only see rule evaluation after clicking "Recalculate Pricing". A pre-calculation rule indicator would help users understand what rules might trigger.

### Units
7. **Unit display inconsistent in quotes** - Quote line items don't consistently show the unit of measure (e.g., "10 hrs @ $50/hr"). The unit appears on product detail but is lost in quote context.

### Pricebooks
8. **No price book indicator in quote line items** - When viewing a quote, users can't see which price book is providing the pricing. The price book is shown at quote level but not contextually on line items.

9. **No price comparison when customer has contract** - When a contract overrides pricing, users see the contract price but not the standard price book price for comparison.

### Contracts
10. **Contract price entry lacks original price reference** - When adding custom contract prices, users must know the standard price; there's no inline display of the current price book price.

11. **No contract pricing indicator in customer contracts list** - The customer detail page shows contracts but doesn't indicate the pricing impact (e.g., "15% discount + 3 custom prices").

### Cross-Feature Relationships
12. **Customer tax exemption not visible in quote creation** - When creating a quote for a customer, there's no immediate indication that the customer is tax-exempt until the quote is calculated.

13. **No price book currency mismatch warning** - If a customer has a currency preference different from their assigned price book's currency, there's no warning.

## Proposed Solution
Enhance the UI across multiple pages to surface existing functionality and improve the user experience around pricing features.

### Phase 1: Core Tax & Discount Visibility (High Priority)
- Add `isTaxable` toggle to product create/edit pages
- Add PRODUCT_CATEGORY scope option to discount create/edit with category selector
- Show inline applied discounts on quote line items
- Show customer tax exemption badge in quote customer card

### Phase 2: Quote Context Improvements (Medium Priority)
- Add unit of measure display to quote line items
- Add price source indicator (price book vs contract) on line items
- Show original price vs contract price comparison when applicable
- Add pre-calculation tax rate preview based on customer jurisdiction

### Phase 3: Contract & Customer Enhancements (Lower Priority)
- Show standard price reference when adding contract price entries
- Enhance customer contract list with pricing impact summary
- Add currency mismatch warning for customer/price book combinations

## Impact Assessment
- **Scope**: UI-only changes, no schema modifications needed
- **Risk**: Low - enhances existing functionality
- **Effort**: Medium - multiple UI components across several pages
- **Value**: High - surfaces hidden capabilities, improves usability

## Success Criteria
- All existing pricing features are accessible through the UI
- Users can see pricing context (source, discounts, taxes) at a glance
- No functionality regression in existing features
