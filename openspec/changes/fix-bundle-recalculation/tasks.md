# Implementation Tasks

## Tasks
- [x] Update `server/api/quotes/[id]/calculate.post.ts` recalculation loop to check product type and parentLineId
- [x] Ensure bundle parent line items (product.type === 'BUNDLE') maintain netPrice = 0 during recalculation
- [x] Fix `server/api/quotes/[id]/bundles.post.ts` to create bundle parents with netPrice = 0 initially
- [x] Fix `server/api/quotes/[id]/calculate.post.ts` to return hierarchical line items (matching GET endpoint behavior)
- [x] Ensure bundle child line items (parentLineId !== null) maintain their parent relationship and get proper pricing
- [x] Test recalculation with quote containing only bundles
- [x] Test recalculation with quote containing only standalone products
- [x] Test recalculation with quote containing mixed bundles and standalone products

## Implementation Notes

### Current Bug Location
File: `server/api/quotes/[id]/calculate.post.ts`, lines 104-156

The current loop:
```typescript
for (const lineItem of quote.lineItems) {
  const priceEntry = quote.priceBook.entries.find(
    (e) => e.productId === lineItem.productId
  )

  if (priceEntry) {
    // Recalculates without checking bundle type or parentLineId
    await prisma.quoteLineItem.update({
      where: { id: lineItem.id },
      data: {
        listPrice,
        discount: lineDiscountAmount,
        netPrice: Math.max(0, netPrice),
      },
    })
  }
}
```

### Required Fix
Add bundle-aware logic:
1. Check if `lineItem.product.type === 'BUNDLE'` - if so, set netPrice = 0
2. Check if `lineItem.parentLineId !== null` - handle as bundle child (keep parentLineId, recalc price normally)
3. Otherwise, handle as standalone product (existing logic)

### Reference Implementation
See `server/services/quoteService.ts` lines 134-176 for the correct pattern used in `recalculateQuote()`.

### Additional Bugs Found

**Bug #2: Bundle Creation**
The bundle creation endpoint also had the same issue - it was setting `netPrice = bundleListPrice * bundleQuantity` instead of 0.

Fixed in `server/api/quotes/[id]/bundles.post.ts` line 151:
- Before: `netPrice: bundleListPrice * bundleQuantity`
- After: `netPrice: 0` (with comment explaining bundle pricing model)

**Bug #3: Calculate Endpoint Response Structure**
The calculate endpoint was returning a flat list of line items, unlike the GET endpoint which returns hierarchical line items with `childLines`. This caused the UI to display bundle children as separate products after recalculation.

Fixed in `server/api/quotes/[id]/calculate.post.ts` lines 328-351:
- Added the same hierarchy organization logic used in GET endpoint
- Filter parent lines (no parentLineId) and map children to their parents
- Return structured `lineItems` with `childLines` property

**Bug #4: Missing Product Fields in Calculate Response**
The calculate endpoint was only selecting a minimal set of product fields (`id`, `name`, `sku`, `type`), missing fields like `isActive`, `isTaxable`, `unitOfMeasure`, and `attributes` that the UI needs. This caused false "inactive product" warnings and missing unit of measure displays.

Fixed in `server/api/quotes/[id]/calculate.post.ts` lines 304-335:
- Updated product select to match GET endpoint
- Now includes: `isActive`, `isTaxable`, `billingFrequency`, `customBillingMonths`, `defaultTermMonths`, `unitOfMeasure`, and `attributes`
- Ensures UI has all necessary product data after recalculation

## Validation Steps
1. Create quote with bundle product (e.g., Developer Laptop bundle)
2. Click "Recalculate" button
3. Verify bundle parent still shows netPrice = 0
4. Verify bundle children still have parentLineId set
5. Verify bundle children appear indented under parent in quote UI
6. Verify quote totals are correct (sum includes children, not parent)
