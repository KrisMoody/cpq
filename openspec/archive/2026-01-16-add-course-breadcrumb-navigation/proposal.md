# Change: Add Course Breadcrumb Navigation

## Why
When viewing a course module on the Learn page, users lack context about their location within the course. The current implementation renders course modules in-place without changing the URL, so the breadcrumb only shows "Learn" regardless of which module is being viewed. This makes it difficult for users to:
- Understand they're inside the course section
- Navigate back to the course list
- Know which module they're currently viewing

## What Changes
- **Route-based course navigation**: Create dedicated routes `/learn/course` (course hub) and `/learn/course/[moduleId]` (module view)
- **Breadcrumb support**: Enable automatic breadcrumbs like "Learn > Course > Introduction to CPQ" when viewing modules
- **Navigation structure update**: Add Course as a nested item under Learn in the navigation structure
- **Preserve existing functionality**: Module progress tracking, content rendering, and navigation between modules remain unchanged

## Impact
- Affected specs: `learning-ui`
- Affected code:
  - `app/pages/learn.vue` - Remove embedded course module state
  - `app/pages/learn/index.vue` - New: Learn hub page
  - `app/pages/learn/course/index.vue` - New: Course list page
  - `app/pages/learn/course/[moduleId].vue` - New: Module viewer page
  - `app/layouts/default.vue` - Update navigation structure for Learn section
  - `app/composables/useBreadcrumbs.ts` - May need minor updates for Learn section routes
