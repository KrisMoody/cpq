# Change: Add Authentication Bypass Flag for Development

## Why
During development and testing, repeatedly logging in through the full authentication flow slows down the developer experience. Local development and automated testing environments benefit from the ability to bypass authentication entirely, allowing immediate access to the application without needing valid Neon Auth credentials or session cookies.

## What Changes
- Add a new environment variable `DISABLE_AUTH` to control authentication bypass
- Modify server middleware to skip session validation when bypass is enabled
- Modify client route guard to skip login redirect when bypass is enabled
- Modify server utilities to return a mock session when bypass is enabled
- Document the bypass flag in `.env.example` with clear warnings about production use

## Impact
- Affected specs: `authentication`, `configuration`
- Affected code:
  - `server/middleware/01.auth.ts` (skip session check when bypass enabled)
  - `app/middleware/auth.global.ts` (skip login redirect when bypass enabled)
  - `server/utils/auth.ts` (return mock session when bypass enabled)
  - `nuxt.config.ts` (add runtime config for bypass flag)
  - `.env.example` (document new environment variable)

## Security Considerations

### Safety Guardrails
1. **Environment-only** - The bypass flag is controlled via environment variable only, not runtime configuration or user input
2. **Explicit opt-in** - Defaults to `false` (auth enabled); developers must explicitly set `DISABLE_AUTH=true`
3. **Clear naming** - Variable name makes the purpose obvious and searchable in security audits
4. **Documentation warnings** - `.env.example` will include clear warnings about never using in production

### Risk Mitigation
- **Production safety**: Should never be enabled in production environments
- **Recommendation**: Add deployment checks or CI/CD validation to ensure `DISABLE_AUTH` is not set in production configs
- **Audit trail**: When bypass is active, it's immediately visible in server logs and runtime config

## Design Considerations

### Best Practices Applied
1. **Fail-safe default** - Authentication is enforced by default; bypass requires explicit configuration
2. **Minimal changes** - Modifications are localized to existing auth utilities and middleware
3. **Consistent behavior** - Both client and server respect the same bypass flag
4. **Developer experience** - Single environment variable controls the entire bypass behavior
5. **No data model changes** - Purely runtime configuration, no database schema impact

### Alternative Approaches Considered
1. **Mock auth service**: Rejected because it's more complex and requires maintaining a separate service
2. **Test-only user**: Rejected because it still requires login flow and maintaining test credentials
3. **Conditional middleware**: Rejected because it's harder to verify bypass is truly disabled in production
4. **Per-route bypass**: Rejected because it's more complex and error-prone than a global flag

### Mock Session Design
When bypass is enabled, server utilities will return a consistent mock session with:
- Fixed user ID (e.g., `"dev-user-bypass"`)
- Fixed email (e.g., `"dev@local"`)
- Fixed name (e.g., `"Development User"`)
- Valid session structure matching `NeonAuthResponse` type

This ensures code that depends on session data doesn't break during development.
