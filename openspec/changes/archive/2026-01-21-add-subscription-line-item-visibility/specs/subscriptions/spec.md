# subscriptions Spec Delta

## MODIFIED Requirements

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
