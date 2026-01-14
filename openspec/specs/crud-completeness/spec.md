# crud-completeness Specification

## Purpose
TBD - created by archiving change add-missing-crud-operations. Update Purpose after archive.
## Requirements
### Requirement: Quote Deletion
The system SHALL allow users to delete quotes that are no longer needed.

#### Scenario: Delete draft quote
- **WHEN** user requests to delete a quote with status DRAFT
- **THEN** the quote is soft-deleted (status changed to CANCELLED)
- **AND** the quote no longer appears in the default quotes list

#### Scenario: Delete quote with line items
- **WHEN** user deletes a quote that has line items and applied discounts
- **THEN** all associated line items and applied discounts are also removed or marked as deleted
- **AND** the deletion is performed as a single transaction

#### Scenario: Prevent deletion of finalized quotes
- **WHEN** user attempts to delete a quote with status FINALIZED or ACCEPTED
- **THEN** the system rejects the deletion
- **AND** returns an error message explaining the quote cannot be deleted

---

### Requirement: Customer Tax Exemption Display
The system SHALL display tax exemption information in the customer detail read view.

#### Scenario: Display tax exempt customer
- **WHEN** viewing a customer detail page where isTaxExempt is true
- **THEN** the system displays a "Tax Exempt" badge
- **AND** shows the exemption reason if provided
- **AND** shows the certificate number if provided
- **AND** shows the expiry date if provided

#### Scenario: Expired exemption warning
- **WHEN** viewing a tax exempt customer whose taxExemptExpiry date is in the past
- **THEN** the system displays a visual warning indicator
- **AND** the display shows "Expired" alongside the expiry date

---

### Requirement: Price Book Entry Tier Management
The system SHALL provide UI for managing volume pricing tiers on price book entries.

#### Scenario: View pricing tiers
- **WHEN** user views a price book entry that has tiers configured
- **THEN** all tiers are displayed showing quantity ranges and tier prices
- **AND** the tier type (UNIT_PRICE or FLAT_PRICE) is indicated

#### Scenario: Add pricing tier to entry
- **WHEN** user adds a new tier to a price book entry
- **THEN** the tier is saved with minQuantity, maxQuantity, tierPrice, and tierType
- **AND** the tier appears in the entry's tier list

#### Scenario: Validate tier boundaries
- **WHEN** user creates a tier with quantity range overlapping an existing tier
- **THEN** the system rejects the creation
- **AND** displays a validation error about overlapping quantities

#### Scenario: Delete pricing tier
- **WHEN** user deletes a tier from a price book entry
- **THEN** the tier is removed from the database
- **AND** remaining tiers are displayed correctly

---

### Requirement: Category Attributes Management
The system SHALL provide UI for managing which attributes are associated with a category.

#### Scenario: View category attributes
- **WHEN** user views a category detail page
- **THEN** the system displays all attributes assigned to that category
- **AND** shows the attribute name and type for each

#### Scenario: Add attribute to category
- **WHEN** user adds an attribute to a category
- **THEN** a CategoryAttribute record is created linking the attribute to the category
- **AND** the attribute appears in the category's attribute list

#### Scenario: Remove attribute from category
- **WHEN** user removes an attribute from a category
- **THEN** the CategoryAttribute record is deleted
- **AND** the attribute no longer appears in the category's attribute list

#### Scenario: Display available attributes
- **WHEN** user opens the "Add Attribute" interface for a category
- **THEN** the system shows all attributes not already assigned to that category
- **AND** excludes attributes already present on the category

