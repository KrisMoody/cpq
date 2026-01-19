# Tasks

## Implementation

- [x] Calculate `grossSubtotal` (sum of listPrice × quantity before discounts) in `calculate.post.ts`
- [x] Calculate per-line discount percentage: `(discount / (listPrice × quantity)) × 100`
- [x] Calculate `maxLineDiscountPercent` (maximum discount % across all line items)
- [x] Calculate aggregate `discountPercent`: `((grossSubtotal - total) / grossSubtotal) × 100`
- [x] Add `maxLineDiscountPercent` and `discountPercent` to rule evaluation context
- [x] Update "Large discount approval" seed rule to use `quote.maxLineDiscountPercent`
- [x] Add new "Heavy quote discount approval" seed rule using `quote.discountPercent > 40`

## Validation

- [x] Test: 100% line-item discount triggers approval rule via `maxLineDiscountPercent`
- [x] Test: 30% line-item discount triggers approval rule
- [x] Test: Multiple lines with different discounts uses the max value
- [x] Test: Zero gross subtotal handles gracefully (no division by zero)
