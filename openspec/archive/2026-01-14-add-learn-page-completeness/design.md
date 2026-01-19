## Context
The learn page serves as an interactive glossary and reference for CPQ concepts. It currently documents ~25 terms but is missing ~18 terms for features already implemented in the codebase. The ER diagram is also manually created using ApexCharts, requiring manual updates when the schema changes.

## Goals / Non-Goals
**Goals:**
- Auto-generate accurate ER diagram from Prisma schema
- Document all implemented features in the glossary
- Keep ERD in sync with schema automatically

**Non-Goals:**
- Replacing the existing ApexCharts diagrams (they serve different purposes)
- Adding documentation for unimplemented features
- Creating a separate documentation site

## Decisions

### Decision: Use prisma-erd-generator with Mermaid output
**Rationale:**
- Integrates into existing `prisma generate` workflow
- Generates SVG/PNG output suitable for embedding
- Actively maintained (2.4M downloads, recent updates)
- Mermaid.js is already familiar in documentation contexts

**Alternatives considered:**
- Manual ApexCharts diagram: Requires manual updates, already have one
- Database reverse-engineering tools: Overkill for a learning project
- DBML conversion: Extra step, less integrated

### Decision: Add ERD as a third tab alongside existing diagrams
**Rationale:**
- Preserves existing hand-crafted visualizations which have curated groupings
- Auto-generated ERD provides completeness and accuracy
- Users can choose between conceptual (manual) and technical (auto) views

### Decision: Group new glossary terms into existing and new groups
**Rationale:**
- Tax terms → New "Tax Terms" group
- Contract terms → New "Contract Terms" group
- Unit of Measure → Add to "Product Terms" group
- Attribute terms → New "Attribute Terms" group
- Currency terms → New "Currency Terms" group
- Subscription terms → Add to "Pricing Terms" and "Quote Terms" groups

## Risks / Trade-offs
- **Risk:** ERD generator depends on Mermaid CLI (puppeteer)
  - **Mitigation:** Only dev dependency, doesn't affect production
- **Risk:** Generated ERD may be overwhelming with 18+ entities
  - **Mitigation:** Can configure to exclude system tables if needed; manual diagrams remain for focused views

## Open Questions
- None - straightforward implementation
