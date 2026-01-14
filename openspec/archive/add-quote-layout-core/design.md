## Context

QuoteLayout introduces a portable, reusable presentation layer for quotes. This design supports future integration with external systems (app-site, integrations) by keeping the data model and renderer decoupled.

## Goals / Non-Goals

**Goals:**
- Define a flexible QuoteLayout data model supporting sections, columns, and theming
- Create a QuoteRenderer that takes Quote + Layout and produces styled HTML
- Support layout inheritance (entity default → quote override)
- Keep the design simple enough for a POC while extensible for production

**Non-Goals:**
- Visual drag-drop builder (separate proposal: `add-quote-layout-builder`)
- Integration with external editor systems (future: app-site repo)
- PDF export (existing print-friendly preview is sufficient for now)

## Decisions

### Decision: Store layout as JSON in database
QuoteLayout sections, columns, and theme configuration are stored as JSON columns in PostgreSQL. This provides flexibility for schema evolution without migrations.

**Alternatives considered:**
- Normalized relational tables: More complex, harder to evolve, overkill for POC
- NoSQL: Adds infrastructure complexity

### Decision: Section-based layout structure
Layouts are organized into sections (e.g., "Hardware", "Services", "Recurring"). Each section has filter rules to determine which line items appear.

**Structure:**
```
QuoteLayout
├── sections[]
│   ├── name, description
│   ├── columns[] (which fields to show)
│   ├── filter (productType, categoryId, custom)
│   └── showSubtotal
├── summaryConfig (what to show in totals)
└── theme (colors, fonts, spacing)
```

### Decision: Column configuration per section
Each section defines its own visible columns. Common columns: productName, quantity, unitPrice, discount, netPrice, description.

### Decision: Theme as structured object (not CSS)
Theme uses typed properties (primaryColor, fontFamily, etc.) rather than raw CSS. This ensures consistency and makes the builder UI simpler.

## Data Model

```typescript
// Core types
interface QuoteLayout {
  id: string
  entityId: string
  name: string
  description?: string
  isTemplate: boolean      // Reusable template vs one-off
  sections: QuoteLayoutSection[]
  summaryConfig: SummaryConfig
  theme: QuoteTheme
  createdAt: Date
  updatedAt: Date
}

interface QuoteLayoutSection {
  id: string
  name: string
  description?: string
  columns: LayoutColumn[]
  filter?: SectionFilter
  showSubtotal: boolean
  sortOrder: number
}

interface LayoutColumn {
  field: ColumnField         // 'productName' | 'quantity' | 'unitPrice' | etc.
  label?: string             // Custom header label
  width?: string             // CSS width
  align?: 'left' | 'center' | 'right'
}

interface SectionFilter {
  type: 'all' | 'productType' | 'category' | 'custom'
  productTypes?: string[]
  categoryIds?: string[]
  customFn?: string          // For future: stored filter expression
}

interface SummaryConfig {
  showSubtotal: boolean
  showDiscounts: boolean
  showTaxes: boolean
  showTotal: boolean
  customFields?: string[]
}

interface QuoteTheme {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  headerStyle: 'simple' | 'branded' | 'minimal'
  tableBorders: boolean
  alternateRowColors: boolean
}
```

## API Design

```
GET    /api/quote-layouts           - List layouts (with ?template=true filter)
GET    /api/quote-layouts/:id       - Get layout by ID
POST   /api/quote-layouts           - Create layout
PUT    /api/quote-layouts/:id       - Update layout
DELETE /api/quote-layouts/:id       - Delete layout
POST   /api/quote-layouts/:id/clone - Clone layout (for customization)
```

## Risks / Trade-offs

- **Risk**: JSON schema evolution could break existing layouts
  - Mitigation: Version field in layout, migration utilities if needed

- **Trade-off**: Flexibility vs type safety
  - JSON storage is flexible but less type-safe at DB level
  - Mitigation: Strong TypeScript types and Zod validation at API layer

## Open Questions

- Should layouts be scoped to entity or global? Starting with entity-scoped.
- How to handle layout versioning when templates are updated? Defer to future.
