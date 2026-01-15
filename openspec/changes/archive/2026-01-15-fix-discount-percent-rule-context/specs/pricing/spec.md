# pricing Spec Delta

## ADDED Requirements

### Requirement: Discount Metrics in Rule Evaluation Context

The system SHALL include discount metrics in the rule evaluation context when calculating quotes, following enterprise CPQ patterns for discount-based approval rules.

**Line-Item Discount Percentage:**
- `lineDiscountPercent` = (discount / (listPrice × quantity)) × 100, or 0 if listPrice × quantity is 0

**Quote-Level Metrics:**
- `grossSubtotal` = sum of (listPrice × quantity) for all line items (before discounts)
- `maxLineDiscountPercent` = maximum `lineDiscountPercent` across all line items, or 0 if no line items
- `discountPercent` = ((grossSubtotal - total) / grossSubtotal) × 100, or 0 if grossSubtotal is 0

#### Scenario: Single line with 100% discount triggers approval
- **GIVEN** a rule exists: "IF quote.maxLineDiscountPercent > 25 THEN REQUIRE_APPROVAL"
- **WHEN** a quote has one line item with listPrice $100, quantity 1
- **AND** a 100% discount is applied to that line (discount = $100)
- **THEN** lineDiscountPercent for that line = 100
- **AND** maxLineDiscountPercent = 100
- **AND** the approval rule is triggered

#### Scenario: Multiple lines uses maximum discount
- **GIVEN** a rule checks `quote.maxLineDiscountPercent > 25`
- **WHEN** a quote has two line items:
  - Line 1: listPrice $100, quantity 1, discount $10 (10%)
  - Line 2: listPrice $200, quantity 1, discount $60 (30%)
- **THEN** maxLineDiscountPercent = 30
- **AND** the approval rule is triggered

#### Scenario: Aggregate discount percent calculation
- **GIVEN** a quote with:
  - Line 1: listPrice $100, quantity 1, discount $10, netPrice $90
  - Line 2: listPrice $200, quantity 1, discount $60, netPrice $140
- **AND** a quote-level discount of $23
- **THEN** grossSubtotal = $300
- **AND** total = $207 (90 + 140 - 23)
- **AND** discountPercent = 31 ((300 - 207) / 300 × 100)

#### Scenario: Zero gross subtotal handles gracefully
- **WHEN** a quote has no line items
- **THEN** maxLineDiscountPercent = 0
- **AND** discountPercent = 0 (not NaN or error)

#### Scenario: Line with zero list price
- **WHEN** a line item has listPrice $0 (e.g., free item)
- **THEN** lineDiscountPercent for that line = 0
- **AND** it does not affect maxLineDiscountPercent calculation for other lines

#### Scenario: Aggregate discount triggers separate approval rule
- **GIVEN** two rules exist:
  - "IF quote.maxLineDiscountPercent > 25 THEN REQUIRE_APPROVAL" (sales director)
  - "IF quote.discountPercent > 40 THEN REQUIRE_APPROVAL" (finance)
- **WHEN** a quote has three line items each with 20% discount
- **AND** a 10% quote-level discount is applied
- **THEN** maxLineDiscountPercent = 20 (no single line exceeds 25%)
- **AND** discountPercent ≈ 28 (combined effect)
- **AND** neither approval rule is triggered
- **WHEN** the quote-level discount is increased to 30%
- **THEN** discountPercent ≈ 44
- **AND** the finance approval rule is triggered
