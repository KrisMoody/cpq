## ADDED Requirements

### Requirement: Historical Quote Data for AI Context
The system SHALL include historical quote data that enables the AI to learn customer and product patterns.

#### Scenario: Customer segment patterns
- **WHEN** the AI analyzes a quote for an enterprise customer
- **THEN** historical data shows enterprise customers typically have larger deals with higher discounts
- **AND** the AI can reference similar historical quotes for recommendations

#### Scenario: Product affinity patterns
- **WHEN** the AI analyzes a quote containing specific products
- **THEN** historical data shows which products are commonly purchased together
- **AND** the AI can recommend cross-sell items based on purchase patterns

#### Scenario: Discount success patterns
- **WHEN** the AI recommends discount levels
- **THEN** historical data shows what discount percentages led to accepted vs rejected quotes
- **AND** the AI can suggest discount levels likely to close deals

### Requirement: Quote Status Distribution
The seed data SHALL include a realistic distribution of quote outcomes to enable AI learning.

#### Scenario: Accepted quote patterns
- **WHEN** the AI queries accepted quotes
- **THEN** approximately 60% of historical quotes show ACCEPTED status
- **AND** patterns emerge around successful pricing and product combinations

#### Scenario: Rejected quote patterns
- **WHEN** the AI queries rejected quotes
- **THEN** approximately 20% of historical quotes show REJECTED status
- **AND** patterns indicate price sensitivity or product mismatch

#### Scenario: Finalized and cancelled patterns
- **WHEN** the AI queries all quote statuses
- **THEN** approximately 15% show FINALIZED and 5% show CANCELLED
- **AND** the full quote lifecycle is represented

### Requirement: Deal Size Variety
The seed data SHALL include quotes across different deal sizes to support AI recommendations for various contexts.

#### Scenario: Small deal analysis
- **WHEN** a quote totals less than $1,000
- **THEN** historical small deals provide relevant comparison data
- **AND** the AI can make size-appropriate recommendations

#### Scenario: Medium deal analysis
- **WHEN** a quote totals between $1,000 and $5,000
- **THEN** historical medium deals provide relevant comparison data
- **AND** the AI can reference similar-sized successful deals

#### Scenario: Large deal analysis
- **WHEN** a quote totals more than $5,000
- **THEN** historical large deals provide relevant comparison data
- **AND** the AI can recommend strategies used in similar enterprise deals
