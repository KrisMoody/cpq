## Context

The tier type selector was displayed per-tier in the UI, but the backend only uses the first tier's type for all calculations. This created a misleading UX where users saw per-tier controls but experienced entry-level behavior.

This is a localized UI refactoring affecting only `app/pages/price-books/[id].vue`.

## Goals / Non-Goals

**Goals:**
- Move tier type selector to entry level to match actual behavior
- Simplify tier editing UI by removing redundant per-tier type dropdowns

**Non-Goals:**
- Backend changes (not needed - already uses first tier's type)
- Data model changes (tier type still stored per-tier for backwards compatibility)

## Decisions

**Entry-level tier type selector**: Display a single tier type dropdown above the tiers list in edit mode. When changed, propagate to all tiers via the existing `onEntryTierTypeChange()` function.

*Rationale*: Matches the actual backend behavior and removes user confusion about per-tier control.

**Keep tier type stored per-tier**: No database migration needed - tier type is still stored on each tier row, but the UI now enforces uniformity.

*Rationale*: Simpler approach that avoids migration complexity while fixing the UX issue.

## Risks / Trade-offs

**Existing data with mixed tier types** → The backend already handles this by using only the first tier's type, so no migration needed.
