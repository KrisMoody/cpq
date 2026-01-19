# Tasks: Add Multi-Currency UI

## Phase 1: Navigation & Currency Management Page

- [x] Add "Currencies" link to sidebar navigation in `app/layouts/default.vue` (Configuration group)
- [x] Create currencies list page `app/pages/currencies/index.vue` with table showing all currencies
- [x] Create currency detail page `app/pages/currencies/[id].vue` with edit form and exchange rate history
- [x] Create new currency page `app/pages/currencies/new.vue` with create form

## Phase 2: Currency Selectors on Existing Forms

- [x] Add currency selector to customer new form `app/pages/customers/new.vue`
- [x] Add currency selector to customer edit form `app/pages/customers/[id].vue`
- [x] Add currency selector to quote new form `app/pages/quotes/new.vue`
- [x] Add currency selector to price book new form `app/pages/price-books/new.vue`
- [x] Add currency selector to price book edit form `app/pages/price-books/[id].vue`

## Phase 3: Currency Display in Lists

- [x] Show currency column in customers list `app/pages/customers/index.vue`
- [x] Show currency with amounts in quotes list `app/pages/quotes/index.vue`

## Validation

- [x] Verify currencies page loads and displays seeded currencies
- [x] Verify can create new currency with exchange rate
- [x] Verify customer currency selector works on new/edit forms
- [x] Verify quote currency defaults to customer's currency
- [x] Verify price book currency selector works
