# Change: Lock Base Currency After First Transaction

## Why
Changing the base currency after transactions exist corrupts historical data, breaks exchange rate calculations, and invalidates financial reports. Industry-standard ERP systems (NetSuite, Dynamics 365) prevent base currency changes once transactions are posted. This safeguard prevents accidental data corruption.

## What Changes
- Prevent changing base currency if any quotes exist
- Add validation in currency API endpoints
- Display warning in currency management UI
- Allow base currency change only when no transaction data exists

## Impact
- Affected specs: `multi-currency`
- Affected code:
  - `server/api/currencies/[id].put.ts` - Add validation
  - `server/api/currencies/base.post.ts` - New endpoint for setting base
  - `app/pages/settings/currencies/[id].vue` - UI warning
