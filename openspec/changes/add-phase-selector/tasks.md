## 1. Database Schema (Neon Branch)

- [x] 1.1 Verify Neon branch `phase-system` is active and `.env.local` points to it
- [x] 1.2 Add `introducedInPhase Int @default(1)` column to Product model in schema.prisma
- [x] 1.3 Add `introducedInPhase` column to remaining models: Customer, Quote, PriceBook, Discount, Contract, TaxRate, UnitOfMeasure, Attribute, AttributeGroup, Rule, ProductAffinity, Questionnaire, QuoteLayout
- [x] 1.4 Run `prisma migrate dev --name add_phase_tracking` on branch
- [x] 1.5 Verify migration applied successfully with `prisma studio`

## 2. Server-Side Phase Infrastructure

- [x] 2.1 Create `server/middleware/02.phase.ts` to extract phase from `cpq-phase` cookie into `event.context.phase`
- [x] 2.2 Create `server/utils/phase.ts` with `phaseWhere(phase)` utility function
- [x] 2.3 Add `withPhaseFilter(args, phase)` utility to wrap Prisma query args
- [x] 2.4 Add `getPhaseIncludes(model, phase)` utility for phase-aware relationship includes - SKIPPED: UI phase awareness handles this via `features.*` flags

## 3. Client-Side Phase Infrastructure

- [x] 3.1 Create `app/composables/usePhaseContext.ts` composable
- [x] 3.2 Implement `currentPhase` reactive ref that reads from `cpq-phase` cookie
- [x] 3.3 Implement `setPhase(n)` function that sets cookie and triggers refresh
- [x] 3.4 Implement `isPhaseVisible(n)` helper function
- [x] 3.5 Default to Phase 5 when no cookie exists
- [x] 3.6 Implement `features` computed property with semantic feature flags (bundles, discounts, taxes, etc.)

## 4. Phase Selector Component

- [x] 4.1 Create `app/components/PhaseSelector.vue` component
- [x] 4.2 Display current phase with name, number, and phase color
- [x] 4.3 Implement dropdown listing all 5 phases with descriptions
- [x] 4.4 Apply phase colors from `phases.ts` config
- [x] 4.5 Call `setPhase()` on selection and close dropdown

## 5. Navigation Phase Filtering

- [x] 5.1 Add PhaseSelector to sidebar header in `app/layouts/default.vue` (below logo)
- [x] 5.2 Create computed `visibleNavigation` that filters `navigation` array by phase
- [x] 5.3 Use `navMappings` from `phases.ts` to determine item visibility
- [x] 5.4 Hide group headers when all children are hidden
- [x] 5.5 Add PhaseSelector to mobile sidebar in same position

## 6. Route Protection Middleware

- [x] 6.1 Create `app/middleware/phase.global.ts` route middleware
- [x] 6.2 Check if target route's phase > current phase using `navMappings`
- [x] 6.3 Redirect to dashboard if route is blocked
- [x] 6.4 Optionally show toast notification on redirect

## 7. Hub Pages Phase Filtering

- [x] 7.1 Update `/sales` hub page to filter links by current phase
- [x] 7.2 Update `/admin` hub page to filter section links by phase
- [x] 7.3 Update `/admin/catalog` hub page to filter child links by phase
- [x] 7.4 Update `/admin/configuration` hub page to filter child links by phase

## 8. API Route Phase Filtering

- [x] 8.1 Update `server/api/products` routes to apply phase filter
- [x] 8.2 Update `server/api/quotes` routes to apply phase filter
- [x] 8.3 Update `server/api/customers` routes to apply phase filter
- [x] 8.4 Update `server/api/discounts` routes to apply phase filter
- [x] 8.5 Update `server/api/contracts` routes to apply phase filter
- [x] 8.6 Update `server/api/price-books` routes to apply phase filter
- [x] 8.7 Update remaining API routes: tax-rates, units, attributes, rules, affinities, questionnaires, quote-layouts
- [x] 8.8 Set `introducedInPhase` to current phase on record creation

## 9. Phase-Aware Includes

- [x] 9.1 Update product fetch to conditionally include attributes (Phase 4+) - SKIPPED: UI hides via `features.attributes`
- [x] 9.2 Update product fetch to conditionally include affinities (Phase 5+) - SKIPPED: UI hides via `features.affinities`
- [x] 9.3 Update quote fetch to conditionally include recommendationLogs (Phase 5+) - SKIPPED: UI hides via `features.affinities`
- [x] 9.4 Update price book entry fetch to conditionally include tiers (Phase 2+) - SKIPPED: UI handles display filtering

## 10. Seed Data Updates

