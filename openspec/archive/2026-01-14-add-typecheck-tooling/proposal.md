# Change: Add TypeScript Checking Tooling

## Why
The project currently has 41 TypeScript errors that go unnoticed during development. Adding a typecheck script and pre-commit hook will catch type errors early and maintain type safety as the codebase grows.

## What Changes
- Add `typecheck` script to package.json using `nuxt typecheck`
- Install and configure Husky for git hooks
- Add lint-staged for running checks on staged files
- Create pre-commit hook that runs TypeScript checks

## Impact
- Affected specs: None (new tooling capability)
- Affected code: package.json, new .husky/ directory
- Developer workflow: Commits will be blocked if type errors exist in staged files
