# Change: Fix Prisma ESM Module Compatibility

## Why
The project uses `"type": "module"` in package.json (ESM), but Prisma generates CommonJS output by default. This causes runtime errors when importing named exports like `BillingFrequency`, `ProductType`, and `QuoteStatus` from the generated Prisma client:

```
Named export 'BillingFrequency' not found. The requested module is a CommonJS module, which may not support all module.exports as named exports.
```

## What Changes
- **Switch from `prisma-client-js` to `prisma-client` generator** - The new generator supports ESM via `moduleFormat = "esm"`
- Remove deprecated `previewFeatures = ["driverAdapters"]` (driver adapters are GA in Prisma v7)
- Add `prisma generate` to `postinstall` script for deployment reliability
- Remove `@prisma/client` alias from nuxt.config.ts (new generator requires `@prisma/client/runtime` to remain accessible)
- Update all import paths to use `client.js` suffix for ESM compatibility
- Regenerate Prisma client with ESM output (TypeScript files instead of CommonJS)

## Impact
- Affected specs: tooling (new spec for Prisma configuration)
- Affected code:
  - `prisma/schema.prisma` - generator configuration
  - `package.json` - postinstall script
  - `nuxt.config.ts` - removed alias
  - `server/utils/prisma.ts` - updated import path
  - `server/services/*.ts` - updated import paths
  - `server/api/**/*.ts` - updated import paths
  - `app/composables/*.ts` - updated import paths
  - `app/pages/**/*.vue` - updated import paths
  - `prisma/seed.ts` - updated import path
  - `app/generated/prisma/` - regenerated client (ESM TypeScript format)
