# Design: Fix Cancel Button Behavior

## Context

The application has three distinct patterns for cancel buttons:

1. **Navigation Cancel** - Used on "new entity" forms (e.g., `/customers/new`). These navigate back to the list page when clicked.
2. **Edit Mode Cancel** - Used on entity detail pages (e.g., `/customers/[id]`). These exit edit mode and reset form values to the original entity state.
3. **Modal Cancel** - Used in modals. These close the modal without applying changes.

Currently, navigation cancels do not warn users about unsaved changes, which can lead to accidental data loss.

## Goals
- Prevent accidental data loss when navigating away from forms with unsaved changes
- Maintain consistent UX patterns across all cancel buttons
- Keep implementation simple and non-intrusive

## Non-Goals
- Auto-save functionality
- Complex state management for form data
- Changes to the existing edit mode or modal cancel patterns (they already work correctly)

## Decisions

### Decision: Use Browser `confirm()` for Unsaved Changes Warning
**What:** Use `window.confirm()` to prompt users when they attempt to cancel with unsaved changes.

**Why:**
- Simple, native browser dialog requires no additional UI components
- Consistent with the existing `confirm()` usage for delete operations
- No external dependencies needed

**Alternatives considered:**
- Custom modal component: More complex, requires additional styling, overkill for this use case
- Toast/notification warning: Doesn't block navigation, could still lose data

### Decision: Track Form Dirtiness via Comparison
**What:** Compare current form values against initial values to determine if there are unsaved changes.

**Why:**
- More accurate than tracking individual field changes
- Handles edge cases like changing a value and then changing it back
- Works with existing form patterns

**Implementation:**
```typescript
// composables/useUnsavedChanges.ts
export function useUnsavedChanges<T extends Record<string, any>>(
  formRef: Ref<T>,
  initialValues: Ref<T> | ComputedRef<T>
) {
  const isDirty = computed(() => {
    return JSON.stringify(formRef.value) !== JSON.stringify(initialValues.value)
  })

  function confirmLeave(): boolean {
    if (!isDirty.value) return true
    return confirm('You have unsaved changes. Are you sure you want to leave?')
  }

  return { isDirty, confirmLeave }
}
```

### Decision: Replace `to="/path"` with Click Handler for New Entity Cancel Buttons
**What:** Change cancel buttons from declarative navigation (`to="/path"`) to imperative navigation via click handler.

**Why:**
- Allows us to check for unsaved changes before navigating
- Maintains the same visual appearance and behavior when no changes exist
- Simple implementation that fits existing patterns

**Before:**
```vue
<UButton to="/customers" variant="ghost">Cancel</UButton>
```

**After:**
```vue
<UButton variant="ghost" @click="handleCancel">Cancel</UButton>
```

```typescript
const { confirmLeave } = useUnsavedChanges(form, initialValues)

function handleCancel() {
  if (confirmLeave()) {
    router.push('/customers')
  }
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Users might find confirmation dialogs annoying | Only show when there are actual unsaved changes |
| Browser `confirm()` is not styleable | Acceptable trade-off for simplicity; matches existing delete confirmations |

## Migration Plan

1. Create the `useUnsavedChanges` composable
2. Update each new entity form one at a time
3. Fix the two edit pages that incorrectly use navigation cancels
4. Test all pages manually

No database migrations or breaking API changes required.

## Open Questions
- None at this time
