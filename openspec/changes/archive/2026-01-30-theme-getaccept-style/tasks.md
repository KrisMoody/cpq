## 1. Theme Infrastructure

- [x] 1.1 Add Inter font loading via Google Fonts in nuxt.config.ts
- [x] 1.2 Define ga-gray color scale (50-950) in main.css @theme static block
- [x] 1.3 Define ga-blue color scale for secondary/links in main.css
- [x] 1.4 Define ga-green, ga-red, ga-yellow semantic color scales in main.css
- [x] 1.5 Override shadow scale with GetAccept values (shadow-sm, shadow-md, shadow-lg)
- [x] 1.6 Override border radius scale (4px, 8px, 20px)
- [x] 1.7 Create app.config.ts with semantic color mappings (primary, secondary, neutral, etc.)
- [x] 1.8 Configure Nuxt UI button component overrides in app.config.ts
- [x] 1.9 Configure Nuxt UI card component overrides in app.config.ts
- [x] 1.10 Configure Nuxt UI input component overrides in app.config.ts
- [x] 1.11 Verify theme loads correctly - buttons render navy, cards have correct shadow

## 2. Layout Components

- [x] 2.1 Update app/layouts/default.vue with GA styling
- [x] 2.2 Update app/app.vue with GA base styles

## 3. Core Components (app/components/)

- [x] 3.1 Update QuoteLayoutBuilder.vue
- [x] 3.2 Update PhaseBadge.vue
- [x] 3.3 Update PhaseSelector.vue

## 4. AI Components (app/components/ai/)

- [x] 4.1 Update OptimizationCard.vue
- [x] 4.2 Update QuoteChat.vue
- [x] 4.3 Update QuoteGenerator.vue
- [x] 4.4 Update QuotePanel.vue

## 5. Auth Components (app/components/auth/)

- [x] 5.1 Update UserMenu.vue

## 6. Categories Components (app/components/categories/)

- [x] 6.1 Update CategoryTreeItem.vue

## 7. CPQ Components (app/components/cpq/)

- [x] 7.1 Update AttributeInput.vue
- [x] 7.2 Update BundleConfigurator.vue
- [x] 7.3 Update BundleConfiguratorModal.vue
- [x] 7.4 Update BundleFeaturesEditor.vue
- [x] 7.5 Update CategorySelector.vue
- [x] 7.6 Update CustomerSelector.vue
- [x] 7.7 Update DiscountModal.vue
- [x] 7.8 Update GuidedSellingWizard.vue
- [x] 7.9 Update ProductCard.vue
- [x] 7.10 Update QuoteApprovalBanner.vue
- [x] 7.11 Update QuoteCustomerCard.vue
- [x] 7.12 Update QuoteDiscountsCard.vue
- [x] 7.13 Update QuotePreview.vue
- [x] 7.14 Update QuoteRenderer.vue
- [x] 7.15 Update QuoteRulesPanel.vue
- [x] 7.16 Update RecommendationCard.vue
- [x] 7.17 Update Recommendations.vue
- [x] 7.18 Update PricingSummary.vue
- [x] 7.19 Update QuoteLineItem.vue

## 8. Layout Builder Components (app/components/layout-builder/)

- [x] 8.1 Update ColumnPicker.vue
- [x] 8.2 Update FilterConfig.vue
- [x] 8.3 Update Header.vue
- [x] 8.4 Update Preview.vue
- [x] 8.5 Update SectionEditor.vue
- [x] 8.6 Update SectionsPanel.vue
- [x] 8.7 Update SummaryConfig.vue
- [x] 8.8 Update ThemeEditor.vue

## 9. Learn Components (app/components/learn/)

- [x] 9.1 Update CPQFlowDiagram.vue
- [x] 9.2 Update EntityDiagram.vue
- [x] 9.3 Update EntityHierarchy.vue
- [x] 9.4 Update GlossaryComparison.vue
- [x] 9.5 Update GlossaryTerm.vue
- [x] 9.6 Update LearnBusinessLogic.vue
- [x] 9.7 Update LearnCollapsibleSection.vue
- [x] 9.8 Update LearnCourseList.vue
- [x] 9.9 Update LearnCourseModule.vue
- [x] 9.10 Update LearnDataModel.vue
- [x] 9.11 Update LearnERDiagram.vue
- [x] 9.12 Update LearnEnumReference.vue
- [x] 9.13 Update LearnFormulaReference.vue
- [x] 9.14 Update LearnGlossary.vue
- [x] 9.15 Update LearnMermaidDiagram.vue
- [x] 9.16 Update LearnQuiz.vue
- [x] 9.17 Update LearnQuizHistory.vue
- [x] 9.18 Update LearnQuizQuestion.vue
- [x] 9.19 Update LearnQuizResults.vue
- [x] 9.20 Update LearnRelationshipCards.vue
- [x] 9.21 Update LearnTips.vue
- [x] 9.22 Update LearnWorkedExample.vue
- [x] 9.23 Update PrismaERD.vue
- [x] 9.24 Update SchemaTableNode.vue

## 10. Roadmap Components (app/components/roadmap/)

