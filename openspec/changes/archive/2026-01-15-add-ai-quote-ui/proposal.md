# Change: Add AI Quote UI Components

## Why
Provide a user interface for AI-powered quote optimization. Users need visual ways to interact with AI suggestions, have conversations about quotes, and generate quotes from natural language.

## What Changes
- Create `AIQuotePanel.vue` - Main collapsible AI panel with tabs
- Create `AIQuoteChat.vue` - Conversational chat interface
- Create `AIOptimizationCard.vue` - Suggestion cards with apply actions
- Create `AIQuoteGenerator.vue` - Natural language quote generation form
- Create `useAIQuoteOptimizer.ts` composable for API interactions
- Add AI user settings for action confirmation preferences
- Integrate AI panel into quote detail page

## Impact
- Affected specs: Extends `ai-quote-optimization` capability
- Affected code: `app/components/ai/*.vue`, `app/composables/useAIQuoteOptimizer.ts`, quote detail page
