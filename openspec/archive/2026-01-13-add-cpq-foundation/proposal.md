# Change: Add CPQ Foundation

## Why
Build a learning-focused CPQ (Configure, Price, Quote) application to understand core CPQ concepts including product configuration, pricing engines, and quote management. This establishes the foundational data model, API layer, and UI for exploring CPQ patterns.

## What Changes
- **NEW** Product Catalog capability with standalone products and configurable bundles
- **NEW** Price Books capability for managing product pricing
- **NEW** Quotes capability for creating and managing customer quotes
- **NEW** Configuration capability for bundle option selection and validation
- **NEW** Learning UI capability with interactive glossary and entity relationship diagrams

## Impact
- Affected specs: product-catalog, price-books, quotes, configuration, learning-ui (all new)
- Affected code: Full application scaffold including:
  - Nuxt 4 project with `app/` directory structure
  - Prisma schema with Neon serverless adapter
  - Server API routes in `server/api/`
  - Frontend pages and components
  - Business logic services

## Tech Stack
- **Nuxt 4** - Vue 3 framework with `app/` directory
- **Prisma** - Type-safe ORM with `@prisma/adapter-neon`
- **Neon** - Serverless PostgreSQL
- **Nuxt UI v4** - Component library
- **TanStack Table** - Headless table for data grids
- **ApexCharts** - Interactive diagrams for learning

## Scope Boundaries
This proposal covers the foundational CPQ system. The following are explicitly **out of scope**:
- User authentication
- Approval workflows
- PDF generation
- Discount schedules (volume pricing)
- Advanced product rules (validation/selection logic)
- Multi-currency support
- Customer/Account management
