## Context
The CPQ application uses a sidebar navigation with section headers and groups. Pages follow standard CRUD patterns (`/entity`, `/entity/new`, `/entity/[id]`) with some having nested routes (`/quotes/[id]/preview`). The previous navigation refactor (archived) explicitly listed breadcrumbs as a non-goal; this change adds them as a new enhancement.

**Stakeholders**: All users navigating detail pages
**Constraints**: Must integrate with existing sidebar navigation structure, work with Nuxt 4 routing

## Goals / Non-Goals

**Goals:**
- Provide clear location context showing full navigation path
- Enable quick navigation to parent sections
- Support all existing route patterns (index, new, [id], nested)
- Work consistently across desktop and mobile layouts

**Non-Goals:**
- Dynamic entity names in breadcrumbs (use generic labels for simplicity)
- Breadcrumb-based page titles (pages manage their own titles)
- Replacing existing back buttons (coexist for explicit navigation)

## Decisions

### Decision 1: Derive breadcrumbs from navigation structure
**Choice**: Map routes to the existing `navigation` config in `default.vue` to show full context (e.g., "Admin > Catalog > Products")
**Rationale**:
- Provides consistent hierarchy matching what users see in sidebar
- Single source of truth for navigation structure
- Avoids maintaining separate breadcrumb config

**Alternatives considered**:
- Route-only breadcrumbs: Simpler but loses section context (no "Admin" or "Catalog" grouping)
- Page-defined breadcrumbs via `definePageMeta`: More flexible but requires every page to define its breadcrumbs

### Decision 2: Generic labels for dynamic routes
**Choice**: Use generic labels ("View", "Edit", "New") for dynamic route segments
**Rationale**:
- No data fetching required for breadcrumbs
- Consistent rendering (no loading states in breadcrumbs)
- Keeps breadcrumb logic simple and deterministic

**Alternatives considered**:
- Fetch entity names: More descriptive but adds complexity, loading states, and potential errors

### Decision 3: Composable-based implementation
**Choice**: Create `useBreadcrumbs()` composable that derives breadcrumb items from current route + navigation config
**Rationale**:
- Encapsulates breadcrumb logic away from layout template
- Enables testing and reuse
- Follows existing composable patterns in the codebase

### Decision 4: Placement in layout
**Choice**: Render breadcrumbs in `default.vue` layout, positioned after mobile header and before page slot
**Rationale**:
- Consistent placement across all pages
- No per-page template changes needed
- Breadcrumbs visible before page content loads

## Route-to-Breadcrumb Mapping

| Route | Breadcrumb Path |
|-------|-----------------|
| `/` | Dashboard |
| `/products` | Admin > Catalog > Products |
| `/products/new` | Admin > Catalog > Products > New |
| `/products/abc123` | Admin > Catalog > Products > View |
| `/quotes` | Sales > Quotes |
| `/quotes/new` | Sales > Quotes > New |
| `/quotes/abc123` | Sales > Quotes > View |
| `/quotes/abc123/preview` | Sales > Quotes > View > Preview |
| `/learn` | Learn |

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Navigation structure changes break breadcrumbs | Incorrect breadcrumb paths | Single source of truth in navigation config; test coverage |
| Mobile space constraints | Breadcrumbs may wrap on small screens | Truncate middle items with ellipsis on mobile |
| Pages outside navigation | No breadcrumbs for unlisted routes | Fallback to route-based breadcrumbs or hide |

## Open Questions
- None at this time
