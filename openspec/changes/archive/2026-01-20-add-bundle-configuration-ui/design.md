# Design: Bundle Configuration UI

## Context
The CPQ system has a well-designed data model for bundle products with configurable features and options, but the quote UI bypasses this entirely. When adding a bundle to a quote, users need to configure which options they want included.

### Current Data Model
```
Product (type=BUNDLE)
  └── ProductFeature (e.g., "Processor", "Memory")
        ├── minOptions: 1, maxOptions: 1
        └── ProductOption
              ├── optionProductId → Product (the actual product)
              ├── isRequired, isDefault
              └── minQty, maxQty

QuoteLineItem
  ├── productId → Bundle product
  └── parentLineId → null (this is the parent)

QuoteLineItem (child)
  ├── productId → Option product
  └── parentLineId → parent bundle line item ID
```

## Goals
- Enable users to configure bundles when adding them to quotes
- Respect feature constraints (min/max options)
- Show clear pricing breakdown
- Create proper parent-child line item relationships

## Non-Goals
- Editing bundle configuration after creation (future enhancement)
- Nested bundles (bundles containing bundles)
- Dynamic pricing rules based on option combinations

## Decisions

### Decision: Modal-based Configuration
**Choice:** Use a modal dialog for bundle configuration
**Alternatives considered:**
- Inline expansion in product list: Too cramped, disrupts flow
- Separate configuration page: Breaks context, feels heavyweight
- Drawer/sidebar: Could work, but modal provides better focus

**Rationale:** Modal creates clear focus on the configuration task, common pattern in CPQ systems (Salesforce CPQ, Oracle CPQ).

### Decision: Single API Call for Bundle Creation
**Choice:** Create new endpoint `POST /api/quotes/[id]/bundles` that creates parent + children atomically
**Alternatives considered:**
- Multiple API calls (create parent, then children): Race conditions, partial failures
- Reuse existing line item endpoint with batch support: Overcomplicates existing simple endpoint

**Rationale:** Atomic creation ensures data consistency. If any child fails validation, the whole bundle creation fails cleanly.

### Decision: Feature-Centric UI Layout
**Choice:** Organize UI by features, each showing its options
**Alternatives considered:**
- Flat list of all options: Loses context of what each option is for
- Tab per feature: Too many clicks for simple bundles

**Rationale:** Feature grouping matches how bundles are configured in the product catalog and how sales reps think about configuration.

## API Design

### GET /api/products/[id] (enhanced response for bundles)
```json
{
  "id": "...",
  "name": "Developer Laptop",
  "type": "BUNDLE",
  "features": [
    {
      "id": "feat1",
      "name": "Processor",
      "minOptions": 1,
      "maxOptions": 1,
      "options": [
        {
          "id": "opt1",
          "optionProductId": "prod-i5",
          "isRequired": false,
          "isDefault": true,
          "minQty": 1,
          "maxQty": 1,
          "product": {
            "id": "prod-i5",
            "name": "Intel i5",
            "sku": "CPU-I5",
            "listPrice": 0
          }
        }
      ]
    }
  ]
}
```

### POST /api/quotes/[id]/bundles
```json
// Request
{
  "productId": "bundle-id",
  "quantity": 1,
  "selections": [
    { "optionId": "opt1", "quantity": 1 },
    { "optionId": "opt5", "quantity": 2 }
  ]
}

// Response
{
  "parentLineItem": { ... },
  "childLineItems": [ ... ]
}
```

## Component Structure

```
CpqBundleConfigurator.vue
├── Props: productId, priceBookId, quantity
├── Emits: confirm(selections), cancel
├── State: selectedOptions Map<optionId, quantity>
└── Sections:
    ├── Header (bundle name, base price)
    ├── Features list
    │   └── Feature card
    │       ├── Feature name + constraints
    │       └── Options (radio/checkbox based on maxOptions)
    ├── Summary (selected count, total price)
    └── Actions (Cancel, Add to Quote)
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Complex bundles overwhelm users | Limit visible options, use collapsible sections |
| Price book missing option products | Show warning, disable option, don't block other options |
| Modal dismissed accidentally | Consider "unsaved changes" warning if selections made |

## Open Questions
- Should we support editing an existing bundle's configuration? (Recommend: Phase 2)
- How to handle bundle quantity > 1? (Proposed: Multiply child quantities)
