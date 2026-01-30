## MODIFIED Requirements

### Requirement: Product Create Page
The system SHALL provide a product creation page at `/products/new` with a comprehensive form for creating standalone products and bundles, including categories, attributes, and bundle configuration.

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

#### Scenario: Select categories during creation
- **WHEN** user is creating a product
- **THEN** a Categories section is displayed allowing multi-select of categories
- **AND** categories are shown with hierarchical indentation
- **AND** selected categories appear as removable chips

#### Scenario: View suggested attributes based on categories
- **WHEN** user has selected one or more categories
- **THEN** the Attributes section displays attributes associated with those categories
- **AND** suggested attributes are visually distinguished from other attributes
- **AND** user can fill in attribute values

#### Scenario: Add attributes without categories
- **WHEN** user has not selected any categories
- **THEN** the Attributes section shows all available attributes
- **AND** user can optionally fill in attribute values

#### Scenario: Configure bundle features during creation
- **WHEN** user selects BUNDLE as the product type
- **THEN** a Bundle Features section appears
- **AND** user can add features with name, min/max options
- **AND** user can add options to features by selecting existing standalone products
- **AND** user can set option properties (default, required, min/max quantity)
- **AND** user can reorder features and options via drag-and-drop

#### Scenario: Create product with all associations
- **WHEN** user submits form with categories, attributes, and features configured
- **THEN** all associations are created atomically with the product
- **AND** user is navigated to the complete product detail page

### Requirement: Products API
The system SHALL provide REST API endpoints for product management:
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product with features and options (for bundles)
- `POST /api/products` - Create a new product with optional categories, attributes, and features
- `PUT /api/products/:id` - Update an existing product
- `PUT /api/products/:id/categories` - Update product category assignments
- `DELETE /api/products/:id` - Soft-delete (deactivate) a product

#### Scenario: List products
- **WHEN** GET /api/products is called
- **THEN** return array of all active products with basic attributes

#### Scenario: Get bundle with configuration options
- **WHEN** GET /api/products/:id is called for a BUNDLE product
- **THEN** return the product with nested features and options
- **AND** each option includes its referenced product details

#### Scenario: Create product with categories and attributes
- **WHEN** POST /api/products is called with categoryIds and attributes
- **THEN** create the product with all category associations
- **AND** create all attribute values
- **AND** return the complete product

#### Scenario: Create bundle with features and options
- **WHEN** POST /api/products is called with type BUNDLE and features array
- **THEN** create the product with all features
- **AND** create all options within each feature
- **AND** validate that option products exist and are STANDALONE
- **AND** return the complete product with features and options

#### Scenario: Update product categories
- **WHEN** PUT /api/products/:id/categories is called with categoryIds array
- **THEN** replace all product category associations with the provided categories
- **AND** return the updated product with categories

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

## ADDED Requirements

### Requirement: Product Category Management
The system SHALL allow managing product category assignments from the product detail page.

#### Scenario: View product categories
- **WHEN** viewing a product detail page
- **THEN** display assigned categories in a dedicated section
- **AND** show category hierarchy path (e.g., "Hardware > Storage")

#### Scenario: Edit product categories
- **WHEN** user clicks Edit on the categories section
- **THEN** open a modal with category multi-select
- **AND** pre-select currently assigned categories

#### Scenario: Save category changes
- **WHEN** user saves category changes
- **THEN** call PUT /api/products/:id/categories
- **AND** refresh the product detail with updated categories

#### Scenario: Category-suggested attributes on detail page
- **WHEN** editing product attributes on the detail page
- **THEN** attributes from assigned categories are shown as "suggested"
- **AND** suggested attributes appear before other attributes
