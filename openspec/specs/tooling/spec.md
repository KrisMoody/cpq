# tooling Specification

## Purpose
TBD - created by archiving change fix-prisma-esm-compat. Update Purpose after archive.
## Requirements
### Requirement: Prisma ESM Configuration
The Prisma generator SHALL be configured to output ESM modules for compatibility with the project's ESM module system.

#### Scenario: ESM module format configured
- **WHEN** the Prisma schema generator block is inspected
- **THEN** the provider is `prisma-client` (not the deprecated `prisma-client-js`)
- **AND** it includes `moduleFormat = "esm"`

#### Scenario: Named exports available
- **WHEN** importing enums from the generated Prisma client via `client.js`
- **THEN** named exports like `BillingFrequency`, `ProductType`, `QuoteStatus` are available
- **AND** no CommonJS/ESM interoperability errors occur

#### Scenario: TypeScript output
- **WHEN** `prisma generate` runs
- **THEN** the generated client contains TypeScript files (`.ts`)
- **AND** import statements use `.js` extensions for ESM compatibility

### Requirement: Prisma Client Generation on Install
The project SHALL regenerate the Prisma client during package installation to ensure deployment reliability.

#### Scenario: Postinstall generates client
- **WHEN** `npm install` or `npm ci` completes
- **THEN** `prisma generate` runs automatically via the postinstall script
- **AND** the generated client is available in `app/generated/prisma/`

### Requirement: Prisma ERD Generator
The system SHALL auto-generate an Entity Relationship Diagram from the Prisma schema on each `prisma generate` run.

#### Scenario: ERD generator configured
- **WHEN** the Prisma schema generator blocks are inspected
- **THEN** a generator with provider `prisma-erd-generator` is configured
- **AND** the output path is set to `public/prisma-erd.svg`

#### Scenario: ERD generated on prisma generate
- **WHEN** `npx prisma generate` runs
- **THEN** an SVG file is created at `public/prisma-erd.svg`
- **AND** the SVG contains all entities from the Prisma schema
- **AND** relationships between entities are shown with cardinality labels

#### Scenario: ERD dependencies installed
- **WHEN** inspecting package.json devDependencies
- **THEN** `prisma-erd-generator` is listed
- **AND** `@mermaid-js/mermaid-cli` is listed (required for SVG generation)

### Requirement: Extensionless Import Convention
Application code SHALL use extensionless import paths when importing TypeScript modules, relying on the bundler's module resolution.

#### Scenario: Import paths omit file extensions
- **WHEN** importing from application modules (composables, utils, types, generated Prisma client)
- **THEN** import statements use extensionless paths (e.g., `from '../utils/errors'`)
- **AND** no `.js` or `.ts` extensions appear in import paths

#### Scenario: Bundler resolution handles imports
- **WHEN** the TypeScript configuration is inspected
- **THEN** `moduleResolution` is set to `"Bundler"`
- **AND** the bundler resolves extensionless imports to the correct files

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

