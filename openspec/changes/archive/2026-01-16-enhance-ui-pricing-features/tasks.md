# Tasks: Enhance UI Pricing Features

## Phase 1: Core Tax & Discount Visibility

### Task 1.1: Add isTaxable to Product Pages
**Files:** `app/pages/products/[id].vue`, `app/pages/products/new.vue`, `app/composables/useProducts.ts`

- [x] 1.1.1 Add `isTaxable` to product form state in `[id].vue` (default true)
- [x] 1.1.2 Add checkbox field with hint text in edit form
- [x] 1.1.3 Include `isTaxable` in handleSave payload
- [x] 1.1.4 Add same checkbox to `new.vue` create form
- [x] 1.1.5 Ensure composable handles `isTaxable` in create/update functions
- [x] 1.1.6 Show current taxable status in view mode (Non-Taxable badge)

**Verification:** Create a non-taxable product, add to quote, verify tax calculation excludes it

### Task 1.2: Add PRODUCT_CATEGORY Scope to Discounts
**Files:** `app/pages/discounts/[id].vue`, `app/pages/discounts/new.vue`

- [x] 1.2.1 Add PRODUCT_CATEGORY option to `scopeOptions` array
- [x] 1.2.2 Add `categoryId` to form state
- [x] 1.2.3 Import and use `useCategories` composable
- [x] 1.2.4 Add conditional category selector when scope is PRODUCT_CATEGORY
- [x] 1.2.5 Include `categoryId` in create/update payloads
- [x] 1.2.6 Apply same changes to `new.vue`

**Verification:** Create category-scoped discount, apply to quote, verify it affects only matching products

### Task 1.3: Show Inline Discounts on Quote Line Items
**Files:** `app/components/cpq/QuoteLineItem.vue`

- [x] 1.3.1 Accept `appliedDiscounts` prop (already available from parent)
- [x] 1.3.2 Filter discounts specific to this line item
- [x] 1.3.3 Add discount display row below main line item
- [x] 1.3.4 Format as "↳ {discount name}: -{amount}"
- [x] 1.3.5 Style with muted text, indented alignment

**Verification:** Apply line-level discount, verify it appears inline on the line item

### Task 1.4: Show Tax Exemption in Quote Customer Card
**Files:** `app/components/cpq/QuoteCustomerCard.vue`

- [x] 1.4.1 Check `customer.isTaxExempt` property
- [x] 1.4.2 Add UBadge showing "Tax Exempt" status
- [x] 1.4.3 Check `customer.taxExemptExpiry` for expiration
- [x] 1.4.4 Use warning color if exemption is expired
- [x] 1.4.5 Show expiry date in badge or tooltip

**Verification:** Assign tax-exempt customer to quote, verify badge appears

## Phase 2: Quote Context Improvements

### Task 2.1: Add Unit of Measure to Quote Line Items
**Files:** `app/components/cpq/QuoteLineItem.vue`, `app/composables/useQuotes.ts`

- [x] 2.1.1 Ensure unit info is included in line item data from API
- [x] 2.1.2 Display quantity with unit abbreviation (e.g., "5 hrs")
- [x] 2.1.3 Display unit price with unit (e.g., "$50/hr")
- [x] 2.1.4 Handle products without units gracefully

**Verification:** Add product with unit to quote, verify unit displays correctly

### Task 2.2: Enhance Contract Pricing Display
**Files:** `app/components/cpq/QuoteLineItem.vue`

- [x] 2.2.1 Check for `contractInfo` prop (already passed from parent)
- [x] 2.2.2 Add "Contract Price" badge when contract pricing active
- [x] 2.2.3 Show original price crossed out or in parentheses
- [x] 2.2.4 Calculate and show discount percentage
- [x] 2.2.5 Link badge to contract detail page

**Verification:** Create contract with custom price, verify display on quote line item

### Task 2.3: Add Tax Rate Preview to Pricing Summary
**Files:** `app/components/cpq/PricingSummary.vue`

- [x] 2.3.1 Tax breakdown already displayed after calculation
- [x] 2.3.2 Tax exempt indicator already shown
- [x] 2.3.3 Note: Real-time preview deferred (requires additional API calls)

**Note:** Existing implementation already shows tax breakdown after calculation. Pre-calculation preview deferred.

## Phase 3: Contract & Customer Enhancements

### Task 3.1: Show Standard Price in Contract Entry Form
**Files:** `app/pages/contracts/[id].vue`, `server/api/contracts/[id].get.ts`

- [x] 3.1.1 Enhanced API to return standard price from customer's price book
- [x] 3.1.2 Show "Standard Price" column in price entries table
- [x] 3.1.3 Calculate discount/premium percentage vs standard
- [x] 3.1.4 Show percentage with color coding (green for discount, red for premium)
- [x] 3.1.5 Handle case where product has no price book entry

