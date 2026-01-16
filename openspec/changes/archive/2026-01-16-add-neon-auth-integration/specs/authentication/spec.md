# Authentication Specification

## ADDED Requirements

### Requirement: Auth Proxy Route
The system SHALL provide a catch-all API route at `/api/auth/[...path]` that proxies all requests to the configured Neon Auth service URL.

#### Scenario: Proxy forwards sign-in request
- **GIVEN** a configured `NEON_AUTH_URL` environment variable
- **WHEN** a POST request is made to `/api/auth/sign-in/email` with credentials
- **THEN** the request SHALL be forwarded to `${NEON_AUTH_URL}/sign-in/email`
- **AND** the response body and set-cookie headers SHALL be forwarded back to the client

#### Scenario: Proxy forwards OAuth request
- **GIVEN** a configured `NEON_AUTH_URL` environment variable
- **WHEN** a POST request is made to `/api/auth/sign-in/social` with provider name
- **THEN** the request SHALL be forwarded to `${NEON_AUTH_URL}/sign-in/social`
- **AND** the OAuth redirect URL SHALL be returned to the client

#### Scenario: Proxy handles missing auth URL
- **GIVEN** no `NEON_AUTH_URL` is configured
- **WHEN** any request is made to `/api/auth/*`
- **THEN** the system SHALL return a 500 error with a descriptive message

---

### Requirement: Server Session Retrieval
The system SHALL provide a `getNeonSession(event)` server utility that retrieves the current user session from cookies.

#### Scenario: Valid session retrieval
- **GIVEN** a request with valid Neon Auth session cookies
- **WHEN** `getNeonSession(event)` is called
- **THEN** the function SHALL return a `NeonAuthSession` object containing user and session data

#### Scenario: No session present
- **GIVEN** a request without session cookies
- **WHEN** `getNeonSession(event)` is called
- **THEN** the function SHALL return `null`

#### Scenario: Session refresh forwarding
- **GIVEN** a request where Neon Auth returns set-cookie headers (session refresh)
- **WHEN** `getNeonSession(event)` is called
- **THEN** the set-cookie headers SHALL be forwarded to the client response

---

### Requirement: Server Auth Requirement
The system SHALL provide a `requireAuth(event)` server utility that enforces authentication on API routes.

#### Scenario: Authenticated request proceeds
- **GIVEN** a request with valid session cookies
- **WHEN** `requireAuth(event)` is called
- **THEN** the function SHALL return the user ID
- **AND** the session SHALL be attached to `event.context.neonAuth`

#### Scenario: Unauthenticated request rejected
- **GIVEN** a request without valid session cookies
- **WHEN** `requireAuth(event)` is called
- **THEN** the function SHALL throw an HTTP 401 Unauthorized error

---

### Requirement: JWT Token Retrieval
The system SHALL provide a `getNeonJWT(event)` server utility that retrieves the JWT token for Data API access.

#### Scenario: JWT retrieved from session
- **GIVEN** a request with a valid session containing a token
- **WHEN** `getNeonJWT(event)` is called
- **THEN** the function SHALL return the JWT token string

#### Scenario: No JWT available
- **GIVEN** a request without a valid session
- **WHEN** `getNeonJWT(event)` is called
- **THEN** the function SHALL return `null`

---

### Requirement: Client Auth Composable
The system SHALL provide a `useNeonAuth()` composable for client-side authentication state management.

#### Scenario: Access authentication state
- **WHEN** `useNeonAuth()` is called
- **THEN** the composable SHALL return reactive refs for `user`, `session`, `loading`, `error`, and `isAuthenticated`

#### Scenario: Sign in with email
- **GIVEN** valid email and password credentials
- **WHEN** `signIn({ email, password })` is called
- **THEN** the system SHALL authenticate with Neon Auth
- **AND** update the local state with user and session data

#### Scenario: Sign up with email
- **GIVEN** valid email, password, and optional name
- **WHEN** `signUp({ email, password, name })` is called
- **THEN** the system SHALL register a new user with Neon Auth
- **AND** email verification SHALL always be required
- **AND** the user SHALL be redirected to the verify-email page

#### Scenario: Sign out
- **GIVEN** an authenticated user
- **WHEN** `signOut()` is called
- **THEN** the system SHALL clear the session with Neon Auth
- **AND** reset local state to unauthenticated

