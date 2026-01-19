## 1. Create Hub Pages
- [x] 1.1 Create `/sales` hub page with links to Quotes, Customers, Contracts
- [x] 1.2 Create `/admin` hub page with links to Catalog and Configuration sections
- [x] 1.3 Create `/admin/catalog` hub page with links to Products, Categories, Price Books, Attributes, Units
- [x] 1.4 Create `/admin/configuration` hub page with links to Rules, Discounts, Tax Rates, Currencies, Affinities, Questionnaires, Quote Layouts

## 2. Restructure Navigation
- [x] 2.1 Move "Quote Layouts" from Sales section to Admin > Configuration group in navigation
- [x] 2.2 Add `to` routes to section and group nav items (Sales, Admin, Catalog, Configuration)
- [x] 2.3 Update navigation type definitions if needed

## 3. Update Breadcrumbs
- [x] 3.1 Update `useBreadcrumbs` to include clickable links for sections and groups
- [x] 3.2 Verify breadcrumb trails work correctly (e.g., Admin > Catalog > Products)

## 4. Verification
- [x] 4.1 Verify all hub pages render correctly and link to their children
- [x] 4.2 Verify breadcrumbs are clickable at all levels
- [x] 4.3 Verify Quote Layouts appears under Admin > Configuration
- [x] 4.4 Run type checks to ensure no TypeScript errors
