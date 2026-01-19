## 1. Implementation

- [x] 1.1 Modify `submitQuote` in `useQuotes.ts` to rethrow errors after internal handling
- [x] 1.2 Modify `approveQuote` in `useQuotes.ts` to rethrow errors (same pattern)
- [x] 1.3 Modify `rejectQuote` in `useQuotes.ts` to rethrow errors (same pattern)
- [x] 1.4 Verify error display works on quote editor page when submission fails
- [x] 1.5 Test scenario: submit quote without customer assigned - verify error message appears

## 2. UX Improvement (added)

- [x] 2.1 Disable submit button in QuoteApprovalBanner when no customer assigned
- [x] 2.2 Show inline message explaining customer is required before submission
