## Context

The CPQ project includes a comprehensive training course in `/docs/course/` with:
- 14 numbered modules (00-13) covering CPQ concepts from beginner to advanced
- 2 appendices (data models reference, glossary)
- README with course structure and navigation
- ~60 "Checkpoint Questions" with answers in `<details>` tags

The Learn page (`/learn`) already has:
- Glossary, ER diagrams, workflow visualization
- Quiz functionality with 14 domains and localStorage history
- Collapsible sections with table of contents

## Goals / Non-Goals

**Goals:**
- Display course modules in a browsable, interactive format on the Learn page
- Allow users to track their progress through the course
- Add checkpoint questions to the quiz for reinforced learning
- Render markdown with code highlighting and Mermaid diagrams

**Non-Goals:**
- Video content or interactive exercises beyond reading
- Server-side progress persistence (use localStorage like quiz)
- Course assessments or certification
- Editing course content from the UI

## Decisions

### 1. Course Content Delivery

**Decision:** Serve course markdown via server API, render on client with `@nuxtjs/mdc`.

**Alternatives considered:**
- Pre-render at build time: Simpler but requires rebuild for content changes
- Import markdown as modules: Increases bundle size significantly (~200KB of content)

**Rationale:** Server API allows dynamic loading without rebuilding. MDC provides SSR-compatible markdown rendering with Vue component support.

### 2. Course Progress Storage

**Decision:** Use localStorage with `useCourseProgress` composable, matching quiz pattern.

**Alternatives considered:**
- Database persistence: Requires auth and adds complexity
- Session storage: Lost on tab close

**Rationale:** Consistent with existing quiz history pattern. No auth required. Data persists across sessions.

### 3. Quiz Question Integration

**Decision:** Add course questions to existing `quizQuestions.ts` with new domain prefixes `course-beginner`, `course-intermediate`, `course-advanced`.

**Alternatives considered:**
- Single `course` domain: Less granular, harder to track progress by level
- Separate question file: Splits quiz logic unnecessarily

**Rationale:** Maps to course level structure. Allows filtering by difficulty. Integrates cleanly with existing quiz UI.

### 4. Course Navigation

**Decision:** Module list on Learn page; full module content in expandable section or slide-over panel.

**Alternatives considered:**
- Separate `/course/[module]` pages: Breaks the single-page Learn experience
- Modal for module content: Too constrained for long content

**Rationale:** Keeps learning content centralized. Users can navigate between modules without losing context.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Large markdown files slow down rendering | Lazy-load module content on demand |
| Mermaid diagrams may not render | Use existing `LearnMermaidDiagram` component or fallback to code blocks |
| Quiz question conversion errors | Manual review of converted questions before merge |

## Migration Plan

1. Add course components and API endpoint (no breaking changes)
2. Add course section to Learn page (additive)
3. Add quiz questions to existing file (additive)
4. Rollback: Remove course section if issues arise; quiz questions can remain

## Open Questions

1. Should course progress affect quiz question selection? (e.g., only show questions from completed modules)
2. Should we link glossary terms to relevant course modules?
