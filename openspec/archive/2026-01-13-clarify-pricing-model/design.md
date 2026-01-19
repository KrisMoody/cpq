## Context

The CPQ system has pricing logic spread across multiple services (`pricingEngine.ts`, `priceLookup.ts`, `discountService.ts`, `quoteService.ts`) without clear documentation of how they interact. Users and developers cannot easily understand:
- Why a quote totals what it does
- How bundle pricing works
- How discounts are applied

## Goals / Non-Goals

**Goals:**
- Single source of truth for pricing formulas
- Clear bundle pricing strategy with rationale
- Unified discount application logic
- UI that shows complete price breakdown
- Remove legacy/confusing fields

**Non-Goals:**
- Adding new pricing features (subscriptions, currencies)
- Changing existing calculation results (behavior stays same, just clearer)
- Tax calculation changes (separate concern)

## Decisions

### Decision 1: Bundle Pricing Strategy - Component Sum Model

**What:** Bundle price = sum of selected component prices. The bundle product itself has no price.

**Why:** This is the clearest model for CPQ systems and matches common enterprise patterns:

| Strategy | Pros | Cons |
|----------|------|------|
| **Component Sum** (chosen) | Simple to understand, components are individually priced, easy to itemize on invoice | Can't offer bundle-only discount without separate discount rule |
| Bundle Base + Components | Can charge assembly/service fee | Confusing: "why does empty bundle cost $X?" |
| Bundle Replaces Sum | Good for "package deals" | Loses component visibility, hard to adjust |

**How to handle bundle discounts:** Create a discount with `scope: PRODUCT_CATEGORY` targeting a "bundle" category, or use approval rules to auto-apply discounts when bundles are configured.

### Decision 2: Remove Legacy `Quote.discount` Field

**What:** Remove `Quote.discount` (singular), keep only `discountTotal`.

**Alternatives considered:**
- Keep both fields synced: Adds complexity, easy to get out of sync
- Rename `discountTotal` to `discount`: Breaking change to API consumers

**Migration:** `discountTotal` is already used everywhere. Migration just removes the unused field.

### Decision 3: Pricing Formula Standardization

**Line Item:**
```
netPrice = (unitPrice × quantity) - lineDiscountAmount
```
Where:
- `unitPrice` = tier price if tier applies, else listPrice
- `lineDiscountAmount` = sum of applied discounts for this line

**Quote:**
```
subtotal = sum of all line item netPrices
discountTotal = sum of all applied discounts (line + quote level)
total = subtotal - quoteDiscount + taxAmount
```

Note: Line discounts are already reflected in `netPrice`, so `discountTotal` only subtracts quote-level discounts from subtotal.

### Decision 4: Integrate Price Tiers in Main Flow

**What:** `calculateLinePrice()` should use `lookupPrice()` from `priceLookup.ts` to respect tiers.

**Current bug:** Tiers exist in DB but `pricingEngine.ts` ignores them, only using base `listPrice`.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Removing `discount` field breaks API consumers | Check no external consumers exist (this is a POC) |
| Changing tier integration affects existing quotes | Only new calculations use tiers; existing quotes unchanged |
| UI changes confuse users | Add tooltips explaining each price component |

## Migration Plan

1. Add new `pricing` spec documenting the model
2. Update `pricingEngine.ts` to use tier lookup
3. Update UI components to show clear breakdown
4. Database migration to remove `Quote.discount` field
5. Rollback: Re-add field if needed (data preserved in `discountTotal`)

## Open Questions

None - decisions are straightforward for a POC. For production, would need to validate bundle strategy with business stakeholders.
