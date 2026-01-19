## 1. Database Schema

- [x] 1.1 Add `UnitOfMeasure` model (id, name, abbreviation, baseUnitId, conversionFactor)
- [x] 1.2 Add `unitOfMeasureId` to `Product` model (optional, defaults to Each)
- [x] 1.3 Run migration

## 2. Seed Data

- [x] 2.1 Create default units: Each, Hour, Day, Month, Year, License, Seat, Box, Unit

## 3. Backend API

- [x] 3.1 Create `GET /api/units` - List all units
- [x] 3.2 Create `POST /api/units` - Create unit
- [x] 3.3 Create `PUT /api/units/:id` - Update unit
- [x] 3.4 Create `DELETE /api/units/:id` - Delete unit (only if not in use)

## 4. Frontend

- [x] 4.1 Create `useUnits` composable
- [x] 4.2 Add unit selector to product create/edit forms
- [x] 4.3 Display unit abbreviation on product cards and lists
- [x] 4.4 Display unit with quantity on quote line items (e.g., "10 hrs")
- [x] 4.5 Display unit with price (e.g., "$50/hr") where appropriate
- [x] 4.6 Add units management to settings or admin area

## 5. Integration

- [x] 5.1 Update product API responses to include unit info
- [x] 5.2 Update quote line item display components
- [x] 5.3 Update quote preview to show units
