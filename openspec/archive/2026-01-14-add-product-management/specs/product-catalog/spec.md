## MODIFIED Requirements

### Requirement: Products API
The system SHALL provide REST API endpoints for product management:
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product with features and options (for bundles)
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update an existing product
- `DELETE /api/products/:id` - Soft-delete (deactivate) a product

#### Scenario: List products
- **WHEN** GET /api/products is called
- **THEN** return array of all active products with basic attributes

#### Scenario: Get bundle with configuration options
- **WHEN** GET /api/products/:id is called for a BUNDLE product
- **THEN** return the product with nested features and options
- **AND** each option includes its referenced product details

#### Scenario: Update product
- **WHEN** PUT /api/products/:id is called with valid data
- **THEN** update the product attributes
- **AND** return the updated product

#### Scenario: Update product not found
- **WHEN** PUT /api/products/:id is called with non-existent ID
- **THEN** return 404 error

#### Scenario: Delete product
- **WHEN** DELETE /api/products/:id is called
- **THEN** set isActive to false (soft delete)
- **AND** return success confirmation

#### Scenario: Delete product not found
- **WHEN** DELETE /api/products/:id is called with non-existent ID
- **THEN** return 404 error

### Requirement: Products List Page
The system SHALL provide a products list page at `/products` displaying all products in a sortable, filterable grid with management actions.

#### Scenario: View products grid
- **WHEN** user navigates to /products
- **THEN** display product cards with Name, SKU, Type, Active status
- **AND** grid supports filtering by product type

#### Scenario: Create new product action
- **WHEN** user clicks "New Product" button
- **THEN** navigate to /products/new

#### Scenario: Show inactive products
- **WHEN** user enables "Show inactive" filter
- **THEN** display both active and inactive products

### Requirement: Product Detail Page
The system SHALL provide a product detail page at `/products/[id]` showing product information with edit and delete capabilities, and bundle configuration UI for BUNDLE products.

#### Scenario: View standalone product
- **WHEN** user navigates to /products/:id for a STANDALONE product
- **THEN** display product name, description, SKU, and pricing
- **AND** show Edit and Deactivate action buttons

#### Scenario: View bundle product
- **WHEN** user navigates to /products/:id for a BUNDLE product
- **THEN** display product details with interactive bundle configurator
- **AND** show all features with their selectable options
- **AND** show Edit and Deactivate action buttons

#### Scenario: Edit product
- **WHEN** user clicks Edit button
- **THEN** switch to edit mode with form fields
- **AND** allow modifying product attributes

#### Scenario: Save product changes
- **WHEN** user saves changes in edit mode
- **THEN** call PUT /api/products/:id
- **AND** refresh the page with updated data

#### Scenario: Deactivate product
- **WHEN** user clicks Deactivate button and confirms
- **THEN** call DELETE /api/products/:id
- **AND** navigate back to products list

## ADDED Requirements

### Requirement: Product Create Page
The system SHALL provide a product creation page at `/products/new` with a form for creating standalone products and bundles.

#### Scenario: Create standalone product
- **WHEN** user fills in name, SKU, description and selects STANDALONE type
- **AND** submits the form
- **THEN** call POST /api/products with form data
- **AND** navigate to the new product detail page

#### Scenario: Create bundle product
- **WHEN** user fills in name, SKU, description and selects BUNDLE type
- **AND** submits the form
- **THEN** call POST /api/products with form data
- **AND** navigate to the new product detail page for feature configuration

#### Scenario: Validation error on create
- **WHEN** user submits form with missing required fields (name, SKU)
- **THEN** display validation error
- **AND** do not submit to API

#### Scenario: Duplicate SKU error
- **WHEN** user submits form with SKU that already exists
- **THEN** display error message from API
- **AND** allow user to correct the SKU

### Requirement: Bundle Feature Management
The system SHALL allow managing features for BUNDLE products, including adding, editing, and removing features.

#### Scenario: Add feature to bundle
- **WHEN** user is editing a BUNDLE product and clicks "Add Feature"
- **THEN** display a form to create a new feature
- **AND** save the feature to the product

#### Scenario: Edit feature
- **WHEN** user clicks edit on an existing feature
- **THEN** display form with current feature values
- **AND** allow modifying name, minOptions, maxOptions, sortOrder

#### Scenario: Delete feature
- **WHEN** user deletes a feature and confirms
- **THEN** remove the feature and all its options
- **AND** update the product display

### Requirement: Bundle Option Management
The system SHALL allow managing options within features, including adding, editing, and removing options.

#### Scenario: Add option to feature
- **WHEN** user clicks "Add Option" on a feature
- **THEN** display option form with product selector
- **AND** save the option with selected product reference

#### Scenario: Edit option
- **WHEN** user edits an existing option
- **THEN** allow modifying isRequired, isDefault, minQty, maxQty, sortOrder

#### Scenario: Delete option
- **WHEN** user deletes an option and confirms
- **THEN** remove the option from the feature
