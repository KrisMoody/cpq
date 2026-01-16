# Tasks: Expand Seed Product Catalog

## Implementation Order

### 1. Add New Categories
- [x] Add "Networking" category with subcategories:
  - Routers
  - Switches
  - Wireless
- [x] Add "Security" category with subcategories:
  - Security Software
  - Security Hardware
- [x] Add "Data & Analytics" category with subcategories:
  - Analytics Platforms
  - Data Services
- [x] Add "Professional Services" category with subcategories:
  - Consulting
  - Managed Services
  - Training & Enablement
- [x] Add subcategories under existing "Accessories" category:
  - Input Devices (keyboards, mice)
  - Audio/Video (webcams, headsets)
  - Docking & Connectivity (existing USB hubs, stands)

### 2. Add New Units of Measure
- [x] Add "API Call" unit (for usage-based products)
- [x] Add "GB" unit for storage
- [x] Add "Project" unit for project-based services

### 3. Add Standalone Products - Networking (~5 products)
- [x] Enterprise Router (one-time)
- [x] Managed Switch 24-port (one-time)
- [x] Managed Switch 48-port (one-time)
- [x] Wireless Access Point (one-time)
- [x] Network Cable Kit (one-time)

### 4. Add Standalone Products - Peripherals (~5 products)
- [x] Mechanical Keyboard (one-time)
- [x] Ergonomic Mouse (one-time)
- [x] HD Webcam (one-time)
- [x] Noise-Canceling Headset (one-time)
- [x] Hardware Security Key 2-pack (one-time)

### 5. Add Subscription Products - Security Platform (~3 products)
- [x] Security Platform - Basic (monthly, per-seat)
- [x] Security Platform - Pro (monthly, per-seat)
- [x] Security Platform - Enterprise (annual, per-seat)

### 6. Add Subscription Products - Data Analytics (~3 products)
- [x] Analytics Suite - Starter (monthly)
- [x] Analytics Suite - Business (monthly, per-seat)
- [x] Analytics Suite - Enterprise (annual, unlimited seats)

### 7. Add Usage-Based Products (~2 products)
- [x] API Gateway - Pay As You Go (per 1000 calls)
- [x] Cloud Storage - Metered (per GB/month)

### 8. Add Professional Services (~5 products)
- [x] Security Assessment (one-time, per-project)
- [x] Managed Security Service (monthly)
- [x] Data Migration Services (hourly)
- [x] Custom Integration Development (hourly)
- [x] Quarterly Business Review (quarterly)

### 9. Add New Bundles

#### 9a. Remote Worker Kit (Static Bundle)
- [x] Create bundle product
- [x] Add fixed options: laptop stand, webcam, keyboard, mouse, headset
- [x] All options required, qty=1 each

#### 9b. Security Starter Pack (Configurable Bundle)
- [x] Create bundle product
- [x] Feature: Security Software (choose 1 tier)
- [x] Feature: Hardware Keys (optional, 0-2 packs)
- [x] Feature: Support Plan (choose 1)

#### 9c. Enterprise Platform Bundle (Configurable Bundle)
- [x] Create bundle product
- [x] Feature: Core Platform (DevTools tier - required)
- [x] Feature: Add-ons (Analytics, Security - optional)
- [x] Feature: Cloud Hosting (optional tier selection)
- [x] Feature: Support (required)

### 10. Add Price Book Entries
- [x] Add all new products to Standard Price Book
- [x] Add all new products to Enterprise Price Book (with ~10% discount)
- [x] Set appropriate list prices and costs

### 11. Add Product Attributes
- [x] Assign relevant attributes to networking products (warranty, weight)
- [x] Assign relevant attributes to peripherals (color, warranty)

### 12. Add Product Affinities (Cross-sell/Upsell)
- [x] Security Platform Basic → Upsell to Pro
- [x] Security Platform Pro → Cross-sell Security Assessment
- [x] Analytics Starter → Upsell to Business
- [x] Remote Worker Kit → Cross-sell Support Plan
- [x] Enterprise Router → Cross-sell Managed Switch

### 13. Validation
- [x] Run `npx prisma db seed` successfully
- [x] Verify products appear in /products page
- [x] Verify bundles are configurable
- [x] Verify subscriptions show billing frequency
- [x] Verify price book entries are correct

## Dependencies
- Tasks 1-2 must complete before 3-8
- Tasks 3-8 must complete before 9
- Task 9 must complete before 10
- Tasks 3-9 can run in parallel once categories exist

## Parallelizable Work
- Tasks 3, 4 can run in parallel (standalone products)
- Tasks 5, 6, 7, 8 can run in parallel (subscription/service products)
- Task 11, 12 can run in parallel after products exist
