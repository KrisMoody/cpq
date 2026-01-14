## 1. Implementation

### Products
- [x] 1.1 Fix USelect in `app/pages/products/[id].vue` (type, billingFrequency, unitOfMeasureId, category selects)
- [x] 1.2 Fix USelect in `app/pages/products/new.vue` (type, billingFrequency, unitOfMeasureId)
- [x] 1.3 Fix USelect in `app/pages/products/index.vue` (category filter)

### Categories
- [x] 1.4 Fix USelect in `app/pages/categories/[id].vue` (parent, product, attribute selects)
- [x] 1.5 Fix USelect in `app/pages/categories/new.vue` (parent select)

### Rules
- [x] 1.6 Fix USelect in `app/pages/rules/[id].vue` (type, trigger)
- [x] 1.7 Fix USelect in `app/pages/rules/new.vue` (type, trigger, conditionField, conditionOp, actionType)

### Attributes
- [x] 1.8 Fix USelect in `app/pages/attributes/[id].vue` (type, group)
- [x] 1.9 Fix USelect in `app/pages/attributes/new.vue` (type, group)

### Units
- [x] 1.10 Fix USelect in `app/pages/units/[id].vue` (baseUnitId)
- [x] 1.11 Fix USelect in `app/pages/units/new.vue` (baseUnitId)

### Discounts
- [x] 1.12 Fix USelect in `app/pages/discounts/[id].vue` (type, scope)
- [x] 1.13 Fix USelect in `app/pages/discounts/new.vue` (type, scope)

### Price Books
- [x] 1.14 Fix USelect in `app/pages/price-books/[id].vue` (currency, tierType, product selects)
- [x] 1.15 Fix USelect in `app/pages/price-books/new.vue` (currency)

### Contracts
- [x] 1.16 Fix USelect in `app/pages/contracts/[id].vue` (customer, status, product)
- [x] 1.17 Fix USelect in `app/pages/contracts/new.vue` (customer, status)

### Tax Rates
- [x] 1.18 Fix USelect in `app/pages/tax-rates/[id].vue` (category)
- [x] 1.19 Fix USelect in `app/pages/tax-rates/new.vue` (category)

### Components
- [x] 1.20 Fix USelect in `app/components/cpq/AttributeInput.vue` (select type attributes)

## 2. Validation
- [ ] 2.1 Run dev server and manually verify each form page loads without console errors
- [ ] 2.2 Test that select values bind correctly by editing an existing entity and saving
- [ ] 2.3 Test that new entity creation works with select fields
