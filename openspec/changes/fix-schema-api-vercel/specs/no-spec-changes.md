# No Specification Changes

This change is a bug fix that corrects the implementation of an existing capability without changing its specification.

**Existing behavior** (unchanged): The `/api/schema` endpoint returns the raw Prisma schema content as text.

**Fix**: The implementation is corrected to work in serverless environments by embedding the schema at build time instead of reading it from the filesystem at runtime.

No requirements are added, modified, or removed.
