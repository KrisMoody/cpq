# Change: Add Release Phase Markers to CPQ POC

## Why
This POC serves as a learning tool and future reference for building CPQ functionality in GetAccept. To guide incremental development, we need to:

1. Mark which entities/features belong to each release phase
2. Document extensibility patterns for future integration
3. Capture uncertainties and integration decisions
4. Show how CPQ concepts map to existing GetAccept entities

This makes the POC a **living roadmap** - showing what to build, in what order, and how it connects to GetAccept's existing systems.

## What Changes
- Add phase badges/indicators in the UI (list pages AND detail pages)
- Create an interactive roadmap page with filtering
- Document GetAccept entity mappings and integration options
- Document extensibility patterns for each entity
- Highlight uncertainties and decisions needed

## Impact
- Affected specs: All existing specs get phase annotations
- Affected UI: Entity list pages, detail pages, navigation, new roadmap page
- No breaking changes to existing functionality

---

## GetAccept Entity Analysis

Based on exploration of `getaccept/app.site` and `getaccept/internal-services`:

### Product (`internal-services/cpq-service` - MongoDB)
```typescript
class Product {
  entityId: string              // Multi-tenant key
  name: string
  description: string
  sku: string
  price: string                 // String, not Decimal
  tax?: string
  metaData: {
    locale: string
    currency: string
    optionalProduct?: boolean   // For optional line items
    quantity?: {
      variable: boolean
      defaultMinValue: string
      defaultMaxValue: string
    }
  }
  productPropertyFields?: { productPropertyId, value }[]  // Dynamic properties
  images?: Image[]
}
```

### ProductProperty (`internal-services/cpq-service` - MongoDB)
```typescript
class ProductProperty {
  entityId: string
  name: string                  // Internal name
  displayName: string           // UI label
  type: 'Text' | 'Number' | 'Image'
  unit?: 'Currency' | 'Percentage' | 'Unknown'
  expression?: string           // For calculated/formula fields
  usages?: ProductPropertyUsage[]
}
```

### PricingTable (`app.site/editor-lib` - Document Node)
```typescript
// IMPORTANT: This is a DOCUMENT COMPONENT, not a Quote!
interface PricingTable extends NodeBase {
  type: NodeType.PricingTable
  name: string
  pricingTableSections: PricingTableSection[]
  currencySettings: PricingTableCurrencySettings
  summaryValues: PricingTableSummaryValues
}

interface PricingTableSection {
  columns: PricingTableColumn[]     // Links to ProductProperty via productPropertyId
  rows: PricingTableRow[]           // Product data rows
  sectionSummary: { discount, tax, price }
}
```

### Conditional Effect Service (`internal-services/conditional-effect-service` - MongoDB)
```typescript
// Rules engine for dynamic document behavior
class ConditionalEffect {
  entityId: string
  name: string
  documentId: string
  conditionGroups: ConditionGroup[]  // Groups of conditions with AND/OR
  truthyEffects: Effect[]            // Actions when conditions are TRUE
  falsyEffects: Effect[]             // Actions when conditions are FALSE
}

// Conditions can evaluate against:
// - Recipients (properties like email, name)
// - Document (properties)
// - PricingTableRow (column values!)
// - PricingTableSummary (total, tax, discount)
// - CustomData (custom fields)

// Effects can:
// - Show/hide EditorSection, EditorRow, EditorNode
// - Update document or recipient properties
// - Delete recipients
```

### Contract Management (`app.site/contracts` + `internal-services`)

**⚠️ IMPORTANT**: GA "Contract Management" is **document lifecycle management for signed agreements**, NOT a standalone contract entity system.

```typescript
// A "Contract" in GA is a signed Document with additional fields
interface Contract {
  id: string
  name: string
  type: string                    // DocumentType
  status: DocumentStatus          // signed, expired, etc.
  isSigned: boolean

  // Contract period tracking
  contractStartDate: string       // ISO date
  contractEndDate: string         // ISO date
  signDate: string
  expirationDate: string

  // Value tracking
  value: number                   // Monetary value
  companyName: string

  // Relations
  recipients: ContractRecipient[]
  user: ContractUser              // Owner
  tags: Tag[]
  customData: DocumentCustomData[]
  documentAttachments?: DocumentAttachment[]
}

// Contract filtering supports:
// - contractLength (days)
// - contractEndDate range
// - value range
// - signDate range
// - tags, users, folders
```

