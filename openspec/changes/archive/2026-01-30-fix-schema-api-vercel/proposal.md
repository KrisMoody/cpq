## Why

The `/api/schema` endpoint returns a 500 error on Vercel because it tries to read `prisma/schema.prisma` from the filesystem at runtime. Vercel's serverless functions don't include source files that aren't explicitly bundled, so the file doesn't exist at the expected path.

## What Changes

- Replace runtime filesystem read with Vite's `?raw` import to embed the schema content at build time
- The schema content will be bundled into the API handler, eliminating runtime file access

## Capabilities

### New Capabilities
<!-- None - this is a bug fix, not a new capability -->

### Modified Capabilities
<!-- None - no spec-level requirement changes, only implementation fix -->

## Impact

- `server/api/schema.get.ts`: Replace `readFile()` with `?raw` import
- No API contract changes - endpoint still returns the raw schema text
- Works identically in development and production
