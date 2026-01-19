# subscriptions Specification Delta

## MODIFIED Requirements

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