```typescript
// Document Notifications - reminders for contract lifecycle
interface DocumentNotification {
  id: string
  documentId: string              // Links to contract/document
  userId: string                  // Who gets notified
  notificationType: 'expiration' | 'renewal'
  notificationDate: Date
  notificationNote: string
}

// Use case: User sets reminder 30 days before contractEndDate
// for renewal discussions
```

```typescript
// Linked Contracts - for dealrooms (bundling related contracts)
interface LinkedContract {
  id: string
  type: 'Document' | 'Template'
  documentId?: string             // If type = Document
  resourceId?: string             // If type = Template
  createdAt: number
}

// Dealrooms can link multiple contracts together
```

**Key Insight: GA Contract Management ≠ CPQ Contract**

| Aspect | GA Contract Management | CPQ Contract (Phase 3) |
|--------|----------------------|----------------------|
| What it is | Document lifecycle tracking | Pricing agreement entity |
| Core data | Signed document + dates | Products + prices + terms |
| Owns | Lifecycle, signatures, notifications | Pricing, discounts, renewal terms |
| Status flow | Draft → Sent → Signed → Expired | Draft → Active → Renewed/Terminated |
| Value | `value` field (manual/PricingTable) | Calculated from line items (MRR/ARR/TCV) |

**GA Subscription Entity** (separate concept):
- Located in `entity-service`
- For **billing subscriptions** (Chargebee integration)
- Manages: plans, seats, features, billing frequency
- NOT for product subscriptions in CPQ sense

### Key Insight: PricingTable ≠ Quote

**PricingTable is a document editor component** for displaying pricing data, NOT a quote entity. The relationship is:

