# Design: Quote Groups

## Context
Enterprise CPQ systems like Salesforce CPQ support "Quote Line Groups" for organizing complex deals. Our current implementation only supports flat line items with bundle nesting. This design adds hierarchical grouping while maintaining backward compatibility with existing quotes.

## Goals / Non-Goals

### Goals
- Enable logical grouping of line items (phases, departments, options)
- Support optional groups that customers can accept/decline
- Calculate and display subtotals per group
- Maintain backward compatibility (ungrouped line items remain valid)

### Non-Goals
- Nested groups (groups within groups) - keep flat for simplicity
- Group-specific currencies - currency remains at quote level
- Group-specific approval workflows - approval is quote-level
- Group templates/presets - future enhancement

## Decisions

### Decision 1: Nullable groupId on QuoteLineItem
Line items can exist without a group (backward compatibility). Ungrouped items appear in a "Default" section in the UI.

**Alternatives considered:**
- Auto-create default group: Adds complexity, breaks existing quotes
- Require groups: Breaking change to existing data

### Decision 2: Group totals stored on QuoteGroup, grand totals on Quote
Each group tracks its own subtotal, discountTotal, taxAmount, and groupTotal. The Quote model adds grandSubtotal, grandDiscountTotal, grandTaxAmount, grandTotal fields for the sum of selected groups.

**Rationale:** Avoids recalculating group totals repeatedly; enables efficient UI updates when toggling optional groups.

### Decision 3: isSelected flag for optional groups
Groups have `isOptional` and `isSelected` booleans. Only selected groups contribute to grand totals.

**Alternatives considered:**
- Separate "alternative" groups: More complex, less flexible
- Quote variants: Different design pattern, scope creep

## Data Model

```prisma
model QuoteGroup {
  id            String          @id @default(cuid())
  quoteId       String
  name          String
  description   String?
  sortOrder     Int             @default(0)
  isOptional    Boolean         @default(false)
  isSelected    Boolean         @default(true)

  subtotal      Decimal         @default(0) @db.Decimal(10, 2)
  discountTotal Decimal         @default(0) @db.Decimal(10, 2)
  taxAmount     Decimal         @default(0) @db.Decimal(10, 2)
  groupTotal    Decimal         @default(0) @db.Decimal(10, 2)

  quote         Quote           @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  lineItems     QuoteLineItem[]

  @@index([quoteId])
}

model QuoteLineItem {
  // ... existing fields ...
  groupId       String?
  group         QuoteGroup?     @relation(fields: [groupId], references: [id])
}

model Quote {
  // ... existing fields ...
  groups            QuoteGroup[]
  grandSubtotal     Decimal     @default(0) @db.Decimal(10, 2)
  grandDiscountTotal Decimal    @default(0) @db.Decimal(10, 2)
  grandTaxAmount    Decimal     @default(0) @db.Decimal(10, 2)
  grandTotal        Decimal     @default(0) @db.Decimal(10, 2)
}
```

## Calculation Flow

1. **Line item added/updated:** Recalculate parent group totals
2. **Group selected/deselected:** Recalculate quote grand totals
3. **Grand total formula:** Sum of all selected groups' groupTotal values

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quotes/:id/groups` | List groups with line items |
| POST | `/api/quotes/:id/groups` | Create new group |
| PUT | `/api/quotes/:id/groups/:groupId` | Update group (name, optional, selected) |
| DELETE | `/api/quotes/:id/groups/:groupId` | Delete group (moves items to ungrouped) |
| POST | `/api/quotes/:id/groups/:groupId/lines` | Move line items to group |

## Risks / Trade-offs

- **Risk:** UI complexity increases
  - **Mitigation:** Default to single ungrouped view; groups are opt-in

- **Risk:** Performance with many groups
  - **Mitigation:** Limit to reasonable number (e.g., 20 groups max)

## Migration Plan

1. Add nullable groupId to QuoteLineItem (non-breaking)
2. Add QuoteGroup model
3. Add grand total fields to Quote (default to existing total)
4. Existing quotes continue to work with ungrouped line items

## Open Questions

- Should we limit the number of groups per quote?
- Should ungrouped items have their own subtotal display?
