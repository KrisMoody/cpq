# Tasks: Add Interactive Schema Diagram

## Phase 1: Setup
- [x] Install Vue Flow dependencies (`@vue-flow/core`, `@vue-flow/background`, `@vue-flow/controls`, `@vue-flow/minimap`)
- [x] Verify Vue Flow works with Nuxt 4 (check for SSR compatibility)

## Phase 2: Schema Parsing
- [x] Create `composables/usePrismaSchema.ts` composable
- [x] Implement regex-based parser to extract models, fields, and relations from `schema.prisma`
- [ ] Add unit tests for schema parsing with sample schema snippets
- [x] Handle edge cases: self-relations, many-to-many via junction tables

## Phase 3: Custom Node Component
- [x] Create `components/learn/SchemaTableNode.vue` custom node
- [x] Style as database table card with header and field list
- [x] Add visual indicators for PK (key icon), FK (link icon), required (asterisk)
- [x] Implement expand/collapse for field details
- [x] Add connection handles for edges

## Phase 4: Diagram Integration
- [x] Replace `PrismaERD.vue` implementation with Vue Flow
- [x] Transform parsed schema to Vue Flow nodes and edges format
- [x] Implement domain-based initial layout grouping
- [x] Add edge labels for relationship cardinality (1:N, N:1, N:N)
- [x] Style edges with appropriate markers (arrows, etc.)

## Phase 5: Interactive Features
- [x] Add zoom/pan controls via `@vue-flow/controls`
- [x] Add minimap for navigation via `@vue-flow/minimap`
- [x] Add background pattern via `@vue-flow/background`
- [x] Implement fit-to-view on initial load
- [x] Add keyboard shortcuts (zoom, reset view)

## Phase 6: Polish
- [x] Add loading state while parsing schema
- [x] Add error state if schema parsing fails
- [x] Ensure dark mode compatibility
- [x] Test with full CPQ schema (20+ models)
- [x] Verify mobile/touch interactions work

## Validation
- [x] Manual test: Can zoom in/out with mouse wheel
- [x] Manual test: Can pan by dragging background
- [x] Manual test: Can drag individual nodes
- [x] Manual test: Clicking a node expands to show fields
- [x] Manual test: Minimap reflects current viewport
- [x] Manual test: Works in dark mode
