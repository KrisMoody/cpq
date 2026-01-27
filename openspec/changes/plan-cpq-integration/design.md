## Context

This CPQ POC is a learning project that will serve as the reference for building CPQ in GetAccept. Based on exploration of GetAccept repositories, we now understand:

1. **PricingTable is a document component**, not a quote - CPQ Quote would output TO PricingTable
2. **GA already has Products and ProductProperties** - CPQ can reference or extend these
3. **Phase 3 integrates with GA Contract Management** - high complexity
4. **Models must be extensible** - GetAccept implementation will add fields, relations, and behaviors

## Goals / Non-Goals

### Goals
- Mark every entity/feature with its release phase (1-5)
- Make phase information visible throughout the UI (list + detail pages)
- Create interactive roadmap page with filtering
- Document GetAccept entity mappings and relationship types
- Document extensibility patterns for future integration
- Highlight uncertainties and decisions needed per phase
- Show the CPQ → GA data flow (especially Quote → PricingTable)

### Non-Goals
- Actually implementing phases separately (everything is already built)
- Building the GetAccept integration itself
- Making final integration decisions (those need stakeholder input)

## Decisions

### Decision 1: Phase indicator locations
**What**: Show badges on both list pages AND detail pages.
**Why**:
- List pages: quick overview when browsing
- Detail pages: context when deep-diving into an entity
- Consistent experience throughout the app

### Decision 2: Interactive roadmap
**What**: Roadmap page with clickable phase filtering and comprehensive documentation.
**Why**:
- Allows focusing on one phase at a time
- Visual representation of build order
- Central location for all integration documentation

**Content**:
- Phase cards with entity lists
- GA entity mapping table
- Integration strategy options (A/B/C)
- Uncertainties and decisions needed
- Extensibility patterns

### Decision 3: Badge styling
**What**: Colored badges with phase number and tooltip.

| Phase | Badge | Color | Tooltip |
|-------|-------|-------|---------|
| 1 | P1 | Green (`emerald`) | Core Quoting (MVP) |
| 2 | P2 | Blue (`blue`) | Enhanced Pricing |
| 3 | P3 | Purple (`purple`) + ⚠️ | Subscriptions & Contracts |
| 4 | P4 | Orange (`orange`) | Product Configuration |
| 5 | P5 | Pink (`pink`) | Guided Selling |

### Decision 4: GA entity mapping documentation
**What**: Include detailed mapping table and relationship diagrams.
**Why**:
- Clarifies that PricingTable ≠ Quote (common misconception)
- Shows data flow from CPQ to GA
- Documents integration points per entity

### Decision 5: Uncertainty documentation
**What**: Explicit "Decisions Needed" sections per phase.
**Why**:
- Makes it clear what's known vs unknown
- Helps stakeholders understand what needs to be decided
- Prevents assumptions during implementation

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Phase assignments change | Config file makes updates easy |
| GA entity analysis incomplete | Document as "based on code exploration" - verify with GA team |
| Integration strategy not decided | Present all options; don't commit to one |
| Phase 3 complexity underestimated | Dedicated callout; recommend spike work |

## Open Questions

1. Should we verify GA entity analysis with GetAccept team?
2. Should the roadmap include effort estimates per phase?
3. Should we prototype the Quote → PricingTable output in this POC?
4. Should we add phase annotations to OpenSpec specs themselves?
