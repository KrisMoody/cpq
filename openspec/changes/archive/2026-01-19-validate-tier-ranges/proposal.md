# validate-tier-ranges

## Summary
Implement validation for price tier quantity ranges to prevent overlapping tiers and enforce valid boundaries. This implements the existing requirement in `crud-completeness/spec.md` (Scenario: Validate tier boundaries) which is currently not enforced.

## Problem
Users can currently create overlapping tier ranges (e.g., 1-10 and 2-20), which leads to unpredictable pricing behavior. The `lookupPrice` function simply returns the first matching tier, giving inconsistent results depending on tier order.

## Solution
Add server-side validation when creating/updating price tiers to:
1. Prevent overlapping quantity ranges
2. Ensure `minQuantity >= 1`
3. Ensure `maxQuantity > minQuantity` (when maxQuantity is set)
4. For GRADUATED tiers: enforce contiguous ranges starting from 1

## Scope
- **In scope**: Server-side validation in the entry update endpoint
- **Out of scope**: Client-side validation (nice to have, not required)

## Spec Impact
- No new requirements needed - implements existing `crud-completeness` requirement
- Minor delta to clarify additional edge cases
