# product-categories Specification

## Purpose
TBD - created by archiving change add-product-categories. Update Purpose after archive.
## Requirements
### Requirement: Category Model
The system SHALL support a hierarchical category structure for organizing products.

#### Scenario: Create root category
- **WHEN** user creates a category without a parent
- **THEN** a root-level category is created
- **AND** it can contain products and subcategories

#### Scenario: Create subcategory
- **WHEN** user creates a category with a parent category
- **THEN** a child category is created under the parent
- **AND** the hierarchy is preserved in queries

#### Scenario: Category attributes
- **WHEN** a category is created
- **THEN** it has name, description, and optional parent reference
- **AND** it has an active/inactive status flag

### Requirement: Product-Category Association
The system SHALL allow products to be assigned to one or more categories.

#### Scenario: Assign product to category
- **WHEN** user assigns a product to a category
- **THEN** the product appears in that category listing
- **AND** the product can belong to multiple categories

#### Scenario: Remove product from category
- **WHEN** user removes a product from a category
- **THEN** the product no longer appears in that category
- **AND** the product remains in other assigned categories

#### Scenario: Product inherits parent categories
- **WHEN** a product is assigned to a subcategory
- **THEN** the product is discoverable through the parent category hierarchy

### Requirement: Category Management UI
The system SHALL provide a user interface for managing categories.

#### Scenario: List categories
- **WHEN** user navigates to categories page
- **THEN** categories are displayed in a hierarchical tree view
- **AND** each category shows product count

#### Scenario: Create category
- **WHEN** user creates a new category
- **THEN** the category appears in the tree
- **AND** user can optionally select a parent category

#### Scenario: Edit category
- **WHEN** user edits an existing category
- **THEN** name, description, and parent can be modified

#### Scenario: Deactivate category
- **WHEN** user deactivates a category
- **THEN** the category is hidden from product assignment
- **AND** existing product associations are preserved

### Requirement: Category-Based Product Filtering
The system SHALL allow filtering products by category.

#### Scenario: Filter products by category
- **WHEN** user selects a category filter on products page
- **THEN** only products in that category (and subcategories) are shown

#### Scenario: Clear category filter
- **WHEN** user clears the category filter
- **THEN** all products are shown regardless of category

### Requirement: Category-Based Discounts
The system SHALL support applying discounts to product categories.

#### Scenario: Apply category discount
- **WHEN** a discount has scope PRODUCT_CATEGORY and a category is specified
- **THEN** the discount applies to all products in that category
- **AND** includes products in subcategories

