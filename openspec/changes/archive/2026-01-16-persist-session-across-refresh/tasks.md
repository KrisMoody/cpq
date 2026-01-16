# Tasks: Persist Session Across Page Refresh

## Implementation Order

- [x] **Create server plugin for SSR session fetch** (`app/plugins/auth.server.ts`)
   - Fetches session from Neon Auth during SSR using request cookies
   - Stores user/session in `useState` for automatic client hydration
   - Forwards set-cookie headers for session refresh

- [x] **Update `useNeonSession` composable**
   - Reads from `useState` (populated by server plugin during SSR)
   - Provides `refresh()` for client-side session updates
   - No more `useAsyncData` complexity

- [x] **Update `useNeonAuth` to use `useNeonSession`**
   - Derives user/session/isAuthenticated from `useNeonSession`
   - Calls `neonSession.refresh()` after mutations (signIn, signOut, etc.)

- [x] **Simplify auth middleware**
   - No async operations needed - state is already hydrated
   - Just checks `isAuthenticated` from `useNeonSession`

- [x] **Fix auth proxy for Neon Auth requirements**
   - Always send `content-type: application/json` for POST/PUT/PATCH
   - Send `{}` as body when no content (Neon Auth requires JSON body)

- [x] **Test the full flow**
   - Login -> refresh page -> remains logged in ✓
   - Logout -> works correctly ✓
   - Direct URL access when authenticated -> works ✓
   - Direct URL access when not authenticated -> redirects to login ✓

## Architecture

```
Browser Request (with cookies)
        ↓
[auth.server.ts plugin] ← fetches session from Neon Auth using cookies
        ↓
useState('neon-auth-user') ← populated during SSR
useState('neon-auth-session')
        ↓
[SSR HTML with hydration data]
        ↓
Client hydrates useState automatically
        ↓
useNeonSession() reads from useState
        ↓
Middleware checks isAuthenticated (already true if logged in)
```
