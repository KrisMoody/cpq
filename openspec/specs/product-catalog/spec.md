# product-catalog Specification

## Purpose
TBD - created by archiving change add-cpq-foundation. Update Purpose after archive.
## Requirements
### Requirement: Product Entity
The system SHALL store products with the following attributes:
- Unique identifier (CUID)
- Name (required)
- Description (optional)
- SKU (unique, required)
- Type (STANDALONE or BUNDLE)
- Active status (boolean, default true)
- Creation timestamp

**Design Note:** Bundles are modeled as products with `type: BUNDLE` rather than a separate entity. This unifies the product catalog and allows bundles to appear on quotes like any product. See `design.md` for full rationale.

#### Scenario: Create standalone product
- **WHEN** a product is created with type STANDALONE
- **THEN** the product is stored with the provided attributes
- **AND** no features or options are associated

#### Scenario: Create bundle product
- **WHEN** a product is created with type BUNDLE
- **THEN** the product is stored with the provided attributes
- **AND** the product can have associated ProductFeatures

### Requirement: Product Feature Entity
The system SHALL support ProductFeature entities to group configurable options within a bundle:
- Unique identifier (CUID)
- Reference to parent Product (required)
- Name (required)
- Minimum options selectable (default 0)
- Maximum options selectable (default 1)
- Sort order for display (default 0)

#### Scenario: Feature with single selection
- **WHEN** a feature has minOptions=1 and maxOptions=1
- **THEN** exactly one option MUST be selected during configuration

#### Scenario: Feature with optional multi-selection
- **WHEN** a feature has minOptions=0 and maxOptions=3
- **THEN** zero to three options may be selected during configuration

### Requirement: Product Option Entity
The system SHALL support ProductOption entities as selectable items within a feature:
- Unique identifier (CUID)
- Reference to parent ProductFeature (required)
- Reference to the option's Product (required, for pricing lookup)
- Required flag (boolean, default false)
- Default selection flag (boolean, default false)
- Minimum quantity (default 1)
- Maximum quantity (default 1)
- Sort order for display (default 0)

**Design Note:** Options reference products rather than duplicating product data. This allows products to be sold standalone AND used as options within bundles, maintaining a single source of truth for pricing and inventory.

#### Scenario: Option references standalone product
- **WHEN** a ProductOption is created
- **THEN** it MUST reference an existing Product for price lookup

#### Scenario: Default option pre-selected
- **WHEN** a bundle is configured and an option has isDefault=true
- **THEN** that option is pre-selected in the configuration UI

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
The system SHALL provide a products list page at `/products` displaying all products in a sortable, filterable view with management actions. Users can switch between table and card views, with table view as the default.

#### Scenario: View products in table view (default)
- **WHEN** user navigates to /products
- **THEN** display products in a TanStack Table with columns: Name, SKU, Type, Description, Status, Actions
- **AND** table supports sorting by clicking column headers
- **AND** table supports global search filtering

#### Scenario: View products in card view
- **WHEN** user clicks the card view toggle button
- **THEN** display product cards with Name, SKU, Type, Active status in a responsive grid

#### Scenario: Switch between views
- **WHEN** user clicks the view toggle button
- **THEN** switch between table and card views
- **AND** persist the preference for future visits

#### Scenario: Create new product action
- **WHEN** user clicks "New Product" button
- **THEN** navigate to /products/new

#### Scenario: Show inactive products
- **WHEN** user enables "Show inactive" filter
- **THEN** display both active and inactive products in either view

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

### Requirement: Seed Data Product Diversity
The seed data SHALL include a diverse set of products to demonstrate CPQ capabilities across different product types and billing models.

#### Scenario: Standalone products across categories
- **WHEN** the database is seeded
- **THEN** standalone products exist in multiple categories with subcategory depth:
  - Hardware (Processors, Memory, Storage)
  - Networking (Routers, Switches, Wireless)
  - Accessories (Input Devices, Audio/Video, Docking & Connectivity)
  - Security (Security Software, Security Hardware)

#### Scenario: Subscription products with different billing frequencies
- **WHEN** the database is seeded
- **THEN** subscription products exist with various billing models:
  - Monthly per-seat subscriptions (e.g., DevTools, Security Platform)
  - Annual per-seat subscriptions (e.g., Enterprise tiers)
  - Monthly platform subscriptions (e.g., Cloud Hosting, Analytics)

#### Scenario: Tiered subscription products
- **WHEN** the database is seeded
- **THEN** at least 2 product lines have tiered offerings:
  - Basic/Starter tier
  - Professional/Business tier
  - Enterprise tier

#### Scenario: Professional services products
- **WHEN** the database is seeded
- **THEN** professional services exist with different billing:
  - Hourly services (implementation, consulting)
  - Project-based services (assessments, migrations)
  - Recurring services (managed services, QBRs)

#### Scenario: Bundle products with different configurations
- **WHEN** the database is seeded
- **THEN** multiple bundle types exist:
  - Static bundles (fixed contents)
  - Configurable bundles with required options
  - Configurable bundles with optional add-ons

#### Scenario: Price book coverage
- **WHEN** the database is seeded
- **THEN** all products have entries in both Standard and Enterprise price books
- **AND** enterprise prices reflect appropriate volume/relationship discounts

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

