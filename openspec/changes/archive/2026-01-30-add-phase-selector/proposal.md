## Why

The CPQ POC is organized into 5 release phases, each introducing new capabilities. Currently, the app shows all phases simultaneously with phase badges as informational indicators. To effectively demo the phased release strategy to stakeholders and help developers understand what each phase delivers, we need the ability to **select a phase and have the entire application transform** to show only what exists at that phase level - navigation, data, forms, and all.

This enables: "Look, this is a CPQ at Phase 1. Now watch as I switch to Phase 3 - contracts appear, subscriptions become available, tax calculations work."

## What Changes

- Add a **phase selector dropdown** in the sidebar header that allows switching between phases 1-5
- **Navigation filtering**: Hide nav items for phases above the selected phase (using existing `navMappings`)
- **Route protection**: Block access to pages for phases above the selected phase
- **API filtering**: Add `introducedInPhase` column to core database models; queries filter by selected phase
- **Form field filtering**: Conditionally show/hide form fields and sections based on phase (e.g., billing frequency only in Phase 3+)
- **Relationship filtering**: API includes only phase-appropriate relations (e.g., no attributes in Phase 1-3)
- **Seed data enhancement**: Demo data tagged with phase information for realistic demos
- **Session-level state**: Phase selection stored in cookie, defaults to Phase 5 (full experience)

## Capabilities

### New Capabilities
- `phase-selection`: Global phase selector UI component and session state management
- `phase-data-filtering`: Database schema changes (`introducedInPhase` column) and query filtering utilities
- `phase-ui-awareness`: Semantic feature flags and conditional UI rendering within pages - hiding phase-specific form fields, sections, and components (discounts, taxes, attributes, subscriptions, etc.)

### Modified Capabilities
- `navigation`: Navigation items filtered by selected phase; items for future phases are hidden

## Impact

**Database**:
- Schema migration adding `introducedInPhase` column to ~14 core tables (Product, Quote, Customer, Discount, Contract, TaxRate, UnitOfMeasure, Attribute, AttributeGroup, Rule, ProductAffinity, Questionnaire, QuoteLayout, PriceBook)
- Seed data updated with phase assignments

**Frontend**:
- New `PhaseSelector.vue` component in sidebar header
- New `usePhaseContext` composable for global phase state
- Modified `default.vue` layout for navigation filtering
- Conditional rendering in forms across multiple pages

**Server**:
- New route middleware for phase-based access control
- New server middleware to extract phase from request
- Query utility functions for phase filtering
- Modified API routes to apply phase filters

**Configuration**:
- Existing `phases.ts` config leveraged for entity-to-phase mappings
- Existing `navMappings` used for navigation filtering
