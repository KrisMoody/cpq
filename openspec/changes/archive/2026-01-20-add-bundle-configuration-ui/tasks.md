# Tasks: Add Bundle Configuration UI

## 1. API Updates
- [x] 1.1 Update `GET /api/products/[id]` to include features and options with pricing
- [x] 1.2 Create `POST /api/quotes/[id]/bundles` endpoint for adding bundle with children in one request
- [x] 1.3 Ensure option products have price book entries returned

## 2. Bundle Configurator Component
- [x] 2.1 Create `CpqBundleConfigurator.vue` modal component
- [x] 2.2 Display bundle header with name, SKU, and base price
- [x] 2.3 Render feature groups with their available options
- [x] 2.4 Implement option selection (radio for max=1, checkbox for max>1)
- [x] 2.5 Show option details: name, SKU, price, quantity controls
- [x] 2.6 Display running total (bundle base + selected options)
- [x] 2.7 Add validation for min/max option constraints per feature
- [x] 2.8 Pre-select default options on load
- [x] 2.9 Disable confirmation until all required features are satisfied

## 3. Quote Page Integration
- [x] 3.1 Detect when selected product is BUNDLE type in add product flow
- [x] 3.2 Show bundle configurator modal instead of immediate add
- [x] 3.3 On configuration confirm, call bundle creation endpoint
- [x] 3.4 Refresh quote to show bundle with children (auto-expanded)

## 4. Visual Polish
- [x] 4.1 Style feature groups with clear visual separation
- [x] 4.2 Indicate required vs optional features
- [x] 4.3 Show "Included" badge for $0 options
- [x] 4.4 Add loading state during bundle creation
- [x] 4.5 Show success feedback after bundle added

## 5. Edge Cases
- [x] 5.1 Handle bundles with no features (add directly without modal)
- [x] 5.2 Handle option products not in price book (show warning, disable option)
- [x] 5.3 Preserve configurator state if modal is accidentally closed
- [x] 5.4 Support quantity > 1 for bundle (multiply child quantities)
- [x] 5.5 Handle inactive option products (show warning, disable option)
- [x] 5.6 Add pre-validation when bundle is selected in product dropdown
- [x] 5.7 Block adding bundle if required options are unavailable (inactive or not in price book)
