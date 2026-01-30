## MODIFIED Requirements

### Requirement: Pricing Model Documentation
The system SHALL implement and document a clear pricing calculation model with the following formulas:

**Line Item Pricing:**
- `unitPrice` = applicable tier price if quantity matches a tier, otherwise `listPrice`
- `lineTotal` = `unitPrice` × `quantity` (except for GRADUATED tier type, see below)
- `lineDiscountAmount` = sum of discounts applied to this line item
- `netPrice` = `lineTotal` - `lineDiscountAmount`

**Tier Type Calculations:**
- `UNIT_PRICE` (Slab): All units priced at the tier's `tierPrice`
- `FLAT_PRICE` (Stairstep): Fixed `tierPrice` for any quantity in the range
- `GRADUATED`: Each quantity portion priced at its respective tier rate, summed together
- `VOLUME_DISCOUNT_PERCENT`: List price reduced by tier's `discountPercent`

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

#### Scenario: Calculate line item with graduated pricing
- **WHEN** a product has GRADUATED tier pricing:
  - Tier 1: qty 1-100 at $0.10/unit
  - Tier 2: qty 101-1000 at $0.08/unit
  - Tier 3: qty 1001-5000 at $0.06/unit
- **AND** quantity is 2500
- **THEN** lineTotal = (100 × $0.10) + (900 × $0.08) + (1500 × $0.06) = $10 + $72 + $90 = $172
- **AND** unitPrice (effective) = $172 / 2500 = $0.0688

#### Scenario: Calculate line item with volume discount percentage
- **WHEN** a product has VOLUME_DISCOUNT_PERCENT tier pricing:
  - Tier 1: qty 1-5 at 0% discount
  - Tier 2: qty 6-20 at 10% discount
  - Tier 3: qty 21-50 at 20% discount
- **AND** listPrice is $100
- **AND** quantity is 25
- **THEN** discountPercent = 20%
- **AND** unitPrice = $100 × (1 - 0.20) = $80
- **AND** netPrice = $80 × 25 = $2000

## ADDED Requirements

### Requirement: Graduated Tier Pricing
The system SHALL support graduated (incremental) tier pricing where different portions of the quantity are priced at different rates.

**Calculation:**
- Each tier applies only to the quantity portion within its range
- Total price = sum of (tier quantity × tier price) for all applicable tiers
- Effective unit price = total price / quantity

#### Scenario: Graduated pricing like tax brackets
- **WHEN** a price entry has GRADUATED tier type
- **AND** tiers are: 1-10 @ $10, 11-50 @ $8, 51+ @ $6
- **AND** quantity is 75
- **THEN** total = (10 × $10) + (40 × $8) + (25 × $6) = $100 + $320 + $150 = $570

#### Scenario: Graduated pricing with single tier
- **WHEN** a price entry has GRADUATED tier type
- **AND** only one tier exists: 1-100 @ $5
- **AND** quantity is 50
- **THEN** total = 50 × $5 = $250

#### Scenario: Graduated pricing requires contiguous tiers
- **WHEN** creating GRADUATED tiers
- **THEN** tiers MUST start from quantity 1
- **AND** tiers MUST be contiguous (no gaps between maxQuantity and next minQuantity)

### Requirement: Volume Discount Percentage Tier Pricing
The system SHALL support volume discount percentage pricing where a percentage discount from list price increases based on quantity.

**Calculation:**
- Find the applicable tier based on quantity
- Apply the tier's `discountPercent` to the list price
- Unit price = listPrice × (1 - discountPercent / 100)

#### Scenario: Volume discount percentage applied
- **WHEN** a price entry has VOLUME_DISCOUNT_PERCENT tier type
- **AND** listPrice is $100
- **AND** tier for qty 10-50 has discountPercent = 15
- **AND** quantity is 25
- **THEN** unitPrice = $100 × 0.85 = $85
- **AND** lineTotal = $85 × 25 = $2,125

#### Scenario: No discount in first tier
- **WHEN** a price entry has VOLUME_DISCOUNT_PERCENT tier type
- **AND** tier for qty 1-5 has discountPercent = 0
- **AND** quantity is 3
- **THEN** unitPrice = listPrice (no discount applied)

### Requirement: Tier Type Consistency Validation
The system SHALL enforce that all tiers within a single price book entry use the same tier type.

#### Scenario: Reject mixed tier types
- **WHEN** a price entry has tiers with UNIT_PRICE type
- **AND** user attempts to add a tier with GRADUATED type
- **THEN** the system rejects the operation with an error message

#### Scenario: Allow changing tier type when empty
- **WHEN** a price entry has no tiers
- **AND** user adds a tier with any tier type
- **THEN** the system accepts the tier
