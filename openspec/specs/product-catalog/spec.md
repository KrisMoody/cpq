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

#### Scenario: List products
- **WHEN** GET /api/products is called
- **THEN** return array of all active products with basic attributes

#### Scenario: Get bundle with configuration options
- **WHEN** GET /api/products/:id is called for a BUNDLE product
- **THEN** return the product with nested features and options
- **AND** each option includes its referenced product details

### Requirement: Products List Page
The system SHALL provide a products list page at `/products` displaying all products in a sortable, filterable table using TanStack Table.

#### Scenario: View products table
- **WHEN** user navigates to /products
- **THEN** display a table with columns: Name, SKU, Type, Active status
- **AND** table supports sorting and filtering

### Requirement: Product Detail Page
The system SHALL provide a product detail page at `/products/[id]` showing product information and bundle configuration UI for BUNDLE products.

#### Scenario: View standalone product
- **WHEN** user navigates to /products/:id for a STANDALONE product
- **THEN** display product name, description, SKU, and pricing

#### Scenario: View bundle product
- **WHEN** user navigates to /products/:id for a BUNDLE product
- **THEN** display product details with interactive bundle configurator
- **AND** show all features with their selectable options

