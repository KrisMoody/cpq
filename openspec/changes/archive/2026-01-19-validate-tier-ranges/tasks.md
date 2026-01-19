# Tasks

## Implementation

- [x] Add `validateTiers` helper function in `server/services/priceLookup.ts`
  - Validates minQuantity >= 1
  - Validates maxQuantity > minQuantity (when set)
  - Detects overlapping ranges between tiers
  - For GRADUATED: validates contiguous ranges starting from 1

- [x] Integrate validation into `server/api/price-books/[id]/entries/[entryId].put.ts`
  - Call validateTiers before saving
  - Return 400 error with descriptive message on failure

- [~] ~~Add unit tests for tier validation~~

- [x] Display validation errors in the UI
  - Updated saveTiers to show server error messages in the page's error alert
