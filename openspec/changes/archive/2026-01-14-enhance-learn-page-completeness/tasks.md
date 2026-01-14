# Tasks: Enhance Learn Page Completeness

## Phase 0: Dependencies & Setup

### 0.1 Install New Dependencies
- [x] Install `@vue-flow/core@^1.48.1` for interactive diagrams
- [x] Install `@vue-flow/minimap@^1.5.4` for diagram navigation
- [x] Install `@vue-flow/controls@^1.1.2` for zoom/fit controls
- [x] Install `mermaid@^11.12.2` for flowchart rendering (using directly, no Nuxt module needed)
- [x] Verify all dependencies work with Nuxt 4

## Phase 0.5: Navigation & Layout Infrastructure

### 0.5.1 Create Table of Contents Component
- [ ] Create LearnTableOfContents.vue component
- [ ] Implement sticky left sidebar layout for desktop (≥1280px)
- [ ] Implement sticky top bar for tablet (768-1279px)
- [ ] Implement hamburger menu with slide-out for mobile (<768px)
- [ ] Add section links with nested navigation
- [ ] Implement smooth scroll on click
- [ ] Highlight current section on scroll (intersection observer)
- [ ] Update URL hash for bookmarking

### 0.5.2 Create Collapsible Section Component
- [ ] Create LearnCollapsibleSection.vue component
- [ ] Implement expand/collapse toggle on header click
- [ ] Add smooth height transition animation
- [ ] Display section icon and title in header
- [ ] Show chevron indicator for expand/collapse state
- [ ] Accept defaultOpen prop

### 0.5.3 Update Learn Page Layout
- [ ] Wrap all sections in LearnCollapsibleSection
- [ ] Add LearnTableOfContents to page layout
- [ ] Add "Expand All" / "Collapse All" buttons
- [ ] Implement section state management
- [ ] Add scroll-margin-top for header offset
- [ ] Test responsive behavior across breakpoints

## Phase 1: Glossary Enhancements

### 1.1 Add Guided Selling Glossary Terms
- [ ] Add 'guided-selling' to GlossaryTerm group type in learn.vue
- [ ] Add groupLabel for 'Guided Selling Terms'
- [ ] Add groupOrder entry for 'guided-selling' after 'discount'
- [ ] Add Product Affinity term with definition, example, related terms
- [ ] Add Affinity Type term with all 6 enum values explained
- [ ] Add Questionnaire term with definition and example
- [ ] Add Question term with type explanation
- [ ] Add Question Type term with all 4 values
- [ ] Add Question Product Mapping term
- [ ] Add Recommendation Log term
- [ ] Add Recommendation Source term with all 4 values
- [ ] Add Recommendation Action term with all 3 values
- [ ] Verify all examples use consistent laptop bundle scenario

### 1.2 Add Missing Terms to Existing Groups
- [ ] Add TierType term to Pricing group (UNIT_PRICE, FLAT_PRICE)
- [ ] Add Category Attribute mention to Attribute group
- [ ] Add CANCELLED to Quote Status references in Quote term
- [ ] Verify all existing terms are accurate against current schema

## Phase 2: Interactive ER Diagram with Vue Flow

### 2.1 Create Interactive ER Diagram Component
- [ ] Create LearnERDiagram.vue component using Vue Flow
- [ ] Import and configure VueFlow, MiniMap, Controls
- [ ] Define all 31 entities as Vue Flow nodes with positions
- [ ] Create EntityNode.vue custom node component
- [ ] Style nodes by domain color with border and background
- [ ] Display entity name and preview of attributes
- [ ] Add Handles for relationship connections

### 2.2 Implement Relationships
- [ ] Define all relationships as Vue Flow edges
- [ ] Add cardinality labels to edges (1:N, N:1, N:N)
- [ ] Style edges by relationship type
- [ ] Implement edge hover tooltips

### 2.3 Add Interactive Features
- [ ] Configure zoom and pan behavior
- [ ] Add MiniMap component in corner
- [ ] Add Controls component (zoom in/out, fit view)
- [ ] Implement node click handler to open detail panel
- [ ] Create EntityDetailPanel.vue side panel component
- [ ] Show entity attributes, types, and relationships in panel
- [ ] Add "View in Glossary" link in panel

### 2.4 Add Filtering and Search
- [ ] Add domain filter toggles (Products, Quotes, etc.)
- [ ] Implement filter logic to show/hide nodes by domain
- [ ] Add search input for entity names
- [ ] Highlight matching nodes on search
- [ ] Dim non-matching nodes

