## 1. Implementation

- [x] 1.1 Remove `.js` extensions from `app/composables/*.ts` imports
- [x] 1.2 Remove `.js` extensions from `app/pages/**/*.vue` imports
- [x] 1.3 Remove `.js` extensions from `server/api/**/*.ts` imports
- [x] 1.4 Remove `.js` extensions from `server/services/*.ts` imports
- [x] 1.5 Remove `.js` extensions from `server/utils/prisma.ts` and `prisma/seed.ts`

## 2. Validation

- [x] 2.1 Run TypeScript type check (`npx nuxi typecheck`)
- [x] 2.2 Verify no `.js` imports remain (only generated Prisma client has them, which is expected)
- [x] 2.3 TypeScript type check passed - imports resolve correctly
