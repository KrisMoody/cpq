# Change: Add AI Quote API Endpoints

## Why
Expose AI quote optimization capabilities through REST API endpoints. These endpoints enable the frontend to request quote optimization, generation, recommendations, and conversational interactions.

## What Changes
- Create `POST /api/ai/generate-quote` for natural language quote creation
- Create `POST /api/ai/optimize-quote` for quote analysis and suggestions
- Create `POST /api/ai/recommendations` for AI-enhanced product recommendations
- Create `POST /api/ai/chat` for streaming conversational interface

## Impact
- Affected specs: Extends `ai-quote-optimization` capability
- Affected code: `server/api/ai/*.post.ts` (4 new files)
