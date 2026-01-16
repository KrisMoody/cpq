# Spec Delta: Contracts UI - Enhanced Price Entry

## ADDED Requirements

### Requirement: Standard Price Reference in Contract Entry Form
The system SHALL show standard pricing when adding contract price entries to help users set appropriate contract prices.

#### Scenario: View standard price when selecting product
- **WHEN** user selects a product in the "Add Custom Price" form
- **THEN** the current list price from the customer's price book is displayed
- **AND** the price is labeled "Standard price: ${amount}"
- **AND** if no price book entry exists, show "No standard price available"

#### Scenario: Calculate discount from contract price
- **WHEN** user enters a fixed price for a product
- **AND** the product has a standard price available
- **THEN** the system calculates and displays the discount/premium
- **AND** shows "Discount: {percent}% (${amount})" for lower prices
- **AND** shows "Premium: {percent}% (${amount})" for higher prices

#### Scenario: Contract price matches standard price
- **WHEN** user enters a contract price equal to the standard price
- **THEN** no discount/premium indicator is shown
- **OR** show "Same as standard price"

### Requirement: Enhanced Contract Summary in Customer View
The system SHALL provide better visibility into contract pricing impact on the customer detail page.

#### Scenario: View contract pricing summary
- **WHEN** viewing contracts in the customer detail page
- **THEN** each contract shows the default discount percentage prominently
- **AND** shows the count of custom product prices (e.g., "3 custom prices")
- **AND** uses visual indicators for discount level (e.g., green badge for significant discounts)

#### Scenario: Active contract indicator
- **WHEN** a customer has multiple contracts
- **THEN** the currently active contract is clearly highlighted
- **AND** expired contracts are shown with muted styling
- **AND** draft contracts are distinguishable from active ones

### Requirement: Currency Consistency Warning
The system SHALL warn users about potential currency mismatches between customer settings and price books.

#### Scenario: Currency mismatch detected
- **WHEN** viewing a customer with a currency preference
- **AND** the customer's assigned price book uses a different currency
- **THEN** a warning alert is displayed
- **AND** the warning explains the potential pricing inconsistency
- **AND** suggests corrective actions (change currency or price book)

#### Scenario: No currency mismatch
- **WHEN** customer currency matches price book currency
- **OR** customer uses default currency (no preference set)
- **OR** customer uses default price book (no assignment)
- **THEN** no currency warning is displayed
