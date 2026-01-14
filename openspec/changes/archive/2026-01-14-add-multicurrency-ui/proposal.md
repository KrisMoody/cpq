# Proposal: Add Multi-Currency UI

## Problem Statement
The multi-currency backend was implemented in PR #5 (add-multi-currency), including:
- Currency and ExchangeRate database models
- Full CRUD API endpoints (`/api/currencies/*`)
- `useCurrencies` composable with all necessary methods
- Seed data with 5 currencies (USD, EUR, GBP, CAD, AUD)

However, there is **no UI** for users to:
1. View or manage currencies and exchange rates
2. Select a currency when creating customers, quotes, or price books
3. See currency information in list views

Users cannot access the multi-currency feature through the application.

## Proposed Solution
Add the missing UI components to complete the multi-currency feature:

1. **Currency Management Page** (`/currencies`) - List, create, edit currencies and manage exchange rates
2. **Currency Selectors** - Add currency dropdown to Customer, Quote, and Price Book forms
3. **Navigation Update** - Add "Currencies" link to the Configuration group in sidebar
4. **Currency Display** - Show currency info in relevant list views (customers, quotes)

## Scope
- Frontend only (Vue pages/components)
- Uses existing `useCurrencies` composable and API endpoints
- Follows existing UI patterns (UCard, UFormField, USelect, etc.)

## Out of Scope
- Backend changes (already complete)
- Currency conversion logic (already in currencyService)
- Quote preview currency display (already implemented in PR #5)

## Dependencies
- Requires merged PR #5 (multi-currency backend)
- Uses existing Nuxt UI v4 components

## Risks
- None significant - straightforward UI implementation using existing patterns
