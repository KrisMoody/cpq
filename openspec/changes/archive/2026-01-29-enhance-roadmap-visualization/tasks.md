# Tasks: Enhance Roadmap Page Visualization

## 1. Remove Phase 3 "isComplex" Flag

- [x] 1.1 Remove `isComplex` property from Phase interface in `app/config/phases.ts`
- [x] 1.2 Remove `isComplex: true` from Phase 3 definition
- [x] 1.3 Remove warning icon logic from `PhaseBadge.vue` component
- [x] 1.4 Remove "Complex" label from roadmap page phase cards

## 2. Extend Phase Data Model

- [x] 2.1 Add new Phase interface fields: `details`, `goals`, `keyDeliverables`, `upcomingChanges`
- [x] 2.2 Add detailed content for Phase 1 (Core Quoting)
- [x] 2.3 Add detailed content for Phase 2 (Enhanced Pricing)
- [x] 2.4 Add detailed content for Phase 3 (Subscriptions & Contracts) with `upcomingChanges` about GA evolution
- [x] 2.5 Add detailed content for Phase 4 (Product Configuration)
- [x] 2.6 Add detailed content for Phase 5 (Guided Selling)

## 3. Create Roadmap Components

- [x] 3.1 Create `app/components/roadmap/PhaseDetailCard.vue` - expandable card with phase info
- [x] 3.2 Create `app/components/roadmap/MermaidDiagram.vue` - Mermaid wrapper for diagrams
- [x] 3.3 Create `app/components/roadmap/StrategySelector.vue` - interactive strategy picker
- [x] 3.4 Create `app/components/roadmap/PhaseMetricsChart.vue` - ApexCharts entity distribution

## 4. Add Mermaid Diagram Data

- [x] 4.1 Add data model ER diagram definitions per phase to `phases.ts`
- [x] 4.2 Add domain flow diagram definitions per phase
- [x] 4.3 Add GA integration diagram definitions
- [x] 4.4 Test Mermaid rendering for all diagram types

## 5. Implement Strategy-Filtered Content

- [x] 5.1 Define `StrategyContent` interface in `phases.ts`
- [x] 5.2 Add strategy-specific extensibility patterns for each strategy option
- [x] 5.3 Add strategy-specific decisions for each strategy option
- [x] 5.4 Add strategy-specific entity notes for each strategy option
- [x] 5.5 Create `getContentForStrategy(strategyId)` function in `usePhase.ts`

## 6. Update Roadmap Page

- [x] 6.1 Replace phase cards with expandable `PhaseDetailCard` components
- [x] 6.2 Add entity relationship diagrams section (tabbed: Data Model / Domain Flow / GA Integration)
- [x] 6.3 Refactor Integration Strategy Options to use `StrategySelector` with selection state
- [x] 6.4 Make Extensibility Patterns section reactive to selected strategy
- [x] 6.5 Make Decisions Needed section reactive to selected strategy
- [x] 6.6 Add entity count donut chart using `PhaseMetricsChart`
- [x] 6.7 Update entity list to show strategy-specific notes when strategy selected

## 7. Add ApexCharts Visualizations

- [x] 7.1 Add entity count per phase donut chart
- [x] 7.2 Ensure charts support dark mode

## 8. Entity Extension Examples

- [x] 8.1 Add EntityExtensionExample interface to phases.ts
- [x] 8.2 Add entity extension examples for "extend" strategy (Product, ProductProperty, Document)
- [x] 8.3 Add entity extension examples for "reference" strategy (Product, Document, ProductProperty)
- [x] 8.4 Add entity extension examples for "hybrid" strategy (Product, ProductProperty, Document, Customer)
- [x] 8.5 Add implications (positive, negative, considerations) for each strategy
- [x] 8.6 Add Entity Extension Examples section to roadmap page (expandable cards with schema diffs)
- [x] 8.7 Add Strategy Implications Summary section (pros, cons, considerations)

## 9. Testing & Polish

- [x] 9.1 Run lint and type checks
- [x] 9.2 Run prettier to format files
