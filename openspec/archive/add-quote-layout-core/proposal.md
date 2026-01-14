# Change: Add QuoteLayout Core System

## Why

The current quote-preview is a fixed layout. To support reusable, customizable quote presentations that can be shared across different contexts (documents, dealrooms, integrations), we need a QuoteLayout data model that separates quote data from quote presentation.

This enables:
- Reusable layouts across multiple quotes/documents
- Portable quote presentations (send Quote + Layout together)
- Entity-level default layouts with per-quote overrides
- Foundation for a visual layout builder

## What Changes

- **NEW**: `QuoteLayout` entity with sections, columns, summary config, and theming
- **NEW**: `QuoteLayoutSection` for grouping line items (e.g., "Products", "Services")
- **NEW**: API endpoints for QuoteLayout CRUD operations
- **NEW**: `QuoteRenderer` Vue component that renders Quote + QuoteLayout → HTML
- **NEW**: `useQuoteLayout` composable for state management
- **NEW**: Sample/default layouts for quick start

## Impact

- Affected specs: NEW `quote-layout` capability
- Affected code:
  - `prisma/schema.prisma` - new QuoteLayout model
  - `server/api/quote-layouts/` - CRUD endpoints
  - `app/components/quote/` - QuoteRenderer component
  - `app/composables/useQuoteLayout.ts` - state management
  - `app/types/quote-layout.ts` - TypeScript types
