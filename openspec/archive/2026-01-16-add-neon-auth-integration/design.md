# Design: Neon Auth Integration for Nuxt

## Context

Neon Auth is a managed authentication service built on Better Auth v1.4.6 that stores user data in the `neon_auth` schema within the Neon database. It exposes a REST API that handles authentication flows, session management, and JWT token issuance.

The official SDKs only support React and Next.js. For Vue/Nuxt, we need to build a custom integration that:
1. Proxies auth requests to the Neon Auth service
2. Manages session state via composables
3. Protects API routes with server middleware
4. Handles SSR/hydration correctly

### Stakeholders
- Developers working on the CPQ POC
- Future users who need secure access to the system

### Constraints
- Must work with existing Nuxt 4 + Neon + Prisma setup
- Must follow existing project patterns (composables, server utils)
- Cookie-based auth preferred (security best practice)
- No external auth package dependencies beyond `better-auth`

## Goals / Non-Goals

### Goals
- Secure authentication with email/password (OAuth prepared but not enabled initially)
- Require email verification for all signups
- Protect all routes by default (no public routes initially)
- Support SSR with proper session hydration
- Follow existing project patterns and conventions
- Enable Row-Level Security (RLS) via JWT tokens

### Non-Goals (Initial Scope)
- Full-featured auth UI library (keep minimal)
- Multi-tenant organization support (POC scope)
- Password recovery flows (can add later)
- Two-factor authentication (can add later)

