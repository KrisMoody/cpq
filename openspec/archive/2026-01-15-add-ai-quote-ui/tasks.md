## 1. Composable
- [x] 1.1 Create `app/composables/useAIQuoteOptimizer.ts`
- [x] 1.2 Implement `optimizeQuote()` function with loading state
- [x] 1.3 Implement `generateQuote()` function
- [x] 1.4 Implement `getRecommendations()` function
- [x] 1.5 Implement streaming chat functionality

## 2. AI Panel Component
- [x] 2.1 Create `app/components/ai/QuotePanel.vue`
- [x] 2.2 Implement collapsible panel with three tabs (Optimize, Chat, Generate)
- [x] 2.3 Show optimization score and analysis summary

## 3. Optimization Cards
- [x] 3.1 Create `app/components/ai/OptimizationCard.vue`
- [x] 3.2 Display recommendation type, priority badge, and description
- [x] 3.3 Show impact metrics (revenue, margin changes)
- [x] 3.4 Implement "Apply" button with confirmation based on user settings

## 4. Chat Interface
- [x] 4.1 Create `app/components/ai/QuoteChat.vue`
- [x] 4.2 Implement message list with user/AI message styling
- [x] 4.3 Implement streaming response display
- [x] 4.4 Show tool execution indicators during AI actions

## 5. Quote Generator
- [x] 5.1 Create `app/components/ai/QuoteGenerator.vue`
- [x] 5.2 Implement natural language input textarea
- [x] 5.3 Show generated quote preview before creation
- [x] 5.4 Implement "Create Quote" action

## 6. Integration
- [x] 6.1 Add "Optimize with AI" button to quote detail page header
- [x] 6.2 Integrate AIQuotePanel into quote detail page
- [x] 6.3 Wire up apply actions to update quote state

## 7. User Settings
- [x] 7.1 Define AI settings interface (`confirmActions`: always/destructive_only/never)
- [x] 7.2 Store user AI preferences
- [x] 7.3 Respect confirmation settings when applying AI suggestions
