## ADDED Requirements

### Requirement: TypeScript Type Checking Script
The project SHALL provide a `typecheck` npm script that runs full TypeScript type checking via `nuxt typecheck`.

#### Scenario: Run typecheck manually
- **WHEN** developer runs `yarn typecheck`
- **THEN** nuxt typecheck executes and reports any type errors
- **AND** exits with code 0 if no errors, non-zero otherwise

### Requirement: Pre-Commit Type Checking
The project SHALL enforce TypeScript type checking on staged files before commits.

#### Scenario: Commit with type errors blocked
- **WHEN** developer attempts to commit changes
- **AND** staged .ts or .vue files contain type errors
- **THEN** the commit is blocked
- **AND** type errors are displayed to the developer

#### Scenario: Commit without type errors succeeds
- **WHEN** developer attempts to commit changes
- **AND** staged files pass type checking
- **THEN** the commit proceeds normally

### Requirement: Type Error-Free Codebase
The project codebase SHALL pass TypeScript strict mode checking without errors.

#### Scenario: Clean typecheck on main branch
- **WHEN** `yarn typecheck` is run on the main branch
- **THEN** zero type errors are reported
- **AND** the command exits with code 0
