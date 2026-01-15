# Fix Discount Percent Rule Context

## Problem

When applying a 100% discount to a quote (or any discount > 25%), the "Large discount approval" rule does not trigger. This is a bug in the rule evaluation context.

### Root Cause

The rule in the seed data checks `quote.discountPercent`:

```typescript
condition: {
  field: 'quote.discountPercent',
  operator: 'greaterThan',
  value: 25
}
```

However, the context object passed to rule evaluation in `calculate.post.ts` (lines 213-223) does **not** include a `discountPercent` field.

## Solution

Align with enterprise CPQ patterns (e.g., Salesforce CPQ) by:

1. **Calculating discount percent per line item** - Each line item tracks its own discount percentage based on `(discount / (listPrice × quantity)) × 100`

2. **Exposing `maxLineDiscountPercent` in rule context** - The maximum discount percentage across all line items, allowing rules to check "any line with >X% discount"

3. **Also exposing aggregate `discountPercent`** - Total discount as a percentage of gross subtotal, for quote-level threshold checks

This follows the enterprise pattern where approval rules typically check:
- Maximum line-item discount (most common for discount approval)
- Quote total thresholds
- Aggregate discount percentage

## Scope

**Files affected:**
- `server/api/quotes/[id]/calculate.post.ts` - Add discount calculations to context
- `prisma/seed.ts` - Update existing rule + add new rule demonstrating both patterns

**Spec affected:**
- `pricing` - Add requirement for discount metrics in rule context

## Impact

- Low risk: additive change to existing context object
- Fixes broken approval rule functionality
- Aligns with enterprise CPQ patterns
- No breaking changes to existing behavior
