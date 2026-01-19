# Change: Persist Session Across Page Refresh

## Why

Users are getting logged out when they refresh the page. The current implementation has two separate session-handling composables that don't work together:

1. **`useNeonSession`** - Uses `useFetch` which IS SSR-compatible and properly hydrates
2. **`useNeonAuth`** - Uses `useState` with manual `$fetch` calls, which does NOT hydrate from SSR

The auth middleware uses `useNeonAuth`, which initializes state as `null` and only fetches the session client-side via `initialize()`. This causes a flash where the user appears unauthenticated during SSR, triggering a redirect to login.

## What Changes

- Update `useNeonAuth` to use `useNeonSession` as the source of truth for initial state
- The middleware will check `useNeonSession`'s SSR-hydrated state directly
- Remove the manual `initialize()` pattern in favor of SSR-hydrated state

## Impact

- **Affected specs**: `authentication`
- **Affected code**:
  - `app/composables/useNeonAuth.ts` - Use `useNeonSession` for initial state
  - `app/middleware/auth.global.ts` - Use SSR-hydrated state from `useNeonSession`

## Design Choice: Leverage Existing `useNeonSession`

The project already has `useNeonSession` which uses `useFetch` - this automatically:
1. Fetches the session during SSR (cookies are forwarded by Nuxt)
2. Serializes the response into the SSR payload
3. Hydrates the data on the client without re-fetching

The fix is to have the auth middleware use `useNeonSession` (which hydrates properly) instead of `useNeonAuth` (which doesn't). The `useNeonAuth` composable can still be used for mutations (signIn, signOut, etc.) but should read its initial state from `useNeonSession`.

This is the simplest fix with minimal code changes.
