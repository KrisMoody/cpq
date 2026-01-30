## Context

The CPQ system currently calculates taxes based on customer address (country/state) matching against `TaxRate` records. This works well for domestic sales but has limitations for international operations:

- No tax calculation when customer address is incomplete
- No way to pre-configure regional tax rules for different price books
- Each price book region (e.g., "EU Pricing", "US Pricing") cannot define default tax behavior

The existing `TaxRate` model stores individual tax rates with country/state jurisdiction. The `taxEngine.ts` service resolves rates via `getApplicableTaxRates()` using customer location.

## Goals / Non-Goals

**Goals:**
- Enable grouping related tax rates into named profiles (e.g., "EU VAT Profile", "US Sales Tax Profile")
- Allow price books to reference a tax profile for regional defaults
- Fall back to price book's tax profile when customer address is incomplete
- Provide management UI for creating and editing tax profiles
- Maintain backward compatibility (customer address still takes precedence when available)

**Non-Goals:**
- Tax rate auto-detection or third-party tax service integration
- Complex tax exemption rules at the profile level
- Multi-jurisdiction tax nexus calculations
- Modifying how individual tax rates are created/managed

## Decisions

### Decision 1: New TaxProfile entity with join table

**Choice**: Create a new `TaxProfile` model with a many-to-many relationship to `TaxRate` via a `TaxProfileRate` join table.

**Alternatives considered**:
- A: Embed tax rate IDs directly in TaxProfile as JSON array
  - Rejected: Loses referential integrity, harder to query
- B: Add `profileId` directly to TaxRate
  - Rejected: A rate may belong to multiple profiles (e.g., federal tax used in multiple regional profiles)

**Schema**:
```prisma
model TaxProfile {
  id          String   @id @default(cuid())
  name        String
  description String?
  country     String   // Default jurisdiction (ISO country code)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  rates      TaxProfileRate[]
  priceBooks PriceBook[]
}

model TaxProfileRate {
  id           String @id @default(cuid())
  taxProfileId String
  taxRateId    String

  taxProfile TaxProfile @relation(...)
  taxRate    TaxRate    @relation(...)

  @@unique([taxProfileId, taxRateId])
}
```

### Decision 2: Optional taxProfileId on PriceBook

**Choice**: Add an optional `taxProfileId` foreign key to the `PriceBook` model.

**Rationale**: Price books already represent regional pricing contexts (via currency). Adding tax profile association keeps regional configuration together without requiring a new entity.

### Decision 3: Tax resolution priority

**Choice**: Customer address → Price book tax profile → No tax (with warning)

**Logic in taxEngine.ts**:
1. If customer has country (and optionally state), use address-based resolution (existing logic)
2. Else if price book has a tax profile, use the profile's assigned rates
3. Else return empty rates and set a `noTaxJurisdiction: true` flag

**Rationale**: This maintains existing behavior while adding a meaningful fallback. Explicit opt-in via price book configuration avoids unexpected tax application.

### Decision 4: API structure

**Choice**: RESTful endpoints under `/api/tax-profiles/`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/tax-profiles` | GET | List all profiles with rate counts |
| `/api/tax-profiles/:id` | GET | Get profile with assigned rates |
| `/api/tax-profiles` | POST | Create profile |
| `/api/tax-profiles/:id` | PUT | Update profile attributes |
| `/api/tax-profiles/:id` | DELETE | Soft delete (set isActive=false) |
| `/api/tax-profiles/:id/rates` | POST | Assign rates to profile |
| `/api/tax-profiles/:id/rates/:rateId` | DELETE | Remove rate from profile |

### Decision 5: UI location

**Choice**: New settings page at `/settings/tax-profiles` plus a dropdown selector on price book edit page.

**Rationale**: Tax profiles are administrative configuration, fitting naturally in the Settings section alongside other system configuration. The price book page gets a simple dropdown since profiles are managed separately.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Profile with no rates assigned may cause confusion | Show warning badge on profiles with 0 rates in UI |
| Circular dependency if tax profile references deleted rates | Use soft delete on TaxRate or cascade delete TaxProfileRate records |
| Performance if profile has many rates | Tax calculation is per-quote, not high frequency; profile rates are typically <10 |
| Migration path for existing price books | Optional field means no migration required; existing behavior unchanged |