- [x] 10.1 Update PhaseDetailCard.vue
- [x] 10.2 Update PhaseMetricsChart.vue
- [x] 10.3 Update StrategySelector.vue
- [x] 10.4 Update MermaidDiagram.vue

## 11. Table Components (app/components/tables/)

- [x] 11.1 Update CurrenciesTable.vue
- [x] 11.2 Update CustomersTable.vue
- [x] 11.3 Update DiscountsTable.vue
- [x] 11.4 Update PriceBooksTable.vue
- [x] 11.5 Update ProductsTable.vue
- [x] 11.6 Update QuotesTable.vue
- [x] 11.7 Update RulesTable.vue
- [x] 11.8 Update TaxRatesTable.vue
- [x] 11.9 Update UnitsTable.vue

## 12. Auth Pages

- [x] 12.1 Update pages/login.vue
- [x] 12.2 Update pages/register.vue
- [x] 12.3 Update pages/verify-email.vue
- [x] 12.4 Update pages/auth/callback.vue

## 13. Admin Pages

- [x] 13.1 Update pages/admin/index.vue
- [x] 13.2 Update pages/admin/catalog/index.vue
- [x] 13.3 Update pages/admin/configuration/index.vue

## 14. Product Catalog Pages

- [x] 14.1 Update pages/products/index.vue
- [x] 14.2 Update pages/products/[id].vue
- [x] 14.3 Update pages/products/new.vue
- [x] 14.4 Update pages/categories/index.vue
- [x] 14.5 Update pages/categories/[id].vue
- [x] 14.6 Update pages/categories/new.vue
- [x] 14.7 Update pages/attributes/index.vue
- [x] 14.8 Update pages/attributes/[id].vue
- [x] 14.9 Update pages/attributes/new.vue
- [x] 14.10 Update pages/affinities/index.vue
- [x] 14.11 Update pages/affinities/[id].vue
- [x] 14.12 Update pages/affinities/new.vue

## 15. Pricing Pages

- [x] 15.1 Update pages/price-books/index.vue
- [x] 15.2 Update pages/price-books/[id].vue
- [x] 15.3 Update pages/price-books/new.vue
- [x] 15.4 Update pages/currencies/index.vue
- [x] 15.5 Update pages/currencies/[id].vue
- [x] 15.6 Update pages/currencies/new.vue
- [x] 15.7 Update pages/discounts/index.vue
- [x] 15.8 Update pages/discounts/[id].vue
- [x] 15.9 Update pages/discounts/new.vue
- [x] 15.10 Update pages/tax-rates/index.vue
- [x] 15.11 Update pages/tax-rates/[id].vue
- [x] 15.12 Update pages/tax-rates/new.vue
- [x] 15.13 Update pages/units/index.vue
- [x] 15.14 Update pages/units/[id].vue
- [x] 15.15 Update pages/units/new.vue

## 16. Quote Pages

- [x] 16.1 Update pages/quotes/index.vue
- [x] 16.2 Update pages/quotes/new.vue
- [x] 16.3 Update pages/quotes/[id]/index.vue
- [x] 16.4 Update pages/quotes/preview-[id].vue
- [x] 16.5 Update pages/quote-layouts/index.vue
- [x] 16.6 Update pages/quote-layouts/[id].vue
- [x] 16.7 Update pages/quote-layouts/new.vue

## 17. Customer & Sales Pages

- [x] 17.1 Update pages/customers/index.vue
- [x] 17.2 Update pages/customers/[id].vue
- [x] 17.3 Update pages/customers/new.vue
- [x] 17.4 Update pages/contracts/index.vue
- [x] 17.5 Update pages/contracts/[id].vue
- [x] 17.6 Update pages/contracts/new.vue
- [x] 17.7 Update pages/sales/index.vue

## 18. Configuration Pages

- [x] 18.1 Update pages/rules/index.vue
- [x] 18.2 Update pages/rules/[id].vue
- [x] 18.3 Update pages/rules/new.vue
- [x] 18.4 Update pages/questionnaires/index.vue
- [x] 18.5 Update pages/questionnaires/[id].vue
- [x] 18.6 Update pages/questionnaires/new.vue

## 19. Learn Pages

- [x] 19.1 Update pages/learn/index.vue
- [x] 19.2 Update pages/learn/[section].vue
- [x] 19.3 Update pages/learn/roadmap.vue
- [x] 19.4 Update pages/learn/course/index.vue
- [x] 19.5 Update pages/learn/course/[moduleId].vue

## 20. Home Page

- [x] 20.1 Update pages/index.vue

## 21. Verification

- [ ] 21.1 Visual review: Primary buttons are navy (#2c3b4e)
- [ ] 21.2 Visual review: Cards have correct shadow and border radius
- [ ] 21.3 Visual review: Text colors use GA gray scale consistently
- [ ] 21.4 Visual review: Inter font is loading and applied
- [ ] 21.5 Visual review: Form inputs match GA styling
- [ ] 21.6 Visual review: Alerts/badges use correct semantic colors
- [ ] 21.7 Run dev server and check all main flows render correctly
