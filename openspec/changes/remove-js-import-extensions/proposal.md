# Change: Remove unnecessary .js extensions from imports

## Why
The codebase has 61 imports using `.js` extensions (e.g., `from '../utils/errors.js'`). With Nuxt 3's `moduleResolution: "Bundler"` in tsconfig, these extensions are unnecessary and inconsistent with standard TypeScript conventions.

## What Changes
- Remove `.js` extensions from all import statements across 48 files
- Standardize imports to use extensionless paths (e.g., `from '../utils/errors'`)
- No behavioral changes - purely cosmetic/consistency improvement

## Impact
- Affected specs: None (code style change only)
- Affected code: 48 files across `app/`, `server/`, and `prisma/` directories
  - `app/composables/*.ts` - 14 files
  - `app/pages/**/*.vue` - 13 files
  - `server/api/**/*.ts` - 12 files
  - `server/services/*.ts` - 6 files
  - `server/utils/prisma.ts`
  - `prisma/seed.ts`
