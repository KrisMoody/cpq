# Proposal: Fix Recurring Revenue Calculation

## Problem

When a quote containing subscription products is recalculated via the "Recalculate Pricing" button, the MRR, ARR, TCV, and oneTimeTotal fields are not populated. The Quote Summary UI shows these metrics only when `mrr > 0`, but the values remain at their default of 0.

## Root Cause

The `/api/quotes/[id]/calculate.post.ts` endpoint performs its own inline pricing calculation that only updates:
- `subtotal`
- `discountTotal`
- `total`
- `requiresApproval`

It does **not** calculate or persist:
- `oneTimeTotal`
- `mrr`
- `arr`
- `tcv`

Meanwhile, the `calculateQuoteTotal` function in `server/services/pricingEngine.ts` correctly calculates all these values, but the calculate endpoint doesn't use it.

## Solution

Integrate the recurring revenue calculation into the calculate endpoint. Two options:

**Option A (Recommended):** Call `calculateQuoteTotal` from the pricing engine after line item updates are complete. This function already handles:
- One-time vs recurring revenue split
- MRR calculation with billing frequency normalization
- ARR (MRR × 12)
- TCV (MRR × term + one-time)
- Tax calculation
- Base currency conversion

**Option B:** Extract the recurring revenue logic and add it inline to the calculate endpoint.

Option A is preferred because it:
- Reuses existing, tested logic
- Ensures consistency between different calculation paths
- Reduces code duplication

## Scope

- **Files to modify:** `server/api/quotes/[id]/calculate.post.ts`
- **No UI changes required:** The `PricingSummary` component already displays these metrics when present
- **No schema changes required:** The Quote model already has the fields
- **No spec changes required:** The subscriptions spec already defines this behavior (Requirement: Recurring Revenue Calculations)

## Out of Scope

- Pro-ration calculations (separate feature)
- Line item recurring display enhancements
- Renewal quote generation