```
┌─────────────────────────────────────────────────────────────────┐
│                         CPQ System                               │
│  ┌─────────┐    ┌───────────────┐    ┌─────────────────────┐   │
│  │ Product │───>│ Quote         │───>│ QuoteLineItem       │   │
│  └─────────┘    │ (pricing,     │    │ (product, qty,      │   │
│       │         │  discounts,   │    │  price, discount)   │   │
│       │         │  status)      │    └─────────────────────┘   │
│       │         └───────────────┘              │                │
└───────┼────────────────────────────────────────┼────────────────┘
        │                                        │
        │ reference                              │ outputs to
        ▼                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GetAccept System                            │
│  ┌─────────┐    ┌───────────────┐    ┌─────────────────────┐   │
│  │ Product │    │ PricingTable  │<───│ PricingTableSection │   │
│  │ (GA)    │    │ (doc node)    │    │ (columns, rows)     │   │
│  └─────────┘    └───────────────┘    └─────────────────────┘   │
│       │                                        ▲                │
│       │         ┌───────────────┐              │                │
│       └────────>│ ProductProp-  │──────────────┘                │
│                 │ erty (fields) │   (column definitions)        │
│                 └───────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Entity Mapping: CPQ → GetAccept

| CPQ Entity | GA Entity | Relationship | Phase |
|------------|-----------|--------------|-------|
| Product | **Product** | Reference or extend | 1 |
| ProductAttribute | **ProductProperty + ProductPropertyFields** | Maps well - similar concept | 4 |
| Quote | (none - new concept) | CPQ Quote is upstream; **outputs to** PricingTable | 1 |
| QuoteLineItem | **PricingTableRow** | Line items become rows in document | 1 |
| Contract | **Document (signed)** | Reference via documentId; CPQ owns pricing, GA owns lifecycle | 3 |
| Subscription | (new - GA has billing subs only) | GA Subscription is for Chargebee billing, not product subs | 3 |
| Customer | **Contacts/Companies?** | May reference existing CRM | 1 |
| Category | (new) | GA has no product categories | 1 |
| PriceBook | (new) | GA has no price book concept | 1 |
| Discount | (new) | GA has discount in PricingTable but no reusable discounts | 2 |
| Rule | **Conditional Effect Service** | Different purpose but similar structure - see Phase 4 | 4 |

---

## Integration Strategy Options

### Option A: Extend Existing GA Entities
Add CPQ fields directly to GA Products, ProductProperties, etc.

| Pros | Cons |
|------|------|
| Single source of truth | Tight coupling to GA schema |
| No sync needed | Migration complexity |
| Simpler queries | May bloat existing models |
| | Breaking changes affect GA |

### Option B: New CPQ Entities with References
CPQ has own models that reference GA entities via foreign key.

| Pros | Cons |
|------|------|
| Clean separation | Data duplication risk |
| CPQ can evolve independently | Sync complexity |
| No risk to existing GA | More complex queries |
| Easier to test in isolation | |

### Option C: Hybrid Approach (Recommended)
- **Reference GA entities**: Product, Customer (don't duplicate)
- **New CPQ entities**: Quote, PriceBook, Discount, Rule (CPQ-specific concepts)
- **Extend carefully**: ProductProperty → add CPQ-specific fields if needed

| Pros | Cons |
|------|------|
| Balanced coupling | Complexity in deciding boundaries |
| Leverages existing data | Some sync still needed |
| CPQ-specific features are isolated | |

**Recommendation**: Option C, but needs stakeholder input on exact boundaries.

---

## Uncertainties & Decisions Needed

### Phase 1 Decisions
| Question | Options | Impact |
|----------|---------|--------|
| How does CPQ Product relate to GA Product? | A) Reference GA Product by ID, B) Copy/sync data, C) Extend GA Product | Core data model |
| How does Quote output to PricingTable? | A) Auto-generate on finalize, B) Manual export, C) Live sync | Document workflow |
| Where does CPQ live? | A) New package in internal-services, B) Extend cpq-service, C) Separate repo | Architecture |

### Phase 3 Decisions (High Complexity)
| Question | Options | Impact |
|----------|---------|--------|
| How does CPQ Contract relate to GA Document? | A) Reference via `documentId`, B) Extend Document schema, C) New document type | Determines coupling level |
| Who owns contract pricing? | A) CPQ owns, syncs `value` to GA, B) GA owns (PricingTable source), C) Both (conflict risk) | Data authority |
| When does GA Document get created? | A) On quote finalize, B) On contract activation, C) Manually triggered | Workflow timing |
| How to handle renewals? | A) CPQ creates new Quote+Contract, links to existing GA Document, B) Create entirely new GA Document, C) Amend existing | Renewal workflow |
| Do GA Document Notifications integrate with CPQ? | A) CPQ triggers its own reminders, B) Create GA notifications from CPQ, C) Keep separate | Notification UX |
| How to sync contract value? | A) CPQ updates GA `value` field on changes, B) GA reads from CPQ on demand, C) Event-driven sync | Real-time vs eventual consistency |

### Phase 4 Decisions
| Question | Options | Impact |
|----------|---------|--------|
| Does CPQ Attribute replace or extend GA ProductProperty? | A) Replace (migration), B) Extend (add fields), C) Separate (parallel systems) | Product configuration |
| How do calculated fields work? | A) Use GA expression field, B) CPQ rules engine, C) Both | Pricing flexibility |

---

## Phase Assignments

### Phase 1: Core Quoting (MVP)
*Minimum viable quoting - create products, set prices, build quotes*

| Entity | Spec | GA Mapping | Extensibility Notes |
|--------|------|------------|---------------------|
| Currency | multi-currency | (new) | Base currency only; multi-currency deferred to Phase 3 |
| Category | product-categories | (new) | Hierarchical from start; GA has no equivalent |
| Product | product-catalog | **Product** | STANDALONE only; type enum allows BUNDLE later |
| Customer | (needs spec) | Contacts? | Minimal fields; metadata JSON for extension |
| PriceBook | price-books | (new) | No date validity yet; relation ready for tiers |
| PriceBookEntry | price-books | (new) | List price only; tier relation nullable |
| Quote | quotes | → PricingTable | Status enum extensible; outputs to GA PricingTable |
| QuoteLineItem | quotes | → PricingTableRow | parentLineId nullable for bundles |

**Design principles**:
- All entities have `entityId` for multi-tenancy
- Nullable foreign keys for future relations
- Enum types for extensible categorization
- JSON metadata fields for custom data

**⚠️ Integration decisions needed**:
- CPQ Product → GA Product relationship
- Quote → PricingTable output mechanism

---

### Phase 2: Enhanced Pricing
*Pricing flexibility - tiers, bundles, discounts*

| Entity | Spec | GA Mapping | Extensibility Notes |
|--------|------|------------|---------------------|
| PriceTier | pricing | (new) | TierType enum: UNIT_PRICE, FLAT, GRADUATED, VOLUME_DISCOUNT |
| ProductFeature | configuration | (new) | Bundle structure with min/max options |
| ProductOption | configuration | (new) | Links to products; flexible quantities |
| Discount | discounts | (new) | Scope enum: LINE_ITEM, QUOTE, CATEGORY |
| DiscountTier | discounts | (new) | Tiered discount values |
| AppliedDiscount | discounts | (new) | Tracks source, reason, appliedBy |
| UnitOfMeasure | unit-of-measure | (new) | Conversion factor chain |

**Design principles**:
- Pricing logic uses strategy pattern (TierType determines calculation)
- Discounts are stackable with priority ordering
- Bundle options support quantity ranges

**Note**: GA PricingTable has discount/tax fields but no reusable discount entities. CPQ discounts would be the source of truth, applied to PricingTable on export.

---

### Phase 3: Subscriptions & Contracts ⚠️ COMPLEX
*Recurring revenue and customer agreements - integrates with GetAccept Contract Management*

| Entity | Spec | GA Mapping | Integration Notes |
|--------|------|------------|-------------------|
| BillingFrequency | subscriptions | (new enum) | ONE_TIME, MONTHLY, QUARTERLY, ANNUAL, CUSTOM |
| Contract | contract-pricing | **Contract Management** | **Key integration point** - see below |
| ContractPriceEntry | contract-pricing | (new) | Negotiated price overrides per product |
| TaxRate | tax-calculation | (new) | Region-based; may integrate external tax service |
| ExchangeRate | multi-currency | (new) | Time-series rates with effective dates |

**⚠️ Contract Management Integration Complexity**:

GetAccept already has Contract Management for **document lifecycle tracking**. Understanding the current system is critical:

**What GA Contract Management Currently Does:**
1. **Tracks signed documents as contracts** - A "contract" is a signed Document with `contractStartDate`, `contractEndDate`, `value`
2. **Provides reminder notifications** - Users can set `expiration` or `renewal` type reminders
3. **Enables contract search/filtering** - By value range, contract length, end date, tags, etc.
4. **Calculates metrics** - Total contract value (`sum`) across filtered contracts
5. **Links contracts in dealrooms** - Bundle related documents via LinkedContracts

**What GA Contract Management Does NOT Do:**
- ❌ Manage subscription billing cycles
- ❌ Track individual product pricing within contracts
- ❌ Calculate MRR/ARR/TCV
- ❌ Handle renewal workflows (only reminders)
- ❌ Price overrides per customer/contract
- ❌ Multi-currency per contract

**Integration Analysis:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A) Extend GA | Add pricing fields to GA Document | Single entity | Bloats Document; tight coupling |
| B) Reference | CPQ Contract references `documentId` | Clean separation | Two systems to query |
| C) Replace | CPQ Contract + new Document type | Full control | Migration; duplicate features |

**Recommendation**: Option B (Reference) with clear ownership:

```
┌─────────────────────────────────────────────────────────────────┐
│                         CPQ System                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ CPQ Contract                                              │   │
│  │  - id, name, customerId                                   │   │
│  │  - status (DRAFT, ACTIVE, RENEWED, TERMINATED)           │   │
│  │  - billingFrequency                                       │   │
│  │  - contractPriceEntries[] (product prices)               │   │
│  │  - MRR, ARR, TCV (calculated)                            │   │
│  │  - documentId → links to GA                              │   │
│  └──────────────────────────┬───────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │ references
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GetAccept System                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ GA Contract (Document)                                    │   │
│  │  - id, name, status                                       │   │
│  │  - contractStartDate, contractEndDate                    │   │
│  │  - signDate, recipients                                   │   │
│  │  - value (from PricingTable or CPQ sync)                 │   │
│  │  - documentNotifications[] (reminders)                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Ownership split:**
| Aspect | Owner | Notes |
|--------|-------|-------|
| Contract lifecycle (sign, expire) | GA | Existing workflow |
| Contract pricing (products, discounts) | CPQ | New capability |
| Contract reminders | GA | Existing feature |
| Renewal workflow | CPQ | New - triggers new Quote |
| Contract value | Both | CPQ calculates → syncs to GA `value` |

