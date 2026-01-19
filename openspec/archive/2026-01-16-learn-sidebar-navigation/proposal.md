# Change: Learn Sidebar Navigation

## Why
The Learn section currently uses a floating table of contents (TOC) component that appears separately from the main application sidebar. This creates an inconsistent navigation experience where:
- Users must use two different navigation patterns (main sidebar + floating TOC)
- The floating TOC takes up screen space and overlaps content on some viewports
- Learning content sections are not discoverable from the main navigation

Moving Learn content into the main sidebar creates a consistent navigation experience and makes all learning resources immediately accessible.

## What Changes
- **Learn as top-level section**: Add Learn as a section header (alongside Sales and Admin) in the main sidebar navigation
- **Learning content as sidebar items**: Move all 11 learning sections (Course, Workflow, Data Model, etc.) into the sidebar as children under Learn
- **Route-based section navigation**: Create dedicated routes for each learning section to enable proper breadcrumb support
- **Module title in breadcrumbs**: Show actual module titles (e.g., "Price Books") instead of generic "View" when viewing course modules
- **Remove floating TOC**: Remove the LearnTableOfContents component as it's no longer needed

## Impact
- Affected code:
  - `app/layouts/default.vue` - Add Learn section with all children to navigation structure
  - `app/pages/learn/index.vue` - Simplify to redirect or show overview
  - `app/pages/learn/[section].vue` - New: Dynamic route for learning sections
  - `app/pages/learn/course/[moduleId].vue` - Update to set breadcrumb title from module data
  - `app/composables/useBreadcrumbs.ts` - Enhance to support custom breadcrumb titles via route meta
  - `app/components/learn/LearnTableOfContents.vue` - Remove (no longer needed)
