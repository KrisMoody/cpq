# Proposal: Enhance CPQ User Interface

## Change ID
`enhance-quote-editor-ui`

## Summary
Enhance the CPQ application UI to fully integrate customers, discounts, and rules - adding navigation, dashboard visibility, and enabling the full CPQ workflow within the quote editor.

## Background
The `add-cpq-features` change introduced backend capabilities for customers, discounts, and rules. While management pages exist for these entities (`/customers`, `/discounts`, `/rules`), there are significant UX gaps:

1. **Navigation**: No links to Customers, Discounts, or Rules in main navigation
2. **Dashboard**: No visibility into these entities on the home page
3. **Quote Editor**: Cannot interact with customers, discounts, or see rule effects
4. **Integration**: These features exist in isolation rather than as part of the CPQ workflow

## Problem Statement
Users cannot discover or efficiently use the new CPQ capabilities:
1. Navigation only shows Dashboard, Products, Quotes, Learn - hiding key features
2. Dashboard shows Products, Quotes, Price Books stats but not Customers, Discounts, Rules
3. Quote editor doesn't show customer info or allow customer changes
4. No way to apply discounts to quotes from the quote editor
5. Rules fire silently - users don't understand why approval is needed
6. Line item quantities require add/remove rather than inline edit

## Proposed Solution

### 1. Navigation Enhancement
- Add "Customers", "Discounts", "Rules" to main navigation
- Group under a "Settings" or "Configure" dropdown to avoid clutter
- Highlight active section

### 2. Dashboard Enhancement
- Add stats cards for Customers, Discounts, Rules
- Add quick links to create customer, create discount, create rule
- Show recent customers alongside recent quotes

### 3. Quote Editor Enhancement
- **Customer Section** - Show customer info and allow selection/change
- **Discount Application** - Modal to apply available discounts, show applied discounts
- **Rules Panel** - Display active rules, warnings, and approval requirements
- **Inline Editing** - Edit quantities directly in line items
- **Enhanced Summary** - Breakdown of discounts with explanations

## Scope

### In Scope
- **Navigation**: Add Customers, Discounts, Rules links to header nav
- **Dashboard**: Add stats and quick links for new entities
- **Quote Editor**: Customer selection/display, discount application, rules panel
- **Inline Editing**: Edit line item quantities directly
- **Approval Workflow**: Submit, approve, reject with reasons
- **Discount UI**: Apply modal, manual discount entry, remove discounts

### Out of Scope
- Bundle configuration changes (existing BundleConfigurator is sufficient)
- Product catalog browsing enhancements
- Batch quote operations
- Quote versioning/comparison
- PDF export
- Price book management UI (existing pages are sufficient)

## Dependencies
- `add-cpq-features` change must be applied (provides Customer, Discount, Rule entities and APIs)
- Existing composables: useQuotes, useCustomers, useDiscounts, useRules

## Risks
- **Complexity**: Quote editor could become cluttered; mitigate with collapsible panels
- **Performance**: Loading discounts/rules/customer data; mitigate with lazy loading
- **UX**: Too many actions available; mitigate with contextual display based on quote status

## Success Criteria
- User can select/change customer on a draft quote
- User can apply discounts and see them reflected in totals
- User can see which rules triggered and why approval is needed
- User can edit line item quantities inline
- Quote approval workflow is complete (submit → approve/reject)