### Future Considerations (Prepared in Architecture)
- **OAuth providers**: Architecture supports OAuth, but not enabled initially. Can add Google/GitHub/Discord later.
- **Public routes**: Currently all routes protected. Can configure public routes via middleware config.
- **Role-based access control**: User type includes extensible fields; can add `role` field and `requireRole()` utility later.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│  useNeonAuth()           │  auth.global.ts middleware           │
│  - signIn/signUp/signOut │  - Check authentication              │
│  - session state         │  - Redirect to login if needed       │
│  - OAuth flows           │                                      │
└────────────┬─────────────┴──────────────────────────────────────┘
             │ $fetch with credentials: 'include'
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Nuxt Server (Nitro)                        │
├─────────────────────────────────────────────────────────────────┤
│  /api/auth/[...path].ts  │  server/utils/auth.ts                │
│  - Proxy to Neon Auth    │  - getNeonSession(event)             │
│  - Forward cookies       │  - requireAuth(event)                │
│  - Handle set-cookie     │  - getNeonJWT(event)                 │
└────────────┬─────────────┴──────────────────────────────────────┘
             │ fetch with cookies forwarded
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Neon Auth Service                            │
│  (https://<project>.neon.tech/auth)                             │
├─────────────────────────────────────────────────────────────────┤
│  - /sign-up/email, /sign-in/email, /sign-out                    │
│  - /sign-in/social (OAuth)                                      │
│  - /get-session                                                 │
│  - /email-otp/verify-email                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Decisions

### 1. Proxy Pattern for Auth Requests

**Decision**: Route all `/api/auth/*` requests through a catch-all proxy handler.

**Rationale**:
- Cookies are HTTP-only and secure - can't be accessed by JS
- Proxy handles cookie forwarding transparently
- Avoids CORS issues with direct Neon Auth calls
- Allows request/response interception if needed

**Implementation**:
```typescript
// server/api/auth/[...path].ts
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''
  const config = useRuntimeConfig()

  // Forward request to Neon Auth
  const response = await $fetch.raw(`${config.neonAuthUrl}/${path}`, {
    method: event.method,
    headers: /* forward relevant headers */,
    body: /* forward body for POST/PUT */,
    credentials: 'include'
  })

  // Forward set-cookie headers back to client
  // Return response body
})
```

### 2. Composable-Based State Management

**Decision**: Use a single `useNeonAuth()` composable with Vue's `useState()` for reactive state.

**Rationale**:
- Matches existing project patterns (all composables use `useState`)
- Provides consistent API across the app
- Enables SSR hydration through Nuxt's state system

**API**:
```typescript
const auth = useNeonAuth()

// State (reactive)
auth.user           // Ref<NeonAuthUser | null>
auth.session        // Ref<NeonAuthSession | null>
auth.loading        // Ref<boolean>
auth.isAuthenticated // ComputedRef<boolean>

// Methods
await auth.signIn({ email, password })
await auth.signUp({ email, password, name })
await auth.signOut()
await auth.signInWithOAuth('google')
await auth.refreshSession()
```

### 3. Server-Side Session Utilities

**Decision**: Create three core utilities for API route protection.

**`getNeonSession(event)`**: Retrieves session without throwing
- Returns `NeonAuthSession | null`
- Forwards cookies to Neon Auth `/get-session`
- Passes set-cookie headers back through proxy

**`requireAuth(event)`**: Strict auth requirement
- Returns `string` (userId)
- Throws 401 if not authenticated
- Attaches session to `event.context.neonAuth`

**`getNeonJWT(event)`**: Get JWT for Data API/RLS
- Returns `string | null`
- Extracts token from session

### 4. Route Protection Strategy

**Client-side middleware** (`app/middleware/auth.global.ts`):
- Runs before page navigation
- Redirects unauthenticated users to login
- Maintains redirect path for post-login return

**Server-side protection** (per-route):
- Each protected API route calls `requireAuth(event)`
- Explicit opt-in rather than blanket protection
- Allows granular control over which routes need auth

### 5. Session Storage

**Decision**: HTTP-only, secure cookies managed by Neon Auth.

**Rationale**:
- Prevents XSS token theft (cookies not accessible to JS)
- Automatic CSRF protection with SameSite
- Server validates session on every request
- No localStorage/sessionStorage management needed

## Data Flow

### Sign In Flow
```
1. User enters credentials on /login page
2. useNeonAuth().signIn() calls POST /api/auth/sign-in/email
3. Proxy forwards to Neon Auth service
4. Neon Auth validates, returns user + session + set-cookie
5. Proxy forwards set-cookie to browser
6. Browser stores HTTP-only session cookie
7. Composable updates local state
8. User redirected to intended page
```

### Protected API Request Flow
```
1. Client calls /api/products (with credentials: 'include')
2. Browser attaches session cookie automatically
3. API handler calls requireAuth(event)
4. requireAuth fetches Neon Auth /get-session with cookies
5. Neon Auth validates session, returns user data
6. Handler proceeds with userId, returns data
7. Any set-cookie headers forwarded back to client
```

### OAuth Flow
```
1. User clicks "Sign in with Google"
2. useNeonAuth().signInWithOAuth('google')
3. POST /api/auth/sign-in/social → returns OAuth URL
4. Browser redirects to OAuth provider
5. After consent, provider redirects to /auth/callback
6. Callback page calls refreshSession()
7. Session cookie already set by Neon Auth
8. User redirected to dashboard
```

## Type Definitions

```typescript
interface NeonAuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

interface NeonAuthSession {
  id: string
  userId: string
  expiresAt: string
  token: string  // JWT for Data API
  createdAt: string
  updatedAt: string
}

// H3 context augmentation
declare module 'h3' {
  interface H3EventContext {
    neonAuth?: {
      user: NeonAuthUser
      session: NeonAuthSession
    }
  }
}
```

## Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // Private (server-only)
    neonAuthUrl: process.env.NEON_AUTH_URL,

    // Public (client-accessible)
    public: {
      neonAuthUrl: process.env.NEON_AUTH_URL
    }
  }
})
```

```bash
# .env
NEON_AUTH_URL=https://your-project.neon.tech/auth
```

## Risks / Trade-offs

### Risk: Network Latency for Session Validation
- **Issue**: Every protected API call makes a round-trip to Neon Auth
- **Mitigation**: Neon Auth is in the same region as DB; consider caching with short TTL
- **Trade-off**: Accept latency for simplicity; optimize later if needed

### Risk: Neon Auth Service Availability
- **Issue**: If Neon Auth is down, all auth fails
- **Mitigation**: Neon provides SLA; handle errors gracefully in UI
- **Trade-off**: Managed service reliability vs self-hosted complexity

### Risk: Cookie Configuration Mismatch
- **Issue**: Cookies may not work across different domains/subdomains
- **Mitigation**: Ensure Neon Auth and app are on same domain or configure appropriately
- **Note**: For local development, both typically run on localhost

## Migration Plan

### Phase 1: Core Infrastructure
1. Add environment variables
2. Create auth proxy route
3. Create server utilities
4. Create composable

### Phase 2: Auth UI
1. Add login/register pages
2. Add UserMenu component
3. Add client middleware

### Phase 3: Route Protection
1. Add protection to sensitive API routes
2. Test all auth flows
3. Update documentation

### Rollback
- Remove auth middleware to restore public access
- All changes are additive; existing routes continue to work

## Resolved Questions

1. **OAuth providers**: None initially. Architecture prepared for future addition.
2. **Email verification**: Required for all signups.
3. **Public routes**: None initially (only auth pages: login, register, verify-email). All other routes protected.
4. **Admin roles**: Not initially. Architecture prepared for future `role` field and `requireRole()` utility.

## Extensibility Notes

### Adding OAuth Providers (Future)
1. Configure providers in Neon Auth dashboard
2. Add provider buttons to login/register pages
3. `signInWithOAuth(provider)` method already in composable

### Adding Public Routes (Future)
1. Update `PUBLIC_ROUTES` array in `app/middleware/auth.global.ts`
2. Consider adding config option in `nuxt.config.ts` for flexibility

### Adding Role-Based Access Control (Future)
1. Add `role` field to `NeonAuthUser` type
2. Create `requireRole(event, role)` server utility
3. Create `useRequireRole(role)` composable for client-side checks
4. Neon Auth stores custom user fields in the `neon_auth.user` table
