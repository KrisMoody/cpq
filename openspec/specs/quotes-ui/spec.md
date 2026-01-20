# quotes-ui Specification

## Purpose
TBD - created by archiving change enhance-ui-pricing-features. Update Purpose after archive.
## Requirements
### Requirement: Tax Exemption Indicator in Quote Customer Card
The system SHALL display customer tax exemption status prominently in the quote editor.

#### Scenario: Tax-exempt customer assigned to quote
- **WHEN** a quote has a customer assigned
- **AND** the customer has `isTaxExempt = true`
- **THEN** a "Tax Exempt" badge is displayed in the customer card
- **AND** the badge is colored green for active exemption

#### Scenario: Expired tax exemption warning
- **WHEN** a quote has a customer with expired tax exemption
- **THEN** the "Tax Exempt" badge shows "(Expired)" suffix
- **AND** the badge is colored yellow/warning
- **AND** hovering shows the expiry date

#### Scenario: Tax exemption with expiry date
- **WHEN** viewing a quote with tax-exempt customer
- **AND** the exemption has a future expiry date
- **THEN** the badge or tooltip shows "Expires: {date}"

### Requirement: Unit of Measure Display in Quote Line Items
The system SHALL display unit of measure information on quote line items.

#### Scenario: Product with unit of measure
- **WHEN** a product with a unit of measure is added to a quote
- **THEN** the quantity shows with unit abbreviation (e.g., "10 hrs")
- **AND** the unit price shows per-unit rate (e.g., "$50/hr")

#### Scenario: Product without unit of measure
- **WHEN** a product without a unit of measure is added to a quote
- **THEN** the quantity shows as a plain number
- **AND** the unit price shows without unit suffix

### Requirement: Contract Pricing Indicator on Line Items
The system SHALL indicate when contract pricing overrides standard pricing on quote line items.

#### Scenario: Line item with contract pricing
- **WHEN** a quote line item is priced from an active contract
- **THEN** a "Contract Price" badge appears on the line item
- **AND** the original list price is shown for comparison (e.g., "was $100.00")
- **AND** clicking the badge navigates to the contract detail page

#### Scenario: Contract percentage discount applied
- **WHEN** a contract applies a percentage discount (not a fixed price)
- **THEN** the badge shows "Contract: -{percent}%"
- **AND** the original price is visible for reference

#### Scenario: Line item without contract pricing
- **WHEN** a quote line item uses standard price book pricing
- **THEN** no contract badge is shown
- **AND** the line item displays normally

### Requirement: Price Source Visibility
The system SHALL make it clear where prices originate from.

#### Scenario: Standard price book pricing
- **WHEN** viewing a quote line item priced from the standard price book
- **THEN** hovering over the price shows "Price Book: {name}"

#### Scenario: Tier pricing applied
- **WHEN** a line item quantity triggers tier pricing
- **THEN** an indicator shows the tier being applied (e.g., "Tier: 10-50 @ $80")
- **AND** this appears in a tooltip or small text below the price

### Requirement: Bundle Configuration Modal
The system SHALL display a configuration modal when adding a bundle product to a quote, allowing users to select options for each feature.

#### Scenario: Adding bundle triggers configuration
- **WHEN** user selects a product of type BUNDLE to add to quote
- **THEN** system displays the bundle configuration modal
- **AND** the modal shows the bundle name and base price
- **AND** the modal displays all features with their available options

#### Scenario: Bundle with no features
- **WHEN** user selects a bundle product that has no features defined
- **THEN** system adds the bundle directly to the quote without showing configuration modal

#### Scenario: Feature display
- **WHEN** bundle configuration modal is displayed
- **THEN** each feature is shown as a distinct section
- **AND** feature name and selection constraints are visible (e.g., "Select 1-2 options")
- **AND** required features are visually distinguished

#### Scenario: Option display
- **WHEN** a feature's options are displayed
- **THEN** each option shows the product name and SKU
- **AND** each option shows its price from the quote's price book
- **AND** options with $0 price show "Included" indicator
- **AND** default options are pre-selected

### Requirement: Bundle Option Selection
The system SHALL allow users to select options within the constraints defined for each feature.

#### Scenario: Single-select feature (maxOptions = 1)
- **WHEN** a feature has maxOptions = 1
- **THEN** options are displayed as radio buttons
- **AND** selecting one option deselects the previously selected option

#### Scenario: Multi-select feature (maxOptions > 1)
- **WHEN** a feature has maxOptions > 1
- **THEN** options are displayed as checkboxes
- **AND** user can select up to maxOptions options
- **AND** further selections are disabled when max is reached

#### Scenario: Required option
- **WHEN** an option has isRequired = true
- **THEN** the option is automatically selected
- **AND** the option cannot be deselected

#### Scenario: Option quantity
- **WHEN** an option has maxQty > 1
- **THEN** a quantity selector is shown for that option
- **AND** quantity can be adjusted between minQty and maxQty

### Requirement: Bundle Configuration Validation
The system SHALL validate that all feature constraints are satisfied before allowing bundle creation.

#### Scenario: Minimum options not met
- **WHEN** a feature has minOptions > 0
- **AND** fewer than minOptions are selected
- **THEN** the feature shows a validation error
- **AND** the "Add to Quote" button is disabled

#### Scenario: All constraints satisfied
- **WHEN** all features have valid selections meeting min/max constraints
- **THEN** the "Add to Quote" button is enabled
- **AND** clicking it creates the bundle with selected options

### Requirement: Bundle Pricing Summary
The system SHALL display a running total of the bundle configuration.

#### Scenario: Price calculation display
- **WHEN** user is configuring a bundle
- **THEN** system displays the bundle base price
- **AND** system displays the sum of selected option prices
- **AND** system displays the total (base + options)

