# Spec Delta: Discounts - Category Scope UI

## ADDED Requirements

### Requirement: Discount Category Scope UI
The system SHALL allow users to create and manage discounts scoped to specific product categories.

#### Scenario: Create category-scoped discount
- **WHEN** user creates a new discount
- **AND** selects "Product Category" scope
- **THEN** a category selector appears (required when this scope is selected)
- **AND** user must select a category for the discount to apply to
- **AND** the discount is saved with scope `PRODUCT_CATEGORY` and the selected `categoryId`

#### Scenario: Edit category-scoped discount
- **WHEN** user edits an existing category-scoped discount
- **THEN** the scope shows "Product Category"
- **AND** the associated category is pre-selected in the category dropdown
- **AND** user can change the category or scope

#### Scenario: Category scope in discount list
- **WHEN** viewing the discounts list
- **AND** a discount has scope "Product Category"
- **THEN** the scope column shows "Category: {category name}"

#### Scenario: Category-scoped discount application
- **GIVEN** a discount with scope `PRODUCT_CATEGORY` and categoryId pointing to "Software"
- **WHEN** a quote contains products from category "Software" and "Hardware"
- **AND** the discount is applied to the quote
- **THEN** only products in the "Software" category receive the discount
- **AND** "Hardware" products are not affected

## ADDED Requirements

### Requirement: Inline Discount Display on Quote Line Items
The system SHALL display applied discounts directly on quote line items for better visibility.

#### Scenario: View line-level discounts inline
- **WHEN** viewing a quote with line-level discounts applied
- **THEN** each line item shows its applied discounts below the main line
- **AND** discounts are formatted as "↳ {discount name}: -{amount}"
- **AND** multiple discounts are listed separately

#### Scenario: No discounts on line item
- **WHEN** viewing a line item with no applied discounts
- **THEN** no discount row is shown below the line item
- **AND** only the standard line item display appears

#### Scenario: Manual discount display
- **WHEN** a manual discount is applied to a line item
- **THEN** the discount shows "↳ Manual Discount: -{amount}"
- **AND** the reason (if provided) is shown in a tooltip
