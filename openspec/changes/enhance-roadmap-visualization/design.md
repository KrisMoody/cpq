# Design: Enhance Roadmap Page Visualization

## Overview

This design document describes the architecture for enhancing the roadmap page with richer phase information, entity relationship diagrams, and interactive strategy selection.

## Component Architecture

```
roadmap.vue (page)
├── PhaseDetailCard.vue (x5, one per phase)
│   ├── PhaseBadge.vue (existing)
│   ├── Expandable details, goals, deliverables
│   └── upcomingChanges callout (Phase 3 only)
├── Diagrams Section (tabbed)
│   ├── EntityRelationsDiagram.vue (Mermaid ER)
│   ├── DomainFlowDiagram.vue (Mermaid flowchart)
│   └── GAIntegrationDiagram.vue (Mermaid flowchart)
├── PhaseMetricsChart.vue (ApexCharts donut)
├── StrategySelector.vue
│   └── Strategy cards (A/B/C) - clickable
├── Extensibility Patterns Section (reactive)
└── Decisions Needed Section (reactive)
```

## State Management

### Strategy Selection State

The selected strategy is managed via a `ref` at the page level and passed down/emitted up as needed:

```typescript
// roadmap.vue
const selectedStrategy = ref<'extend' | 'reference' | 'hybrid' | null>(null)

// Computed content based on selection
const activeExtensibilityPatterns = computed(() => {
  if (!selectedStrategy.value) return extensibilityPatterns // default all
  return getContentForStrategy(selectedStrategy.value).extensibilityPatterns
})

const activeDecisions = computed(() => {
  if (!selectedStrategy.value) return allDecisions
  return getContentForStrategy(selectedStrategy.value).decisions
})
```

### Phase Expansion State

Each phase card manages its own expanded state:

```typescript
// PhaseDetailCard.vue
const isExpanded = ref(false)
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    phases.ts (config)                        │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ phases[]    │  │ entityMap-   │  │ integration-      │  │
│  │ (enhanced)  │  │ pings[]      │  │ Strategies[]      │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ mermaid-    │  │ strategy-    │  │ extensibility-    │  │
│  │ Diagrams{}  │  │ Content{}    │  │ Patterns[]        │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    usePhase.ts (composable)                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ getContentForStrategy(strategyId): StrategyContent  │   │
│  │ getMermaidDiagram(type, phaseNumber): string        │   │
│  │ getPhaseDetails(phaseNumber): PhaseDetails          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    roadmap.vue (page)                        │
│  selectedStrategy: Ref<string | null>                       │
│  activePatterns: ComputedRef<Pattern[]>                     │
│  activeDecisions: ComputedRef<Decision[]>                   │
└─────────────────────────────────────────────────────────────┘
```

## Mermaid Diagram Structure

Diagrams are stored as string templates in `phases.ts`:

```typescript
export const mermaidDiagrams = {
  // Data model ER diagrams per phase
  dataModel: {
    1: `erDiagram
    Product ||--o{ PriceBookEntry : "has prices in"
    ...`,
    2: `erDiagram
    ...`,
  },

  // Domain flow diagrams per phase
  domainFlow: {
    1: `flowchart LR
    A[Product Catalog] --> B[Price Books]
    ...`,
  },

  // GA integration (global, not per-phase)
  gaIntegration: `flowchart TB
    subgraph CPQ["CPQ System"]
    ...`,
}
```

## Strategy-Specific Content Structure

```typescript
interface StrategyContent {
  id: 'extend' | 'reference' | 'hybrid'
  extensibilityPatterns: ExtensibilityPattern[]
  decisions: Decision[]
  entityNotes: Record<string, string>
}

export const strategyContent: Record<string, StrategyContent> = {
  extend: {
    id: 'extend',
    extensibilityPatterns: [
      // Only patterns relevant to "extend" strategy
      { name: 'Direct field extension', ... },
    ],
    decisions: [
      // Decisions specific to "extend" approach
      { question: 'Which GA tables need schema migration?', ... },
    ],
    entityNotes: {
      'Product': 'Add CPQ fields directly to GA Product table',
      'Quote': 'Create as new table with GA Product references',
    },
  },
  reference: { ... },
  hybrid: { ... },
}
```

## ApexCharts Configuration

### Entity Distribution Donut

```typescript
const chartOptions: ApexOptions = {
  chart: {
    type: 'donut',
  },
  labels: phases.map(p => `P${p.number}: ${p.name}`),
  colors: ['#10b981', '#3b82f6', '#a855f7', '#f97316', '#ec4899'],
  legend: {
    position: 'bottom',
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: { width: 300 },
      legend: { position: 'bottom' },
    },
  }],
}

const series = phases.map(p => getEntitiesForPhase(p.number).length)
```

## UI/UX Considerations

### Strategy Selection Visual Feedback

When a strategy is selected:
1. Selected card gets a prominent border/ring
2. Other cards become slightly faded (opacity)
3. A "Clear Selection" button appears
4. Sections below animate/highlight briefly to show they've changed

### Expandable Phase Cards

- Default: Collapsed, showing name + short description + badge
- On click: Expands to show full details, goals, deliverables
- Phase 3: Shows "Upcoming Changes" callout in expanded view (not a badge)

### Diagram Tabs

```
[ Data Model ] [ Domain Flow ] [ GA Integration ]
┌─────────────────────────────────────────────────┐
│                                                 │
│         (Active diagram renders here)           │
│                                                 │
└─────────────────────────────────────────────────┘
```

- Diagrams filter by selected phase (from phase cards above)
- If no phase selected, show combined/overview diagram

## Dark Mode Support

- Mermaid: Use `theme: 'neutral'` or detect system preference
- ApexCharts: Use `theme.mode: 'dark'` when `colorMode.value === 'dark'`
- All custom colors use Tailwind dark variants

## Mobile Responsiveness

- Phase cards: Stack vertically on mobile
- Diagrams: Horizontal scroll with touch-friendly pan
- Charts: Resize to fit viewport
- Strategy cards: Stack vertically, full-width buttons
