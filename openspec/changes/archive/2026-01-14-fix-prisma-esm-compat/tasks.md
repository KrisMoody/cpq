## 1. Prisma Schema Configuration
- [x] 1.1 Add `moduleFormat = "esm"` to generator block in `prisma/schema.prisma`
- [x] 1.2 Remove `previewFeatures = ["driverAdapters"]` (no longer needed in Prisma v7)
- [x] 1.3 Switch from `prisma-client-js` to `prisma-client` generator (required for ESM support)

## 2. Build Configuration
- [x] 2.1 Update `postinstall` script in `package.json` to include `prisma generate`
- [x] 2.2 Remove `@prisma/client` alias from `nuxt.config.ts` (new generator needs runtime access)

## 3. Regenerate Client
- [x] 3.1 Run `npx prisma generate` to regenerate client with ESM output
- [x] 3.2 Update import paths to use `client.js` suffix for ESM compatibility

## 4. Update Import Paths
- [x] 4.1 Update `server/utils/prisma.ts` to import from generated client
- [x] 4.2 Update server services imports (priceLookup, pricingEngine, ruleEngine, discountService)
- [x] 4.3 Update server API imports (rules/evaluate, attributes/*)
- [x] 4.4 Update composables imports (useQuotes, useRules, useDiscounts, useAttributes, useProducts)
- [x] 4.5 Update Vue page imports (rules/*, products/*, discounts/*, attributes/*)
- [x] 4.6 Update seed.ts import path
- [x] 4.7 Update test file import for Decimal type

## 5. Validation
- [x] 5.1 Run `npm run dev` to verify application starts without ESM import errors
- [ ] 5.2 Run `npm run typecheck` to verify TypeScript compilation succeeds (pre-existing type errors unrelated to ESM)
