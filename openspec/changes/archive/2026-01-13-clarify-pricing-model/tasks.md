## 1. Database Schema Updates
- [x] 1.1 Remove `Quote.discount` field from Prisma schema
- [x] 1.2 Run database migration
- [x] 1.3 Update any code references to `quote.discount` to use `discountTotal`

## 2. Pricing Engine Updates
- [x] 2.1 Integrate `lookupPrice()` into `calculateLinePrice()` for tier support
- [x] 2.2 Update `calculateLinePrice()` return type to include tier info
- [x] 2.3 Add unit tests for tier-based pricing calculations

## 3. Bundle Pricing Clarification
- [x] 3.1 Update `addProductToQuote()` to set bundle parent `netPrice` to 0
- [x] 3.2 Update quote total calculation to skip bundle parent prices
- [x] 3.3 Add tests for bundle pricing (empty bundle, configured bundle)

## 4. UI - Line Item Price Breakdown
- [x] 4.1 Update `QuoteLineItem.vue` to show unit price with tier indicator
- [x] 4.2 Add expandable section showing discount breakdown per line
- [x] 4.3 Show "line total" vs "net price" (before/after discounts)

## 5. UI - Quote Summary Improvements
- [x] 5.1 Update `PricingSummary.vue` to list discounts with names
- [x] 5.2 Add tooltips explaining subtotal, discounts, total calculations
- [x] 5.3 Show savings percentage based on discounts applied

## 6. Documentation
- [x] 6.1 Add inline code comments explaining pricing formulas
- [x] 6.2 Update any existing API documentation
