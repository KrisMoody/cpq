## 1. Database Schema

- [x] 1.1 Add `Currency` model (id, code, name, symbol, isBase, isActive)
- [x] 1.2 Add `ExchangeRate` model (currencyId, rate, effectiveDate)
- [x] 1.3 Add `currencyId` to `PriceBook` model
- [x] 1.4 Add `currencyId` to `Quote` model
- [x] 1.5 Add `currencyId` to `Customer` model (preferred currency)
- [x] 1.6 Add `baseAmount` to `Quote` for reporting in base currency
- [x] 1.7 Run migration

## 2. Currency Service

- [x] 2.1 Create `server/services/currencyService.ts`
- [x] 2.2 Implement `getExchangeRate(currencyId, date)` - get rate for date
- [x] 2.3 Implement `convertAmount(amount, fromCurrency, toCurrency, date)`
- [x] 2.4 Implement `formatCurrency(amount, currencyId)` - format with symbol

## 3. Seed Data

- [x] 3.1 Create default currencies: USD (base), EUR, GBP, CAD, AUD
- [x] 3.2 Set initial exchange rates

## 4. Backend API

- [x] 4.1 Create `GET /api/currencies` - List currencies
- [x] 4.2 Create `POST /api/currencies` - Create currency
- [x] 4.3 Create `PUT /api/currencies/:id` - Update currency
- [x] 4.4 Create `POST /api/currencies/:id/rates` - Add exchange rate
- [x] 4.5 Create `GET /api/currencies/:id/rates` - Get rate history
- [x] 4.6 Update price book endpoints to include currency
- [x] 4.7 Update quote endpoints to include currency

## 5. Pricing Integration

- [x] 5.1 Update `priceLookup.ts` to handle currency conversion
- [x] 5.2 Update `calculateQuoteTotal` to record base currency amount
- [x] 5.3 Add currency info to pricing responses

## 6. Frontend

- [x] 6.1 Create `useCurrencies` composable
- [x] 6.2 Create `formatCurrency` utility function
- [x] 6.3 Add currency selector to price book forms
- [x] 6.4 Add currency selector to quote forms
- [x] 6.5 Add preferred currency to customer forms
- [x] 6.6 Update all price displays to use currency formatting
- [x] 6.7 Add currency management page (settings)

## 7. Quote Preview

- [x] 7.1 Update quote preview to show currency code
- [x] 7.2 Format all amounts with correct currency symbol
