## Context
The CPQ application needs a scalable navigation pattern that accommodates current features and future growth while providing clear information architecture aligned with CPQ workflows.

**Stakeholders**: All users navigating the application
**Constraints**: Must work within Nuxt UI v4 component library, maintain mobile responsiveness

## Goals / Non-Goals

**Goals:**
- Reduce cognitive load by grouping related features
- Follow CPQ industry conventions for familiarity
- Support responsive behavior across device sizes
- Allow for future navigation expansion without major restructure

**Non-Goals:**
- Role-based navigation hiding (all users see all items for this POC)
- Breadcrumb navigation (keep simple for learning project)
- Search/command palette (future enhancement)

## Decisions

### Decision 1: Sidebar over dropdown menus
**Choice**: Persistent left sidebar with collapsible groups
**Rationale**:
- Industry standard for CPQ applications (Salesforce, Oracle, SAP)
- Better discoverability than nested dropdowns
- Supports keyboard navigation and accessibility
- Scales to 15+ items without redesign

**Alternatives considered**:
- Dropdown menus in top nav: Hides complexity but poor for frequent navigation, harder to scan
- Mega menu: Overkill for current item count, complex to implement

### Decision 2: Workflow-based grouping
**Choice**: Group by CPQ workflow stage (Sales, Catalog, Configuration)
**Rationale**:
- Matches mental model of CPQ users ("I'm configuring the catalog" vs "I'm doing sales")
- Clear separation of concerns
- Mirrors how enterprise CPQ systems organize features

**Alternatives considered**:
- By user role: Would require role-based visibility logic, overengineered for POC
- By entity type: Less intuitive ("what group is Discounts in?")

### Decision 3: Navigation structure
```
├── Dashboard (standalone, top)
├── Sales
│   ├── Quotes
│   └── Customers
├── Catalog
│   ├── Products
│   └── Price Books
├── Configuration
│   ├── Rules
│   └── Discounts
└── Learn (standalone, bottom)
```

### Decision 4: Responsive behavior
**Choice**: Three-tier responsive approach
- **Desktop (≥1024px)**: Full sidebar with labels, always visible
- **Tablet (768-1023px)**: Collapsed sidebar with icons only, expand on hover/click
- **Mobile (<768px)**: Hidden sidebar, hamburger menu triggers slide-out drawer

**Rationale**: Standard responsive pattern, Nuxt UI provides primitives for this

### Decision 5: Implementation approach
**Choice**: Use Nuxt UI's `UNavigationMenu` or build custom with `UCollapsible`
**Rationale**: Nuxt UI v4 has navigation primitives; evaluate if they fit before custom build

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sidebar takes horizontal space | Less content area on small screens | Collapsible sidebar, responsive breakpoints |
| Group labels add visual noise | Users may ignore groupings | Keep groups minimal (3-4), clear icons |
| Breaking change to app layout | All pages affected | Single change in app.vue, pages unaffected |

## Migration Plan
1. Implement sidebar in `app.vue` (replaces header nav)
2. Adjust main content area CSS for sidebar offset
3. Test all existing pages for layout issues
4. No data migration required

**Rollback**: Revert `app.vue` changes (single file)

## Open Questions
- Should Dashboard be inside a group or standalone? (Resolved: standalone at top)
- Should "Learn" have a different visual treatment as non-core feature? (Proposal: subtle styling, bottom of nav)
