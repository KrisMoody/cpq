# Change: Add Neon Auth Integration for Nuxt

## Why

The CPQ POC currently has no authentication layer - all API routes are publicly accessible. Neon Auth provides a managed authentication service that stores auth data directly in the Neon database (`neon_auth` schema), enabling Row-Level Security (RLS) policies and seamless integration with the existing Neon/Prisma setup.

Since Neon Auth only provides official SDKs for React and Next.js, we need to build a custom Vue/Nuxt integration following patterns from two existing implementations: `neon-nuxt-sdk` (module-based approach) and `flight-search` (proxy-based approach).

## What Changes

- Add server-side auth proxy route (`/api/auth/[...path].ts`) to forward requests to Neon Auth service
- Add `useNeonAuth()` composable for client-side authentication state management
- Add server utilities (`getNeonSession`, `requireAuth`, `getNeonJWT`) for API route protection
- Add global auth middleware for route protection
- Add auth-related pages (login, register, verify-email, auth callback)
- Add `UserMenu` component for authenticated user UI
- Extend `nuxt.config.ts` with Neon Auth runtime configuration
- **BREAKING**: Existing API routes will require authentication after middleware is enabled

## Impact

- **Affected specs**: None existing (new capability)
- **New spec**: `authentication` - Core auth functionality
- **Affected code**:
  - `nuxt.config.ts` - Runtime config additions
  - `server/api/` - New auth routes + protection on existing routes
  - `server/utils/` - New auth utilities
  - `server/middleware/` - New auth verification middleware
  - `app/composables/` - New `useNeonAuth` composable
  - `app/middleware/` - New client-side auth guard
  - `app/pages/` - New auth pages (login, register, etc.)
  - `app/components/auth/` - New auth UI components

## Design Choice: Proxy vs Module

After analyzing both reference implementations:

| Approach | Pros | Cons |
|----------|------|------|
| **Proxy (flight-search)** | Simpler setup, no external packages, full control | More boilerplate, manual cookie handling |
| **Module (neon-nuxt-sdk)** | Reusable package, auto-imports, cleaner DX | Requires publishing package, more complex setup |

**Decision**: Use the **proxy approach** directly in this project because:
1. This is a POC/learning project - embedded code is easier to understand
2. No need to publish/maintain a separate package
3. Full control over implementation specifics
4. Can always extract to a module later if needed

## Key Architectural Decisions

1. **Cookie-based sessions** - HTTP-only cookies for security (no localStorage exposure)
2. **Server-side session validation** - Every protected route validates via Neon Auth service
3. **Proxy pattern** - All `/api/auth/*` requests proxy to Neon Auth URL
4. **Better Auth compatibility** - Uses `better-auth/vue` client for consistent patterns
5. **Composable-first** - Follow existing project patterns with `use*` composables