#### Scenario: OAuth sign in (future)
- **GIVEN** a supported OAuth provider name
- **WHEN** `signInWithOAuth(provider)` is called
- **THEN** the system SHALL redirect to the OAuth provider's authorization page
- **NOTE** OAuth is prepared in the architecture but not enabled initially

#### Scenario: Session refresh
- **WHEN** `refreshSession()` is called
- **THEN** the system SHALL fetch the current session from `/api/auth/get-session`
- **AND** update local state accordingly

---

### Requirement: Client Route Guard
The system SHALL provide a global client-side middleware that protects all routes by default from unauthenticated access.

#### Scenario: Unauthenticated user accessing protected route
- **GIVEN** an unauthenticated user
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

---

### Requirement: Login Page
The system SHALL provide a `/login` page for email/password authentication.

#### Scenario: Successful login
- **GIVEN** a user on the login page
- **WHEN** valid credentials are submitted
- **THEN** the user SHALL be authenticated
- **AND** redirected to the home page or the preserved redirect path

#### Scenario: Failed login
- **GIVEN** a user on the login page
- **WHEN** invalid credentials are submitted
- **THEN** an error message SHALL be displayed
- **AND** the user SHALL remain on the login page

#### Scenario: Link to registration
- **GIVEN** a user on the login page
- **THEN** a link to the registration page SHALL be visible

---

### Requirement: Registration Page
The system SHALL provide a `/register` page for new user registration with mandatory email verification.

#### Scenario: Successful registration
- **GIVEN** a user on the registration page
- **WHEN** valid registration details are submitted
- **THEN** the user account SHALL be created
- **AND** an OTP code SHALL be sent to their email
- **AND** the user SHALL be redirected to `/verify-email`

#### Scenario: Failed registration
- **GIVEN** a user on the registration page
- **WHEN** invalid or duplicate details are submitted
- **THEN** an error message SHALL be displayed

---

### Requirement: Email Verification Page
The system SHALL provide a `/verify-email` page for OTP-based email verification.

#### Scenario: Successful verification
- **GIVEN** a user with a pending email verification
- **WHEN** the correct OTP code is submitted
- **THEN** the email SHALL be verified
- **AND** the user SHALL be redirected to the dashboard

#### Scenario: Failed verification
- **GIVEN** a user on the verification page
- **WHEN** an incorrect OTP code is submitted
- **THEN** an error message SHALL be displayed

#### Scenario: Resend verification code
- **GIVEN** a user on the verification page
- **WHEN** the resend button is clicked
- **THEN** a new OTP code SHALL be sent
- **AND** a cooldown period SHALL prevent immediate re-requests

---

### Requirement: OAuth Callback Page
The system SHALL provide an `/auth/callback` page to handle OAuth provider redirects (prepared for future OAuth support).

#### Scenario: Successful OAuth callback
- **GIVEN** a successful OAuth authentication
- **WHEN** the OAuth provider redirects to `/auth/callback`
- **THEN** the session SHALL be refreshed
- **AND** the user SHALL be redirected to the dashboard

#### Scenario: Failed OAuth callback
- **GIVEN** an OAuth error (user denied, provider error)
- **WHEN** the OAuth provider redirects to `/auth/callback` with an error
- **THEN** an error message SHALL be displayed
- **AND** a link to retry login SHALL be provided

**NOTE**: OAuth is prepared in the architecture but not enabled initially. This page exists to support future OAuth provider integration.

---

### Requirement: User Menu Component
The system SHALL provide a `UserMenu` component displaying the authenticated user's information and actions.

#### Scenario: Display user information
- **GIVEN** an authenticated user
- **WHEN** the UserMenu is rendered
- **THEN** the user's name or email SHALL be displayed
- **AND** an avatar SHALL be displayed if available

#### Scenario: Sign out action
- **GIVEN** an authenticated user viewing the UserMenu
- **WHEN** the sign out button is clicked
- **THEN** the user SHALL be signed out
- **AND** redirected to the login page

---

### Requirement: Runtime Configuration
The system SHALL support configuration of Neon Auth via environment variables and Nuxt runtime config.

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
- **WHEN** auth functionality is used
- **THEN** a clear error message SHALL indicate the missing configuration
