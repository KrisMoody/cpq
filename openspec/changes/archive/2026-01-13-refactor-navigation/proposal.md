# Change: Refactor Navigation to Sidebar with Grouped Hierarchy

## Why
The current horizontal navbar has 8 top-level items (Dashboard, Products, Price Books, Quotes, Customers, Discounts, Rules, Learn) which creates visual clutter and does not scale as the application grows. Users lack clear mental models for how features relate to each other.

## What Changes
- **Replace horizontal navbar with persistent left sidebar** following CPQ industry standards (Salesforce CPQ, Oracle CPQ, SAP CPQ patterns)
- **Group navigation items by CPQ workflow stage**:
  - **Sales**: Quotes, Customers (revenue-generating activities)
  - **Catalog**: Products, Price Books (what you sell and pricing)
  - **Configuration**: Rules, Discounts (business logic controlling CPQ behavior)
  - **Dashboard** and **Learn** as standalone items (top/bottom of sidebar)
- **Add collapsible groups** for cleaner navigation on smaller screens
- **Implement responsive behavior**: sidebar collapses to icons on tablet, becomes slide-out drawer on mobile

## Impact
- Affected specs: `learning-ui` (navigation and layout requirements)
- Affected code:
  - `app/app.vue` - major restructure from header nav to sidebar layout
  - Potentially new composable for navigation state (collapsed/expanded)
  - CSS/layout changes for main content area positioning
