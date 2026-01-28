## Context

The CPQ POC has a well-defined 5-phase release roadmap with existing infrastructure:
- `phases.ts` config with phase definitions, colors, and descriptions
- `entityMappings` linking entities to their introduction phase
- `navMappings` linking navigation paths to phases
- `usePhase()` composable with helper functions
- Phase badges already displayed in navigation

The app currently shows all phases simultaneously. We need to make it "phase-aware" so selecting a phase transforms the entire experience - navigation, data, forms, and APIs - to reflect what would exist at that phase level.

**Constraints**:
- Session-level state only (no user preferences persistence)
- Default to Phase 5 (full experience)
- Hidden UX for unavailable items (not locked/disabled)
- Must support realistic demo data per phase
- Database changes require safe testing via Neon branches

## Goals / Non-Goals

**Goals:**
- Global phase selector in sidebar header that instantly transforms the app
- Navigation filtering using existing `navMappings`
- Route protection for phase-blocked pages
- Database records filtered by `introducedInPhase` column
- Form fields conditionally rendered based on phase
- Demo-ready seed data tagged with phases

**Non-Goals:**
- User preference persistence (session-only)
- Per-tenant phase configuration
- "Locked" or "preview" UX for future phases
- Automatic phase detection or progression
- Phase-aware permissions/RBAC

## Decisions

### Decision 1: Session-Level Cookie State

**Choice**: Store selected phase in HTTP cookie (`cpq-phase`), readable by both client and server.

**Alternatives considered**:
- Pinia store only: Server wouldn't know the phase for API filtering
- URL parameter: Clutters URLs, breaks bookmarking
- localStorage: Not accessible server-side

**Rationale**: Cookie provides universal access - client reads it for UI, server middleware reads it for API filtering. Session-level (no expiry) means it resets on browser close, which is appropriate for demos.

### Decision 2: Cumulative Phase Filtering

**Choice**: Phase N shows all content from phases 1 through N (cumulative).

**Alternatives considered**:
- Discrete: Phase 3 shows only Phase 3 content (like viewing a single git commit)

**Rationale**: Cumulative matches how real software releases work - Phase 3 includes everything from Phases 1 and 2 plus new Phase 3 features.

### Decision 3: `introducedInPhase` Column on Root Entities Only

**Choice**: Add `introducedInPhase Int @default(1)` to ~14 "root" tables, not child/junction tables.

**Root tables** (need column):
- Product, Customer, Quote, PriceBook, Discount, Contract, TaxRate
- UnitOfMeasure, Attribute, AttributeGroup, Rule
- ProductAffinity, Questionnaire, QuoteLayout

**Child tables** (inherit from parent, no column):
- PriceBookEntry, PriceTier, QuoteLineItem, AppliedDiscount, DiscountTier
- ContractPriceEntry, ProductFeature, ProductOption, ProductAttribute
- CategoryAttribute, Question, QuestionProductMapping, RecommendationLog

**Alternatives considered**:
- Column on all tables: Redundant - children always belong to a parent
- No schema change (entity-level only): Can't have "Phase 3 demo products"

**Rationale**: Root entities are what users browse/create. Children inherit visibility from parents. Default value of 1 ensures all existing data remains visible.

### Decision 4: Phase Filtering Architecture

```
┌─────────────────┐
│ PhaseSelector   │──── Sets cookie: cpq-phase=N
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ usePhaseContext │     │ Server Middleware│
│ (client state)  │     │ (reads cookie)   │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│ Nav Filtering   │     │ API Filtering    │
│ Route Guards    │     │ Query Utilities  │
│ Form Fields     │     │ Include Filtering│
└─────────────────┘     └─────────────────┘
```

**Client-side**:
- `usePhaseContext()` composable reads cookie, provides reactive `currentPhase`
- Navigation computed property filters items using existing `navMappings`
- Route middleware redirects if accessing phase-blocked page
- Forms use `v-if="phase >= N"` for conditional fields

**Server-side**:
- Middleware extracts phase from `cpq-phase` cookie → `event.context.phase`
- Query utility: `phaseWhere(phase)` returns `{ introducedInPhase: { lte: phase } }`
- API routes apply filter to all findMany/findFirst queries
- Includes conditionally add relations based on phase

### Decision 5: Neon Branch for Schema Testing

**Choice**: Use Neon database branching to safely test schema migration before applying to main.

**Workflow**:
1. Create branch: `neonctl branches create --name phase-system`
2. Point `.env.local` to branch connection string
3. Run migration on branch: `prisma migrate dev`
4. Test thoroughly
5. If successful: apply to main with `prisma migrate deploy`
6. Delete branch

**Rationale**: Zero risk to production data. Instant branch creation with full data copy. Easy rollback (just delete branch).

### Decision 6: Phase Selector Placement

