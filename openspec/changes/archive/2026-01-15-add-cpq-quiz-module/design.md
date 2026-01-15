# Design: CPQ Quiz Module

## Context
The Learn page provides educational content about CPQ concepts. Adding an interactive quiz helps users test their understanding of terminology, relationships, and concepts.

## Goals / Non-Goals

### Goals
- Provide interactive self-assessment for CPQ knowledge
- Cover all 13 glossary groups with questions
- Include relationship/concept questions (e.g., how entities relate)
- Support single-answer and multiple-answer questions
- Persist quiz history in localStorage
- Provide immediate feedback with explanations

### Non-Goals
- Free-text/essay questions (too complex to validate)
- AI-generated questions (static question bank)
- Gamification features (badges, leaderboards)
- Server-side storage of quiz results
- Timed quizzes or countdown timers

## Decisions

### Question Bank Structure
Questions are organized by domain (matching glossary groups) and relationship topics. Each question has:
- Question text
- Question type: `single` or `multiple`
- Answer options (2-4 choices)
- Correct answer(s)
- Explanation shown after answering
- Difficulty level (basic/intermediate) for potential future filtering

**Rationale**: Static JSON structure keeps implementation simple, allows easy question additions, and matches existing glossary data structure.

### Domain Coverage
Questions cover:
1. **Domain Knowledge** (13 groups × ~5-10 questions each):
   - Meta/Overview (CPQ basics)
   - Product Terms
   - Category Terms
   - Attribute Terms
   - Pricing Terms
   - Currency Terms
   - Quote Terms
   - Customer Terms
   - Contract Terms
   - Tax Terms
   - Rules Terms
   - Discount Terms
   - Guided Selling Terms

2. **Relationship Knowledge** (~15-20 questions):
   - Product → Feature → Option hierarchy
   - Price Book → Entry → Tier hierarchy
   - Quote → Line Item → Discount flow
   - Customer → Contract → Pricing flow
   - Guided Selling flows

### Quiz Generation
When user starts a quiz:
1. Select 1-3 random questions per domain/relationship category
2. Shuffle questions to mix topics
3. Present questions one at a time
4. Show immediate feedback after each answer
5. Display final score and summary at end

**Rationale**: Random selection from a larger pool ensures variety on repeat attempts. 1-3 per domain keeps quiz length manageable (~20-40 questions total).

### Storage Schema (localStorage)
```typescript
interface QuizAttempt {
  id: string
  date: string // ISO date
  totalQuestions: number
  correctAnswers: number
  duration: number // seconds
  domainScores: Record<string, { correct: number, total: number }>
}

interface QuizStorage {
  attempts: QuizAttempt[]
  // Optional: track which questions answered for variety
  lastAttemptDate: string
}
```

### UI Components
- `LearnQuiz.vue` - Main quiz section container
- `LearnQuizQuestion.vue` - Single question display with options
- `LearnQuizResults.vue` - Final score and summary
- `LearnQuizHistory.vue` - Past attempts display
- `quizQuestions.ts` - Question bank data file

## Risks / Trade-offs

### Risk: Question Quality
- **Mitigation**: Review questions against glossary definitions to ensure accuracy. Use "easily confused" terms as basis for distractor options.

### Risk: localStorage Limitations
- **Mitigation**: Limit stored attempts (e.g., last 10) to avoid quota issues. localStorage is sufficient for this learning-focused feature.

### Trade-off: Static vs Dynamic Questions
- Chose static for simplicity and reliability
- Future: Could generate questions from glossary data programmatically

## Open Questions
None - requirements are clear.
