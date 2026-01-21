# Tasks: Add Subscription Visibility to Quote Line Items

## Phase 1: API & Type Updates

- [x] **1.1** Update `QuoteLineItem` interface in `useQuotes.ts` to include:
  - `termMonths?: number`
  - `product.billingFrequency`
  - `product.customBillingMonths`
  - `product.defaultTermMonths`

- [x] **1.2** Update quote line item API queries to include product billing fields:
  - `server/api/quotes/[id].get.ts` (already had the fields)
  - `server/api/quotes/[id]/lines.post.ts` (added customBillingMonths)
  - `server/api/quotes/[id]/bundles.post.ts` (added all billing fields)

## Phase 2: Display Helpers

- [x] **2.1** Create `useBillingDisplay` composable with helper functions:
  - `formatPriceWithFrequency(price, frequency, customMonths)` → "$100/mo"
  - `getBillingLabel(frequency)` → "Monthly", "Annual", etc.
  - `calculateLineMRR(netPrice, frequency, customMonths)` → normalized monthly value

## Phase 3: UI Implementation

- [x] **3.1** Update `QuoteLinesTable.vue` header row to add Term column (between Qty and Unit Price)

- [x] **3.2** Add billing frequency badge to product name cell:
  - Show "Monthly", "Annual", "One-Time" etc.
  - Use subtle badge styling (gray for one-time, blue for recurring)

- [x] **3.3** Update Unit Price column to show frequency suffix:
  - One-time: "$100.00"
  - Monthly: "$100.00/mo"
  - Annual: "$1,200.00/yr"

- [x] **3.4** Add Term column display:
  - Show term when applicable (e.g., "12 mo", "36 mo")
  - Show "-" for one-time products

- [x] **3.5** Update child line items (bundle options) to follow same patterns

## Phase 4: Validation

- [x] **4.1** TypeScript check passes
- [x] **4.2** Sample quote data updated with billing frequencies
