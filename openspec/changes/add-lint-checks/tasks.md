# Tasks: Add Full Lint Checks

## 1. Setup ESLint
- [ ] 1.1 Install `@nuxt/eslint` module and peer dependencies
- [ ] 1.2 Add `@nuxt/eslint` to `nuxt.config.ts` modules
- [ ] 1.3 Create `eslint.config.mjs` with Nuxt preset
- [ ] 1.4 Add `lint` and `lint:fix` scripts to `package.json`

## 2. Run Initial Lint Check
- [ ] 2.1 Run `yarn lint` to identify all issues
- [ ] 2.2 Document lint errors and warnings found

## 3. Fix Lint Issues
- [ ] 3.1 Run `yarn lint:fix` for auto-fixable issues
- [ ] 3.2 Manually fix remaining issues (if any)
- [ ] 3.3 Run final lint check to confirm zero issues

## 4. Verification
- [ ] 4.1 Verify build still works (`yarn build`)
- [ ] 4.2 Verify dev server starts (`yarn dev`)
