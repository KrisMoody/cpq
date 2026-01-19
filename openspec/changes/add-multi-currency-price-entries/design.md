# Design: Multi-Currency Price Entries

## Context
The current system requires separate price books per currency. This works well for region-specific pricing but creates duplication when prices are equivalent across regions. This design adds optional currency-specific prices at the entry level while maintaining backward compatibility.

## Goals / Non-Goals

### Goals
- Allow native prices in multiple currencies per price book entry
- Fall back to exchange rate conversion when native price unavailable
- Maintain existing single-currency price book behavior
- Reduce price book duplication for global products

### Non-Goals
- Automatic currency price synchronization
- Bulk currency price updates
- Currency-specific tiers (tiers remain in entry's default currency)
- Replacing the currency-per-price-book model

## Decisions

### Decision 1: Optional currency prices at entry level
Currency-specific prices are optional. When not present, the system converts from the price book's base currency using exchange rates.

**Rationale:** Maintains simplicity for single-currency use cases while enabling multi-currency when needed.

### Decision 2: Price book retains primary currency
The price book's currency remains the "default" for entries. Currency-specific prices are additions, not replacements.

**Alternatives considered:**
- Remove price book currency entirely: Too breaking, loses regional price book pattern
- Make all entries multi-currency: Over-engineering for most use cases

### Decision 3: No currency-specific tiers
Price tiers remain in the entry's default currency. Currency-specific prices apply only to the list price; tier calculations happen after currency selection.

**Rationale:** Simplifies implementation; tier complexity is orthogonal to currency.

## Data Model

```prisma
model PriceBookEntryCurrency {
  id            String   @id @default(cuid())
  entryId       String
  currencyId    String
  listPrice     Decimal  @db.Decimal(10, 2)
  cost          Decimal? @db.Decimal(10, 2)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  entry    PriceBookEntry @relation(fields: [entryId], references: [id], onDelete: Cascade)
  currency Currency       @relation(fields: [currencyId], references: [id])

  @@unique([entryId, currencyId])
  @@index([currencyId])
}
```

## Price Lookup Flow

```
1. Quote requests price for product in currency X
2. Look up PriceBookEntry for product
3. Check PriceBookEntryCurrency for currency X
   a. If found: Use native price
   b. If not found: Convert entry.listPrice using exchange rate
4. Apply tier pricing (in quote currency after conversion)
5. Return price result with conversion indicator
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/price-books/:id/entries/:entryId/currencies` | List currency prices |
| POST | `/api/price-books/:id/entries/:entryId/currencies` | Add currency price |
| PUT | `/api/price-books/:id/entries/:entryId/currencies/:currencyId` | Update currency price |
| DELETE | `/api/price-books/:id/entries/:entryId/currencies/:currencyId` | Remove currency price |

## Risks / Trade-offs

- **Risk:** Complexity in price lookup
  - **Mitigation:** Clear lookup order, comprehensive caching

- **Risk:** Confusion about which price applies
  - **Mitigation:** UI indicators showing native vs converted prices

## Migration Plan

1. Add PriceBookEntryCurrency model (non-breaking)
2. Update priceLookup to check currency-specific prices
3. Existing price books continue to work unchanged
4. Currency-specific prices are opt-in per entry

## Open Questions

- Should we allow currency-specific costs for margin calculation?
- How to handle currency-specific minimum margins?