**Design principles**:
- CPQ Contract is a **pricing container** that references the authoritative GA Contract
- MRR/ARR/TCV calculated from quote line items with billing frequency
- `documentId` links to GA; null until document generated
- On renewal: CPQ creates new Quote → new Contract → generates GA Document
- Tax calculation is pluggable (internal or external service)

---

### Phase 4: Product Configuration
*Attributes and rules engine*

| Entity | Spec | GA Mapping | Extensibility Notes |
|--------|------|------------|---------------------|
| Attribute | product-attributes | (new) | Type enum: TEXT, NUMBER, BOOLEAN, SELECT, DATE |
| AttributeGroup | product-attributes | (new) | Logical grouping with sort order |
| ProductAttribute | product-attributes | **ProductPropertyFields** | JSON value for type flexibility |
| CategoryAttribute | product-attributes | (new) | Inheritance from category to products |
| Rule | configuration | **Conditional Effect Service** | Different purpose - see below |

**⚠️ ProductProperty Integration Decision**:

GA already has ProductProperty with:
- `type`: Text, Number, Image
- `expression`: For calculated fields
- `unit`: Currency, Percentage

| Option | Description |
|--------|-------------|
| A) Replace | CPQ Attribute replaces ProductProperty (migration) |
| B) Extend | Add CPQ fields to ProductProperty |
| C) Parallel | Both systems, mapped via productPropertyId |

