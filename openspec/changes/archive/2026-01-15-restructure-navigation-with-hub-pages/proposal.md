# Change: Restructure Navigation with Hub Pages

## Why
Currently, menu sections (Sales, Admin) and groups (Catalog, Configuration) are purely visual separators without corresponding pages. This makes breadcrumbs non-clickable for these levels, reducing navigation discoverability. Additionally, "Quote Layouts" is misplaced under Sales when it's actually a configuration concern.

## What Changes
- Move "Quote Layouts" from Sales section to Admin > Configuration group
- Create hub pages for:
  - `/sales` - Links to Quotes, Customers, Contracts
  - `/admin` - Links to Catalog and Configuration groups
  - `/admin/catalog` - Links to Products, Categories, Price Books, Attributes, Units
  - `/admin/configuration` - Links to Rules, Discounts, Tax Rates, Currencies, Affinities, Questionnaires, Quote Layouts
- Update navigation structure to use these new routes
- Update breadcrumb composable to make section/group breadcrumbs clickable

## Impact
- Affected specs: navigation (new capability)
- Affected code:
  - `app/layouts/default.vue` - Navigation structure
  - `app/composables/useBreadcrumbs.ts` - Breadcrumb generation
  - `app/pages/sales/index.vue` - New hub page
  - `app/pages/admin/index.vue` - New hub page
  - `app/pages/admin/catalog/index.vue` - New hub page
  - `app/pages/admin/configuration/index.vue` - New hub page
