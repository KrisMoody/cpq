# Change: Add Full Lint Checks

## Why
The project has husky + lint-staged installed but no ESLint setup. The pre-commit hook currently runs only `typecheck`. Adding ESLint with proper Nuxt/Vue/TypeScript configuration will catch code quality issues, enforce consistent code style, and prevent common bugs before they reach production.

## What Changes
- Add `@nuxt/eslint` module for ESLint integration
- Configure ESLint with TypeScript and Vue rules
- Add `lint` and `lint:fix` npm scripts
- Configure lint-staged to run ESLint on staged files
- Update pre-commit hook to run lint-staged (which runs both lint + typecheck)
- Run full lint checks and fix auto-fixable issues

## Impact
- Affected specs: New `tooling` capability
- Affected code: All `.ts`, `.vue`, and config files in `app/`, `server/`, and root
- New dependencies: `@nuxt/eslint`, `eslint`
- Modified files: `.husky/pre-commit`, `package.json`
