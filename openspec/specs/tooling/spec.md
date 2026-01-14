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

