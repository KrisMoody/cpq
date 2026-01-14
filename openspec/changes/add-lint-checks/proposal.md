# Change: Add Full Lint Checks

## Why
The project currently has no linting setup. Adding ESLint with proper Nuxt/Vue/TypeScript configuration will catch code quality issues, enforce consistent code style, and prevent common bugs before they reach production.

## What Changes
- Add `@nuxt/eslint` module for ESLint integration
- Configure ESLint with TypeScript and Vue rules
- Add `lint` and `lint:fix` npm scripts
- Run full lint checks and fix auto-fixable issues
- Document any manual fixes needed

## Impact
- Affected specs: New `tooling` capability
- Affected code: All `.ts`, `.vue`, and config files in `app/`, `server/`, and root
- New dependencies: `@nuxt/eslint`, `eslint`
