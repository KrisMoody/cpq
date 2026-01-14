## 1. Database Schema

- [ ] 1.1 Add `BillingFrequency` enum (ONE_TIME, MONTHLY, QUARTERLY, ANNUAL, CUSTOM)
- [ ] 1.2 Add `billingFrequency` to `Product` model (default ONE_TIME)
- [ ] 1.3 Add `customBillingMonths` to `Product` model (for CUSTOM frequency)
- [ ] 1.4 Add `defaultTermMonths` to `Product` model
- [ ] 1.5 Add `termMonths` to `QuoteLineItem` model
- [ ] 1.6 Add `isProrated` and `proratedAmount` to `QuoteLineItem` model
- [ ] 1.7 Add `oneTimeTotal`, `mrr`, `arr`, `tcv` to `Quote` model
- [ ] 1.8 Run migration

## 2. Pricing Engine Updates

- [ ] 2.1 Update `calculateLinePrice` to handle recurring pricing
- [ ] 2.2 Implement MRR calculation logic
- [ ] 2.3 Implement ARR calculation (MRR * 12)
- [ ] 2.4 Implement TCV calculation (MRR * term)
- [ ] 2.5 Implement pro-ration calculation
- [ ] 2.6 Update `calculateQuoteTotal` to split one-time vs recurring

## 3. Backend API

- [ ] 3.1 Update product endpoints to handle billing frequency
- [ ] 3.2 Update quote line item endpoints to handle term
- [ ] 3.3 Update quote response to include recurring totals
- [ ] 3.4 Create `POST /api/quotes/:id/renew` - Generate renewal quote

## 4. Frontend

- [ ] 4.1 Add billing frequency selector to product forms
- [ ] 4.2 Add term duration input to product forms (for recurring)
- [ ] 4.3 Update quote line item to show frequency and term
- [ ] 4.4 Add term override input on line items
- [ ] 4.5 Update pricing summary to show one-time/MRR/ARR/TCV
- [ ] 4.6 Add pro-ration toggle on recurring line items
- [ ] 4.7 Add visual distinction for recurring vs one-time items

## 5. Quote Preview

- [ ] 5.1 Update quote preview to show recurring metrics
- [ ] 5.2 Display subscription terms clearly

## 6. Seed Data

- [ ] 6.1 Add sample subscription products (software licenses, support plans)
