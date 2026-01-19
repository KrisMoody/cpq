# authentication Specification Delta

## MODIFIED Requirements

### Requirement: Client Auth Composable
The system SHALL provide a `useNeonAuth()` composable for client-side authentication state management **that persists across page refreshes by leveraging `useNeonSession`**.

#### Scenario: Access authentication state (MODIFIED)
- **WHEN** `useNeonAuth()` is called on initial page load
- **THEN** the composable SHALL return reactive refs for `user`, `session`, `loading`, `error`, and `isAuthenticated`
- **AND** if a valid session cookie exists, `user` and `session` SHALL be pre-populated from `useNeonSession` SSR-hydrated data

#### Scenario: Session persists across refresh (ADDED)
- **GIVEN** an authenticated user with valid session cookies
- **WHEN** the user refreshes the page
- **THEN** `useNeonSession` SHALL fetch the session during SSR via `useFetch`
- **AND** the auth state SHALL be hydrated to the client automatically
- **AND** `isAuthenticated` SHALL be `true` immediately on client render
- **AND** the user SHALL NOT be redirected to the login page

#### Scenario: Auth state syncs after mutations (ADDED)
- **GIVEN** a user performs signIn, signOut, or other auth mutation via `useNeonAuth`
- **WHEN** the mutation completes successfully
- **THEN** `useNeonSession().refresh()` SHALL be called to sync the SSR-hydration source
- **AND** both composables SHALL reflect the same auth state

---

### Requirement: Client Route Guard (MODIFIED)
The system SHALL provide a global client-side middleware that protects all routes by default from unauthenticated access, **using `useNeonSession` for SSR-hydrated auth state**.

#### Scenario: Authenticated user on page refresh (MODIFIED)
- **GIVEN** an authenticated user with valid session cookies
- **WHEN** the page is refreshed or loaded directly via URL
- **THEN** the middleware SHALL use `useNeonSession()` which is SSR-hydrated
- **AND** navigation SHALL proceed normally without redirect

#### Scenario: Middleware waits for pending session fetch (ADDED)
- **GIVEN** the session fetch is still pending (during SSR or initial client load)
- **WHEN** the middleware checks authentication
- **THEN** it SHALL wait for the `pending` state to resolve before making a decision
- **AND** it SHALL NOT redirect while the session is being fetched

#### Scenario: Unauthenticated user accessing protected route (UNCHANGED)
- **GIVEN** an unauthenticated user (no valid session cookies)
- **WHEN** navigating to any route except auth pages
- **THEN** the user SHALL be redirected to `/login`
- **AND** the intended path SHALL be preserved as a `redirect` query parameter
