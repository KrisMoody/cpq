# discounts Specification

## Purpose
TBD - created by archiving change enhance-ui-pricing-features. Update Purpose after archive.
## Requirements
### Requirement: Inline Discount Display on Quote Line Items
The system SHALL display applied discounts directly on quote line items for better visibility.

#### Scenario: View line-level discounts inline
- **WHEN** viewing a quote with line-level discounts applied
- **THEN** each line item shows its applied discounts below the main line
- **AND** discounts are formatted as "↳ {discount name}: -{amount}"
- **AND** multiple discounts are listed separately

#### Scenario: No discounts on line item
- **WHEN** viewing a line item with no applied discounts
- **THEN** no discount row is shown below the line item
- **AND** only the standard line item display appears

#### Scenario: Manual discount display
- **WHEN** a manual discount is applied to a line item
- **THEN** the discount shows "↳ Manual Discount: -{amount}"
- **AND** the reason (if provided) is shown in a tooltip

