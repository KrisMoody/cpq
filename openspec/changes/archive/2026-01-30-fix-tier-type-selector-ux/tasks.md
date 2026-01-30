# Tasks: Fix Tier Type Selector UX

## Implementation Order

1. [x] **Move tier type selector to entry level**
   - Add a tier type selector above the tiers list in edit mode
   - Initialize from first tier's type (or default to UNIT_PRICE if no tiers)
   - Update `onTierTypeChange` to use this entry-level value

2. [x] **Remove per-tier type dropdowns**
   - Remove the Type column/field from individual tier rows
   - Simplify tier row to: Min Qty, Max Qty, Price (or Discount %)

3. [x] **Conditionally show Price vs Discount % field**
   - When type is VOLUME_DISCOUNT_PERCENT, show "Discount %" input
   - For all other types, show "Price" input
   - Already implemented per-tier, just needs adjustment for entry-level control

4. [x] **Update view mode display**
   - Show the tier type badge once at the entry level (not per-tier)
   - Keep the tiers table simple: Quantity Range, Price/Discount

5. [x] **Test the changes**
   - Verify switching tier types updates all tiers correctly
   - Verify VOLUME_DISCOUNT_PERCENT shows discount field
   - Verify saving and loading preserves tier type correctly
