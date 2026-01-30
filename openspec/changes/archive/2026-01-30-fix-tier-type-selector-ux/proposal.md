# Change: Fix Tier Type Selector UX

## Why
The current price book entry tier editing UI shows a "Type" dropdown on each tier row, suggesting that each tier can have a different type. However:
- The backend `priceLookup.ts` only uses the **first tier's type** to determine the calculation method for all tiers
- The frontend already enforces uniform types via `onTierTypeChange()` which propagates changes to all tiers
- This creates a confusing UX where users see per-tier control but experience entry-level behavior

## What Changes
- Move the tier type selector from individual tier rows to the entry level (above the tier list)
- Display the selected type once, making it clear it applies to all tiers
- Remove redundant type dropdowns from each tier row
- Conditionally show the appropriate input field (Price vs Discount %) based on selected type

## Impact
- Affected specs: `price-books` (UI requirement update)
- Affected code:
  - `app/pages/price-books/[id].vue` (tier editing UI)
