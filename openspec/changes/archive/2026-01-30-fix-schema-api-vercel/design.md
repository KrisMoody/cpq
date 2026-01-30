## Context

The `/api/schema` endpoint serves the raw Prisma schema content to the frontend for rendering the ERD diagram in the learn section. Originally it read the file at runtime using Node's `fs.readFile()`. This works locally but fails on Vercel because serverless functions don't bundle source files like `prisma/schema.prisma`.

## Goals / Non-Goals

**Goals:**
- Make `/api/schema` work on Vercel's serverless environment
- Keep the endpoint behavior identical (return raw schema text)
- Auto-generate the export so schema changes don't require manual updates

**Non-Goals:**
- Changing the schema parsing logic in `usePrismaSchema.ts`
- Dynamic schema updates at runtime (the schema only changes with deployments anyway)

## Decisions

### Use build-time code generation instead of Vite's `?raw` import

**Decision**: Create a build script that generates a TypeScript module exporting the schema content as a string.

**Rationale**:
- Vite's `?raw` import doesn't work in Nitro (uses Rollup, not Vite)
- Nitro's `serverAssets` configuration didn't bundle the file as expected
- Build-time generation is reliable and works in all environments
- The generator runs automatically on `yarn build` and `yarn postinstall`

**Implementation**:
1. `scripts/generate-schema-export.ts` - reads `prisma/schema.prisma` and writes `server/utils/prismaSchema.ts`
2. `package.json` - `build` and `postinstall` scripts run the generator
3. `server/api/schema.get.ts` - imports from the generated module
4. `.gitignore` - excludes the generated file (regenerated on build)

**Alternatives considered**:
- Vite `?raw` import - doesn't work with Nitro's Rollup bundler
- Nitro `serverAssets` - configuration didn't work as documented
- Copy to `public/` - exposes schema publicly, adds build complexity
- Manual string embedding - requires manual updates when schema changes

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Generated file could become stale | Runs on every build and postinstall |
| Extra build step | Adds ~100ms to build time |
| Schema changes require rebuild | Already true - Prisma client generation requires rebuild anyway |