### 2.5 Simplified vs Full Toggle
- [ ] Add "Simplified/Full" toggle to diagram header
- [ ] Define simplified node set (13 core entities)
- [ ] Filter nodes and edges based on toggle state
- [ ] Persist toggle state

### 2.6 Update Data Model Section
- [ ] Replace EntityDiagram.vue with LearnERDiagram.vue
- [ ] Update tab structure in Data Model card
- [ ] Ensure tab switching works correctly
- [ ] Lazy load Vue Flow component for performance

## Phase 3: Hierarchy Tree Enhancement

### 3.1 Add Missing Hierarchies to EntityHierarchy.vue
- [ ] Add Category hierarchy series with parent-child self-reference
- [ ] Add Contract hierarchy: Customer → Contract → ContractPriceEntry
- [ ] Add Currency hierarchy: Currency → ExchangeRate
- [ ] Add Attribute hierarchy with AttributeGroup and CategoryAttribute
- [ ] Add Guided Selling hierarchy: Questionnaire → Question → QuestionProductMapping
- [ ] Add ProductAffinity with source/target notation
- [ ] Update chart options for expanded height
- [ ] Verify tooltip descriptions for new hierarchies

## Phase 4: Business Logic Documentation

### 4.1 Create Business Logic Component with Mermaid
- [ ] Create LearnBusinessLogic.vue component
- [ ] Design expandable card layout using UCard and UAccordion
- [ ] Implement Pricing Calculation card with formula and example
- [ ] Implement Discount Stacking card with Mermaid flowchart
- [ ] Write Mermaid code for discount stacking decision tree
- [ ] Implement Contract Pricing Override card with Mermaid flowchart
- [ ] Write Mermaid code for contract pricing decision tree
- [ ] Implement Tax Calculation card with jurisdiction rules
- [ ] Implement Subscription Metrics card with MRR/ARR/TCV formulas
- [ ] Use nuxt-mermaid-string for flowchart rendering
- [ ] Ensure Mermaid diagrams render correctly in dark mode

### 4.2 Add Business Logic Section to Learn Page
- [ ] Import LearnBusinessLogic component in learn.vue
- [ ] Position after Data Model section
- [ ] Add appropriate spacing and header

## Phase 5: Formula Reference

### 5.1 Create Formula Reference Component
- [ ] Create LearnFormulaReference.vue component
- [ ] Design collapsible card layout
- [ ] Add Line Item Pricing formulas section
- [ ] Add Quote Totals formulas section
- [ ] Add Recurring Revenue formulas section
- [ ] Add Proration formula section
- [ ] Add Currency Conversion formula section
- [ ] Style formulas in monospace with syntax highlighting
- [ ] Implement copy-to-clipboard functionality
- [ ] Add toast notification on copy

### 5.2 Add Formula Reference to Learn Page
- [ ] Import LearnFormulaReference component
- [ ] Position after Business Logic section

## Phase 6: Worked Example

### 6.1 Create Worked Example Component
- [ ] Create LearnWorkedExample.vue component
- [ ] Design multi-step layout with visual flow
- [ ] Implement Step 1: Setup (Customer, Price Book, Contract)
- [ ] Implement Step 2: Add Product (Bundle selection)
- [ ] Implement Step 3: Configure (Feature/Option selection)
- [ ] Implement Step 4: Apply Pricing (Contract price override)
- [ ] Implement Step 5: Apply Discounts (Contract discount)
- [ ] Implement Step 6: Calculate Tax (Jurisdiction, rate)
- [ ] Implement Step 7: Final Totals (All calculated fields)
- [ ] Add step navigation (Next/Previous)
- [ ] Highlight current step visually
- [ ] Show data flow between steps

### 6.2 Add Worked Example to Learn Page
- [ ] Import LearnWorkedExample component
- [ ] Position after Formula Reference section

## Phase 7: Enum Reference

### 7.1 Create Enum Reference Component
- [ ] Create LearnEnumReference.vue component
- [ ] Design collapsible/expandable card with UAccordion
- [ ] Group enums by domain (Product, Quote, Discount, etc.)
- [ ] Add ProductType enum with values
- [ ] Add BillingFrequency enum with values
- [ ] Add QuoteStatus enum with all 8 values
- [ ] Add DiscountType enum with values
- [ ] Add DiscountScope enum with values
- [ ] Add ContractStatus enum with values
- [ ] Add AttributeType enum with values
- [ ] Add RuleType enum with values
- [ ] Add RuleTrigger enum with values
- [ ] Add AffinityType enum with all 6 values
- [ ] Add QuestionType enum with values
- [ ] Add RecommendationSource enum with values
- [ ] Add RecommendationAction enum with values
- [ ] Add TierType enum with values
- [ ] Add hover tooltips with usage hints
- [ ] Implement enum value search/filter

