## 1. Database Schema

- [x] 1.1 Add `BillingFrequency` enum (ONE_TIME, MONTHLY, QUARTERLY, ANNUAL, CUSTOM)
- [x] 1.2 Add `billingFrequency` to `Product` model (default ONE_TIME)
- [x] 1.3 Add `customBillingMonths` to `Product` model (for CUSTOM frequency)
- [x] 1.4 Add `defaultTermMonths` to `Product` model
- [x] 1.5 Add `termMonths` to `QuoteLineItem` model
- [x] 1.6 Add `isProrated` and `proratedAmount` to `QuoteLineItem` model
- [x] 1.7 Add `oneTimeTotal`, `mrr`, `arr`, `tcv` to `Quote` model
- [x] 1.8 Run migration

## 2. Pricing Engine Updates

- [x] 2.1 Update `calculateLinePrice` to handle recurring pricing
- [x] 2.2 Implement MRR calculation logic
- [x] 2.3 Implement ARR calculation (MRR * 12)
- [x] 2.4 Implement TCV calculation (MRR * term)
- [x] 2.5 Implement pro-ration calculation
- [x] 2.6 Update `calculateQuoteTotal` to split one-time vs recurring

## 3. Backend API

- [x] 3.1 Update product endpoints to handle billing frequency
- [x] 3.2 Update quote line item endpoints to handle term
- [x] 3.3 Update quote response to include recurring totals
- [x] 3.4 Create `POST /api/quotes/:id/renew` - Generate renewal quote

## 4. Frontend

- [x] 4.1 Add billing frequency selector to product forms
- [x] 4.2 Add term duration input to product forms (for recurring)
- [x] 4.3 Update quote line item to show frequency and term
- [x] 4.4 Add term override input on line items
- [x] 4.5 Update pricing summary to show one-time/MRR/ARR/TCV
- [x] 4.6 Add pro-ration toggle on recurring line items
- [x] 4.7 Add visual distinction for recurring vs one-time items

## 5. Quote Preview

- [x] 5.1 Update quote preview to show recurring metrics
- [x] 5.2 Display subscription terms clearly

## 6. Seed Data

- [x] 6.1 Add sample subscription products (software licenses, support plans)
