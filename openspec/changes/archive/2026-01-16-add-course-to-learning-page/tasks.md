## 1. Course Section UI

- [x] 1.1 Create `LearnCourseList.vue` component displaying all modules as cards with title, level, and focus
- [x] 1.2 Create `LearnCourseModule.vue` component to render individual module markdown content
- [x] 1.3 Add "Course" section to `learn.vue` page with collapsible wrapper
- [x] 1.4 Add "Course" entry to table of contents navigation
- [x] 1.5 Style course cards with level indicators (Beginner/Intermediate/Advanced)

## 2. Course Content Rendering

- [x] 2.1 Create server API endpoint `/api/course/[module].get.ts` to serve course markdown files
- [x] 2.2 Install/configure markdown rendering library (e.g., `@nuxtjs/mdc` or `markdown-it`) - Used custom markdown parser
- [x] 2.3 Add syntax highlighting for code blocks in course content
- [x] 2.4 Handle Mermaid diagram rendering in course content - Uses existing LearnMermaidDiagram component
- [x] 2.5 Implement navigation between modules (previous/next)

## 3. Progress Tracking

- [x] 3.1 Create `useCourseProgress` composable for localStorage-based progress tracking
- [x] 3.2 Track module completion status (not started, in progress, completed)
- [x] 3.3 Display progress indicators on course module cards
- [x] 3.4 Add "Mark as Complete" button to module viewer
- [x] 3.5 Show overall course completion percentage

## 4. Quiz Integration

- [x] 4.1 Parse checkpoint questions from all course modules (extract Q&A from `<details>` tags)
- [x] 4.2 Convert questions to quiz format (`QuizQuestion` interface)
- [x] 4.3 Add course domain(s) to `QuizDomain` type (e.g., `course-beginner`, `course-intermediate`, `course-advanced`)
- [x] 4.4 Add 27 checkpoint questions to `quizQuestions.ts` organized by difficulty level
- [x] 4.5 Update quiz UI to show new domain labels
- [x] 4.6 Test quiz generation includes new course questions

## 5. Validation & Polish

- [x] 5.1 Test responsive layout on mobile/tablet/desktop - Uses responsive grid
- [x] 5.2 Ensure keyboard accessibility for course navigation - Standard button/link navigation
- [x] 5.3 Add loading states for course content fetching
- [x] 5.4 Verify quiz questions have appropriate difficulty spread - 7 beginner, 10 intermediate, 10 advanced
