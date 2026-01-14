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
