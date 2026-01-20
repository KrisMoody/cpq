# Change: Add Bundle Configuration UI When Adding Bundles to Quotes

## Why
When users add a bundle product to a quote, the system currently adds only the bundle itself without its configurable options. Users cannot select which products (features/options) to include in the bundle. This defeats the purpose of bundles, which should allow customers to customize their selection from predefined options (e.g., choosing processor, memory, storage for a laptop bundle).

The data model already supports this (ProductFeature, ProductOption, and QuoteLineItem.parentLineId), but the UI doesn't expose the configuration step.

## What Changes
- Show a bundle configuration modal/drawer when adding a BUNDLE type product to a quote
- Display the bundle's features (e.g., "Processor", "Memory") with their available options
- Allow users to select options based on min/max constraints defined on each feature
- Pre-select default options (where `isDefault: true`)
- Create child line items with `parentLineId` linking them to the bundle
- Support required options that must be included
- Show pricing impact as options are selected

## Impact
- Affected specs: `quotes-ui`
- Affected code:
  - `app/pages/quotes/[id]/index.vue` - Trigger configuration modal for bundles
  - New component: `app/components/cpq/BundleConfigurator.vue` - The configuration UI
  - `server/api/quotes/[id]/lines.post.ts` - May need batch creation endpoint
  - `server/api/products/[id].get.ts` - Ensure features/options are returned

## Design Considerations

### User Flow
1. User clicks "Add Product" on quote
2. User selects a BUNDLE type product
3. System detects it's a bundle and opens configuration modal
4. Modal shows bundle name, base price, and feature groups
5. User selects options for each feature (respecting min/max constraints)
6. User confirms configuration
7. System creates bundle line item + child line items for selected options

### Pricing Display
- Show bundle base price
- Show each option's price (from price book)
- Show running total as options are selected
- Indicate included options (price = $0) vs add-on options

### Validation
- Enforce `minOptions` and `maxOptions` per feature
- Enforce `minQty` and `maxQty` per option
- Prevent confirmation until all required features have valid selections
