# Tasks: Add CPQ Foundation

## 1. Project Setup
- [x] 1.1 Initialize Nuxt 4 project with `npx nuxi@latest init` (use existing directory)
- [x] 1.2 Install Prisma dependencies: `prisma`, `@prisma/client`, `@prisma/adapter-neon`, `@neondatabase/serverless`
- [x] 1.3 Install UI dependencies: `@nuxt/ui` (Nuxt UI v4)
- [x] 1.4 Install table dependencies: `@tanstack/vue-table`
- [x] 1.5 Install chart dependencies: `vue3-apexcharts`, `apexcharts`
- [x] 1.6 Initialize Prisma with `npx prisma init`
- [x] 1.7 Create Prisma client with Neon adapter at `server/utils/prisma.ts`
- [x] 1.8 Configure Nuxt UI v4 in `nuxt.config.ts`
- [x] 1.9 Set up `.env` with DATABASE_URL placeholder

## 2. Database Schema
- [x] 2.1 Define Product model in `prisma/schema.prisma`
- [x] 2.2 Define ProductFeature model with Product relation
- [x] 2.3 Define ProductOption model with ProductFeature relation
- [x] 2.4 Define PriceBook model
- [x] 2.5 Define PriceBookEntry model with unique constraint
- [x] 2.6 Define Quote model with status enum
- [x] 2.7 Define QuoteLineItem model with parent-child self-relation
- [x] 2.8 Run `npx prisma db push` to sync schema

## 3. Seed Data
- [x] 3.1 Create `prisma/seed.ts` script
- [x] 3.2 Seed standalone products (RAM modules, SSDs, accessories)
- [x] 3.3 Seed "Developer Laptop" bundle with features and options
- [x] 3.4 Seed default price book with all product prices
- [x] 3.5 Seed example quote with line items
- [x] 3.6 Configure seed script in `package.json`
- [x] 3.7 Run `npx prisma db seed` to populate data

## 4. Products API
- [x] 4.1 Create `server/api/products/index.get.ts` - list products
- [x] 4.2 Create `server/api/products/index.post.ts` - create product
- [x] 4.3 Create `server/api/products/[id].get.ts` - get product with features/options

## 5. Price Books API
- [x] 5.1 Create `server/api/price-books/index.get.ts` - list price books
- [x] 5.2 Create `server/api/price-books/[id]/prices.get.ts` - get prices in book

## 6. Quotes API
- [x] 6.1 Create `server/api/quotes/index.get.ts` - list quotes
- [x] 6.2 Create `server/api/quotes/index.post.ts` - create quote
- [x] 6.3 Create `server/api/quotes/[id].get.ts` - get quote with line items
- [x] 6.4 Create `server/api/quotes/[id].put.ts` - update quote
- [x] 6.5 Create `server/api/quotes/[id]/lines.post.ts` - add line item
- [x] 6.6 Create `server/api/quotes/[id]/lines/[lineId].delete.ts` - remove line item
- [x] 6.7 Create `server/api/quotes/[id]/calculate.post.ts` - recalculate totals

## 7. Business Logic Services
- [x] 7.1 Create `server/services/pricingEngine.ts` with `calculateLinePrice` function
- [x] 7.2 Add `calculateQuoteTotal` function to pricing engine
- [x] 7.3 Create `server/services/configurationValidator.ts` with `validateBundleConfiguration`
- [x] 7.4 Add `getRequiredOptions` function to configuration validator
- [x] 7.5 Create `server/services/quoteService.ts` with `addProductToQuote`
- [x] 7.6 Add `recalculateQuote` function to quote service

## 8. Composables
- [x] 8.1 Create `app/composables/useProducts.ts` for product data fetching
- [x] 8.2 Create `app/composables/useQuotes.ts` for quote operations
- [x] 8.3 Create `app/composables/usePricing.ts` for price lookups

## 9. Components
- [x] 9.1 Create `app/components/cpq/ProductCard.vue`
- [x] 9.2 Create `app/components/cpq/BundleConfigurator.vue`
- [x] 9.3 Create `app/components/cpq/QuoteLineItem.vue`
- [x] 9.4 Create `app/components/cpq/PricingSummary.vue`
- [x] 9.5 Create `app/components/tables/ProductsTable.vue` with TanStack Table
- [x] 9.6 Create `app/components/tables/QuotesTable.vue` with TanStack Table
- [x] 9.7 Create `app/components/tables/QuoteLinesTable.vue` with TanStack Table
- [x] 9.8 Create `app/components/learn/GlossaryTerm.vue`
- [x] 9.9 Create `app/components/learn/EntityRelationshipChart.vue` with ApexCharts
- [x] 9.10 Create `app/components/learn/CPQFlowDiagram.vue`

## 10. Pages
- [x] 10.1 Create `app/pages/index.vue` - Dashboard
- [x] 10.2 Create `app/pages/products/index.vue` - Products list
- [x] 10.3 Create `app/pages/products/[id].vue` - Product detail / bundle config
- [x] 10.4 Create `app/pages/quotes/index.vue` - Quotes list
- [x] 10.5 Create `app/pages/quotes/new.vue` - Create quote
- [x] 10.6 Create `app/pages/quotes/[id].vue` - Quote editor
- [x] 10.7 Create `app/pages/learn.vue` - Interactive glossary

## 11. App Layout
- [x] 11.1 Create `app/app.vue` with Nuxt UI layout
- [x] 11.2 Add navigation header with links to Products, Quotes, Learn
- [x] 11.3 Configure color mode (light/dark) support

## 12. Verification
- [x] 12.1 Verify database schema syncs with `npx prisma db push`
- [x] 12.2 Verify seed data populates correctly
- [x] 12.3 Test Products API endpoints with curl/browser
- [x] 12.4 Test Quotes API endpoints with curl/browser
- [x] 12.5 Test bundle configuration flow in UI
- [x] 12.6 Test quote creation and line item management
- [x] 12.7 Verify pricing calculations are correct
- [x] 12.8 Verify TanStack Tables render with sorting/filtering
- [x] 12.9 Verify ApexCharts diagrams render on Learn page
