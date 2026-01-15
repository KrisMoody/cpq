## 1. Dependencies
- [ ] 1.1 Install AI SDK packages (`ai`, `@ai-sdk/anthropic`)
- [ ] 1.2 Add `ANTHROPIC_API_KEY` to environment configuration

## 2. AI Service Core
- [ ] 2.1 Create `server/services/aiQuoteService.ts` with Anthropic client setup
- [ ] 2.2 Define Zod schemas for AI response validation (optimization output, recommendations)
- [ ] 2.3 Implement error handling for AI service failures

## 3. Data Lookup Tools
- [ ] 3.1 Implement `lookupCustomer` tool (customer profile, contracts, history)
- [ ] 3.2 Implement `searchProducts` tool (find products by criteria)
- [ ] 3.3 Implement `getPricing` tool (pricing with tiers and contract rates)
- [ ] 3.4 Implement `getQuoteHistory` tool (customer purchase patterns)
- [ ] 3.5 Implement `getAffinities` tool (cross-sell/upsell relationships)
- [ ] 3.6 Implement `getAvailableDiscounts` tool (applicable discounts)

## 4. Action Tools
- [ ] 4.1 Implement `addToQuote` tool (add product to quote)
- [ ] 4.2 Implement `applyDiscount` tool (apply discount to quote/line)
- [ ] 4.3 Implement `calculateMetrics` tool (calculate quote totals and margins)
