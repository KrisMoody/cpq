## ADDED Requirements

### Requirement: Quiz Section
The system SHALL provide a Quiz section on the Learn page as a collapsible section for users to test their CPQ knowledge.

#### Scenario: View quiz section
- **WHEN** user views the Learn page
- **THEN** display a "Quiz" collapsible section alongside other learning sections
- **AND** the section is included in the table of contents navigation

#### Scenario: Quiz section in collapsed state
- **WHEN** user views the quiz section header
- **THEN** display section title "Test Your Knowledge" with quiz icon
- **AND** show expand/collapse toggle

### Requirement: Quiz Question Bank
The system SHALL provide a question bank with 5-10 questions per CPQ domain and 15-20 questions about concept relationships.

#### Scenario: Question bank coverage
- **WHEN** quiz questions are loaded
- **THEN** include questions for all glossary groups: Meta, Product, Category, Attribute, Pricing, Currency, Quote, Customer, Contract, Tax, Rules, Discount, Guided Selling
- **AND** include questions about relationships between concepts

#### Scenario: Question format
- **WHEN** a question is defined
- **THEN** it has question text, type (single or multiple), 2-4 answer options, correct answer(s), and explanation text

### Requirement: Quiz Generation
The system SHALL generate a quiz by selecting 1-3 random questions from each domain and relationship category.

#### Scenario: Start new quiz
- **WHEN** user clicks "Start Quiz" button
- **THEN** select 1-3 random questions per domain
- **AND** shuffle the selected questions
- **AND** display the first question

#### Scenario: Quiz variety
- **WHEN** user takes multiple quizzes
- **THEN** each quiz has a different random selection of questions from the pool

### Requirement: Single Answer Questions
The system SHALL support questions where exactly one answer is correct.

#### Scenario: Answer single-choice question
- **WHEN** user views a single-answer question
- **THEN** display radio buttons for answer options
- **AND** allow selecting exactly one option

#### Scenario: Submit single-choice answer
- **WHEN** user selects an answer and clicks Submit
- **THEN** compare selection to correct answer
- **AND** show correct/incorrect feedback immediately

### Requirement: Multiple Answer Questions
The system SHALL support questions where one or more answers are correct.

#### Scenario: Answer multiple-choice question
- **WHEN** user views a multiple-answer question
- **THEN** display checkboxes for answer options
- **AND** indicate that multiple selections are allowed
- **AND** allow selecting one or more options

#### Scenario: Submit multiple-choice answer
- **WHEN** user selects answers and clicks Submit
- **THEN** compare all selections to correct answers
- **AND** mark as correct only if all correct answers are selected and no incorrect answers are selected

### Requirement: Immediate Question Feedback
The system SHALL show feedback immediately after each question is answered.

#### Scenario: View correct answer feedback
- **WHEN** user submits a correct answer
- **THEN** display success indicator (green highlight or checkmark)
- **AND** show the explanation text for the question
- **AND** display "Next Question" button

#### Scenario: View incorrect answer feedback
- **WHEN** user submits an incorrect answer
- **THEN** display error indicator (red highlight)
- **AND** highlight which answer(s) were correct
- **AND** show the explanation text for the question
- **AND** display "Next Question" button

### Requirement: Quiz Progress Display
The system SHALL show quiz progress during the quiz.

#### Scenario: View progress indicator
- **WHEN** user is answering questions
- **THEN** display current question number and total (e.g., "Question 5 of 25")
- **AND** display current score (correct answers so far)

#### Scenario: View domain progress
- **WHEN** user is answering questions
- **THEN** optionally show which domains have been covered

### Requirement: Quiz Results Summary
The system SHALL display a summary when the quiz is completed.

#### Scenario: View quiz results
- **WHEN** user answers the last question
- **THEN** display final score as percentage and fraction (e.g., "80% (20/25)")
- **AND** display breakdown by domain showing correct/total for each
- **AND** highlight domains with low scores for review

#### Scenario: Restart quiz from results
- **WHEN** user views quiz results
- **THEN** display "Take Another Quiz" button
- **AND** clicking it starts a new quiz with fresh random selection

### Requirement: Quiz History Persistence
The system SHALL persist quiz attempts in localStorage across browser sessions.

#### Scenario: Save quiz attempt
- **WHEN** user completes a quiz
- **THEN** save attempt to localStorage with date, score, and domain breakdown
- **AND** limit stored attempts to last 10 to manage storage

#### Scenario: View quiz history
- **WHEN** user views the quiz section
- **THEN** display previous quiz attempts with dates and scores
- **AND** show improvement trend if multiple attempts exist

#### Scenario: Clear quiz history
- **WHEN** user clicks "Clear History" button
- **THEN** remove all stored quiz attempts from localStorage
- **AND** display empty history state

### Requirement: Quiz Accessibility
The system SHALL ensure the quiz is accessible to all users.

#### Scenario: Keyboard navigation
- **WHEN** user navigates quiz with keyboard
- **THEN** all options are focusable with Tab
- **AND** Space/Enter selects options
- **AND** focus is visible on current element

#### Scenario: Screen reader support
- **WHEN** screen reader user takes quiz
- **THEN** questions and options are properly labeled
- **AND** feedback status (correct/incorrect) is announced
- **AND** progress is announced

### Requirement: Quiz Responsive Layout
The system SHALL display the quiz correctly on all screen sizes.

#### Scenario: Quiz on mobile
- **WHEN** user takes quiz on mobile viewport
- **THEN** question and options display in single column
- **AND** touch targets are at least 44px
- **AND** all content is visible without horizontal scroll

#### Scenario: Quiz on desktop
- **WHEN** user takes quiz on desktop viewport
- **THEN** layout uses available space efficiently
- **AND** history panel may display alongside quiz