**Recommendation**: Option C (Parallel) initially, with mapping. CPQ Attribute has richer types (BOOLEAN, SELECT, DATE) and validation constraints that ProductProperty lacks.

**⚠️ Rules ↔ Conditional Effect Service Integration**:

GA has a `conditional-effect-service` - a rules engine for dynamic documents:

```typescript
// GA Conditional Effect structure
class ConditionalEffect {
  conditionGroups: ConditionGroup[]  // Groups with AND/OR logic
  truthyEffects: Effect[]            // Actions when TRUE
  falsyEffects: Effect[]             // Actions when FALSE
}

class Condition {
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'filled' | ...
  leftOperand: Recipients | Document | PricingTableRow | PricingTableSummary | CustomData
  rightOperand: String | Number | Boolean
}

class Effect {
  type: 'update' | 'delete'
  objectType: Document | Recipient | EditorSection | EditorRow | EditorNode
  payload: { hidden?: boolean, ... }  // Show/hide sections, update fields
}
```

**Key differences**:

| Aspect | CPQ Rule | GA Conditional Effect |
|--------|----------|----------------------|
| Purpose | Configure quotes, calculate pricing | Dynamic document rendering |
| Operates on | Quotes, Products, Prices | Documents, Recipients, Editor nodes |
| Trigger | ON_PRODUCT_ADD, ON_QUOTE_SAVE, etc. | Continuous (on document load/change) |
| Actions | SET_PRICE, ADD_PRODUCT, REQUIRE_APPROVAL | Show/hide sections, update fields |

**Integration options**:

| Option | Description | Recommendation |
|--------|-------------|----------------|
| A) Separate | CPQ Rules for quotes, GA for documents | MVP approach |
| B) Generate | CPQ Rules auto-create GA Conditional Effects on quote finalize | Phase 5+ |
| C) Shared engine | Extract GA condition syntax for CPQ use | High complexity |

**Recommendation**: Option A for MVP. CPQ Rules are quote-time logic; GA Conditional Effects are document-time logic. They serve different purposes. In Phase 5, explore generating GA effects from quote data.

