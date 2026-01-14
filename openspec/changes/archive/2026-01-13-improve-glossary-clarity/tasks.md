## 1. Content Improvements

- [x] 1.1 Rewrite glossary term definitions in `learn.vue` with clearer distinctions
- [x] 1.2 Update all examples to use consistent laptop bundle scenario
- [x] 1.3 Add `confusedWith` and `distinction` fields to glossary term data
- [x] 1.4 Add `group` field to each term (product, pricing, quote)

## 2. Visual Grouping

- [x] 2.1 Update `learn.vue` to render terms grouped by category
- [x] 2.2 Add group headers ("Product Terms", "Pricing Terms", "Quote Terms")
- [x] 2.3 Update search to preserve group context in results

## 3. Term Comparison Mode

- [x] 3.1 Add `compareMode` state and selected terms tracking in `learn.vue`
- [x] 3.2 Create `GlossaryComparison.vue` component for side-by-side view
- [x] 3.3 Add "Compare Terms" toggle button to glossary header
- [x] 3.4 Add selection checkboxes to `GlossaryTerm.vue` when in compare mode
- [x] 3.5 Implement side-by-side layout highlighting definition differences

## 4. Confusable Terms Feature

- [x] 4.1 Update `GlossaryTerm.vue` to display "Easily confused with" hints
- [x] 4.2 Add click handler to scroll/highlight confusable term
- [x] 4.3 Style confusable hints distinctly (e.g., warning color, icon)

## 5. Validation

- [x] 5.1 Manually verify all 12 glossary terms render correctly
- [x] 5.2 Test comparison mode with Feature vs Option pair
- [x] 5.3 Test search preserves grouping
- [x] 5.4 Test confusable term navigation works
