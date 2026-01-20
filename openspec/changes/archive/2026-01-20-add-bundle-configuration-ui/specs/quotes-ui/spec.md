# quotes-ui Specification Delta

## ADDED Requirements

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
