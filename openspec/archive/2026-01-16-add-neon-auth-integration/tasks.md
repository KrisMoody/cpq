# Tasks: Add Neon Auth Integration

## 1. Configuration & Environment

- [x] 1.1 Add `NEON_AUTH_URL` to `.env.example` with documentation
- [x] 1.2 Update `nuxt.config.ts` with `neonAuthUrl` in runtimeConfig (private and public)
- [x] 1.3 Create `app/types/auth.ts` with type definitions (NeonAuthUser, NeonAuthSession, etc.)

## 2. Server-Side Auth Infrastructure

- [x] 2.1 Create `server/api/auth/[...path].ts` - Auth proxy route to forward requests to Neon Auth
- [x] 2.2 Create `server/utils/auth.ts` with core utilities:
  - `getNeonSession(event)` - Retrieve session from cookies
  - `requireAuth(event)` - Require auth or throw 401
  - `getNeonJWT(event)` - Get JWT token for Data API
- [x] 2.3 Add H3 context type augmentation for `event.context.neonAuth`

## 3. Client-Side Auth Composable

- [x] 3.1 Create `app/composables/useNeonAuth.ts` with:
  - Reactive state (user, session, loading, error)
  - `signIn({ email, password })` method
  - `signUp({ email, password, name })` method
  - `signOut()` method
  - `signInWithOAuth(provider)` method (prepared for future use)
  - `refreshSession()` method
  - `verifyEmail(email, code)` method
  - `resendVerification(email)` method
  - `initialize()` method for app startup
- [x] 3.2 Create `app/composables/useNeonSession.ts` for SSR-compatible session access

## 4. Auth Middleware

- [x] 4.1 Create `app/middleware/auth.global.ts` - Client-side route guard
  - Define auth-only routes (login, register, verify-email) as public
  - All other routes protected by default
  - Redirect to login if not authenticated
  - Preserve redirect path in query string
- [x] 4.2 Create `server/middleware/01.auth.ts` - Server middleware for blanket API protection

## 5. Auth Pages

- [x] 5.1 Create `app/pages/login.vue` - Email/password login form
- [x] 5.2 Create `app/pages/register.vue` - User registration form (email verification required)
- [x] 5.3 Create `app/pages/verify-email.vue` - Email OTP verification with resend functionality
- [x] 5.4 Create `app/pages/auth/callback.vue` - OAuth callback handler (prepared for future use)

## 6. Auth UI Components

- [x] 6.1 Create `app/components/auth/UserMenu.vue` - User dropdown with avatar and sign out
- [x] 6.2 Update app header/layout to include UserMenu when authenticated

## 7. API Route Protection

- [x] 7.1 Server middleware protects all API routes automatically (except /api/auth/*)
- [x] 7.2 Protected routes return 401 when unauthenticated
- [x] 7.3 Protected routes work correctly with valid session

## 8. Testing & Validation

- [x] 8.1 Test email/password sign-up flow with email verification
- [x] 8.2 Test email verification OTP flow
- [x] 8.3 Test email/password sign-in flow
- [x] 8.4 Test sign-out flow and session cleanup
- [x] 8.5 Test protected page redirect behavior
- [x] 8.6 Test API route protection (401 responses)
- [x] 8.7 Test SSR session hydration

## 9. Documentation

- [x] 9.1 Update README with auth setup instructions
- [x] 9.2 Document environment variables
- [x] 9.3 Document how to add OAuth providers in the future
- [x] 9.4 Document how to add public routes in the future

## Dependencies

- Tasks 1.x must complete before 2.x (config needed for server code)
- Tasks 2.x must complete before 3.x (server endpoints needed for composable)
- Tasks 2.x and 3.x must complete before 4.x (auth logic needed for middleware)
- Tasks 3.x must complete before 5.x (composable needed for pages)
- Tasks 5.x and 6.x can run in parallel
- Tasks 7.x depends on 2.2 (requireAuth utility)
- Tasks 8.x run after all implementation tasks

## Parallelizable Work

After core infrastructure (1.x, 2.x, 3.x):
- 5.1, 5.2, 5.3, 5.4 (pages) can be worked in parallel
- 6.1, 6.2 (components) can be worked in parallel
- 7.x (API protection) can start once 2.2 is done
