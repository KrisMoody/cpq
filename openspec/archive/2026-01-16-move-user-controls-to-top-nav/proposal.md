# Change: Move User Controls to Top Navigation

## Why
The sidebar footer currently contains the user menu (name and logout) and color mode switcher. Moving these to a dedicated top navigation bar improves UX by:
- Placing user controls in a more conventional, discoverable location
- Freeing up sidebar space for navigation items
- Providing consistent access to user controls regardless of scroll position

## What Changes
- Add a top navigation bar (header) to the desktop layout with user menu and color mode toggle
- Remove user menu and color mode controls from the sidebar footer
- Update mobile header to include user menu (currently only has color mode button)
- Keep the sidebar navigation structure unchanged

## Impact
- Affected specs: `navigation`
- Affected code: `app/layouts/default.vue`, `app/components/auth/UserMenu.vue`
- No breaking changes to existing functionality
- Visual/UX change only
