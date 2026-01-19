## ADDED Requirements

### Requirement: Rule Entity
The system SHALL store business rules with the following attributes:
- Unique identifier (CUID)
- Name (required)
- Description (optional)
- Type: CONFIGURATION or PRICING (required)
- Trigger event: ON_PRODUCT_ADD, ON_QUANTITY_CHANGE, ON_QUOTE_SAVE, ON_FINALIZE (required)
- Priority (integer, lower = higher priority, default 100)
- Active status (boolean, default true)
- Condition expression (JSON, defines when rule applies)
- Action expression (JSON, defines what rule does)
- Creation and update timestamps

#### Scenario: Create configuration rule
- **WHEN** a rule is created with type CONFIGURATION
- **THEN** the rule is stored to enforce product/option constraints
- **AND** condition and action expressions are validated as valid JSON

#### Scenario: Create pricing rule
- **WHEN** a rule is created with type PRICING
- **THEN** the rule is stored to modify pricing calculations
- **AND** condition and action expressions are validated as valid JSON

#### Scenario: Rule priority ordering
- **WHEN** multiple rules match a trigger event
- **THEN** rules are evaluated in priority order (lowest number first)

### Requirement: Configuration Rule Actions
The system SHALL support the following configuration rule actions:
- REQUIRE_OPTION: Force selection of a specific option when condition met
- EXCLUDE_OPTION: Prevent selection of a specific option when condition met
- REQUIRE_PRODUCT: Force addition of a product when condition met
- EXCLUDE_PRODUCT: Prevent addition of a product when condition met
- SHOW_WARNING: Display a warning message without blocking

#### Scenario: Require option rule
- **WHEN** a rule with action REQUIRE_OPTION is triggered
- **AND** the condition evaluates to true
- **THEN** the specified option MUST be selected or validation fails

#### Scenario: Exclude option rule
- **WHEN** a rule with action EXCLUDE_OPTION is triggered
- **AND** the condition evaluates to true
- **THEN** the specified option MUST NOT be selected or validation fails

#### Scenario: Show warning rule
- **WHEN** a rule with action SHOW_WARNING is triggered
- **AND** the condition evaluates to true
- **THEN** display the warning message but allow the action to proceed

### Requirement: Pricing Rule Actions
The system SHALL support the following pricing rule actions:
- APPLY_DISCOUNT: Apply a discount (percentage or fixed) to matching items
- APPLY_MARKUP: Apply a markup (percentage or fixed) to matching items
- SET_PRICE: Override price to a specific value
- REQUIRE_APPROVAL: Flag quote for approval when threshold exceeded

#### Scenario: Apply discount rule
- **WHEN** a rule with action APPLY_DISCOUNT is triggered
- **AND** the condition evaluates to true (e.g., quantity >= 10)
- **THEN** apply the specified discount to matching line items

#### Scenario: Require approval rule
- **WHEN** a rule with action REQUIRE_APPROVAL is triggered
- **AND** the condition evaluates to true (e.g., discount > 20%)
- **THEN** set quote approval flag and prevent finalization without approval

### Requirement: Rule Condition Expressions
The system SHALL support condition expressions with the following operators:
- Comparison: equals, notEquals, greaterThan, lessThan, greaterOrEqual, lessOrEqual
- Logical: and, or, not
- Context fields: productId, productSku, quantity, lineTotal, quoteTotal, customerId, optionId

#### Scenario: Simple quantity condition
- **WHEN** a condition checks `quantity greaterOrEqual 10`
- **AND** line item quantity is 15
- **THEN** condition evaluates to true

#### Scenario: Compound condition
- **WHEN** a condition checks `productSku equals "LAPTOP-PRO" AND quantity greaterOrEqual 5`
- **AND** both sub-conditions are true
- **THEN** condition evaluates to true

### Requirement: Rule Evaluation Service
The system SHALL provide a rule evaluation service that:
- Evaluates all active rules for a given trigger event
- Processes rules in priority order
- Aggregates results (errors, warnings, applied actions)
- Returns evaluation result with pass/fail status and messages

#### Scenario: Evaluate rules on product add
- **WHEN** a product is added to a quote
- **THEN** evaluate all rules with trigger ON_PRODUCT_ADD
- **AND** return combined result of all matching rules

#### Scenario: Evaluate rules on quote save
- **WHEN** a quote is saved
- **THEN** evaluate all rules with trigger ON_QUOTE_SAVE
- **AND** apply pricing rule actions to recalculate totals

#### Scenario: Rule evaluation with no matching rules
- **WHEN** rules are evaluated and no conditions match
- **THEN** return success result with no actions applied

### Requirement: Rules API
The system SHALL provide REST API endpoints for rule management:
- `GET /api/rules` - List all rules
- `GET /api/rules/:id` - Get rule details
- `POST /api/rules` - Create a new rule
- `PUT /api/rules/:id` - Update rule
- `DELETE /api/rules/:id` - Delete rule
- `POST /api/rules/evaluate` - Evaluate rules for a given context

#### Scenario: List rules with type filter
- **WHEN** GET /api/rules is called with query param `type=PRICING`
- **THEN** return only pricing rules

#### Scenario: Evaluate rules endpoint
- **WHEN** POST /api/rules/evaluate is called with quote context
- **THEN** evaluate all applicable rules and return results

### Requirement: Rules Management Page
The system SHALL provide a rules management page at `/rules` for viewing and managing business rules.

#### Scenario: View rules table
- **WHEN** user navigates to /rules
- **THEN** display a table with columns: Name, Type, Trigger, Priority, Active
- **AND** table supports sorting and filtering by type

#### Scenario: Create rule from UI
- **WHEN** user clicks Create Rule
- **THEN** display form with rule fields and condition/action builders
- **AND** provide guided UI for building condition expressions
