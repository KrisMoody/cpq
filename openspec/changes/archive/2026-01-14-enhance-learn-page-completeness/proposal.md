# Proposal: Enhance Learn Page Completeness

## Summary

Transform the Learn page into a comprehensive, interactive CPQ knowledge hub that fully reflects the application's capabilities. The current Learn page covers basic glossary terms and simple static diagrams, but is missing critical content including guided selling concepts, complete entity relationships, pricing formulas, business process documentation, and interactive examples.

**Key Enhancements:**
1. **Table of Contents** - Sticky navigation for quick section access
2. **Collapsible Sections** - Progressive disclosure with expand/collapse all
3. **Interactive Diagrams** - Replace static SVGs with Vue Flow for zoom, pan, click-to-explore

## Problem Statement

The current Learn page:
1. **Missing Entities**: Does not document Guided Selling (ProductAffinity, Questionnaire, Question, RecommendationLog), QuestionProductMapping, or CategoryAttribute
2. **Incomplete ER Diagram**: The custom EntityDiagram.vue shows only 13 entities; the actual schema has 31 models
3. **Missing Business Logic Documentation**: No explanation of pricing formulas, discount stacking rules, contract pricing override logic, or subscription calculations
4. **No Interactive Examples**: Users cannot see how concepts connect through worked examples
5. **Missing Glossary Terms**: Guided selling terms (Affinity, Questionnaire, Recommendation) are not documented
6. **Hierarchy Tree Outdated**: Does not show Category, Contract, Currency, Tax, Attribute, or Guided Selling hierarchies
7. **No Formula Reference**: Pricing calculations (MRR, ARR, TCV, proration) are mentioned but formulas not shown
8. **Missing Relationship Explanations**: Users don't understand when/how entities connect (e.g., when contract pricing overrides price book pricing)

## Goals

1. **Complete Entity Coverage**: Document all 31 database models in glossary and diagrams
2. **Visual Completeness**: ER diagram showing all entities grouped by domain
3. **Business Logic Documentation**: Explain pricing formulas, discount stacking, approval workflows
4. **Interactive Learning**: Worked examples tracing data through the system
5. **Quick Reference**: Cheat sheets for enums, formulas, and relationships
6. **Guided Selling Documentation**: Full coverage of affinity types, questionnaires, recommendations

## Non-Goals

- Changing the actual application behavior
- Adding new features to the CPQ system
- Creating a separate documentation site (keep everything on /learn)

## Scope

### In Scope
- New glossary terms for all missing entities
- Enhanced ER diagram with all 31 models
- New hierarchy sections for missing entity groups
- Business logic explanation cards
- Formula reference section
- Interactive "trace through" examples
- Enum quick reference
- Relationship explanation diagrams

### Out of Scope
- Video tutorials
- External documentation
- Code samples or API documentation
- Admin/setup guides

## Technical Approach

### 0. Navigation & Layout Enhancements

**Table of Contents:**
- Sticky left sidebar (desktop) / top bar (tablet) / hamburger menu (mobile)
- Nested navigation showing current section
- Click to scroll with smooth animation
- Highlight current section on scroll

**Collapsible Sections:**
- Each major section wrapped in collapsible card
- "Expand All" / "Collapse All" buttons
- Sections remember state during session
- Smooth height transitions

### 1. Glossary Enhancements
Add missing terms organized into new groups:
- **Guided Selling Group**: ProductAffinity, AffinityType, Questionnaire, Question, QuestionType, QuestionProductMapping, RecommendationLog, RecommendationSource, RecommendationAction
- Update existing groups with missing junction tables (CategoryAttribute)

### 2. Interactive ER Diagram with Vue Flow

