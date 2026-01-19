## ADDED Requirements

### Requirement: Modal Accessibility Titles
The system SHALL provide accessible titles for all modal dialogs using the UModal `title` prop to ensure screen readers can announce the modal's purpose.

#### Scenario: Modal announces title to screen reader
- **WHEN** a modal opens
- **THEN** the modal has a `title` prop that describes its purpose
- **AND** assistive technologies can read the modal title

#### Scenario: Feature modal has accessible title
- **WHEN** user opens the Feature modal on the product page
- **THEN** the modal has title "Add Feature" or "Edit Feature" depending on mode

#### Scenario: Option modal has accessible title
- **WHEN** user opens the Option modal on the product page
- **THEN** the modal has title "Add Option" or "Edit Option" depending on mode

#### Scenario: Attributes modal has accessible title
- **WHEN** user opens the Attributes modal on the product page
- **THEN** the modal has title "Edit Product Attributes"

#### Scenario: Add Product modal has accessible title
- **WHEN** user opens the Add Product modal on quote, category, or price book pages
- **THEN** the modal has a title describing its context (e.g., "Add Product to Quote", "Add Product to Category", "Add Product to Price Book")

#### Scenario: Customer Selector modal has accessible title
- **WHEN** user opens the Customer Selector modal
- **THEN** the modal has title "Select Customer"

#### Scenario: Group modal has accessible title
- **WHEN** user opens the Group modal on attributes page
- **THEN** the modal has title "New Group" or "Edit Group" depending on mode

#### Scenario: Discount modals have accessible titles
- **WHEN** user opens the Apply Discount or Manual Discount modal
- **THEN** the modal has title describing the action and scope (e.g., "Apply Quote Discount", "Apply Manual Line Item Discount")

#### Scenario: Reject Quote modal has accessible title
- **WHEN** user opens the Reject Quote modal
- **THEN** the modal has title "Reject Quote"
