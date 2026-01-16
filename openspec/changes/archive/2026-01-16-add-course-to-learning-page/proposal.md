# Change: Add CPQ Course to Learning Page

## Why
The `/docs/course` directory contains a comprehensive CPQ training course with 14 modules, but this content is only accessible by browsing markdown files. Making the course available in the frontend learning page would:
- Provide a better learning experience with interactive navigation
- Centralize all CPQ educational content in one place
- Allow learners to track their progress through the course
- Integrate the ~60 checkpoint questions from the course into the quiz system for reinforced learning

## What Changes
- **New "Course" section** on the Learn page with module listing and navigation
- **Course viewer component** to display module content rendered from markdown
- **Module progress tracking** using localStorage (similar to quiz history)
- **Checkpoint questions integration** - parse and add ~60 questions from course modules to the existing quiz question bank
- **New quiz domain** for course-specific questions or integration into existing domains

## Impact
- Affected specs: `learning-ui`
- Affected code:
  - `app/pages/learn.vue` - add Course section
  - `app/components/learn/` - new course components
  - `app/data/quizQuestions.ts` - add checkpoint questions
  - `app/composables/useCourseProgress.ts` - new composable for progress tracking
