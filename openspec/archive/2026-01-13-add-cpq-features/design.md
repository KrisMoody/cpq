# Design: CPQ Core Features

## Context

This change introduces four interconnected capabilities to the CPQ POC: customers, rules, discount management, and enhanced pricing. These features work together to enable realistic B2B quoting workflows.

**Stakeholders**: Sales users creating quotes, sales managers approving deals, system administrators managing rules/discounts.

**Constraints**:
- Learning/POC project - keep implementations simple
- Must integrate with existing quote/product/price-book models
- Nuxt 4 + Prisma + Neon stack

## Goals / Non-Goals

**Goals:**
- Enable customer management with quote association
- Provide flexible rules engine for configuration and pricing
- Support percentage, fixed, and volume-tiered discounts
- Add approval workflows for high-discount scenarios
- Maintain audit trail of applied discounts

**Non-Goals:**
- Complex approval routing (multi-level, matrix-based)
- Customer hierarchy/account management
- Multi-currency support
- Tax calculations
- External CRM integration

## Decisions

### 1. Rule Expression Format

**Decision**: Use JSON objects for condition/action expressions rather than a DSL.

**Rationale**: JSON is familiar, easy to validate, and can be edited via UI builders. A custom DSL adds parsing complexity without significant benefit for a POC.

**Format**:
```json
{
  "condition": {
    "operator": "and",
    "conditions": [
      { "field": "quantity", "op": "gte", "value": 10 },
      { "field": "productSku", "op": "eq", "value": "LAPTOP-PRO" }
    ]
  },
  "action": {
    "type": "APPLY_DISCOUNT",
    "discountId": "clx123...",
    "scope": "LINE_ITEM"
  }
}
```

**Alternatives considered**:
- Custom DSL (`IF qty >= 10 THEN discount 10%`) - More readable but requires parser
- JavaScript expressions - Security concerns with eval()
- Hardcoded rule types - Not flexible enough

### 2. Discount Stacking Strategy

**Decision**: Discounts marked `stackable=true` compound in priority order. Non-stackable discounts compete (highest value wins).

**Rationale**: This matches common CPQ behavior and gives administrators control over discount combinations.

**Application order**:
1. Sort applicable discounts by priority (lower = first)
2. Group by stackable flag
3. For non-stackable group, select best value
4. Apply all stackable + best non-stackable
5. Percentage discounts apply before fixed amounts

### 3. Customer-Quote Relationship

**Decision**: `customerId` is optional on Quote, but required for finalization. Deprecate `customerName` string field.

**Rationale**: Supports draft quotes without customer (exploring pricing), but ensures proper customer linkage for business records. Backward compatibility maintained via deprecated field.

**Migration**: Existing quotes with `customerName` but no `customerId` can be updated manually or remain in draft status.

### 4. Price Tier Storage

**Decision**: Store price tiers as separate `PriceTier` records linked to `PriceBookEntry`.

**Rationale**: Allows unlimited tiers, easy querying, and clean separation from base pricing. Alternative of JSON array in PriceBookEntry was considered but makes queries harder.

**Lookup logic**:
1. Query tiers for (priceBookId, productId) ordered by minQuantity
2. Find tier where minQuantity <= quantity < maxQuantity (or maxQuantity is null)
3. Return tier price, or fall back to base listPrice if no tier matches

### 5. Approval Workflow

**Decision**: Simple threshold-based approval using pricing rules with `REQUIRE_APPROVAL` action.

**Rationale**: Full workflow engines are out of scope. A simple flag + status transition covers the common case (manager approval for deep discounts).

**Flow**:
1. Quote calculation evaluates pricing rules
2. If any rule triggers `REQUIRE_APPROVAL`, set `requiresApproval=true`
3. On submit: route to `PENDING_APPROVAL` if flag set, else direct to `APPROVED`
4. Approval endpoints allow status transition + record approver

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Rule evaluation performance on large quotes | Evaluate rules lazily, cache compiled conditions, limit rule count |
| Discount calculation complexity | Clear priority ordering, comprehensive logging of applied discounts |
| Breaking change for customerName field | Keep field as deprecated, add migration guide |
| JSON expressions hard to debug | Provide rule testing UI, detailed evaluation logs |

## Data Model Changes

### New Models

```
Customer {
  id, name, email, phone, company,
  street, city, state, postalCode, country,
  priceBookId?, isActive, createdAt, updatedAt
}

Rule {
  id, name, description, type, trigger, priority,
  condition (JSON), action (JSON),
  isActive, createdAt, updatedAt
}

Discount {
  id, name, description, type, value, scope,
  minQuantity?, maxQuantity?, minOrderValue?,
  validFrom?, validTo?, isActive, stackable, priority,
  createdAt, updatedAt
}

DiscountTier {
  id, discountId, tierNumber, minQuantity, maxQuantity?, value
}

AppliedDiscount {
  id, quoteId, lineItemId?, discountId?,
  type, value, calculatedAmount, reason?,
  appliedBy?, appliedAt
}

PriceTier {
  id, priceBookEntryId, minQuantity, maxQuantity?,
  tierPrice, tierType
}
```

### Modified Models

```
Quote {
  + customerId? (FK to Customer)
  + discountTotal (Decimal)
  + requiresApproval (Boolean)
  + approvedBy? (String)
  + approvedAt? (DateTime)
  ~ status (add PENDING_APPROVAL, FINALIZED)
  ~ customerName (deprecated)
}
```

## API Design

### New Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/customers | GET, POST | List/create customers |
| /api/customers/:id | GET, PUT, DELETE | Customer CRUD |
| /api/rules | GET, POST | List/create rules |
| /api/rules/:id | GET, PUT, DELETE | Rule CRUD |
| /api/rules/evaluate | POST | Evaluate rules for context |
| /api/discounts | GET, POST | List/create discounts |
| /api/discounts/:id | GET, PUT, DELETE | Discount CRUD |
| /api/quotes/:id/discounts | POST, DELETE | Apply/remove discount |
| /api/quotes/:id/submit | POST | Submit for approval |
| /api/quotes/:id/approve | POST | Approve pending quote |
| /api/quotes/:id/reject | POST | Reject pending quote |
| /api/price-books/lookup | GET | Price lookup with tiers |

## Migration Plan

1. **Schema migration**: Run Prisma migrate to add new models/fields
2. **Backward compatibility**: Keep customerName field, populate from Customer on read
3. **Seed data**: Add sample customers, rules, discounts for testing
4. **Gradual adoption**: Existing quotes remain functional, new features opt-in

**Rollback**: Revert migration, restore previous schema. Data in new tables lost.

## Open Questions

1. Should discount audit trail include user who removed a discount?
2. Maximum number of rules to evaluate before performance concern?
3. Should price tiers support date-based validity?
