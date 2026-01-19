## ADDED Requirements

### Requirement: Type Safety Standards
The codebase SHALL follow strict type safety standards to prevent runtime errors and improve maintainability.

#### Scenario: No explicit any types
- **WHEN** reviewing TypeScript code
- **THEN** the code MUST NOT contain explicit `any` type annotations
- **AND** ESLint SHALL flag any `any` usage as an error

#### Scenario: Error handling with unknown type
- **WHEN** catching errors in try/catch blocks
- **THEN** the catch variable SHALL use `unknown` type
- **AND** error properties SHALL be accessed via type guards or the `getErrorMessage` utility

#### Scenario: Prisma JSON field typing
- **WHEN** working with Prisma JSON fields (e.g., Rule.condition, Attribute.options)
- **THEN** specific TypeScript interfaces SHALL be used instead of `JsonValue`
- **AND** type guards SHALL validate the shape at runtime boundaries

### Requirement: Type Assertion Minimization
Type assertions (`as` keyword) SHALL be minimized and documented when necessary.

#### Scenario: Route parameter typing
- **WHEN** accessing route parameters in page components
- **THEN** the `useRequiredParam` composable SHALL be used instead of `as string` assertions
- **AND** the composable SHALL throw a 400 error for missing/invalid parameters

#### Scenario: Necessary type assertions
- **WHEN** a type assertion is genuinely required
- **THEN** it SHALL be accompanied by a comment explaining why: `// ASSERTION: <reason>`
- **AND** the assertion SHALL use the narrowest possible target type

#### Scenario: Enum value initialization
- **WHEN** initializing reactive state with enum values
- **THEN** imported enum values SHALL be used directly (e.g., `ProductType.STANDALONE`)
- **AND** string literals with `as EnumType` assertions SHALL NOT be used

### Requirement: Nullish Value Conventions
Nullish values SHALL follow consistent conventions across the codebase.

#### Scenario: Database layer nullish values
- **WHEN** a database field has no value
- **THEN** `null` SHALL be used (matching Prisma/PostgreSQL semantics)
- **AND** `undefined` SHALL NOT be stored in the database

#### Scenario: API response nullish values
- **WHEN** an API response field has no value
- **THEN** the field SHALL be set to `null` or omitted entirely
- **AND** `undefined` SHALL NOT appear in JSON responses (as it serializes to nothing)

#### Scenario: Frontend state nullish values
- **WHEN** representing "no value" in Vue reactive state
- **THEN** `null` SHALL be used for explicit absence
- **AND** `undefined` MAY be used for "not yet initialized" states

#### Scenario: Empty string handling
- **WHEN** a form input is cleared
- **THEN** empty strings SHALL be converted to `null` before API submission
- **AND** empty strings SHALL NOT be used to represent "no value" for non-string fields