**Verification:** Add contract price, verify standard price comparison appears

### Task 3.2: Enhance Customer Contracts List
**Files:** `app/pages/customers/[id].vue`

- [x] 3.2.1 Highlight currently active contracts with green border
- [x] 3.2.2 Show discount percentage as badge with color coding
- [x] 3.2.3 Add "Currently Active" badge for active contracts
- [x] 3.2.4 Show custom prices count inline

**Verification:** View customer with contract, verify pricing summary in contract card

### Task 3.3: Add Currency Mismatch Warning
**Files:** `app/pages/customers/[id].vue`

- [x] 3.3.1 Compare customer currency with assigned price book currency
- [x] 3.3.2 If mismatch, show warning alert
- [x] 3.3.3 Explain potential pricing inconsistency
- [x] 3.3.4 Only show when both are set (not default)

**Verification:** Set mismatched currency/price book, verify warning appears

## Phase 4: Enhanced Tax Visibility

### Task 4.1: Add Taxable Column to Products Table
**Files:** `app/components/tables/ProductsTable.vue`

- [x] 4.1.1 Add `isTaxable` column accessor to table columns
- [x] 4.1.2 Add template rendering for Tax column with badge styling
- [x] 4.1.3 Add Tax badge to mobile card view

**Verification:** View products list, verify Taxable/Non-Taxable column displays

### Task 4.2: Add Taxable Badge to Product Cards
**Files:** `app/components/cpq/ProductCard.vue`

- [x] 4.2.1 Show "Non-Taxable" badge in card footer for non-taxable products

**Verification:** View products in card view, verify Non-Taxable badge appears

### Task 4.3: Show Taxable Status in Quote Add Product Modal
**Files:** `app/pages/quotes/[id]/index.vue`

- [x] 4.3.1 Add [Non-Taxable] suffix to product labels in dropdown
- [x] 4.3.2 Add computed property for selected product details
- [x] 4.3.3 Show taxable/non-taxable badge when product is selected
- [x] 4.3.4 Add explanatory text for non-taxable products

**Verification:** Add product to quote, verify taxable status shows in modal

### Task 4.4: Add Taxable Indicator to Quote Line Items
**Files:** `app/components/cpq/QuoteLineItem.vue`, `server/api/quotes/[id].get.ts`, `app/composables/useQuotes.ts`

- [x] 4.4.1 Add `isTaxable` to product select in quote API
- [x] 4.4.2 Add `isTaxable` to QuoteLineItem interface
- [x] 4.4.3 Show "Non-Taxable" badge next to product name on line items

**Verification:** View quote with non-taxable products, verify badge displays on line items

## Phase 5: List View Enhancements

### Task 5.1: Add MRR Column to QuotesTable
**Files:** `app/components/tables/QuotesTable.vue`, `server/api/quotes/index.get.ts`

- [x] 5.1.1 Add `mrr` and `arr` to quotes list API response
- [x] 5.1.2 Add MRR column to desktop table
- [x] 5.1.3 Show MRR in mobile card view with "/mo" suffix
- [x] 5.1.4 Display dash when MRR is zero/null

**Verification:** View quotes list with recurring products, verify MRR column displays

### Task 5.2: Add Currency Column to PriceBooksTable
**Files:** `app/components/tables/PriceBooksTable.vue`

- [x] 5.2.1 Add currency column accessor
- [x] 5.2.2 Add badge rendering for currency code
- [x] 5.2.3 Include currency badge in mobile card view

**Verification:** View price books list, verify currency code displays

### Task 5.3: Add Tax Exempt Status to CustomersTable
**Files:** `app/components/tables/CustomersTable.vue`

- [x] 5.3.1 Add tax exempt column with expiry check logic
- [x] 5.3.2 Show "Exempt" badge (green) for valid exemptions
- [x] 5.3.3 Show "Expired" badge (warning) for expired exemptions
- [x] 5.3.4 Include tax status in mobile card view

**Verification:** View customers list, verify tax exempt status displays correctly

### Task 5.4: Add Validity Column to DiscountsTable
**Files:** `app/components/tables/DiscountsTable.vue`

- [x] 5.4.1 Add validity column with date range logic
- [x] 5.4.2 Create helper function for validity status (Expired/Scheduled/Always/Valid)
- [x] 5.4.3 Add color-coded badges (error/info/neutral/success)
- [x] 5.4.4 Include validity badge in mobile card view

**Verification:** View discounts list, verify validity status displays correctly

## Completion Checklist

- [x] All Phase 1 tasks complete
- [x] All Phase 2 tasks complete
- [x] All Phase 3 tasks complete
- [x] All Phase 4 tasks complete
- [x] All Phase 5 tasks complete
- [ ] Manual testing of all new features
- [ ] No regression in existing functionality
- [x] Code follows project conventions
