# Change: Add AI Training Seed Data

## Why
The AI needs historical quote patterns to make intelligent recommendations. Current seed data has only 1 quote, which doesn't provide enough context for the AI to understand what products are commonly purchased together, what discount levels close deals, or what patterns differentiate customer segments.

## What Changes
- Expand seed file with 20-30 historical quotes across existing customers
- Include varied quote statuses (ACCEPTED 60%, REJECTED 20%, FINALIZED 15%, CANCELLED 5%)
- Add diverse product combinations per quote
- Include applied discounts showing successful deal patterns
- Create different quote sizes (small <$1k, medium $1-5k, large >$5k)

## Impact
- Affected specs: Extends `ai-quote-optimization` capability (data requirements)
- Affected code: `prisma/seed.ts` or seed data files
