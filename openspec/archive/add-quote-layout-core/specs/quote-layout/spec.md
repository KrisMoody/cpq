## ADDED Requirements

### Requirement: QuoteLayout Entity
The system SHALL store quote layouts with the following attributes:
- Unique identifier (CUID)
- Entity ID (required, for multi-tenancy)
- Name (required)
- Description (optional)
- Is template flag (boolean, indicates reusable template)
- Sections (JSON array of QuoteLayoutSection)
- Summary configuration (JSON object)
- Theme (JSON object)
- Creation and update timestamps

#### Scenario: Create layout template
- **WHEN** a layout is created with isTemplate=true
- **THEN** the layout is stored as a reusable template
- **AND** it appears in template listings for selection

#### Scenario: Create quote-specific layout
- **WHEN** a layout is created with isTemplate=false
- **THEN** the layout is stored as a one-off customization
- **AND** it is associated with a specific use case

### Requirement: QuoteLayout Section Structure
Each QuoteLayout SHALL contain sections that define how line items are grouped and displayed:
- Section ID (unique within layout)
- Section name (displayed as header)
- Description (optional, displayed below header)
- Columns (array defining visible fields and their configuration)
- Filter (optional, determines which line items appear)
- Show subtotal flag (whether to show section subtotal)
- Sort order (for section ordering)

#### Scenario: Section with all line items
- **WHEN** a section has no filter or filter type 'all'
- **THEN** all quote line items appear in that section

#### Scenario: Section filtered by product type
- **WHEN** a section has filter type 'productType' with values ['HARDWARE']
- **THEN** only line items for hardware products appear in that section

#### Scenario: Section filtered by category
- **WHEN** a section has filter type 'category' with categoryIds
- **THEN** only line items for products in those categories appear

### Requirement: QuoteLayout Column Configuration
Each section SHALL define columns that control what fields are displayed:
- Field identifier (productName, quantity, unitPrice, discount, netPrice, description, sku, etc.)
- Custom label (optional, overrides default header)
- Width (optional, CSS width value)
- Alignment (left, center, right)

#### Scenario: Default columns
- **WHEN** no columns are specified for a section
- **THEN** default columns are used: Product, Quantity, Unit Price, Net Price

#### Scenario: Custom column labels
- **WHEN** a column has a custom label specified
- **THEN** the custom label is displayed in the table header

### Requirement: QuoteLayout Summary Configuration
Each QuoteLayout SHALL define a summary configuration controlling the totals section:
- Show subtotal (boolean)
- Show discounts (boolean)
- Show taxes (boolean)
- Show total (boolean)
- Custom fields (optional array for additional summary rows)

#### Scenario: Full summary display
- **WHEN** all summary options are enabled
- **THEN** the rendered quote shows subtotal, discounts, taxes, and total

#### Scenario: Minimal summary
- **WHEN** only showTotal is enabled
- **THEN** only the final total is displayed in the summary

### Requirement: QuoteLayout Theme
Each QuoteLayout SHALL define theming properties:
- Primary color (hex color for headers and accents)
- Secondary color (hex color for secondary elements)
- Font family (CSS font-family value)
- Header style (simple, branded, minimal)
- Table borders (boolean)
- Alternate row colors (boolean)

#### Scenario: Apply theme colors
- **WHEN** a layout has primaryColor set to '#1a56db'
- **THEN** section headers and accent elements use that color

#### Scenario: Alternate row styling
- **WHEN** alternateRowColors is true
- **THEN** table rows alternate between white and a light gray background

### Requirement: QuoteLayout API
The system SHALL provide REST API endpoints for layout management:
- `GET /api/quote-layouts` - List layouts with optional `?template=true` filter
- `GET /api/quote-layouts/:id` - Get layout by ID
- `POST /api/quote-layouts` - Create new layout
- `PUT /api/quote-layouts/:id` - Update existing layout
- `DELETE /api/quote-layouts/:id` - Delete layout
- `POST /api/quote-layouts/:id/clone` - Clone layout for customization

#### Scenario: List template layouts
- **WHEN** GET /api/quote-layouts?template=true is called
- **THEN** return only layouts where isTemplate=true

#### Scenario: Clone layout
- **WHEN** POST /api/quote-layouts/:id/clone is called
- **THEN** create a copy of the layout with isTemplate=false
- **AND** return the new layout with a new ID

### Requirement: QuoteRenderer Component
The system SHALL provide a Vue component that renders a Quote with a QuoteLayout:
- Accept quote data and layout configuration as props
- Render sections based on layout definition
- Apply column configuration per section
- Filter line items into appropriate sections
- Display summary based on summaryConfig
- Apply theme styling

#### Scenario: Render quote with sectioned layout
- **WHEN** QuoteRenderer receives a quote and a layout with multiple sections
- **THEN** line items are distributed into sections based on filters
- **AND** each section displays with its configured columns
- **AND** section subtotals appear where enabled

#### Scenario: Render with default layout
- **WHEN** QuoteRenderer receives a quote but no layout
- **THEN** a default single-section layout is applied
- **AND** all line items appear in one table

#### Scenario: Print-friendly rendering
- **WHEN** the rendered quote is printed
- **THEN** theme styling is preserved
- **AND** page breaks occur at section boundaries where possible

### Requirement: Default Layout Templates
The system SHALL provide default layout templates:
- "Simple" - Single section with basic columns (Product, Qty, Price, Total)
- "Detailed" - Single section with all columns including descriptions
- "Sectioned" - Multiple sections splitting products by type

#### Scenario: Seed default templates
- **WHEN** the database is seeded
- **THEN** default layout templates are created
- **AND** they are available for selection when creating quotes

### Requirement: Layout Selection in Quote Editor
The system SHALL allow selecting a layout when editing quotes:
- Display layout selector with available templates
- Preview button to see quote with selected layout
- Layout selection persists with quote (optional: add layoutId to Quote)

#### Scenario: Select layout for quote
- **WHEN** user selects a layout in the quote editor
- **THEN** the preview uses the selected layout
- **AND** the selection is preserved for future views
