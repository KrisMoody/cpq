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

