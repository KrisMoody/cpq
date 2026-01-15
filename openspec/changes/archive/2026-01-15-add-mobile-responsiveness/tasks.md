# Tasks: Add Mobile Responsiveness

## 1. CPQ Workflow Diagram Mobile Support
- [x] 1.1 Analyze CPQFlowDiagram.vue to determine best mobile approach (responsive layout vs hide)
- [x] 1.2 If responsive: Create vertical stacked layout for mobile breakpoints
- [x] 1.3 If hide: Add `hidden md:block` wrapper class on Dashboard and Learn pages
- [x] 1.4 Test CPQ diagram on mobile viewport sizes

## 2. Responsive Table Pattern
- [x] 2.1 Create a reusable responsive table wrapper/composable
- [x] 2.2 Implement card-based mobile view that shows key columns with expandable details
- [x] 2.3 Define responsive breakpoint strategy (e.g., < 768px = card layout)

## 3. Update Individual Table Components
- [x] 3.1 Update ProductsTable.vue with responsive pattern
- [x] 3.2 Update CustomersTable.vue with responsive pattern
- [x] 3.3 Update QuotesTable.vue with responsive pattern
- [x] 3.4 Update RulesTable.vue with responsive pattern
- [x] 3.5 Update DiscountsTable.vue with responsive pattern
- [x] 3.6 Update PriceBooksTable.vue with responsive pattern
- [x] 3.7 Update CurrenciesTable.vue with responsive pattern
- [x] 3.8 Update TaxRatesTable.vue with responsive pattern
- [x] 3.9 Update UnitsTable.vue with responsive pattern

## 4. Testing & Verification
- [x] 4.1 Test all tables on mobile viewport (<768px)
- [x] 4.2 Test all tables on tablet viewport (768-1024px)
- [x] 4.3 Verify sorting and filtering still work on mobile
- [x] 4.4 Test CPQ diagram visibility/layout on all breakpoints
- [x] 4.5 Verify no horizontal scrolling issues remain

## 5. Additional Pages (Round 2)
- [x] 5.1 Fix Quotes page header buttons (flex-col on mobile, flex-row on sm+)
- [x] 5.2 Fix Quotes page filter buttons (flex-wrap on mobile)
- [x] 5.3 Fix Contracts page header (flex-col on mobile, flex-row on sm+)
- [x] 5.4 Fix Contracts page filter buttons (flex-wrap on mobile)
- [x] 5.5 Add Contracts page mobile card layout

## 6. Data Model Diagrams (Round 2)
- [x] 6.1 Add mobile notice to LearnERDiagram (best viewed on larger screens)
- [x] 6.2 Make LearnERDiagram controls responsive (flex-col on mobile)
- [x] 6.3 Adjust LearnERDiagram container height for mobile (350px vs 500px)
- [x] 6.4 Make detail panel full-width on mobile
- [x] 6.5 Add mobile notice to PrismaERD
- [x] 6.6 Adjust PrismaERD container height for mobile (400px vs 600px)
- [x] 6.7 Make PrismaERD footer controls responsive
- [x] 6.8 Add mobile notice to EntityHierarchy
- [x] 6.9 Adjust EntityHierarchy chart height for mobile

## 7. Learn Page Components (Round 3)
- [x] 7.1 Fix Glossary section search input (w-64 → w-full sm:w-64)
- [x] 7.2 Fix Glossary section controls layout (flex-col on mobile)
- [x] 7.3 Fix GlossaryComparison grid (grid-cols-1 on mobile, responsive for 2-3 columns)
- [x] 7.4 Fix LearnEnumReference search input (w-64 → w-full sm:w-64)
- [x] 7.5 Fix LearnWorkedExample calculation code overflow (break-words, overflow-hidden)
- [x] 7.6 Fix LearnWorkedExample step navigation overflow (max-w-full, smaller min-w on mobile)
