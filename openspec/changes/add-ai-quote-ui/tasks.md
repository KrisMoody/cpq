## 1. Composable
- [ ] 1.1 Create `app/composables/useAIQuoteOptimizer.ts`
- [ ] 1.2 Implement `optimizeQuote()` function with loading state
- [ ] 1.3 Implement `generateQuote()` function
- [ ] 1.4 Implement `getRecommendations()` function
- [ ] 1.5 Implement streaming chat functionality

## 2. AI Panel Component
- [ ] 2.1 Create `app/components/ai/AIQuotePanel.vue`
- [ ] 2.2 Implement collapsible panel with three tabs (Optimize, Chat, Generate)
- [ ] 2.3 Show optimization score and analysis summary

## 3. Optimization Cards
- [ ] 3.1 Create `app/components/ai/AIOptimizationCard.vue`
- [ ] 3.2 Display recommendation type, priority badge, and description
- [ ] 3.3 Show impact metrics (revenue, margin changes)
- [ ] 3.4 Implement "Apply" button with confirmation based on user settings

## 4. Chat Interface
- [ ] 4.1 Create `app/components/ai/AIQuoteChat.vue`
- [ ] 4.2 Implement message list with user/AI message styling
- [ ] 4.3 Implement streaming response display
- [ ] 4.4 Show tool execution indicators during AI actions

## 5. Quote Generator
- [ ] 5.1 Create `app/components/ai/AIQuoteGenerator.vue`
- [ ] 5.2 Implement natural language input textarea
- [ ] 5.3 Show generated quote preview before creation
- [ ] 5.4 Implement "Create Quote" action

## 6. Integration
- [ ] 6.1 Add "Optimize with AI" button to quote detail page header
- [ ] 6.2 Integrate AIQuotePanel into quote detail page
- [ ] 6.3 Wire up apply actions to update quote state

## 7. User Settings
- [ ] 7.1 Define AI settings interface (`confirmActions`: always/destructive_only/never)
- [ ] 7.2 Store user AI preferences
- [ ] 7.3 Respect confirmation settings when applying AI suggestions
