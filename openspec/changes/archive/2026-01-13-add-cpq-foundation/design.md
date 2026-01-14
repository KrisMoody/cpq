## Context
This is a learning project to understand CPQ (Configure, Price, Quote) concepts. The application will demonstrate core CPQ patterns using modern web technologies. The target user is a developer learning CPQ systems, not end-users in a production environment.

### Stakeholders
- Developer learning CPQ concepts (primary)

### Constraints
- Must use Nuxt 4 with `app/` directory structure
- Must use Neon serverless PostgreSQL (already configured)
- Prioritize simplicity and learning over enterprise features

## Goals / Non-Goals

### Goals
- Demonstrate core CPQ data model (Products, Bundles, Price Books, Quotes)
- Implement working bundle configuration with option constraints
- Build pricing engine that calculates quote totals from price book entries
- Provide interactive learning UI explaining CPQ concepts
- Create seed data with realistic example (Developer Laptop bundle)

### Non-Goals
- Production-ready security or performance
- User authentication or multi-tenancy
- Complex business rules engine
- PDF/document generation
- Integration with external CRM/ERP systems

## Decisions

### Decision 1: Prisma with Neon Adapter
**What**: Use Prisma ORM with `@prisma/adapter-neon` for database access.
**Why**: Type-safe queries, migration support, and native serverless Postgres compatibility.
**Alternatives considered**:
- Drizzle ORM - Lighter weight but less mature ecosystem
- Raw SQL - More control but loses type safety benefits

### Decision 2: Bundle Configuration via Product Features/Options
**What**: Model configurable bundles using ProductFeature (groups) and ProductOption (selectable items) entities.
**Why**: This mirrors how enterprise CPQ systems (Salesforce CPQ, Oracle CPQ) model configuration. Each option references a standalone product, enabling price lookup and reuse.
**Structure**:
```
Product (Bundle)
  └── ProductFeature (e.g., "Memory")
        └── ProductOption (e.g., "32GB RAM" → refs Product "RAM-32GB")
```

### Decision 3: Price Book Pattern
**What**: Separate pricing from products using PriceBook and PriceBookEntry entities.
**Why**: Standard CPQ pattern allowing multiple price lists (retail, wholesale, promotional) without duplicating product data. Quotes reference a single price book for consistent pricing.

### Decision 4: Quote Line Item Hierarchy
**What**: QuoteLineItem supports parent-child relationships via `parentLineId` for bundle components.
**Why**: When a bundle is added to a quote, the bundle itself is one line item, and each selected option becomes a child line item. This enables proper subtotaling and visibility into bundle composition.

### Decision 5: Server-Side Pricing Calculation
**What**: All pricing calculations happen in server services, not client-side.
**Why**: Ensures pricing integrity. Client displays prices but never computes them. The `POST /api/quotes/:id/calculate` endpoint recalculates totals.

### Decision 6: TanStack Table for Data Grids
**What**: Use `@tanstack/vue-table` for products, quotes, and line items tables.
**Why**: Headless approach gives full styling control with Nuxt UI, while providing sorting, filtering, and pagination capabilities needed for list views.

### Decision 7: ApexCharts for Learning Diagrams
**What**: Use `vue3-apexcharts` for entity relationship and workflow diagrams on the learning page.
**Why**: Interactive charts help visualize CPQ concepts. ApexCharts supports treemap and network-style visualizations suitable for showing entity relationships.

## Data Model Overview

```
┌─────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Product   │─────────│ ProductFeature  │─────────│ ProductOption   │
│  (bundle)   │  1:N    │  (e.g., RAM)    │   1:N   │ (e.g., 16GB)    │
└─────────────┘         └─────────────────┘         └────────┬────────┘
       │                                                     │
       │                                                     │ refs
       │                                             ┌───────▼───────┐
       │                                             │    Product    │
       │                                             │  (component)  │
       │                                             └───────────────┘
       │
       │ N:1                    ┌─────────────┐
       ▼                        │  PriceBook  │
┌─────────────────┐             └──────┬──────┘
│ PriceBookEntry  │────────────────────┘ 1:N
└─────────────────┘

┌─────────────┐    1:N    ┌─────────────────┐
│    Quote    │───────────│ QuoteLineItem   │─────────▶ Product
└─────────────┘           └─────────────────┘
       │
       └──────────────────▶ PriceBook (N:1)
```

## Risks / Trade-offs

### Risk: Schema complexity for a learning project
**Mitigation**: Start with the full schema but seed with simple, well-documented examples. The Developer Laptop bundle demonstrates all concepts without overwhelming complexity.

### Risk: Nuxt 4 is relatively new
**Mitigation**: Stick to documented patterns (`app/` directory, server routes). Nuxt UI v4 is designed for Nuxt 4 compatibility.

### Trade-off: No real-time updates
**Decision**: Use standard request/response patterns. Real-time collaboration would add complexity without teaching core CPQ concepts.

## Migration Plan
Not applicable - greenfield project.

## Open Questions
None - implementation plan is comprehensive.
