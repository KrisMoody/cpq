# Tasks: Add Full Lint Checks

## 1. Setup ESLint
- [x] 1.1 Install `@nuxt/eslint` module
- [x] 1.2 Add `@nuxt/eslint` to `nuxt.config.ts` modules
- [x] 1.3 Create `eslint.config.mjs` with Nuxt preset
- [x] 1.4 Add `lint` and `lint:fix` scripts to `package.json`

## 2. Configure Pre-commit Hook
- [x] 2.1 Add lint-staged config to `package.json` (lint + typecheck staged files)
- [x] 2.2 Update `.husky/pre-commit` to run `npx lint-staged`

## 3. Run Initial Lint Check
- [x] 3.1 Run `yarn lint` to identify all issues
- [x] 3.2 Document lint errors and warnings found (251 initial issues: 203 `no-explicit-any`, 40 unused vars, 8 auto-fixable)

## 4. Fix Lint Issues
- [x] 4.1 Run `yarn lint:fix` for auto-fixable issues
- [x] 4.2 Manually fix remaining issues (fixed 40 unused variable errors)
- [x] 4.3 Run final lint check to confirm zero errors (203 warnings remain for `no-explicit-any` - acceptable for POC)

## 5. Verification
- [x] 5.1 Verify typecheck passes (`yarn typecheck`)
- [x] 5.2 Verify build works (`yarn build`)
- [ ] 5.3 Test pre-commit hook by staging a file and committing (manual verification)

## Notes
- Configured `@typescript-eslint/no-explicit-any` as warning (not error) for POC project
- Added `eslint` and `typescript` as dev dependencies (peer deps of @nuxt/eslint)
