# Spec Delta: Product Catalog - Tax Configuration

## ADDED Requirements

### Requirement: Product Tax Configuration UI
The system SHALL allow users to configure product taxability through the product management interface.

#### Scenario: View product taxable status
- **WHEN** viewing a product in view mode
- **THEN** the product's taxable status is displayed (e.g., "Taxable" badge or indicator)
- **AND** non-taxable products are clearly marked

#### Scenario: Edit product taxable status
- **WHEN** user edits a product
- **THEN** a "Taxable" checkbox is available (checked by default for new products)
- **AND** hint text explains: "Uncheck for products exempt from sales tax"
- **AND** changes to taxability take effect on subsequent quote calculations

#### Scenario: Create non-taxable product
- **WHEN** user creates a new product
- **AND** unchecks the "Taxable" checkbox
- **THEN** the product is saved with `isTaxable = false`
- **AND** this product is excluded from tax calculations in quotes

#### Scenario: Non-taxable product in quote
- **GIVEN** a product with `isTaxable = false`
- **WHEN** the product is added to a quote
- **AND** the quote is calculated
- **THEN** no tax is applied to that line item
- **AND** only taxable items contribute to the taxable subtotal
