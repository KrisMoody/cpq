# Change: Add Guided Selling / Recommendations (AI-Ready)

## Why
Sales reps often need guidance on which products to recommend based on customer needs. A guided selling system helps optimize product selection, increases average deal size through relevant upsells, and ensures customers get appropriate solutions. This foundation prepares for AI-driven recommendations in the future.

## What Changes
- Add `Recommendation` model for product recommendations
- Add recommendation rules engine (product affinity, cross-sell, upsell)
- Create guided selling questionnaire framework
- Add recommendation display on quote editor
- Design for future AI integration (embeddings, ML models)
- **BREAKING**: None - additive feature

## Impact
- Affected specs: `guided-selling` (new)
- Affected code:
  - `prisma/schema.prisma` - Add Recommendation models
  - `server/services/recommendationEngine.ts` (new)
  - `app/components/cpq/Recommendations.vue` (new)
  - `app/components/cpq/GuidedSelling.vue` (new)

## Implementation Notes

### Dependencies
- **Requires**: None - this is a standalone new capability
- **Benefits from**: `subscriptions` (merged), `contract-pricing` (merged), `multi-currency` (merged)
- **Modifies**: Creates new `guided-selling` spec only

### Integration with Merged Features

**Subscriptions Integration** (merged):
- Recommendations can suggest one-time products to complement recurring subscriptions
- Affinity rules can filter by billing frequency (e.g., recommend monthly add-ons for annual plans)
- Recommendation cards show billing frequency badges for recurring products

**Contract Pricing Integration** (merged):
- Recommendations prioritize products covered by customer's active contract
- Recommendation pricing respects contract prices when applicable
- Contract indicator shown on recommendations with negotiated pricing

**Multi-Currency Integration** (merged):
- Recommendation prices displayed in quote's currency
- Uses existing `usePricing()` composable for consistent currency formatting
- No additional work needed - automatic via shared formatting utilities

### Coordination Points
- **Quote editor page** ([quotes/[id]/index.vue](app/pages/quotes/[id]/index.vue)): Adds recommendation panel to right column below `CpqPricingSummary`. Uses existing `usePricing()` composable for currency formatting.
- **prisma/schema.prisma**: Adds new Recommendation models. Currency model already exists for price display.

### Suggested Order
- **Implement before**: None - independent of other proposals
- **Implement after**: None - can start anytime

### Parallel Development Notes
This is the **safest proposal for parallel development**. It creates entirely new functionality with no overlap on existing code paths.

Safe to implement in parallel with:
- `add-product-management` - no overlap
