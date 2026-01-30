# Design: Advanced Tier Pricing Types

## Context
The CPQ system currently supports two tier pricing types:
- **UNIT_PRICE (Slab)**: All units priced at the tier rate when quantity reaches threshold
- **FLAT_PRICE (Stairstep)**: Fixed price for the entire quantity range

Customer feedback and industry standards indicate need for two additional types:
- **Graduated pricing**: Different rates for different portions of quantity (like tax brackets)
- **Volume discount percentage**: Percentage discount from list price based on quantity

## Goals / Non-Goals
**Goals:**
- Add graduated pricing where different quantity portions get different rates
- Add percentage-based volume discounts
- Maintain backward compatibility with existing tier configurations
- Keep the pricing lookup efficient

**Non-Goals:**
- Complex multi-dimensional pricing (e.g., based on attributes + quantity)
- Time-based tier changes within a single price entry
- Cumulative historical volume pricing

## Decisions

### Decision 1: Extend TierType Enum
Add new values to the existing `TierType` enum rather than creating a separate mechanism.

**Rationale:** Keeps tier pricing unified in one model. All tier types share the same structure (min/max quantity ranges).

```prisma
enum TierType {
  UNIT_PRICE              // Slab: all units at tier price
  FLAT_PRICE              // Stairstep: fixed total for range
  GRADUATED               // Incremental: each portion at its tier rate
  VOLUME_DISCOUNT_PERCENT // Percentage off list price
}
```

### Decision 2: Add discountPercent Field
Add an optional `discountPercent` field to `PriceTier` for percentage-based discounts.

**Rationale:**
- `tierPrice` stores the absolute price (for UNIT_PRICE, FLAT_PRICE, GRADUATED)
- `discountPercent` stores the percentage discount (for VOLUME_DISCOUNT_PERCENT)
- Only one is used per tier, determined by `tierType`

```prisma
model PriceTier {
  // ... existing fields
  tierPrice       Decimal   @db.Decimal(10, 2)
  discountPercent Decimal?  @db.Decimal(5, 2)  // For VOLUME_DISCOUNT_PERCENT
  tierType        TierType  @default(UNIT_PRICE)
}
```

### Decision 3: Graduated Pricing Calculation
For `GRADUATED` tier type, calculate total by summing each tier's contribution.

**Algorithm:**
```
remainingQty = quantity
total = 0
for each tier (ordered by minQuantity):
  tierQty = min(remainingQty, tierCapacity)
  total += tierQty * tier.tierPrice
  remainingQty -= tierQty
  if remainingQty <= 0: break
return total
```

**Example (2,500 GB storage):**
```
Tier 1 (1-100): 100 GB × $0.10 = $10
Tier 2 (101-1000): 900 GB × $0.08 = $72
Tier 3 (1001-5000): 1,500 GB × $0.06 = $90
Total: $172
```

### Decision 4: Volume Discount Percentage Calculation
For `VOLUME_DISCOUNT_PERCENT`, apply the tier's discount percentage to the list price.

**Algorithm:**
```
unitPrice = listPrice * (1 - discountPercent / 100)
total = unitPrice * quantity
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Graduated pricing requires all tiers to calculate total | Add validation that graduated tiers must be contiguous and start from 1 |
| Mixed tier types on same entry could cause confusion | Validate that all tiers on an entry use the same tier type |
| Performance impact for graduated calculation | Tiers are typically few (<10); linear scan is acceptable |

## Migration Plan
1. Add new enum values and field (non-breaking, additive)
2. Deploy schema migration
3. Update pricing logic with feature flag
4. Update UI to support new types
5. Remove feature flag after validation

No data migration needed - existing tiers continue working with UNIT_PRICE/FLAT_PRICE.

## Open Questions
- Should we enforce that all tiers on an entry use the same tier type? (Recommendation: Yes, for simplicity)
- Should graduated tiers require contiguous ranges starting from 1? (Recommendation: Yes, for correctness)
