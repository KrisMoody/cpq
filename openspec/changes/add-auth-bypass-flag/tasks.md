# Implementation Tasks

## 1. Configuration
- [x] 1.1 Add `DISABLE_AUTH` to `.env.example` with clear security warnings
- [x] 1.2 Add `disableAuth` to runtime config in `nuxt.config.ts` (server-side only)

## 2. Server Middleware
- [x] 2.1 Modify `server/middleware/01.auth.ts` to check bypass flag
- [x] 2.2 Skip session validation and allow request through when bypass is enabled
- [x] 2.3 Add comment explaining the bypass logic and security implications

## 3. Server Utilities
- [x] 3.1 Modify `getNeonSession()` in `server/utils/auth.ts` to return mock session when bypass enabled
- [x] 3.2 Define mock session constants matching `NeonAuthResponse` type
- [x] 3.3 Ensure `requireAuth()` and `getNeonJWT()` work correctly with mock session

## 4. Client Middleware
- [x] 4.1 Modify `app/middleware/auth.global.ts` to check bypass flag from public runtime config
- [x] 4.2 Skip login redirect when bypass is enabled
- [x] 4.3 Add runtime config to nuxt.config.ts public section for client access

## 5. Verification
- [x] 5.1 Test with `DISABLE_AUTH=true` - verify direct access to protected routes without login
- [x] 5.2 Test with `DISABLE_AUTH=false` or unset - verify normal auth flow still works
- [x] 5.3 Test API routes can access mock user session when bypass enabled
- [x] 5.4 Verify client components can display mock user information when bypass enabled

## Notes
- All tasks should maintain backward compatibility - when bypass is disabled, behavior is identical to before
- No database migrations or schema changes required
- Changes are purely runtime configuration-based
