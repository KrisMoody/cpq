# Tasks

## Phase 1: Route Structure

1. [x] Create `app/pages/learn/index.vue` - Move existing learn.vue content here (Nuxt file-based routing will serve this at `/learn`)
2. [x] Create `app/pages/learn/course/index.vue` - Course hub page showing module list
3. [x] Create `app/pages/learn/course/[moduleId].vue` - Module viewer page with breadcrumb support
4. [x] Remove course-specific state from learn page (selectedCourseModule ref, handlers)

## Phase 2: Navigation Updates

5. [x] Update `app/layouts/default.vue` - Add Learn section structure with Course as a nested route
6. [x] Verify `useBreadcrumbs` composable handles Learn section correctly

## Phase 3: Component Updates

7. [x] Update `LearnCourseList.vue` - Emit router navigation instead of module selection
8. [x] Update `LearnCourseModule.vue` - Use route params instead of props, navigate via router

## Phase 4: Validation

9. [x] Verify breadcrumbs show correctly: "Learn > Course" on course list, "Learn > Course > [Module Title]" on module view
10. [x] Verify module progress tracking still works
11. [x] Verify back navigation works correctly
12. [x] Verify previous/next module navigation works
