## 1. Core Implementation
- [x] 1.1 Create `useBreadcrumbs` composable in `app/composables/useBreadcrumbs.ts`
- [x] 1.2 Implement route-to-navigation mapping logic to derive full breadcrumb path
- [x] 1.3 Handle dynamic route segments with generic labels (View, New)
- [x] 1.4 Handle nested routes (e.g., `/quotes/[id]/preview`)

## 2. Layout Integration
- [x] 2.1 Add breadcrumb rendering to `app/layouts/default.vue`
- [x] 2.2 Style breadcrumbs with separator icons and proper spacing
- [x] 2.3 Ensure breadcrumbs are clickable links (except current page)
- [x] 2.4 Handle mobile layout (truncation or horizontal scroll)

## 3. Testing
- [x] 3.1 Test breadcrumbs on top-level pages (`/products`, `/quotes`)
- [x] 3.2 Test breadcrumbs on detail pages (`/products/[id]`)
- [x] 3.3 Test breadcrumbs on new pages (`/products/new`)
- [x] 3.4 Test breadcrumbs on nested routes (`/quotes/[id]/preview`)
- [x] 3.5 Verify breadcrumbs update on navigation
