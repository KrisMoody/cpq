# Design: Interactive Schema Diagram

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     PrismaERD.vue                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    <VueFlow>                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │ TableNode   │  │ TableNode   │  │ TableNode   │   │  │
│  │  │ (Product)   │──│ (Feature)   │──│ (Option)    │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐                    │  │
│  │  │ TableNode   │──│ TableNode   │     [Minimap]      │  │
│  │  │ (Quote)     │  │ (LineItem)  │     [Controls]     │  │
│  │  └─────────────┘  └─────────────┘                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Schema Parser (`usePrismaSchema.ts`)
A composable that parses the Prisma schema and extracts:
- **Models**: Name, fields, and their types
- **Relations**: Foreign keys and relationship cardinality
- **Enums**: For reference in field types

```ts
interface ParsedModel {
  name: string
  fields: ParsedField[]
  relations: ParsedRelation[]
}

interface ParsedField {
  name: string
  type: string
  isRequired: boolean
  isPrimaryKey: boolean
  isForeignKey: boolean
  relatedModel?: string
}
```

### 2. Custom Table Node (`SchemaTableNode.vue`)
A Vue Flow custom node component styled as a database table card:
- Header with model name and color coding by domain
- Collapsible field list
- Visual indicators for PK, FK, required fields
- Handles for edge connections

### 3. Layout Algorithm
Initial positions calculated using a domain-based grouping:
- **Product domain**: Product, ProductFeature, ProductOption, Category
- **Pricing domain**: PriceBook, PriceBookEntry, PriceTier, Currency
- **Quote domain**: Quote, QuoteLineItem, AppliedDiscount
- **Customer domain**: Customer, Contract
- **Rules domain**: Rule, Discount, DiscountTier
- **Reference domain**: Attribute, TaxRate, UnitOfMeasure

Entities within groups are arranged vertically; groups are arranged horizontally.

## Data Flow

```
schema.prisma (static file)
       │
       ▼
usePrismaSchema() ─── parses at build time or runtime
       │
       ▼
{ models, relations } ─── transformed to Vue Flow format
       │
       ▼
nodes[] + edges[] ─── passed to <VueFlow>
       │
       ▼
Interactive diagram with zoom/pan/drag
```

## Approach Options

### Option A: Runtime Parsing (Recommended)
- Fetch `schema.prisma` as a text file at runtime
- Parse using regex or a lightweight parser
- Pro: Always reflects current schema
- Con: Slightly more complex, needs error handling

### Option B: Build-time Generation
- Generate a JSON file during `prisma generate`
- Import the JSON in the component
- Pro: Simpler runtime, validated at build
- Con: Requires build step, may get out of sync

**Decision**: Option A - Runtime parsing provides immediate feedback when schema changes and requires no additional build configuration.

## Styling Approach

Color coding by domain (matching existing `EntityDiagram.vue`):
| Domain | Color |
|--------|-------|
| Product | `#3b82f6` (blue) |
| Pricing | `#10b981` (emerald) |
| Quote | `#f59e0b` (amber) |
| Customer | `#8b5cf6` (violet) |
| Rules | `#ec4899` (pink) |
| Discount | `#ef4444` (red) |
| Reference | `#6b7280` (gray) |

## Performance Considerations

- **Lazy expand**: Only show field details on click/hover to reduce initial render
- **Viewport culling**: Vue Flow handles this automatically
- **Memoization**: Cache parsed schema to avoid re-parsing on every render
