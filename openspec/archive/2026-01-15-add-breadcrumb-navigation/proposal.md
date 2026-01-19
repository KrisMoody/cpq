# Change: Add Breadcrumb Navigation

## Why
Users navigating to detail pages (e.g., viewing a product, editing a quote) lose context of where they are in the application hierarchy. Breadcrumbs provide wayfinding and quick navigation back to parent sections without relying solely on the sidebar.

## What Changes
- Add a breadcrumb component that displays the full navigation path including section context
- Breadcrumbs appear above page content in the default layout, below mobile header
- Route hierarchy maps to navigation structure (e.g., Admin > Catalog > Products > View)
- Detail pages use generic labels (View, Edit, New) rather than fetching entity names
- Existing "Back to X" buttons remain for explicit single-step navigation

## Impact
- Affected specs: learning-ui
- Affected code: `app/layouts/default.vue`, new composable for breadcrumb generation
