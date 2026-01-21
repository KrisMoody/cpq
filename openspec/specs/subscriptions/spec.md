# subscriptions Specification

## Purpose
TBD - created by archiving change add-subscriptions. Update Purpose after archive.
## Requirements
### Requirement: Product Billing Frequency
The system SHALL support different billing frequencies for products.

#### Scenario: Set billing frequency
- **WHEN** user creates or edits a product
- **THEN** user can select billing frequency: ONE_TIME, MONTHLY, QUARTERLY, ANNUAL, CUSTOM
- **AND** default is ONE_TIME for backwards compatibility

#### Scenario: Custom billing period
- **WHEN** billing frequency is CUSTOM
- **THEN** user specifies billing period in months (e.g., 18 months)

### Requirement: Subscription Term
The system SHALL support defining contract/subscription terms.

#### Scenario: Set term duration
- **WHEN** product has recurring billing
- **THEN** user can specify default term length (e.g., 12 months, 24 months)
- **AND** term can be overridden per line item

#### Scenario: Term on line item
- **WHEN** adding subscription product to quote
- **THEN** line item includes term duration
- **AND** user can adjust term for specific line item

### Requirement: Recurring Revenue Calculations
The system SHALL calculate recurring and one-time revenue separately.

#### Scenario: Split totals
- **WHEN** quote contains both one-time and recurring products
- **THEN** quote summary shows separate totals:
  - One-Time Total
  - Monthly Recurring (MRR)
  - Annual Recurring (ARR) or Total Contract Value

#### Scenario: MRR calculation
- **WHEN** calculating MRR
- **THEN** annual products are divided by 12
- **AND** quarterly products are divided by 3
- **AND** monthly products use direct price

#### Scenario: Total Contract Value
- **WHEN** subscription products have defined terms
- **THEN** Total Contract Value = MRR * term months
- **AND** this is displayed alongside recurring totals

#### Scenario: Calculate on recalculate action
- **WHEN** user clicks "Recalculate Pricing" on a quote
- **THEN** the system calculates and persists oneTimeTotal, mrr, arr, and tcv
- **AND** these values are returned in the API response
- **AND** the Quote Summary displays the recurring revenue section

### Requirement: Quote Line Item Recurring Display
The system SHALL clearly display recurring pricing on line items with specific UI elements.

#### Scenario: Recurring line item display
- **WHEN** line item is for a recurring product
- **THEN** display shows billing frequency badge (e.g., "Monthly", "Annual")
- **AND** unit price column shows frequency suffix (e.g., "$100.00/mo", "$1,200.00/yr")
- **AND** a Term column shows contract term (e.g., "12 mo", "36 mo")
- **AND** term displays line item override if set, otherwise product default

#### Scenario: One-time vs recurring distinction
- **WHEN** viewing quote line items
- **THEN** one-time items show no frequency badge or show "One-Time" badge
- **AND** one-time items show no frequency suffix on price
- **AND** one-time items show "-" in Term column

#### Scenario: Bundle with mixed billing frequencies
- **WHEN** a bundle contains products with different billing frequencies
- **THEN** each child line item displays its own billing frequency badge
- **AND** each child line item displays its own price suffix and term

#### Scenario: Custom billing period display
- **WHEN** product has CUSTOM billing frequency
- **THEN** badge shows the custom period (e.g., "18 mo")
- **AND** price suffix shows "/18mo"

### Requirement: Pro-Rated Pricing
The system SHALL support pro-rated pricing for partial periods.

#### Scenario: Mid-month start
- **WHEN** subscription starts mid-billing-period
- **THEN** first period can be pro-rated
- **AND** pro-rated amount is calculated based on days remaining

#### Scenario: Pro-ration toggle
- **WHEN** adding subscription to quote
- **THEN** user can enable/disable pro-ration for first period
- **AND** pro-rated amount is shown separately

### Requirement: Renewal Quotes
The system SHALL support creating renewal quotes for subscriptions.

#### Scenario: Generate renewal
- **WHEN** user generates renewal for expiring subscription
- **THEN** a new quote is created with same products
- **AND** new term dates are calculated
- **AND** pricing is refreshed from current price book

