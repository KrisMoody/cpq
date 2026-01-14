# Change: Add Unit of Measure (UoM) Support

## Why
All products currently assume "each" as the unit of measure. Real-world CPQ systems need to handle diverse units: licenses (per seat), time-based (per hour/month), consumables (per unit/box), and weight/volume measures. UoM support is essential for accurate pricing and inventory management.

## What Changes
- Add `UnitOfMeasure` model with conversion factors
- Add `unitOfMeasureId` to products
- Display unit labels throughout the UI
- Support unit conversion in pricing calculations
- **BREAKING**: None - existing products default to "Each"

## Impact
- Affected specs: `product-catalog` (modified), `unit-of-measure` (new)
- Affected code:
  - `prisma/schema.prisma` - Add UnitOfMeasure model
  - `server/api/units/` (new)
  - `app/composables/useUnits.ts` (new)
  - Product forms and displays - show unit labels
  - Quote line items - display unit with quantity
