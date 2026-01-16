# Design: Enhance UI Pricing Features

## Architecture Overview

This change involves UI enhancements across multiple pages without modifying the backend or schema. All data already exists; we are improving its visibility and accessibility.

## Component-Level Design

### 1. Product Pages - Tax Configuration

**Files to modify:**
- `app/pages/products/[id].vue` - Add `isTaxable` checkbox to edit form
- `app/pages/products/new.vue` - Add `isTaxable` checkbox to create form
- `app/composables/useProducts.ts` - Ensure `isTaxable` is included in create/update payloads

**UI Design:**
```
Product Information
├── Name: [____________]
├── SKU:  [____________]
├── Type: [Standalone ▼]
├── ...existing fields...
├── [x] Active
└── [x] Taxable          <-- NEW: default checked
```

**Note:** Add hint text: "Uncheck for products exempt from sales tax (e.g., some services, digital goods)"

### 2. Discount Management - Category Scope

**Files to modify:**
- `app/pages/discounts/[id].vue` - Add PRODUCT_CATEGORY scope option and category selector
- `app/pages/discounts/new.vue` - Same changes

**UI Design:**
```
Scope: [Line Item ▼]
       ├─ Line Item
       ├─ Quote Total
       └─ Product Category  <-- NEW

[When Product Category selected:]
Category: [Electronics ▼]  <-- NEW: category selector appears
```

**Behavior:**
- When scope is PRODUCT_CATEGORY, show category dropdown (required)
- Category dropdown populated from existing `useCategories` composable

### 3. Quote Line Items - Discount & Unit Display

**Files to modify:**
- `app/components/cpq/QuoteLineItem.vue` - Enhance to show applied discounts and unit

**Current display:**
```
Product Name      Qty    List Price    Net Price    [Actions]
Widget Pro        5      $100.00       $450.00      [x]
```

**Enhanced display:**
```
Product Name      Qty       Unit Price    Net Price    [Actions]
Widget Pro        5 ea      $100.00/ea    $450.00      [x]
                  ↳ 10% Volume Discount: -$50.00  <-- NEW: inline discount
```

**Data source:** Line items already have `appliedDiscounts` array from the API

### 4. Quote Customer Card - Tax Exemption Visibility

**Files to modify:**
- `app/components/cpq/QuoteCustomerCard.vue` - Add tax exemption indicator

**Current:**
```
Customer
Acme Corp
Price Book: Standard Pricing
```

**Enhanced:**
```
Customer
Acme Corp
Price Book: Standard Pricing
[Tax Exempt] (expires: Jan 2027)  <-- NEW: badge with optional expiry
```

**Behavior:**
- Only show if customer.isTaxExempt is true
- Use warning color if exemption has expired

### 5. Quote Line Items - Price Source Indicator

**Files to modify:**
- `app/components/cpq/QuoteLineItem.vue` - Add price source badge

**Design:**
```
Product Name      Qty     Unit Price        Net Price
Widget Pro        5       $90.00/ea         $450.00
                          [Contract Price]   <-- NEW: badge when contract pricing
                          (was $100.00)      <-- NEW: original price reference
```

**Data source:** The evaluation summary from `calculateQuote` already returns `contractPricing.lineItems[lineId]` with contract details

### 6. Contract Price Entry - Standard Price Reference

**Files to modify:**
- `app/pages/contracts/[id].vue` - Show list price when adding contract price entry

**Current:**
```
Add Custom Price
Product: [Widget Pro ▼]
Fixed Price: [___________]
```

**Enhanced:**
```
Add Custom Price
Product: [Widget Pro ▼]
         Standard price: $100.00  <-- NEW: show current price book price
Fixed Price: [___________]
         Discount: 10% ($10.00)   <-- NEW: calculated discount vs standard
```

**Implementation:** When product is selected, fetch its price from the customer's price book (or default)

### 7. Discount Scope Implementation Details

**Backend note:** The schema already supports this:
```prisma
model Discount {
  scope       DiscountScope  @default(LINE_ITEM)
  categoryId  String?        // For PRODUCT_CATEGORY scope
  category    Category?      @relation(...)
}
```

The API already accepts categoryId. We just need to expose it in the UI.

## Data Flow Considerations

### Tax Exemption in Quote Context

```
Quote Editor
    ↓ loads quote with customer
    ↓ customer has isTaxExempt, taxExemptExpiry
    ↓ QuoteCustomerCard reads customer.isTaxExempt
    ↓ Shows badge if true, warning if expired
```

### Contract Pricing Indicator

```
Quote Calculation API
    ↓ returns evaluation.contractPricing
    ↓ evaluation.contractPricing.lineItems[lineId] = {
        contractName, originalPrice, contractPrice
      }
    ↓ QuoteLineItem receives contract-info prop
    ↓ Shows badge and price comparison
```

Note: The quote editor already passes `contractInfo` to line items; we just need to enhance the display.

## Not Included in This Change

1. **Real-time tax rate lookup** - Would require API calls during quote editing; deferred
2. **Currency conversion display** - Complex feature requiring exchange rates; deferred
3. **Rule pre-evaluation** - Would require significant backend changes; deferred
4. **Audit trail for price changes** - Requires schema changes; separate proposal

## Testing Strategy

- Visual testing: Verify new elements appear correctly
- Functional testing: Ensure isTaxable updates propagate to tax calculation
- Regression testing: Existing quote flows work unchanged
- Edge cases: Expired exemptions, missing contracts, null categories
