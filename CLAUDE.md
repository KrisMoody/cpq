<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Form Input Width Conventions

When creating or editing forms, use these standardized width tiers based on expected character count:

| Tier | Tailwind Class | Use Cases |
|------|---------------|-----------|
| **XS** | `w-20` | Percentages, currency codes (3-char ISO), symbols |
| **SM** | `w-28` | Quantity, priority/sort order, exchange rates |
| **MD** | `w-40` | Price/amount, phone, date fields |
| **LG** | `w-64` | Email, name, SKU/code, non-searchable dropdowns |
| **Full** | (default) | Description, notes, addresses, searchable selects |

## Page Container Widths
- **New/edit pages**: `max-w-2xl mx-auto` (672px)
- **Detail pages with tables**: `max-w-4xl mx-auto` (896px)

## Grid Layouts
- Two related fields: `grid grid-cols-1 sm:grid-cols-2 gap-4`
- Inline short fields (min/max): `flex gap-4` with individual widths

## Modal Widths
- Standard forms: `w-[450px]`
- Complex forms with tables: `min-w-[600px]`

## Spacing
- Between form sections: `space-y-6`
- Within form sections: `space-y-4`