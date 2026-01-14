# CPQ Product Model Findings

This document captures architectural decisions and conceptual clarifications for the CPQ product model.

## Context

During development, questions arose about how to model:
1. Bundles vs standalone products with options
2. Options as separate entities vs products
3. The distinction between attributes and options
4. Pricing resolution for configurable products

## Core Concepts

### Attribute vs Option

| Aspect | Attribute | Option |
|--------|-----------|--------|
| **Definition** | A property that defines *what the product is* | A separate product *added to* another product |
| **SKU Impact** | Each combination creates a unique SKU/variant | Option has its own SKU, adds line item |
| **Inventory** | Per-variant (combinations tracked separately) | Per-product (option tracked independently) |
| **Storage** | Creates variant rows | References existing product |
| **On Quote** | One line item | Multiple line items |
| **Scales** | Exponentially (attribute combinations) | Linearly |

**The Test:** Ask "Is this a different *thing*, or the same *thing* with something added?"
- Different thing (Red shirt vs Blue shirt) → Attribute
- Same thing + extra (Laptop + Warranty) → Option

### Under the Hood

**Attributes** generate SKU combinations (variants):
```typescript
Product: {
  id: 'TSHIRT',
  attributes: [
    { name: 'Color', values: ['Red', 'Blue'] },
    { name: 'Size', values: ['S', 'M', 'L'] }
  ]
}

// System generates 6 variants (2 x 3):
Variants: [
  { sku: 'TSHIRT-RED-S', attributes: { color: 'Red', size: 'S' }, price: 29, stock: 12 },
  { sku: 'TSHIRT-RED-M', attributes: { color: 'Red', size: 'M' }, price: 29, stock: 8 },
  // ... etc
]
```

**Options** reference another product, added as separate line:
```typescript
// User selects laptop + warranty
QuoteLines: [
  { productId: 'LAPTOP', qty: 1, price: 1299 },
  { productId: 'WARRANTY-3YR', qty: 1, price: 199 }
]
```

## Design Decisions

### Decision 1: Bundles as Products with Type

**Decision:** Bundles are products with `type: 'bundle'` rather than a separate entity.

**Rationale:**
- Unified product catalog - everything is a product
- Bundles appear on quotes just like products
- Bundles can be nested inside other bundles
- Reuses existing product infrastructure (pricing, permissions)

**Trade-off:** Product model includes bundle-specific fields, but this is acceptable for simplicity.

### Decision 2: Options Reference Products

**Decision:** Options reference products but exist within a configuration context (ProductFeature → ProductOption).

**Rationale:**
- Single source of truth for product data
- Products can be sold standalone AND used as options
- Option-specific metadata (constraints, display order, price modifiers) lives in ProductOption
- Avoids duplication between "sellable items" and "configurable items"

### Decision 3: Bundles Unify Attributes and Options

**Key Insight:** Within a bundle, the distinction between attributes and options dissolves.

Both "Color" (feels like attribute) and "Warranty" (clearly an option) become the same pattern:
- Component with selectable options
- User picks from choices
- No variant explosion needed

```
Bundle: Laptop
├── Component: Display → pick one (feels like attribute)
├── Component: Memory → pick one (feels like attribute)
├── Component: Warranty → pick one (feels like option)
└── Component: Software → pick many (optional add-ons)
```

**Benefit:** Avoids pre-generating hundreds of variant SKUs. Configuration is recorded at quote time.

## Pricing Resolution

### Strategies

| Strategy | Use Case | Example |
|----------|----------|---------|
| **Price modifier** | Simple B2C config | "+$350" displayed to user |
| **Product price** | Parts catalog | Option uses its product's price |
| **Price override** | B2B/negotiated | Per-bundle or per-customer pricing |
| **Tiered pricing** | Volume sales | Quantity breaks |

### Resolution Order

Option pricing resolved in priority order:
1. Price override (bundle-specific)
2. Price modifier (delta from base, e.g., "+$350")
3. Product's own price (fallback)

```typescript
function resolveOptionPrice(option, product, quantity, context) {
  // 1. Explicit override wins
  if (option.priceOverride !== undefined) {
    return option.priceOverride * quantity;
  }

  // 2. Price modifier (delta)
  if (option.priceModifier !== undefined) {
    return option.priceModifier * quantity;
  }

  // 3. Fall back to product price
  return product.price * quantity;
}
```

### Current Implementation

The current schema uses PriceBookEntry for product pricing, with ProductOption referencing products. Price modifiers can be implemented by:
- Using the referenced product's PriceBookEntry price
- Adding a `priceModifier` field to ProductOption (future enhancement)

## Example: Laptop Configuration

```
Bundle: "Business Laptop Pro"
│
├── Component: Display (required, pick 1)
│   ├── 14" FHD        +$0
│   ├── 14" 4K         +$200
│   └── 16" 4K         +$350
│
├── Component: Memory (required, pick 1)
│   ├── 16GB          +$0
│   ├── 32GB          +$150
│   └── 64GB          +$400
│
├── Component: Storage (required, pick 1)
│   ├── 256GB SSD     +$0
│   ├── 512GB SSD     +$100
│   └── 1TB SSD       +$250
│
├── Component: Warranty (required, pick 1)
│   ├── 1 Year        +$0
│   ├── 3 Year        +$199
│   └── 3 Year On-site +$349
│
└── Component: Software (optional, pick many)
    ├── MS Office 365  +$99/yr
    ├── Adobe CC       +$54/mo
    └── Antivirus Pro  +$49/yr

Base Price: $1,299
```

**User Selection Example:**

| Component | Choice | Price |
|-----------|--------|-------|
| Display | 16" 4K | +$350 |
| Memory | 32GB | +$150 |
| Storage | 512GB SSD | +$100 |
| Warranty | 3 Year | +$199 |
| Software | MS Office | +$99/yr |
| **Total** | | **$2,098 + $99/yr** |

## Model Structure Summary

```
Product
├── type: 'STANDALONE' | 'BUNDLE'
├── basePrice (via PriceBookEntry)
└── features[] (if bundle)
    ├── name
    ├── minOptions / maxOptions
    └── options[]
        ├── optionProductId (references a product)
        ├── isRequired / isDefault
        ├── minQty / maxQty
        └── (future: priceModifier)
```

## Open Questions

1. **Recurring pricing:** Software subscriptions need recurring price support (monthly/yearly). Not yet implemented.
2. **Price modifiers:** Should `priceModifier` be added to ProductOption, or always derive from PriceBookEntry?
3. **Variant products:** Do we need attribute-based variants for non-bundle products (e.g., T-shirt colors)?

## References

- Current schema: `prisma/schema.prisma`
- Product catalog spec: `openspec/specs/product-catalog/spec.md`
- Configuration spec: `openspec/specs/configuration/spec.md`
