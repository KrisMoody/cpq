## 1. Database Schema

- [ ] 1.1 Add `Currency` model (id, code, name, symbol, isBase, isActive)
- [ ] 1.2 Add `ExchangeRate` model (currencyId, rate, effectiveDate)
- [ ] 1.3 Add `currencyId` to `PriceBook` model
- [ ] 1.4 Add `currencyId` to `Quote` model
- [ ] 1.5 Add `currencyId` to `Customer` model (preferred currency)
- [ ] 1.6 Add `baseAmount` to `Quote` for reporting in base currency
- [ ] 1.7 Run migration

## 2. Currency Service

- [ ] 2.1 Create `server/services/currencyService.ts`
- [ ] 2.2 Implement `getExchangeRate(currencyId, date)` - get rate for date
- [ ] 2.3 Implement `convertAmount(amount, fromCurrency, toCurrency, date)`
- [ ] 2.4 Implement `formatCurrency(amount, currencyId)` - format with symbol

## 3. Seed Data

- [ ] 3.1 Create default currencies: USD (base), EUR, GBP, CAD, AUD
- [ ] 3.2 Set initial exchange rates

## 4. Backend API

- [ ] 4.1 Create `GET /api/currencies` - List currencies
- [ ] 4.2 Create `POST /api/currencies` - Create currency
- [ ] 4.3 Create `PUT /api/currencies/:id` - Update currency
- [ ] 4.4 Create `POST /api/currencies/:id/rates` - Add exchange rate
- [ ] 4.5 Create `GET /api/currencies/:id/rates` - Get rate history
- [ ] 4.6 Update price book endpoints to include currency
- [ ] 4.7 Update quote endpoints to include currency

## 5. Pricing Integration

- [ ] 5.1 Update `priceLookup.ts` to handle currency conversion
- [ ] 5.2 Update `calculateQuoteTotal` to record base currency amount
- [ ] 5.3 Add currency info to pricing responses

## 6. Frontend

- [ ] 6.1 Create `useCurrencies` composable
- [ ] 6.2 Create `formatCurrency` utility function
- [ ] 6.3 Add currency selector to price book forms
- [ ] 6.4 Add currency selector to quote forms
- [ ] 6.5 Add preferred currency to customer forms
- [ ] 6.6 Update all price displays to use currency formatting
- [ ] 6.7 Add currency management page (settings)

## 7. Quote Preview

- [ ] 7.1 Update quote preview to show currency code
- [ ] 7.2 Format all amounts with correct currency symbol
