## 1. Database Schema

- [x] 1.1 Add `Contract` model (id, name, customerId, startDate, endDate, status, discountPercent)
- [x] 1.2 Add `ContractPriceEntry` model (contractId, productId, fixedPrice)
- [x] 1.3 Add `ContractStatus` enum (DRAFT, ACTIVE, EXPIRED)
- [x] 1.4 Run migration

## 2. Backend API

- [x] 2.1 Create `GET /api/contracts` - List contracts with filtering
- [x] 2.2 Create `POST /api/contracts` - Create contract
- [x] 2.3 Create `GET /api/contracts/:id` - Get contract with price entries
- [x] 2.4 Create `PUT /api/contracts/:id` - Update contract
- [x] 2.5 Create `POST /api/contracts/:id/prices` - Add product price to contract
- [x] 2.6 Create `PUT /api/contracts/:id/prices/:entryId` - Update contract price
- [x] 2.7 Create `DELETE /api/contracts/:id/prices/:entryId` - Remove contract price
- [x] 2.8 Create `POST /api/contracts/:id/renew` - Renew contract

## 3. Pricing Integration

- [x] 3.1 Update `priceLookup.ts` to check for active contracts first
- [x] 3.2 Implement contract price resolution logic (fixed price > percentage > fallback)
- [x] 3.3 Add contract info to pricing response for transparency

## 4. Frontend

- [x] 4.1 Create `useContracts` composable
- [x] 4.2 Create contracts list page with status filtering
- [x] 4.3 Create contract detail/edit page with price entry management
- [x] 4.4 Add contracts section to customer detail page
- [x] 4.5 Show contract pricing indicator on quote editor

## 5. Background Jobs

- [x] 5.1 Create scheduled job to transition contract statuses (`POST /api/cron/contracts`)

## 6. Seed Data

- [x] 6.1 Add sample contracts to seed data
