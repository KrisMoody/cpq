# Change: Fix quote submission error display

## Why
When submitting a quote fails (e.g., customer not assigned), the API returns a 400 error with a helpful message, but the UI silently fails without showing any feedback to the user. This creates confusion because users don't understand why clicking "Submit for Approval" does nothing.

## What Changes
- Fix error propagation from `useQuotes` composable to page components so API errors are properly caught and displayed
- Add explicit error handling scenarios to Quote Submission UI spec

## Impact
- Affected specs: `quotes` (Quote Submission UI requirement)
- Affected code: `app/composables/useQuotes.ts`, `app/pages/quotes/[id]/index.vue`