**Choice**: Sidebar header, directly below the logo/brand area.

**Alternatives considered**:
- Top header bar: Less prominent, not "in control" feeling
- Floating bottom-right: Distracting, feels temporary

**Rationale**: Sidebar header emphasizes this is a global control that affects everything. Visible on every page.

### Decision 7: Semantic Feature Flags for UI Phase Awareness

**Choice**: Extend `usePhaseContext()` with a `features` computed property that provides semantic boolean flags for each CPQ feature.

```typescript
const features = computed(() => ({
  // Phase 2
  bundles: isPhaseVisible(2),
  discounts: isPhaseVisible(2),
  unitsOfMeasure: isPhaseVisible(2),
  // Phase 3
  subscriptions: isPhaseVisible(3),
  contracts: isPhaseVisible(3),
  taxes: isPhaseVisible(3),
  // Phase 4
  attributes: isPhaseVisible(4),
  rules: isPhaseVisible(4),
  // Phase 5
  affinities: isPhaseVisible(5),
  questionnaires: isPhaseVisible(5),
  quoteLayouts: isPhaseVisible(5),
}))
```

**Usage**:
```vue
<CpqQuoteDiscountsCard v-if="features.discounts" />
<div v-if="features.taxes"><!-- Tax exemption fields --></div>
```

**Alternatives considered**:
- **Inline `v-if="isPhaseVisible(2)"`**: Magic numbers scattered throughout codebase, harder to understand at a glance
- **`<PhaseGate :phase="2">` wrapper component**: Extra nesting, not more readable than v-if

**Rationale**: Semantic feature flags are self-documenting (`features.discounts` vs `isPhaseVisible(2)`), provide a single source of truth for phase-to-feature mapping, and make code reviews easier. If phase assignments change, only the composable needs updating.

**Components requiring phase-aware rendering** (identified via codebase audit):

| Feature | Phase | Locations |
|---------|-------|-----------|
| Bundles | 2 | Product type selector, bundle features editor, bundle configurator, line item expansion |
| Discounts | 2 | Quote discounts card, discount modal, pricing summary breakdown, line item discounts |
| Units of Measure | 2 | Product form field, line item unit display |
| Subscriptions | 3 | Billing frequency fields, recurring badges, term column, MRR/ARR/TCV metrics |
| Contracts | 3 | Customer contracts section, contract pricing banner, line item contract indicator |
| Taxes | 3 | Customer tax exemption, product isTaxable, pricing summary tax section |
| Attributes | 4 | Product attributes section/modal, line item key attributes |
| Rules | 4 | Quote rules panel |
| Affinities | 5 | Quote recommendations section |
| Quote Layouts | 5 | Layout builder components |

## Risks / Trade-offs

**[Risk] Schema migration affects production data** → Mitigated by Neon branching workflow. Test fully on branch before applying to main. Default value of 1 ensures existing data unaffected.

**[Risk] Performance impact from additional WHERE clause** → Low risk. `introducedInPhase` indexed. Simple integer comparison. Monitor query performance.

**[Risk] Scattered conditional logic in forms** → Accept trade-off for flexibility. Consider extracting to composable if patterns emerge: `usePhaseField(minPhase)`.

**[Risk] Seed data maintenance burden** → Accept trade-off. Phase tagging is one-time per record. Document phase assignments clearly in seed script.

**[Risk] API routes forget to apply phase filter** → Create `withPhaseFilter()` utility that wraps query args. Code review for new routes.

**[Trade-off] Hidden vs locked UX** → Chose hidden for cleaner demo experience. Trade-off: users don't know what they're missing. Roadmap page serves as the "what's coming" view.

## Migration Plan

1. **Create Neon branch** for testing
2. **Add Prisma schema changes** - `introducedInPhase` column on 14 tables
3. **Run migration on branch**
4. **Create query utilities** - `phaseWhere()`, `withPhaseFilter()`
5. **Build PhaseSelector component** and `usePhaseContext`
6. **Update navigation filtering** in `default.vue`
7. **Add route middleware** for access control
8. **Update API routes** to apply phase filtering
9. **Update seed data** with phase assignments
10. **Test all phases** on branch
11. **Apply migration to main**
12. **Deploy**

**Rollback**: If issues arise post-deploy, phase selector can be set to always return 5 (full experience) while issues are debugged. Database column is additive and doesn't affect existing functionality.

## Open Questions

1. ~~**Form field inventory**: Which specific form fields need phase guards? Need to audit all forms and map fields to phases.~~ **RESOLVED**: See Decision 7 for complete audit of components requiring phase-aware rendering.

2. **Table column filtering**: Should list views also hide columns for future phases, or just show empty values?

3. **Phase change redirect**: When switching to a lower phase while on a now-blocked page, redirect to dashboard or show message?
