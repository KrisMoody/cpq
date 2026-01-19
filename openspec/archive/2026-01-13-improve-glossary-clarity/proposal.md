# Change: Improve Glossary Clarity for Similar CPQ Terms

## Why
Developers learning CPQ concepts struggle to distinguish between similar terms. Key confusing pairs include:
- **Feature vs Option** - Both relate to bundle configuration but serve different roles
- **Price Book Entry vs List Price** - Both involve pricing but at different levels
- **Product vs Bundle** - Overlapping concepts (a bundle IS a product)
- **Configuration vs Quote Line Item** - Configuration lives inside a line item

The current glossary cards show definitions and examples, but don't make the distinctions crystal clear or help users compare similar terms side-by-side.

## What Changes
1. **Clearer definitions** - Rewrite definitions to emphasize what makes each term unique, using consistent structure
2. **Better examples** - Use a single consistent domain (laptop bundle) across all examples so users can trace the relationship between terms
3. **Visual grouping** - Group related terms together (Product group, Pricing group, Quote group) with clear headers
4. **Comparison mode** - Add ability to select 2-3 terms to compare side-by-side, highlighting differences

## Impact
- Affected specs: `learning-ui`
- Affected code: `app/pages/learn.vue`, `app/components/learn/GlossaryTerm.vue`
- No breaking changes - purely additive UI improvements
- No database or API changes
