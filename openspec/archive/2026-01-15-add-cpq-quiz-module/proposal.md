# Change: Add CPQ Quiz Module

## Why
The Learn page contains comprehensive CPQ glossary terms, concepts, and relationships, but lacks an interactive way for users to test and reinforce their knowledge. A quiz module will help developers verify their understanding of CPQ domains and identify areas that need review.

## What Changes
- Add a "Quiz" section as a new collapsible section on the Learn page
- Create a quiz system with questions covering each CPQ domain (product, pricing, quote, etc.) and concept relationships
- Support single-answer and multiple-answer question types (no free text)
- Quiz selection: 1-3 random questions per domain/relation when taking a test
- Question bank: 5-10 questions per domain/relation
- Show immediate feedback with explanations after each question
- Track progress and scores in localStorage across sessions
- Display quiz history and scores

## Impact
- Affected specs: `learning-ui`
- Affected code: `app/pages/learn.vue`, new components in `app/components/Learn/`
- No database changes required (localStorage for persistence)
- No breaking changes

## Content Validation Summary

### Glossary Accuracy
The existing Learn page glossary has been validated against:
1. **Prisma Schema** - All models, enums, and relationships verified
2. **CPQ Industry Standards** - Terminology aligns with standard CPQ concepts (Salesforce CPQ, etc.)

### Validation Findings
- **Conceptually Accurate**: All glossary terms describe valid CPQ concepts
- **Implementation Variations**: Some features (like inline price adjustments on Options) are valid CPQ concepts but implemented differently in the schema (via product references). This is acceptable for educational purposes.
- **No Factual Errors**: No statements found that are factually incorrect from a CPQ perspective

### Question Bank
Created 97 validated questions covering:
- 14 domains (5-8 questions each)
- 15 relationship questions testing cross-domain understanding
- All answers verified against glossary and schema

See `specs/question-bank.md` for the complete validated question bank.