### 7.2 Add Enum Reference to Learn Page
- [ ] Import LearnEnumReference component
- [ ] Position after Glossary section

## Phase 8: Relationship Cards

### 8.1 Create Relationship Cards Component
- [ ] Create LearnRelationshipCards.vue component
- [ ] Design card grid layout
- [ ] Implement Contract Pricing Flow card with flowchart
- [ ] Implement Discount Stacking Flow card with diagram
- [ ] Implement Product Affinity Flow card with source→target visual
- [ ] Implement Questionnaire Scoring Flow card with score aggregation visual
- [ ] Use SVG or CSS for flowchart rendering
- [ ] Add annotations to decision points

### 8.2 Add Relationship Cards to Learn Page
- [ ] Import LearnRelationshipCards component
- [ ] Position after Enum Reference section

## Phase 9: Quick Tips Enhancement

### 9.1 Add Guided Selling Tips
- [ ] Add tip about creating product affinities for cross-sell
- [ ] Add tip about REQUIRED affinity type for mandatory companions
- [ ] Add tip about affinity priority for ordering
- [ ] Add tip about questionnaire design for needs discovery
- [ ] Add tip about branching logic
- [ ] Add tip about product scoring

## Phase 10: Section Navigation

### 10.1 Add Section Navigation
- [ ] Create section anchor IDs for all major sections
- [ ] Create navigation bar component with anchor links
- [ ] Implement smooth scroll to sections
- [ ] Add brief highlight animation on navigation
- [ ] Implement sticky navigation on scroll
- [ ] Highlight current section in navigation

## Phase 11: Polish and Testing

### 11.1 Visual Polish
- [ ] Ensure consistent spacing between all sections
- [ ] Verify color accessibility (contrast ratios)
- [ ] Test dark mode rendering
- [ ] Optimize diagram scaling for different viewports
- [ ] Add loading states for lazy-loaded components

### 11.2 Content Verification
- [ ] Cross-check all glossary terms against Prisma schema
- [ ] Verify all enum values match schema exactly
- [ ] Ensure all 31 models are documented somewhere
- [ ] Review all examples for consistency
- [ ] Check formula accuracy against implementation

### 11.3 Performance Testing
- [ ] Measure page load time (target: <2s)
- [ ] Verify lazy loading works for heavy components
- [ ] Check memory usage with all sections expanded

### 11.4 Accessibility Testing
- [ ] Verify keyboard navigation through all sections
- [ ] Check screen reader announcements
- [ ] Ensure diagrams have text alternatives
- [ ] Verify proper heading hierarchy

## Dependencies

- **Phase 0**: Must complete first (dependencies needed for other phases)
- **Phase 0.5**: Must complete before content phases (layout infrastructure)
- Phase 1 (Glossary) can run parallel to Phase 2 (ER Diagram)
- Phase 3 (Hierarchy) can run parallel to Phases 1-2
- Phase 4-8 (New sections) depend on Phase 0.5 completion
- Phase 9 (Tips) depends on Phase 1 completion
- Phase 10 (Navigation) - moved to Phase 0.5
- Phase 11 (Testing) depends on all other phases

## Estimated Component Count

- **New components: 12**
  - LearnTableOfContents.vue
  - LearnCollapsibleSection.vue
  - LearnERDiagram.vue (Vue Flow)
  - EntityNode.vue (Vue Flow custom node)
  - EntityDetailPanel.vue
  - LearnBusinessLogic.vue (with Mermaid)
  - LearnFormulaReference.vue
  - LearnWorkedExample.vue
  - LearnEnumReference.vue
  - LearnRelationshipCards.vue (with Mermaid)
  - (Plus supporting components)
- **Modified components: 3** (learn.vue, CPQFlowDiagram.vue, EntityHierarchy.vue)
- **New dependencies: 4** (@vue-flow/core@^1.48.1, @vue-flow/minimap@^1.5.4, @vue-flow/controls@^1.1.2, @vue-storefront/nuxt-mermaid@^1.0.0)
- **New glossary terms: ~10** (Guided Selling group)
- **Modified glossary terms: ~3** (existing terms needing updates)
