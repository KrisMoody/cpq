## ADDED Requirements

### Requirement: ESLint Configuration
The project SHALL have ESLint configured with the Nuxt ESLint module for consistent code quality enforcement.

#### Scenario: Nuxt ESLint module enabled
- **WHEN** the project is built or the dev server runs
- **THEN** ESLint rules from `@nuxt/eslint` are applied

#### Scenario: ESLint config file exists
- **WHEN** a developer inspects the project root
- **THEN** an `eslint.config.mjs` file exists with Nuxt preset

### Requirement: Lint Scripts
The project SHALL provide npm scripts for running lint checks.

#### Scenario: Run lint check
- **WHEN** developer runs `yarn lint`
- **THEN** ESLint analyzes all `.ts` and `.vue` files

#### Scenario: Auto-fix lint issues
- **WHEN** developer runs `yarn lint:fix`
- **THEN** ESLint fixes auto-fixable issues in place

### Requirement: Clean Lint State
The project SHALL pass all lint checks with zero errors.

#### Scenario: No lint errors
- **WHEN** `yarn lint` is executed
- **THEN** the command exits with code 0 and reports no errors

### Requirement: Pre-commit Lint Integration
The project SHALL run lint checks on staged files before commits.

#### Scenario: Lint-staged runs on commit
- **WHEN** a developer commits staged `.ts` or `.vue` files
- **THEN** lint-staged runs ESLint and typecheck on those files

#### Scenario: Commit blocked on lint failure
- **WHEN** staged files have lint errors
- **THEN** the commit is blocked until errors are fixed
