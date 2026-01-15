# Proposal: Add Quote Submit Button for Non-Approval Quotes

## Summary

Add a "Submit Quote" button in the Quote Editor for quotes that don't require approval, enabling users to transition quotes from DRAFT to APPROVED status.

## Problem

Currently, the `QuoteApprovalBanner` component only shows a "Submit for Approval" button when `requiresApproval: true`. When a quote doesn't require approval (`requiresApproval: false`), no banner or submit button is displayed, leaving users with no way to advance the quote from DRAFT status through the UI.

**Current behavior (lines 32-42 of QuoteApprovalBanner.vue):**
```typescript
case 'DRAFT':
  if (props.quote.requiresApproval) {
    return { /* show banner with Submit button */ }
  }
  return null  // ← No UI when approval NOT required
```

## Solution

Show a banner with a "Submit Quote" button for DRAFT quotes regardless of whether approval is required. The button label and message will differ based on the `requiresApproval` flag:

| `requiresApproval` | Banner Color | Title | Button Label |
|--------------------|--------------|-------|--------------|
| `true` | Warning (yellow) | "Approval Required" | "Submit for Approval" |
| `false` | Info (blue) | "Ready to Submit" | "Submit Quote" |

Both buttons call the same `emit('submit')` action, which triggers the existing `/api/quotes/{id}/submit` endpoint. The backend already handles both cases correctly (auto-approving when no approval is needed).

## Scope

- **In scope:** QuoteApprovalBanner component update, quotes spec delta
- **Out of scope:** Backend changes (already works correctly), other status transitions

## Risks

None. This is a minimal UI fix that uses existing backend functionality.
