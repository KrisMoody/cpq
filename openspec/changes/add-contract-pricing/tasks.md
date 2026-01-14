## 1. Database Schema

- [ ] 1.1 Add `Contract` model (id, name, customerId, startDate, endDate, status, discountPercent)
- [ ] 1.2 Add `ContractPriceEntry` model (contractId, productId, fixedPrice)
- [ ] 1.3 Add `ContractStatus` enum (DRAFT, ACTIVE, EXPIRED)
- [ ] 1.4 Run migration

## 2. Backend API

- [ ] 2.1 Create `GET /api/contracts` - List contracts with filtering
- [ ] 2.2 Create `POST /api/contracts` - Create contract
- [ ] 2.3 Create `GET /api/contracts/:id` - Get contract with price entries
- [ ] 2.4 Create `PUT /api/contracts/:id` - Update contract
- [ ] 2.5 Create `POST /api/contracts/:id/prices` - Add product price to contract
- [ ] 2.6 Create `PUT /api/contracts/:id/prices/:entryId` - Update contract price
- [ ] 2.7 Create `DELETE /api/contracts/:id/prices/:entryId` - Remove contract price
- [ ] 2.8 Create `POST /api/contracts/:id/renew` - Renew contract

## 3. Pricing Integration

- [ ] 3.1 Update `priceLookup.ts` to check for active contracts first
- [ ] 3.2 Implement contract price resolution logic (fixed price > percentage > fallback)
- [ ] 3.3 Add contract info to pricing response for transparency

## 4. Frontend

- [ ] 4.1 Create `useContracts` composable
- [ ] 4.2 Create contracts list page with status filtering
- [ ] 4.3 Create contract detail/edit page with price entry management
- [ ] 4.4 Add contracts section to customer detail page
- [ ] 4.5 Show contract pricing indicator on quote editor

## 5. Background Jobs

- [ ] 5.1 Create scheduled job to transition contract statuses (optional for POC)

## 6. Seed Data

- [ ] 6.1 Add sample contracts to seed data
