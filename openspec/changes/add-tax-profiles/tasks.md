# Tasks: Add Tax Profiles to Price Books

## 1. Database Schema
- [ ] 1.1 Add TaxProfile model to Prisma schema
- [ ] 1.2 Add taxProfileId foreign key to PriceBook
- [ ] 1.3 Add TaxProfileRate junction table for profile-to-rates
- [ ] 1.4 Run migration and generate Prisma client

## 2. Backend API
- [ ] 2.1 Create tax profile CRUD endpoints
- [ ] 2.2 Create endpoint to assign tax rates to profiles
- [ ] 2.3 Update price book API to include tax profile
- [ ] 2.4 Update tax engine to use profile when address incomplete

## 3. Frontend UI
- [ ] 3.1 Create tax profiles list page
- [ ] 3.2 Create tax profile detail/edit page
- [ ] 3.3 Add tax rate assignment UI to profile page
- [ ] 3.4 Add tax profile selector to price book form

## 4. Validation
- [ ] 4.1 Verify tax profile CRUD operations
- [ ] 4.2 Test tax resolution with profile vs address
- [ ] 4.3 Verify price book tax profile assignment
- [ ] 4.4 Test quote tax calculation with profile