**Design principles**:
- Rules use JSON for conditions/actions (extensible without schema changes)
- Consider aligning condition operator syntax with GA for future compatibility
- Rule triggers: ON_PRODUCT_ADD, ON_QUANTITY_CHANGE, ON_QUOTE_SAVE, ON_FINALIZE

---

### Phase 5: Guided Selling & Intelligence
*Recommendations and optimization*

| Entity | Spec | GA Mapping | Extensibility Notes |
|--------|------|------------|---------------------|
| Questionnaire | guided-selling | (new) | Versioning for A/B testing |
| Question | guided-selling | (new) | Type enum; branchLogic in JSON |
| QuestionProductMapping | guided-selling | (new) | Score-based recommendations |
| ProductAffinity | guided-selling | (new) | AffinityType: CROSS_SELL, UPSELL, ACCESSORY, etc. |
| RecommendationLog | guided-selling | (new) | Analytics and ML training data |
| QuoteLayout | quote-layout | (new) | JSON-based template for quote documents |
| AI Optimization | ai-quote-optimization | (new) | Pluggable ML models |

**Design principles**:
- Recommendation sources are pluggable (RULE_BASED, AI_GENERATED, QUESTIONNAIRE, MANUAL)
- All recommendations logged for analytics
- QuoteLayout uses JSON structure for flexibility

---

## Extensibility Patterns (Cross-cutting)

These patterns should be followed throughout the POC to ensure future integration is smooth:

### 1. Multi-tenancy via entityId
All entities include `entityId` for tenant isolation:
```typescript
model Product {
  entityId String  // GetAccept entity ID
  // ...
}
```

### 2. Enum-based typing
Use enums for extensible categorization:
```typescript
enum ProductType { STANDALONE, BUNDLE }  // Future: SERVICE, SUBSCRIPTION_ADDON
enum DiscountScope { LINE_ITEM, QUOTE, PRODUCT_CATEGORY }  // Future: CUSTOMER_SEGMENT
enum TierType { UNIT_PRICE, FLAT_PRICE, GRADUATED, VOLUME_DISCOUNT_PERCENT }
```

### 3. JSON metadata fields
Include `metadata Json?` on key entities for custom data without migrations:
```typescript
model Quote {
  metadata Json?  // Custom fields per entity/use case
}
model Rule {
  condition Json  // Flexible rule logic
  action Json
}
```

### 4. Nullable foreign keys for future relations
Design schemas with optional relations:
```typescript
model QuoteLineItem {
  parentLineId String?  // Ready for bundles in Phase 2
}
model Product {
  unitOfMeasureId String?  // Ready for UoM in Phase 2
}
```

### 5. Interface-based services
Pricing, tax, and discount calculations use interfaces:
```typescript
interface PricingStrategy {
  calculate(entry: PriceBookEntry, quantity: number): Decimal
}
// Implementations: UnitPriceStrategy, FlatPriceStrategy, GraduatedStrategy
```

### 6. Event hooks for integration
Key operations emit events for future GA integration:
- Quote status changes → trigger document generation
- Quote finalized → output to PricingTable
- Contract created → sync to GA Contract Management

---

## Implementation

### Phase Badges
- Show on **all entity pages** (list AND detail)
- Colored badges with phase number:
  - P1 = Green (emerald) - MVP
  - P2 = Blue - Enhanced Pricing
  - P3 = Purple + ⚠️ warning - Subscriptions & Contracts
  - P4 = Orange - Configuration
  - P5 = Pink - Intelligence
- Tooltip shows phase name and description

### Interactive Roadmap Page
- Located at `/learn/roadmap`
- Click phase to filter/highlight entities
- Show dependency arrows between phases
- Link each entity to its detail page
- Special sections:
  - Phase 3 complexity callout
  - GA entity mapping table
  - Integration strategy options
  - Extensibility patterns documentation

### Configuration
- Single `app/config/phases.ts` file with all mappings
- Includes:
  - Phase definitions (number, name, color, description)
  - Entity-to-phase mappings
  - GA entity mappings
  - Extensibility notes per entity
