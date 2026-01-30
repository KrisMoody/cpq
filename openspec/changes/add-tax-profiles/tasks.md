# Tasks: Add Tax Profiles to Price Books

## 1. Database Schema
- [x] 1.1 Add TaxProfile model to Prisma schema
- [x] 1.2 Add taxProfileId foreign key to PriceBook
- [x] 1.3 Add TaxProfileRate junction table for profile-to-rates
- [x] 1.4 Run migration and generate Prisma client

## 2. Backend API
- [x] 2.1 Create tax profile CRUD endpoints
- [x] 2.2 Create endpoint to assign tax rates to profiles
- [x] 2.3 Update price book API to include tax profile
- [x] 2.4 Update tax engine to use profile when address incomplete

## 3. Frontend UI
- [x] 3.1 Create tax profiles list page
- [x] 3.2 Create tax profile detail/edit page
- [x] 3.3 Add tax rate assignment UI to profile page
- [x] 3.4 Add tax profile selector to price book form

## 4. Validation
- [x] 4.1 Verify tax profile CRUD operations
- [x] 4.2 Test tax resolution with profile vs address
- [x] 4.3 Verify price book tax profile assignment
- [x] 4.4 Test quote tax calculation with profile