#### Scenario: Price updates on selection
- **WHEN** user selects or deselects an option
- **THEN** the pricing summary updates immediately
- **AND** option quantity changes are reflected in the total

### Requirement: Bundle Creation
The system SHALL create the bundle and its child line items when configuration is confirmed.

#### Scenario: Successful bundle creation
- **WHEN** user clicks "Add to Quote" with valid configuration
- **THEN** system creates a parent line item for the bundle
- **AND** system creates child line items for each selected option
- **AND** child line items reference the parent via parentLineId
- **AND** the quote refreshes showing the new bundle
- **AND** the new bundle is auto-expanded to show its children

#### Scenario: Option not in price book
- **WHEN** an option product is not in the quote's price book
- **THEN** that option is displayed as unavailable with "Not in price book" badge
- **AND** user cannot select that option
- **AND** a tooltip shows which price books the option is available in

#### Scenario: Inactive option product
- **WHEN** an option product has isActive = false
- **THEN** that option is displayed as unavailable with "Inactive" badge
- **AND** user cannot select that option
- **AND** the option is visually dimmed

#### Scenario: Required option unavailable
- **WHEN** a required option is unavailable (not in price book or inactive)
- **THEN** an error alert is displayed at the top of the modal
- **AND** the alert lists all unavailable required options with their reason
- **AND** the "Add to Quote" button is disabled

### Requirement: Bundle Pre-Validation
The system SHALL validate bundle options before opening the configuration modal.

#### Scenario: Pre-validation on bundle selection
- **WHEN** user selects a bundle product in the add product dropdown
- **THEN** system checks all option products for availability
- **AND** displays a loading indicator while checking

#### Scenario: Required options unavailable
- **WHEN** pre-validation finds required options that are unavailable
- **THEN** an error alert is shown explaining the bundle cannot be added
- **AND** the "Add to Quote" button is disabled

#### Scenario: Optional options unavailable
- **WHEN** pre-validation finds only optional options that are unavailable
- **THEN** a warning alert is shown explaining some options cannot be selected
- **AND** the "Add to Quote" button remains enabled

### Requirement: Bundle Configuration Cancellation
The system SHALL allow users to cancel bundle configuration without making changes.

#### Scenario: Cancel configuration
- **WHEN** user clicks "Cancel" on the configuration modal
- **THEN** the modal closes
- **AND** no line items are created
- **AND** user returns to the product selection state

### Requirement: Bundle Line Item Expansion
The system SHALL provide expandable/collapsible bundle line items in the quote editor to reveal component products.

#### Scenario: Bundle with child products displays expand control
- **WHEN** a quote contains a bundle product with child line items
- **THEN** the bundle line item displays an expand/collapse chevron icon
- **AND** the icon indicates the current expansion state (right chevron = collapsed, down chevron = expanded)

#### Scenario: Expanding a bundle reveals child products
- **WHEN** user clicks the expand control on a collapsed bundle
- **THEN** the bundle expands to show all child product line items
- **AND** child items are visually indented under the parent bundle
- **AND** child items have a subtle background differentiation

#### Scenario: Collapsing a bundle hides child products
- **WHEN** user clicks the collapse control on an expanded bundle
- **THEN** the child product line items are hidden
- **AND** only the parent bundle row remains visible

#### Scenario: Bundle without child products
- **WHEN** a bundle product has no child line items (empty bundle)
- **THEN** no expand/collapse control is displayed
- **AND** the bundle displays as a regular line item

### Requirement: Bundle Expansion State Persistence
The system SHALL maintain bundle expansion state during the quote editing session.

#### Scenario: Expansion state preserved on data refresh
- **WHEN** user expands a bundle
- **AND** performs an action that refreshes quote data (e.g., quantity change, add product)
- **THEN** the bundle remains expanded after the refresh

#### Scenario: Newly added bundles auto-expand
- **WHEN** user adds a new bundle product to the quote
- **THEN** the bundle is automatically expanded to show its components
- **AND** user can see the bundle configuration immediately

### Requirement: Global Bundle Expansion Toggle
The system SHALL provide a toggle to expand or collapse all bundles at once.

#### Scenario: Show all bundle contents
- **WHEN** user clicks "Show All Bundle Contents" toggle
- **AND** some or all bundles are collapsed
- **THEN** all bundles in the quote expand to show their child products

#### Scenario: Hide all bundle contents
- **WHEN** user clicks "Hide All Bundle Contents" toggle
- **AND** some or all bundles are expanded
- **THEN** all bundles in the quote collapse to hide their child products

#### Scenario: Toggle visibility based on bundle presence
- **WHEN** quote has no bundle products
- **THEN** the global toggle is not displayed
- **AND** no empty state message is shown for the toggle

### Requirement: Bundle Component Count Badge
The system SHALL display a badge showing the number of components in a collapsed bundle.

#### Scenario: Collapsed bundle shows component count
- **WHEN** a bundle is collapsed
- **AND** the bundle has child line items
- **THEN** a badge displays the count of child items (e.g., "3 items")

#### Scenario: Expanded bundle hides component count
- **WHEN** a bundle is expanded
- **THEN** the component count badge is hidden
- **AND** the actual child items are visible instead

### Requirement: Bundle Expansion Accessibility
The system SHALL ensure bundle expansion controls are accessible.

#### Scenario: Keyboard navigation for expand/collapse
- **WHEN** user focuses on a bundle line item with keyboard
- **AND** presses Enter or Space
- **THEN** the bundle toggles its expansion state

#### Scenario: Screen reader announces expansion state
- **WHEN** a bundle line item is focused by a screen reader
- **THEN** the screen reader announces whether the bundle is expanded or collapsed
- **AND** announces "X child items" for context

