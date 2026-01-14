# Project Context

## Purpose
A learning project to build a Configure, Price, Quote (CPQ) system. The goal is to understand CPQ concepts and patterns while building a functional proof-of-concept.

## Tech Stack
- **Framework**: Nuxt v4 (Vue 3 + Nitro) with `app/` directory structure
- **Language**: TypeScript
- **Database**: Neon (serverless PostgreSQL)
- **ORM**: Prisma with `@prisma/adapter-neon` for serverless compatibility
- **UI Components**: Nuxt UI v4 (`@nuxt/ui@next`)
- **Tables**: TanStack Table (`@tanstack/vue-table`) for data grids
- **Charts**: ApexCharts (`vue3-apexcharts`) for learning diagrams

## Project Conventions

### Code Style
- Use TypeScript strict mode
- Follow Vue 3 Composition API patterns
- Use `<script setup>` syntax for Vue components
- Prefer composables for reusable logic
- Use PascalCase for components, camelCase for functions/variables

### Architecture Patterns
- File-based routing via Nuxt
- Server routes in `server/api/` for backend endpoints
- Composables in `composables/` for shared logic
- Components organized by feature when project grows

### Testing Strategy
- Unit tests for business logic (pricing rules, configuration validation)
- Component tests for critical UI flows
- E2E tests for quote generation workflow

### Git Workflow
- Feature branches off `main`
- Conventional commits (feat:, fix:, docs:, etc.)
- PR-based workflow with reviews

## Domain Context
CPQ (Configure, Price, Quote) systems help sales teams:
- **Configure**: Select and customize products with valid option combinations
- **Price**: Calculate pricing with rules, discounts, and bundles
- **Quote**: Generate professional quotes/proposals for customers

Key CPQ concepts:
- **Product Catalog**: Products with attributes and options
- **Configuration Rules**: Valid/invalid combinations, dependencies
- **Pricing Rules**: Base prices, volume discounts, promotions
- **Quote Document**: Generated proposal with line items and totals

## Important Constraints
- Learning/POC project - prioritize simplicity over enterprise features
- Focus on core CPQ flows before advanced features
- Keep the data model extensible but start simple

## External Dependencies
- Neon serverless PostgreSQL (user provides DATABASE_URL)
- No external payment or CRM integrations for initial POC
