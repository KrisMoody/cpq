# Change: Fix CPQ Glossary Validation Issues

## Why

The CPQ glossary validation revealed gaps in term coverage and documentation. SKU is a fundamental concept used throughout the codebase (database, UI, rules) but lacks a formal glossary definition. Additionally, the different naming conventions across Prisma enums and JavaScript fields can cause confusion for developers learning the codebase.

## What Changes

1. **Add SKU glossary term** - Add SKU as a formal term in the product group, explaining its role as a unique product identifier
2. **Add naming conventions documentation** - Add a Quick Tip explaining the difference between Prisma enum naming (SCREAMING_CASE) and JavaScript field naming (camelCase)
3. **Expand customerName migration task** - Add detailed subtasks to the existing add-cpq-features change for removing the deprecated customerName field

## Impact

- **Affected specs**: learning-ui (MODIFIED)
- **Affected code**:
  - `app/pages/learn.vue` - Add SKU term and Quick Tip
  - `openspec/changes/add-cpq-features/tasks.md` - Expand task 8.1
- **No breaking changes** - Documentation only for this change
- **No database changes** - customerName removal tracked separately

## Dependencies

- Depends on: None
- Related to: `add-cpq-features` (shares customerName migration task)

## Out of Scope

- Actual customerName field removal (tracked in add-cpq-features)
- ER diagram updates for SKU (SKU is an attribute, not an entity)
