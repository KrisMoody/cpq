# Change: Add CPQ Core Features (Customers, Rules, Discounts, Pricing)

## Why

The current CPQ system has foundational quote, product, and price book functionality but lacks key enterprise features needed for real-world usage:
- **No customer management** - Quotes only store a customer name string, no proper customer records or history
- **No rules engine** - Configuration validation exists but no business rules for pricing or product constraints
- **Limited discounts** - Only flat-amount discounts at line and quote level, no percentage, volume, or promotional discounts
- **Basic pricing** - Prices come from price books but no dynamic pricing calculations, tiers, or cost-plus margins

## What Changes

### New Capabilities

1. **customers** - Customer entity management
   - Customer records with contact information and accounts
   - Customer assignment to quotes (required for finalization)
   - Customer-specific pricing via price book assignment

2. **rules** - Business rules engine
   - Configuration rules (option dependencies, exclusions, requirements)
   - Pricing rules (triggers for discounts, markups, approvals)
   - Rule evaluation service for quotes and configurations

3. **discount-management** - Advanced discount handling
   - Percentage and fixed-amount discount types
   - Volume/quantity-based tiered discounts
   - Discount application strategies (per-line, quote-level, waterfall)
   - Discount approval workflows

### Modified Capabilities

4. **quotes** - MODIFIED
   - Add required `customerId` reference (required for finalization, optional for drafts)
   - Add discount breakdown fields
   - Add approval workflow support

5. **price-books** - MODIFIED
   - Add volume pricing tiers to price book entries
   - Add cost-plus margin calculation support
   - Add customer-specific price book assignment

## Impact

- **Affected specs**: customers (NEW), rules (NEW), discount-management (NEW), quotes (MODIFIED), price-books (MODIFIED)
- **Affected code**:
  - Prisma schema: New Customer, Rule, Discount models; modified Quote, PriceBookEntry
  - API routes: New `/api/customers`, `/api/rules`, `/api/discounts`; modified quote endpoints
  - Pages: New customer pages, rule management UI; modified quote editor
  - Services: New rules evaluation engine, discount calculation service
- **Database migration**: Required (new tables, modified columns)

## Dependencies

- quotes capability already has `customerName` field - will transition to `customerId` foreign key
- price-books already has `listPrice` and `cost` - will extend with tiers
- configuration capability has validation - rules will extend this pattern

## Risks

- **Breaking change**: Existing quotes without customers will need migration strategy
- **Complexity**: Rules engine must be kept simple for POC scope
- **Performance**: Rule evaluation on large quotes needs to be efficient

## Out of Scope (for this proposal)

- Complex approval workflows beyond simple threshold-based routing
- Customer hierarchy/account management
- Multi-currency support
- Tax calculations
- Contract pricing
