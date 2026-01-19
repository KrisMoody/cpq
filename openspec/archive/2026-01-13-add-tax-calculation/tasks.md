## 1. Database Schema

- [x] 1.1 Add `TaxRate` model (id, name, rate, country, state, categoryId, validFrom, validTo, isActive)
- [x] 1.2 Add `isTaxExempt`, `taxExemptReason`, `taxExemptCertificate`, `taxExemptExpiry` to `Customer`
- [x] 1.3 Add `isTaxable` to `Product` (default true)
- [x] 1.4 Add `taxAmount`, `taxBreakdown` (JSON) to `Quote`
- [x] 1.5 Run migration

## 2. Tax Engine Service

- [x] 2.1 Create `server/services/taxEngine.ts`
- [x] 2.2 Implement `getApplicableTaxRates(customerId, date)` - resolve rates by jurisdiction
- [x] 2.3 Implement `calculateTax(subtotal, taxRates)` - calculate tax amounts
- [x] 2.4 Implement `checkTaxExemption(customerId)` - verify exemption status

## 3. Pricing Integration

- [x] 3.1 Update `calculateQuoteTotal` to include tax calculation
- [x] 3.2 Store tax breakdown in quote record
- [x] 3.3 Calculate grand total (subtotal - discounts + tax)

## 4. Backend API

- [x] 4.1 Create `GET /api/tax-rates` - List tax rates
- [x] 4.2 Create `POST /api/tax-rates` - Create tax rate
- [x] 4.3 Create `PUT /api/tax-rates/:id` - Update tax rate
- [x] 4.4 Create `DELETE /api/tax-rates/:id` - Deactivate tax rate
- [x] 4.5 Update customer API to handle tax exemption fields
- [x] 4.6 Update quote API response to include tax info

## 5. Frontend

- [x] 5.1 Create `useTaxRates` composable
- [x] 5.2 Add tax rates management page (settings area)
- [x] 5.3 Add tax exemption fields to customer form
- [x] 5.4 Update pricing summary to show tax breakdown
- [x] 5.5 Show tax exemption status on quote when applicable

## 6. Quote Preview

- [x] 6.1 Add tax section to quote preview document
- [x] 6.2 Show itemized tax rates and amounts
- [x] 6.3 Note tax exemption if applicable

## 7. Seed Data

- [x] 7.1 Add sample tax rates (US states, EU VAT)
- [x] 7.2 Mark one customer as tax-exempt for testing
