# Reorganize Navigation with Section Headers

## Summary
Add visual section headers to the sidebar navigation to clearly separate user-facing sales workflows from admin/configuration areas, improving the UX for sales reps who primarily work with quotes and customers.

## Motivation
The current navigation groups (Sales, Catalog, Configuration) are logically organized but don't visually communicate which areas are for daily sales work vs system administration. Sales reps may feel overwhelmed seeing admin options they rarely use.

## Approach
Add labeled section dividers to create two distinct zones:
1. **SALES** section - Dashboard, Quotes, Customers (the daily workflow)
2. **ADMIN** section - Catalog and Configuration groups (setup/maintenance)

The "Learn" item remains at the bottom as educational content for all users.

## Changes
- Modify sidebar navigation to include section header components
- Add visual dividers between Sales and Admin areas
- Flatten the Sales group so Quotes and Customers are top-level items (reducing clicks)
- Keep Catalog and Configuration as collapsible groups under Admin

## Visual Structure
```
Dashboard

── SALES ──────────────
Quotes
Customers

── ADMIN ──────────────
Catalog
  Products
  Categories
  Price Books
  Attributes
  Units
Configuration
  Rules
  Discounts
  Tax Rates

Learn
```

## Non-Goals
- Role-based access control (no auth changes)
- Hiding admin sections from sales reps (just visual organization)
- Changing any routes or page URLs

## Affected Specs
- `learning-ui` - Navigation requirements updated
