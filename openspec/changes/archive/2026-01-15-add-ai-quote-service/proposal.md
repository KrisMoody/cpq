# Change: Add AI Quote Optimization Service

## Why
Enable AI-powered quote optimization by creating a backend service that can analyze quotes, recommend improvements, and take actions. This is the core infrastructure needed for AI-enhanced CPQ workflows.

## What Changes
- Add AI SDK dependencies (`ai`, `@ai-sdk/anthropic`)
- Create AI quote service with structured tool definitions
- Implement data lookup tools (customer, products, pricing, history, affinities, discounts)
- Implement action tools (add to quote, apply discount, calculate metrics)
- Define Zod schemas for AI output validation

## Impact
- Affected specs: New `ai-quote-optimization` capability
- Affected code: `server/services/aiQuoteService.ts`, package.json, environment config