**Library Choice:** [Vue Flow](https://vueflow.dev/) - Native Vue 3 flowchart library with excellent interactivity

**Features:**
- **Zoom & Pan**: Mouse wheel zoom, drag to pan, pinch on touch
- **Minimap**: Corner minimap for navigating large diagram
- **Click to Explore**: Click entity to open detail panel with attributes & relationships
- **Domain Filter**: Toggle buttons to show/hide domain groups
- **Search**: Filter nodes by name
- **Fit View**: Button to reset zoom and center diagram

**Implementation:**
- All 31 models as custom Vue components (EntityNode)
- Color-coded by domain (Products, Pricing, Quotes, Customers, Rules, Discounts, Tax, Guided Selling)
- Relationship lines with cardinality markers (crow's foot notation)
- Toggle between simplified (13 core entities) and full view (31 entities)

### 3. New Hierarchy Visualizations
Add missing hierarchy trees:
- Category → ProductCategory → Product
- Currency → ExchangeRate
- Contract → ContractPriceEntry
- TaxRate (standalone)
- Attribute → AttributeGroup, Attribute → ProductAttribute, Attribute → CategoryAttribute
- Questionnaire → Question → QuestionProductMapping
- ProductAffinity relationships

### 4. Business Logic Documentation Section (with Mermaid Flowcharts)

**Library Choice:** [Mermaid](https://mermaid.js.org/) via `nuxt-mermaid-string` - Text-based diagrams for decision flowcharts

New expandable cards explaining:
- **Pricing Calculation Flow**: `unitPrice = tierPrice || listPrice` → `lineTotal = unitPrice × quantity` → `netPrice = lineTotal - discounts`
- **Discount Stacking Rules**: Line-level first, then quote-level; stackable accumulates, non-stackable takes best
- **Contract Pricing Override**: When active contract exists with price entry, it overrides price book
- **Tax Calculation**: `taxAmount = subtotal × rate` where rate comes from customer jurisdiction
- **Subscription Formulas**: MRR = normalized monthly, ARR = MRR × 12, TCV = oneTime + (MRR × termMonths)
- **Quote Status Flow**: DRAFT → PENDING → [PENDING_APPROVAL → APPROVED/REJECTED] → ACCEPTED → FINALIZED

### 5. Formula Quick Reference
Add a collapsible section with all formulas:
```
Line Item Pricing:
  unitPrice = matchingTier?.tierPrice ?? listPrice
  lineTotal = unitPrice × quantity
  netPrice = lineTotal - discountAmount

Quote Totals:
  subtotal = sum(lineItems.netPrice)
  total = subtotal - quoteDiscounts + taxAmount
  baseAmount = total × exchangeRate (to base currency)

Recurring Revenue:
  MRR = sum(recurringLines normalized to monthly)
  ARR = MRR × 12
  TCV = oneTimeTotal + (MRR × termMonths)

Proration:
  proratedAmount = (monthlyPrice / daysInMonth) × remainingDays
```

### 6. Interactive Worked Example
Add a "Trace Through" section showing a complete example:
1. **Setup**: Create Quote for "Acme Corp" using "Partner" price book (EUR currency)
2. **Add Product**: Add "Laptop Pro Bundle" to quote
3. **Configure**: Select i7 CPU (+$0), 32GB RAM (+$200), 512GB SSD (+$100)
4. **Pricing**: Show list price lookup, tier check, option adjustments
5. **Discount**: Apply 10% contract discount
6. **Tax**: Calculate 8% tax based on customer address
7. **Currency**: Convert to base USD for reporting
8. **Finalize**: Show all calculated fields (subtotal, discount, tax, total, MRR, ARR, TCV)

### 7. Enum Quick Reference
Add a reference card showing all enums with values:
- ProductType: STANDALONE, BUNDLE
- BillingFrequency: ONE_TIME, MONTHLY, QUARTERLY, ANNUAL, CUSTOM
- QuoteStatus: DRAFT, PENDING, PENDING_APPROVAL, APPROVED, REJECTED, ACCEPTED, FINALIZED, CANCELLED
- DiscountType: PERCENTAGE, FIXED_AMOUNT
- DiscountScope: LINE_ITEM, QUOTE, PRODUCT_CATEGORY
- ContractStatus: DRAFT, ACTIVE, EXPIRED
- AttributeType: TEXT, NUMBER, BOOLEAN, SELECT, DATE
- RuleType: CONFIGURATION, PRICING
- RuleTrigger: ON_PRODUCT_ADD, ON_QUANTITY_CHANGE, ON_QUOTE_SAVE, ON_FINALIZE
- AffinityType: CROSS_SELL, UPSELL, ACCESSORY, REQUIRED, FREQUENTLY_BOUGHT, SUBSCRIPTION_ADDON
- QuestionType: SINGLE_CHOICE, MULTIPLE_CHOICE, RANGE, YES_NO
- RecommendationSource: RULE_BASED, AI_GENERATED, QUESTIONNAIRE, MANUAL
- RecommendationAction: SHOWN, ACCEPTED, DISMISSED
- TierType: UNIT_PRICE, FLAT_PRICE

### 8. Relationship Explanation Cards
Add visual cards explaining complex relationships:
- "When does Contract Pricing apply?" → Flowchart showing customer → active contract → price entry check
- "How do Discounts Stack?" → Diagram showing line vs quote scope, stackable vs exclusive
- "Product Affinity Flow" → How source product triggers recommendation for target product
- "Questionnaire Scoring" → How answers map to products with relevance scores

## Components to Create/Modify

### New Components
1. `LearnTableOfContents.vue` - Sticky navigation sidebar/bar
2. `LearnCollapsibleSection.vue` - Reusable collapsible wrapper
3. `LearnERDiagram.vue` - Interactive Vue Flow ER diagram
4. `EntityNode.vue` - Custom Vue Flow node for entities
5. `EntityDetailPanel.vue` - Side panel for entity details
6. `LearnBusinessLogic.vue` - Expandable cards with Mermaid flowcharts
7. `LearnFormulaReference.vue` - Formula quick reference section
8. `LearnWorkedExample.vue` - Interactive stepper trace-through example
9. `LearnEnumReference.vue` - Enum quick reference card
10. `LearnRelationshipCards.vue` - Relationship explanation with Mermaid

### Modified Components
1. `learn.vue` - Add TOC, collapsible sections, new layout
2. `CPQFlowDiagram.vue` - Enhance with Vue Flow for interactivity (optional)
3. `EntityHierarchy.vue` - Add missing hierarchy trees
4. `GlossaryTerm.vue` - Minor styling updates for new groups

### New Dependencies
```json
{
  "@vue-flow/core": "^1.48.1",
  "@vue-flow/minimap": "^1.5.4",
  "@vue-flow/controls": "^1.1.2",
  "@vue-storefront/nuxt-mermaid": "^1.0.0"
}
```

> **Note:** Using `@vue-storefront/nuxt-mermaid` instead of `nuxt-mermaid-string` as it's actively maintained and designed for Nuxt 3.

## Spec Deltas

This change modifies the `learning-ui` spec with:
- New glossary term requirements for Guided Selling group
- New ER diagram requirements for complete entity coverage
- New hierarchy requirements for missing entity groups
- New requirements for business logic documentation
- New requirements for formula reference
- New requirements for worked examples
- New requirements for enum reference
- New requirements for relationship explanations

## Dependencies

- Existing `learning-ui` spec
- Prisma schema as source of truth for entities
- ApexCharts for any chart-based visualizations
- Nuxt UI components for cards and layout

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Learn page becomes too long | Organize into collapsible sections with clear navigation |
| ER diagram becomes overwhelming | Provide simplified/full toggle, color coding by domain |
| Business logic docs become outdated | Reference spec files where possible, add note about source of truth |
| Performance impact from large diagrams | Use lazy loading for heavy components |

## Success Criteria

1. All 31 database models documented in glossary
2. ER diagram shows complete entity relationships
3. All business logic formulas documented with examples
4. Users can trace a quote from creation to finalization
5. All enums documented with all values
6. Learn page load time remains under 2 seconds
