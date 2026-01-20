## ADDED Requirements

### Requirement: Development Authentication Bypass
The system SHALL provide a development-only bypass mechanism controlled by the `DISABLE_AUTH` environment variable that allows skipping authentication flows.

#### Scenario: Bypass enabled returns mock session
- **GIVEN** `DISABLE_AUTH=true` is set in the environment
- **WHEN** `getNeonSession(event)` is called
- **THEN** the function SHALL return a mock `NeonAuthSession` object with fixed development user data
- **AND** the mock session SHALL include a user ID of `"dev-user-bypass"`
- **AND** the mock session SHALL include an email of `"dev@local"`
- **AND** the mock session SHALL include a name of `"Development User"`

#### Scenario: Bypass enabled skips server middleware check
- **GIVEN** `DISABLE_AUTH=true` is set in the environment
- **WHEN** a request is made to any `/api/*` route (except `/api/auth/*`)
- **THEN** the server middleware SHALL allow the request through without session validation
- **AND** the mock session SHALL be attached to `event.context.neonAuth`

#### Scenario: Bypass enabled skips client route guard
- **GIVEN** `DISABLE_AUTH=true` is set in the environment
- **WHEN** an unauthenticated user navigates to any protected route
- **THEN** the client middleware SHALL allow navigation without redirecting to `/login`

#### Scenario: Bypass disabled maintains normal auth flow
- **GIVEN** `DISABLE_AUTH` is not set or is set to `false`
- **WHEN** any authentication function is called
- **THEN** the system SHALL behave exactly as it did before the bypass feature was added
- **AND** all authentication requirements SHALL be enforced normally

#### Scenario: Bypass flag accessible from runtime config
- **GIVEN** `DISABLE_AUTH` is set in the environment
- **WHEN** server code accesses `useRuntimeConfig().disableAuth`
- **THEN** the boolean value SHALL be returned
- **WHEN** client code accesses `useRuntimeConfig().public.disableAuth`
- **THEN** the boolean value SHALL be returned

---

## MODIFIED Requirements

### Requirement: Server Session Retrieval
The system SHALL provide a `getNeonSession(event)` server utility that retrieves the current user session from cookies, with support for development bypass.

#### Scenario: Valid session retrieval
- **GIVEN** a request with valid Neon Auth session cookies
- **AND** authentication bypass is not enabled
- **WHEN** `getNeonSession(event)` is called
- **THEN** the function SHALL return a `NeonAuthSession` object containing user and session data

#### Scenario: No session present
- **GIVEN** a request without session cookies
- **AND** authentication bypass is not enabled
- **WHEN** `getNeonSession(event)` is called
- **THEN** the function SHALL return `null`

#### Scenario: Session refresh forwarding
- **GIVEN** a request where Neon Auth returns set-cookie headers (session refresh)
- **AND** authentication bypass is not enabled
- **WHEN** `getNeonSession(event)` is called
- **THEN** the set-cookie headers SHALL be forwarded to the client response

#### Scenario: Bypass mode returns mock session
- **GIVEN** authentication bypass is enabled via `DISABLE_AUTH=true`
- **WHEN** `getNeonSession(event)` is called
- **THEN** the function SHALL return a mock `NeonAuthSession` object without making external requests

---

### Requirement: Server Auth Requirement
The system SHALL provide a `requireAuth(event)` server utility that enforces authentication on API routes, with support for development bypass.

#### Scenario: Authenticated request proceeds
- **GIVEN** a request with valid session cookies
- **AND** authentication bypass is not enabled
- **WHEN** `requireAuth(event)` is called
- **THEN** the function SHALL return the user ID
- **AND** the session SHALL be attached to `event.context.neonAuth`

#### Scenario: Unauthenticated request rejected
- **GIVEN** a request without valid session cookies
- **AND** authentication bypass is not enabled
- **WHEN** `requireAuth(event)` is called
- **THEN** the function SHALL throw an HTTP 401 Unauthorized error

#### Scenario: Bypass mode allows all requests
- **GIVEN** authentication bypass is enabled via `DISABLE_AUTH=true`
- **WHEN** `requireAuth(event)` is called
- **THEN** the function SHALL return the mock user ID without throwing errors
- **AND** the mock session SHALL be attached to `event.context.neonAuth`

---

### Requirement: Client Route Guard
The system SHALL provide a global client-side middleware that protects all routes by default from unauthenticated access, with support for development bypass.

#### Scenario: Unauthenticated user accessing protected route
- **GIVEN** an unauthenticated user
- **AND** authentication bypass is not enabled
- **WHEN** navigating to any route except auth pages
- **THEN** the user SHALL be redirected to `/login`
- **AND** the intended path SHALL be preserved as a `redirect` query parameter

#### Scenario: Authenticated user accessing protected route
- **GIVEN** an authenticated user
- **WHEN** navigating to any route
- **THEN** navigation SHALL proceed normally

#### Scenario: Auth pages remain accessible
- **GIVEN** any user (authenticated or not)
- **WHEN** navigating to an auth page (`/login`, `/register`, `/verify-email`, `/auth/callback`)
- **THEN** navigation SHALL proceed normally
- **NOTE** These are the only routes accessible without authentication

#### Scenario: Bypass mode allows all navigation
- **GIVEN** authentication bypass is enabled via `DISABLE_AUTH=true`
- **WHEN** navigating to any route
- **THEN** navigation SHALL proceed without authentication checks or redirects

---

### Requirement: Runtime Configuration
The system SHALL support configuration of Neon Auth via environment variables and Nuxt runtime config, including the authentication bypass flag.

#### Scenario: Server-side configuration
- **GIVEN** `NEON_AUTH_URL` is set in the environment
- **WHEN** server code accesses `useRuntimeConfig().neonAuthUrl`
- **THEN** the configured URL SHALL be returned

#### Scenario: Client-side configuration
- **GIVEN** `NEON_AUTH_URL` is set in the environment
- **WHEN** client code accesses `useRuntimeConfig().public.neonAuthUrl`
- **THEN** the configured URL SHALL be returned

#### Scenario: Missing configuration error
- **GIVEN** `NEON_AUTH_URL` is not set
- **AND** authentication bypass is not enabled
- **WHEN** auth functionality is used
- **THEN** a clear error message SHALL indicate the missing configuration

#### Scenario: Bypass flag configuration
- **GIVEN** `DISABLE_AUTH` is set to `"true"` in the environment
- **WHEN** server code accesses `useRuntimeConfig().disableAuth`
- **THEN** the boolean value `true` SHALL be returned
- **WHEN** client code accesses `useRuntimeConfig().public.disableAuth`
- **THEN** the boolean value `true` SHALL be returned

#### Scenario: Bypass flag defaults to false
- **GIVEN** `DISABLE_AUTH` is not set in the environment
- **WHEN** any code accesses `useRuntimeConfig().disableAuth` or `useRuntimeConfig().public.disableAuth`
- **THEN** the boolean value `false` SHALL be returned
- **AND** authentication SHALL be enforced normally
