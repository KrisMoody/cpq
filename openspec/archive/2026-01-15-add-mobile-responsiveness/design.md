# Design: Mobile Responsiveness

## Context
The CPQ POC application currently has two main mobile responsiveness issues:
1. **CPQ Workflow Diagram**: A horizontal flow diagram with 5 main steps plus branching paths that overflows on mobile
2. **TanStack Tables**: Wide tables with multiple columns that require horizontal scrolling on small screens

Both issues make the app unusable on mobile devices.

## Goals / Non-Goals
**Goals:**
- Make all views usable on mobile devices (down to 320px width)
- Preserve existing desktop functionality and layout
- Create a reusable pattern for responsive tables
- Minimize code duplication

**Non-Goals:**
- Building a fully native mobile experience
- Adding touch gestures beyond standard scrolling
- Creating separate mobile-only views

## Decisions

### Decision 1: CPQ Workflow Diagram Approach
**Decision**: Implement responsive vertical layout for mobile, falling back to hide if too complex

**Rationale**:
- The workflow diagram is educational and adds value on all devices
- A vertical "timeline" layout works well for sequential workflows on mobile
- Hiding is acceptable fallback if the branching sections prove too complex to adapt

**Implementation**:
- Use Tailwind responsive classes (`md:` prefix)
- Convert horizontal flex to vertical stack below 768px
- Show main flow as vertical timeline
- Simplify branching section on mobile (possibly stack instead of grid)

### Decision 2: Responsive Table Strategy
**Decision**: Use conditional rendering to show table on desktop and card list on mobile

**Rationale**:
- TanStack Table is optimized for tabular desktop layouts
- Mobile users benefit from card-based scanning patterns
- Pure CSS solutions (hiding columns) lose important information

**Implementation Pattern**:
```vue
<template>
  <!-- Desktop: Standard table -->
  <div class="hidden md:block">
    <table>...</table>
  </div>

  <!-- Mobile: Card list -->
  <div class="md:hidden space-y-3">
    <div v-for="row in data" class="card">
      <div class="font-medium">{{ row.name }}</div>
      <div class="text-sm text-gray-500">{{ row.secondary }}</div>
      <!-- Expandable details or link to detail page -->
    </div>
  </div>
</template>
```

### Decision 3: Mobile Card Design
**Decision**: Show 2-3 key fields in card with action button

**Card Structure**:
- Primary identifier (name/title) - always visible
- Status badge (if applicable) - always visible
- 1-2 secondary fields - always visible
- Action button (view/edit) - always visible
- Remaining fields - hidden or in expandable section

**Alternatives Considered**:
1. **Horizontal scroll only**: Rejected - poor mobile UX
2. **Column hiding**: Rejected - loses important data
3. **Full detail expansion**: Considered - may add for complex tables

## Risks / Trade-offs

### Risk: Maintenance overhead
Two different layouts to maintain per table.
**Mitigation**: Extract common patterns into reusable components/composables.

### Risk: Feature parity
Some table features (sorting, filtering) may not translate to mobile cards.
**Mitigation**: Keep search/filter at top, sorting can work on mobile cards.

### Trade-off: Information density
Mobile cards show less information at a glance than desktop tables.
**Acceptance**: Mobile users expect to tap for details; optimize for scanning.

## Open Questions
1. Should expandable card details be implemented, or is linking to detail page sufficient?
   - **Recommendation**: Start with link to detail page, add expansion if users need comparison workflows on mobile
