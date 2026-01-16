# Tasks

## Phase 1: Navigation Structure

1. [x] Update `app/layouts/default.vue` - Add Learn as a section header with all 11 learning sections as children under a Learn group
2. [x] Update `expandedGroups` default to include 'learn' group

## Phase 2: Route Structure

3. [x] Create `app/pages/learn/[section].vue` - Dynamic route to handle learning sections (workflow, data-model, glossary, etc.)
4. [x] Update `app/pages/learn/index.vue` - Simplify to show overview or redirect to first section
5. [x] Migrate section content from monolithic learn page into section-specific rendering

## Phase 3: Breadcrumb Enhancement

6. [x] Update `app/composables/useBreadcrumbs.ts` - Support custom breadcrumb labels via route meta
7. [x] Update `app/pages/learn/course/[moduleId].vue` - Set route meta with module title for breadcrumb display

## Phase 4: Cleanup

8. [x] Remove `app/components/learn/LearnTableOfContents.vue` - No longer needed with sidebar navigation
9. [x] Remove TOC-related code from learn pages (sections array, activeSection tracking, intersection observer)

## Phase 5: Validation

10. [x] Verify navigation: All 11 sections accessible from sidebar
11. [x] Verify breadcrumbs: "Learn > Course" on course list, "Learn > Course > Price Books" on module view
12. [x] Verify mobile: Sidebar navigation works correctly on mobile viewports
13. [x] Verify section scrolling/anchoring still works within each section page
