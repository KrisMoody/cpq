# Proposal: Add Product Full-Text Search

## Summary
Add PostgreSQL full-text search capability to the product search functionality used by the AI quote generation tools. This enables natural language queries like "laptops" to match products named "Developer Laptop Pro" through stemming and linguistic analysis.

## Motivation
The current product search uses simple substring matching (`ILIKE '%query%'`), which fails to match:
- Plurals: "laptops" doesn't match "Laptop"
- Variations: "computing" doesn't match "computer"
- Partial words: "dev" doesn't match "Developer"

This causes the AI quote generation to return empty results even when relevant products exist.

## Scope
- **In scope**:
  - Add `tsvector` search column to Product table
  - Implement PostgreSQL full-text search for AI tool product lookups
  - Automatic index updates via Prisma or triggers

- **Out of scope**:
  - Trigram similarity (for typo tolerance) - can be added later
  - Search ranking/relevance scoring in UI
  - Search suggestions/autocomplete

## Affected Capabilities
- `ai-quote-optimization` - Modify product search tool behavior

## Dependencies
- PostgreSQL (Neon) - full-text search is built-in
- No new external dependencies required

## Risks
- **Low**: Full-text search is well-supported in PostgreSQL
- Prisma doesn't have native FTS support, requires raw SQL for search queries
