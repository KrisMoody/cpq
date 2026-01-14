# Tasks: Fix Cancel Button Behavior

## 1. Create Reusable Unsaved Changes Composable
- [x] 1.1 Create `composables/useUnsavedChanges.ts` with `isDirty` tracking and navigation guard functionality
- [x] 1.2 Add `confirmLeave()` utility function for programmatic navigation checks

## 2. Fix Navigation Cancel Buttons (New Entity Forms)
- [x] 2.1 Update `app/pages/customers/new.vue` - add unsaved changes warning before navigation
- [x] 2.2 Update `app/pages/products/new.vue` - add unsaved changes warning before navigation
- [x] 2.3 Update `app/pages/quotes/new.vue` - add unsaved changes warning before navigation
- [x] 2.4 Update `app/pages/price-books/new.vue` - add unsaved changes warning before navigation
- [x] 2.5 Update `app/pages/discounts/new.vue` - add unsaved changes warning before navigation
- [x] 2.6 Update `app/pages/units/new.vue` - add unsaved changes warning before navigation
- [x] 2.7 Update `app/pages/attributes/new.vue` - add unsaved changes warning before navigation
- [x] 2.8 Update `app/pages/tax-rates/new.vue` - add unsaved changes warning before navigation
- [x] 2.9 Update `app/pages/rules/new.vue` - add unsaved changes warning before navigation
- [x] 2.10 Update `app/pages/categories/new.vue` - add unsaved changes warning before navigation

## 3. Fix Edit Page Cancel Buttons
- [x] 3.1 Update `app/pages/discounts/[id].vue` - change from navigation cancel to proper edit mode cancel with form reset
- [x] 3.2 Update `app/pages/rules/[id].vue` - change from navigation cancel to proper edit mode cancel with form reset

## 4. Testing
- [x] 4.1 Test all new entity forms show confirmation dialog when canceling with unsaved changes
- [x] 4.2 Test all new entity forms allow immediate cancel when no changes made
- [x] 4.3 Test all edit pages properly reset form state on cancel
- [x] 4.4 Test all modal cancel buttons close without saving and reset state on reopen
