# Change: Add Quote Groups for Complex Deal Structures

## Why
Enterprise sales deals often require grouping line items into logical sections (e.g., phases, departments, optional add-ons). Currently, quotes only support flat line item lists with bundle nesting. This limits the ability to present complex deals with subtotals per section and optional/alternative configurations.

## What Changes
- Add `QuoteGroup` entity to organize line items into named sections
- Support optional groups that customers can accept/decline
- Calculate subtotals per group with rollup to grand total
- Enable UI for managing groups within the quote editor
- Update quote document preview to display grouped sections

## Impact
- Affected specs: `quotes`, new `quote-groups` capability
- Affected code:
  - `prisma/schema.prisma` - New QuoteGroup model
  - `server/services/pricingEngine.ts` - Group-level calculations
  - `server/services/quoteService.ts` - Group management
  - `server/api/quotes/[id]/groups.ts` - New API endpoints
  - `app/components/cpq/` - Quote builder UI updates
  - `app/pages/quotes/[id].vue` - Quote editor updates
