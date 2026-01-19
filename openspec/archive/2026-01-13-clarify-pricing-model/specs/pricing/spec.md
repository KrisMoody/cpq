## ADDED Requirements

### Requirement: Pricing Model Documentation
The system SHALL implement and document a clear pricing calculation model with the following formulas:

**Line Item Pricing:**
- `unitPrice` = applicable tier price if quantity matches a tier, otherwise `listPrice`
- `lineTotal` = `unitPrice` × `quantity`
- `lineDiscountAmount` = sum of discounts applied to this line item
- `netPrice` = `lineTotal` - `lineDiscountAmount`

**Quote Pricing:**
- `subtotal` = sum of all line item `netPrice` values
- `quoteDiscountAmount` = sum of quote-level applied discounts
- `discountTotal` = sum of all applied discounts (line + quote level)
- `total` = `subtotal` - `quoteDiscountAmount` + `taxAmount`

#### Scenario: Calculate line item with base price
- **WHEN** a product has no price tiers
- **AND** the product's listPrice is $100
- **AND** quantity is 5
- **AND** no discounts are applied
- **THEN** unitPrice = $100
- **AND** netPrice = $500

#### Scenario: Calculate line item with tier pricing
- **WHEN** a product has a tier: qty 10-50 at $80/unit
- **AND** quantity is 25
- **AND** no discounts are applied
- **THEN** unitPrice = $80 (tier price)
- **AND** netPrice = $2000

#### Scenario: Calculate quote total
- **WHEN** quote has line items with netPrices: $500, $2000, $300
- **AND** a quote-level discount of $100 is applied
- **THEN** subtotal = $2800
- **AND** discountTotal includes the $100 quote discount
- **AND** total = $2700 (before tax)

### Requirement: Bundle Pricing Strategy
The system SHALL calculate bundle prices as the sum of selected component prices. The bundle product itself SHALL NOT contribute to the price.

**Bundle Pricing Formula:**
- Bundle line item `netPrice` = 0 (or not included in sum)
- Total bundle cost = sum of child line item `netPrice` values

#### Scenario: Price a configured bundle
- **WHEN** a bundle product is added to a quote
- **AND** components selected: Monitor ($300), Keyboard ($80), Mouse ($30)
- **THEN** the bundle parent line item's netPrice = $0
- **AND** three child line items are created with respective prices
- **AND** quote subtotal includes $410 for this bundle

#### Scenario: Empty bundle has no cost
- **WHEN** a bundle with no required components is added
- **AND** no options are selected
- **THEN** the bundle contributes $0 to the quote subtotal

### Requirement: Discount Application Order
The system SHALL apply discounts in the following order and precedence:

1. **Line-level discounts first:**
   - Apply stackable discounts in priority order (lower number = higher priority)
   - Calculate best non-stackable discount
   - Use whichever is greater: total stackable or best non-stackable

2. **Quote-level discounts second:**
   - Apply stackable quote discounts to remaining subtotal
   - Calculate best non-stackable quote discount
   - Use whichever is greater: total stackable or best non-stackable

3. **Discount scopes:**
   - `LINE_ITEM`: Applies to specific line items
   - `PRODUCT_CATEGORY`: Applies to line items with products in the specified category
   - `QUOTE`: Applies to the quote subtotal

#### Scenario: Stackable line discounts accumulate
- **WHEN** a line item has listPrice $100, quantity 1
- **AND** two stackable discounts apply: 10% and 5%
- **THEN** first discount: $10 (10% of $100)
- **AND** second discount: $4.50 (5% of $90)
- **AND** netPrice = $85.50

#### Scenario: Non-stackable beats stackable when larger
- **WHEN** a line item has listPrice $100
- **AND** stackable discounts total $12
- **AND** a non-stackable 15% discount applies ($15)
- **THEN** only the non-stackable discount is applied
- **AND** netPrice = $85

#### Scenario: Stackable beats non-stackable when larger
- **WHEN** a line item has listPrice $100
- **AND** stackable discounts total $20
- **AND** a non-stackable 10% discount applies ($10)
- **THEN** only the stackable discounts are applied
- **AND** netPrice = $80

### Requirement: Price Breakdown UI
The system SHALL display a clear breakdown of how each price was calculated.

**Line Item Display:**
- Show unit price (with tier indicator if applicable)
- Show quantity
- Show line total before discounts
- Show applied discounts with names and amounts
- Show net price after discounts

**Quote Summary Display:**
- Show subtotal (sum of line net prices)
- List each applied discount with name, type, and amount
- Show discount total
- Show tax (if applicable)
- Show final total

#### Scenario: View line item price breakdown
- **WHEN** viewing a line item in the quote editor
- **THEN** display: "Unit Price: $80 (Tier: 10-50)"
- **AND** display: "Quantity: 25"
- **AND** display: "Line Total: $2,000"
- **AND** display: "Discount: -$200 (10% Volume Discount)"
- **AND** display: "Net Price: $1,800"

#### Scenario: View quote summary with discounts
- **WHEN** viewing the quote summary
- **AND** multiple discounts are applied
- **THEN** display subtotal
- **AND** list each discount: "Summer Sale (10%): -$280"
- **AND** display discount total
- **AND** display final total

