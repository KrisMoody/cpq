## Context
The CPQ system needs AI capabilities to help sales reps optimize quotes. This service provides the foundation for AI-powered recommendations using Anthropic's Claude model with structured tool use.

## Goals / Non-Goals
- Goals:
  - Create reusable AI service infrastructure
  - Define tools that give AI access to CPQ data
  - Enable structured, validated AI responses
- Non-Goals:
  - Rate limiting or cost tracking (PoC scope)
  - Caching or performance optimization
  - Audit logging of AI decisions

## Decisions
- **LLM Provider**: Anthropic Claude (claude-3-5-sonnet) via AI SDK
  - Rationale: Strong reasoning, good tool use, Vercel AI SDK support
- **Tool Architecture**: Separate data lookup tools from action tools
  - Rationale: Clear separation of read vs write operations
- **Validation**: Use Zod schemas for AI output validation
  - Rationale: Already in project, type-safe, integrates with AI SDK

## Risks / Trade-offs
- AI responses may be slow (~2-5s) → Acceptable for PoC, add streaming later
- Tool definitions increase prompt size → Keep tools focused and minimal
- No rate limiting → Monitor usage manually during PoC

## Migration Plan
No migration needed - new capability.

## Open Questions
- Should tools operate on quote ID or accept quote data directly?
