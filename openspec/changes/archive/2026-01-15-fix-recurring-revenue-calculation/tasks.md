# Tasks: Fix Recurring Revenue Calculation

## Implementation Tasks

- [x] **Integrate pricing engine into calculate endpoint**
  - Import `calculateQuoteTotal` from `pricingEngine.ts`
  - Replace the inline quote update at line ~257-264 with a call to `calculateQuoteTotal`
  - Preserve the rules evaluation logic (it should run before the final total calculation)
  - Ensure contract pricing info is still returned in the response

- [x] **Verify response shape**
  - Confirm the returned quote object includes `oneTimeTotal`, `mrr`, `arr`, `tcv`
  - The frontend already expects these fields, no changes needed there

## Validation

- [x] **Manual testing**
  - Create a quote with a subscription product (e.g., "DevTools Basic" - MONTHLY billing)
  - Click "Recalculate Pricing"
  - Verify the "Recurring Revenue" section appears in Quote Summary
  - Verify MRR, ARR, TCV values are correct

- [ ] **Edge cases to verify**
  - Quote with only one-time products (MRR should be 0, section hidden)
  - Quote with mixed one-time and recurring products
  - Quote with annual billing products (MRR = annual price / 12)
  - Quote with custom term override on line item

## Dependencies

None - this is a self-contained bug fix.
