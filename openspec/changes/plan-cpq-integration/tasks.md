# Tasks: Add Release Phase Markers

## 1. Phase Configuration

- [ ] 1.1 Create `app/config/phases.ts` with phase definitions
- [ ] 1.2 Define phase metadata (number, name, color, description, isComplex)
- [ ] 1.3 Map all entities to phases with extensibility notes
- [ ] 1.4 Map all specs to phases
- [ ] 1.5 Add GA entity mappings per CPQ entity
- [ ] 1.6 Add navigation items to phase mappings

## 2. PhaseBadge Component

- [ ] 2.1 Create `PhaseBadge.vue` component
- [ ] 2.2 Implement color variants per phase (emerald, blue, purple, orange, pink)
- [ ] 2.3 Add tooltip with phase name and description
- [ ] 2.4 Add warning indicator for Phase 3 (complex)
- [ ] 2.5 Support size variants (sm for inline, md for headers)

## 3. Entity Page Integration

- [ ] 3.1 Add phase badge to list page headers
- [ ] 3.2 Add phase badge to detail page headers
- [ ] 3.3 Create composable `usePhase(entityType)` for easy lookup
- [ ] 3.4 Update all entity list pages
- [ ] 3.5 Update all entity detail pages

## 4. Interactive Roadmap Page

- [ ] 4.1 Create `/learn/roadmap` page
- [ ] 4.2 Build phase cards with entity lists
- [ ] 4.3 Implement click-to-filter interaction
- [ ] 4.4 Add dependency arrows/flow between phases
- [ ] 4.5 Add Phase 3 complexity callout section
- [ ] 4.6 Add GA entity mapping table with relationship types
- [ ] 4.7 Add CPQ → GA data flow diagram (Quote → PricingTable)
- [ ] 4.8 Add integration strategy options section (A/B/C with pros/cons)
- [ ] 4.9 Add uncertainties/decisions needed section per phase
- [ ] 4.10 Include extensibility patterns section
- [ ] 4.11 Link entities to their detail pages
- [ ] 4.12 Add roadmap to Learning section navigation

## 5. Documentation

- [ ] 5.1 Add phase comments to Prisma schema models
- [ ] 5.2 Update README with phase overview
- [ ] 5.3 Document GA entity analysis findings
- [ ] 5.4 Document extensibility patterns with code examples
