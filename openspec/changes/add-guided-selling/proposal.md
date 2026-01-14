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
- **Modifies**: Creates new `guided-selling` spec only

### Coordination Points
- **Quote editor page**: Adds recommendation display panel. Minor UI addition that shouldn't conflict with other proposals.
- **prisma/schema.prisma**: Adds new Recommendation models. No overlap with other proposals' schema changes.

### Suggested Order
- **Implement before**: None - independent of other proposals
- **Implement after**: None - can start anytime

### Parallel Development Notes
This is the **safest proposal for parallel development**. It creates entirely new functionality with no overlap on existing code paths.

Safe to implement in parallel with **any other proposal**:
- `add-product-management` - no overlap
- `add-contract-pricing` - no overlap
- `add-subscriptions` - no overlap
- `add-multi-currency` - no overlap (recommendations don't display prices)

**Recommended pairing**: If two developers are working in parallel, one should take this proposal while the other works on pricing-related proposals (`add-contract-pricing` or `add-subscriptions`).
