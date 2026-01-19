# Move Back Button to Breadcrumbs

## Summary
Consolidate the "Back to {route}" navigation pattern by replacing individual back buttons on detail/edit pages with a single back icon button integrated as the first element of the breadcrumb navigation.

## Motivation
Currently, each detail and edit page (e.g., `/products/[id]`, `/products/new`) has its own "Back to Products" button placed above the page content. This creates:
- Visual redundancy with breadcrumbs that already show the navigation path
- Inconsistent placement (before the page header)
- Extra markup repeated across 30+ pages

Integrating the back navigation into breadcrumbs provides:
- A single, consistent location for back navigation
- Cleaner page layouts (no separate back button before content)
- Reduced code duplication

## Changes

### Breadcrumb Component Enhancement
Add a back button as the first element in the breadcrumb navigation bar:
- Icon-only button (left arrow) with no text label
- Appears when breadcrumbs have more than one item (indicating a parent exists)
- Navigates to the parent route (the second-to-last breadcrumb's `to` value)

### Page Cleanup
Remove the standalone "Back to {route}" `<UButton>` components from all detail and edit pages.

## Scope
- **Modified**: `app/layouts/default.vue` - Add back button to breadcrumbs
- **Modified**: ~30 pages in `app/pages/` that have "Back to X" buttons

## Out of Scope
- Changes to mobile navigation behavior
- Changes to breadcrumb generation logic in `useBreadcrumbs.ts`
- Changes to page content or layout beyond removing the back button
