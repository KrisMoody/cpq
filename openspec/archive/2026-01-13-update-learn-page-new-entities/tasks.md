## 1. Glossary Updates

- [x] 1.1 Add Customer glossary term to `learn.vue` with definition, example, and related terms
- [x] 1.2 Add Price Tier glossary term to pricing group
- [x] 1.3 Add Rule glossary term with Rule Type and Rule Trigger sub-concepts
- [x] 1.4 Add Discount glossary term with Discount Type, Discount Scope definitions
- [x] 1.5 Add Discount Tier glossary term explaining volume discounts
- [x] 1.6 Add Applied Discount glossary term explaining discount instances
- [x] 1.7 Update `groupLabels` and `groupOrder` to include new groups (customer, rules, discount)
- [x] 1.8 Add confusable term hints (Discount vs Applied Discount, Rule Type vs Rule Trigger)

## 2. ER Diagram Updates

- [x] 2.1 Add Customer entity box to `LearnEntityDiagram.vue`
- [x] 2.2 Add Customer -> Quote relationship line (1:N)
- [x] 2.3 Add Customer -> PriceBook relationship line (N:1)
- [x] 2.4 Add Rule entity box (standalone)
- [x] 2.5 Add Discount entity box with DiscountTier child
- [x] 2.6 Add AppliedDiscount entity connecting Quote/LineItem to Discount
- [x] 2.7 Add PriceTier entity as child of PriceBookEntry
- [x] 2.8 Create visual groupings for new entity categories

## 3. Hierarchy Tree Updates

- [x] 3.1 Add Customer hierarchy section to `LearnEntityHierarchy.vue`
- [x] 3.2 Add Rules hierarchy section showing Rule with Condition/Action children
- [x] 3.3 Add Discount hierarchy section (Discount -> DiscountTier)
- [x] 3.4 Update Quote hierarchy to include AppliedDiscount
- [x] 3.5 Update Pricing hierarchy to include PriceTier under PriceBookEntry

## 4. Quick Tips Updates

- [x] 4.1 Add tip about assigning customers to quotes
- [x] 4.2 Add tip about customer-specific pricing via price books
- [x] 4.3 Add tip about configuration rules and product validation
- [x] 4.4 Add tip about pricing rules and approval triggers
- [x] 4.5 Add tip about discount types (percentage vs fixed)
- [x] 4.6 Add tip about discount stacking and priority

## 5. Testing

- [x] 5.1 Verify all new glossary terms render correctly
- [x] 5.2 Verify search includes new terms
- [x] 5.3 Verify compare mode works with new terms
- [x] 5.4 Verify ER diagram displays new entities without overlap
- [x] 5.5 Verify hierarchy tree expands/collapses correctly
