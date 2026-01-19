## ADDED Requirements

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
