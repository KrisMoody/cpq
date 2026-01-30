## 1. Fix Schema API Endpoint

- [x] 1.1 Create build-time schema export generator script (`scripts/generate-schema-export.ts`)
- [x] 1.2 Add `generate:schema-export` npm script to package.json
- [x] 1.3 Update build script to run generator before nuxt build
- [x] 1.4 Update postinstall to run generator after prisma generate
- [x] 1.5 Update `server/api/schema.get.ts` to import from generated module
- [x] 1.6 Add generated file to .gitignore

## 2. Verification

- [x] 2.1 Test endpoint locally with `yarn dev`
- [x] 2.2 Deploy to Vercel and verify `/api/schema` returns the schema content (PR #66 created)