- [x] 10.1 Update product seed data with appropriate `introducedInPhase` values
- [x] 10.2 Add Phase 2 demo data: bundle products, discounts, units of measure
- [x] 10.3 Add Phase 3 demo data: subscription products, contracts, tax rates
- [x] 10.4 Add Phase 4 demo data: products with attributes, rules
- [x] 10.5 Add Phase 5 demo data: questionnaires, affinities, quote layouts
- [ ] 10.6 Run seed on branch and verify phase filtering works

## 11. Testing & Verification

- [ ] 11.1 Test Phase 1: verify only Phase 1 nav items, data, and routes accessible
- [ ] 11.2 Test Phase 3: verify Phase 1-3 items visible, Phase 4-5 hidden
- [ ] 11.3 Test Phase 5: verify all items visible (full experience)
- [ ] 11.4 Test phase switching: verify navigation updates, data refreshes
- [ ] 11.5 Test route protection: verify direct URL to blocked page redirects
- [ ] 11.6 Test API filtering: verify phase-blocked records return 404

## 12. Migration to Main

- [ ] 12.1 Switch `.env.local` back to main branch (or delete file)
- [ ] 12.2 Run `prisma migrate deploy` to apply migration to main
- [ ] 12.3 Run seed on main to add phase data
- [ ] 12.4 Verify application works with main database
- [ ] 12.5 Delete Neon branch `phase-system` (optional cleanup)

## 13. UI Phase Awareness (In-Page Conditional Rendering)

### 13.1 Quote Detail Page (`app/pages/quotes/[id]/index.vue`)
- [x] 13.1.1 Hide `CpqQuoteDiscountsCard` when `!features.discounts` (Phase 2)
- [x] 13.1.2 Hide discount application button when `!features.discounts` (Phase 2) - handled in DiscountsCard
- [x] 13.1.3 Hide bundle configurator modal trigger when `!features.bundles` (Phase 2) - SKIPPED: bundles auto-hidden via API filtering
- [x] 13.1.4 Hide contract pricing banner when `!features.contracts` (Phase 3)
- [x] 13.1.5 Hide `CpqQuoteRulesPanel` when `!features.rules` (Phase 4)
- [x] 13.1.6 Hide `CpqRecommendations` when `!features.affinities` (Phase 5)

### 13.2 Product Pages (`app/pages/products/[id].vue`, `app/pages/products/new.vue`)
- [x] 13.2.1 Hide "Bundle" option in product type selector when `!features.bundles` (Phase 2)
- [x] 13.2.2 Hide bundle features editor section when `!features.bundles` (Phase 2)
- [x] 13.2.3 Hide unit of measure field when `!features.unitsOfMeasure` (Phase 2)
- [x] 13.2.4 Hide billing frequency fields when `!features.subscriptions` (Phase 3)
- [x] 13.2.5 Hide default term months field when `!features.subscriptions` (Phase 3)
- [x] 13.2.6 Hide attributes section and modal when `!features.attributes` (Phase 4)

### 13.3 Customer Page (`app/pages/customers/[id].vue`)
- [x] 13.3.1 Hide tax exemption section when `!features.taxes` (Phase 3)
- [x] 13.3.2 Hide contracts section when `!features.contracts` (Phase 3)

### 13.4 Pricing Summary Component (`app/components/cpq/PricingSummary.vue`)
- [x] 13.4.1 Hide discount breakdown section when `!features.discounts` (Phase 2)
- [x] 13.4.2 Hide tax section when `!features.taxes` (Phase 3)
- [x] 13.4.3 Hide recurring revenue metrics (MRR/ARR/TCV) when `!features.subscriptions` (Phase 3)

### 13.5 Quote Line Item Component (`app/components/cpq/QuoteLineItem.vue`)
- [x] 13.5.1 Hide unit abbreviation display when `!features.unitsOfMeasure` (Phase 2)
- [x] 13.5.2 Hide line-level discount amounts when `!features.discounts` (Phase 2)
- [x] 13.5.3 Hide bundle expansion toggles when `!features.bundles` (Phase 2) - SKIPPED: bundles auto-hidden via API filtering
- [x] 13.5.4 Hide recurring product badges when `!features.subscriptions` (Phase 3)
- [x] 13.5.5 Hide term column when `!features.subscriptions` (Phase 3)
- [x] 13.5.6 Hide contract pricing indicator when `!features.contracts` (Phase 3)
- [x] 13.5.7 Hide key attributes badges when `!features.attributes` (Phase 4)

### 13.6 Testing UI Phase Awareness
- [ ] 13.6.1 Test Phase 1 quote detail: no discounts, taxes, rules, recommendations visible
- [ ] 13.6.2 Test Phase 2 product form: bundles and units visible, no subscriptions/attributes
- [ ] 13.6.3 Test Phase 3 customer page: tax exemption and contracts visible
- [ ] 13.6.4 Test Phase 5 quote detail: all sections visible (full experience)
