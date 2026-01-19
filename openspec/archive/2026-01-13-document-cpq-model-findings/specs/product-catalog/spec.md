# product-catalog Specification Delta

## MODIFIED Requirements

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
