## ADDED Requirements

### Requirement: Course Section
The system SHALL provide a "Course" collapsible section on the Learn page displaying all CPQ course modules from `/docs/course/`.

#### Scenario: View course section
- **WHEN** user views the Learn page
- **THEN** display a "Course" collapsible section with icon
- **AND** the section appears in the table of contents navigation
- **AND** the section shows a list of all course modules

#### Scenario: Course section content
- **WHEN** user expands the Course section
- **THEN** display module cards showing: module number, title, level (Beginner/Intermediate/Advanced), and focus
- **AND** cards are ordered by module number (00-13)
- **AND** appendices appear after numbered modules

### Requirement: Course Module List
The system SHALL display course modules as interactive cards with metadata and progress indicators.

#### Scenario: View module card
- **WHEN** user views a course module card
- **THEN** display module number and title
- **AND** display level badge (Beginner = green, Intermediate = yellow, Advanced = red)
- **AND** display brief focus description
- **AND** display progress indicator if module has been started

#### Scenario: Module progress states
- **WHEN** user has not opened a module
- **THEN** display "Not Started" indicator (gray)
- **WHEN** user has opened but not completed a module
- **THEN** display "In Progress" indicator (blue)
- **WHEN** user has marked a module as complete
- **THEN** display "Completed" indicator (green checkmark)

### Requirement: Course Module Viewer
The system SHALL provide a module viewer component to display rendered course markdown content.

#### Scenario: Open module viewer
- **WHEN** user clicks on a course module card
- **THEN** fetch module content from server API
- **AND** display loading state while fetching
- **AND** render markdown content with syntax highlighting for code blocks
- **AND** render Mermaid diagrams where present

#### Scenario: Module navigation
- **WHEN** user is viewing a module
- **THEN** display "Previous Module" button (disabled on first module)
- **AND** display "Next Module" button (disabled on last module)
- **AND** display "Mark as Complete" button
- **AND** display "Close" button to return to module list

#### Scenario: Module completion
- **WHEN** user clicks "Mark as Complete"
- **THEN** save completion status to localStorage
- **AND** update progress indicator on module card
- **AND** update overall course completion percentage

### Requirement: Course Progress Tracking
The system SHALL track course progress in localStorage and display overall completion percentage.

#### Scenario: Track module progress
- **WHEN** user opens a module for the first time
- **THEN** save module as "in progress" to localStorage
- **WHEN** user marks module as complete
- **THEN** save module as "completed" to localStorage

#### Scenario: Display overall progress
- **WHEN** user views the Course section header
- **THEN** display overall completion percentage (completed modules / total modules)
- **AND** display visual progress bar

#### Scenario: Reset progress
- **WHEN** user clicks "Reset Progress" button in Course section
- **THEN** clear all module progress from localStorage
- **AND** reset completion indicators on all module cards

### Requirement: Course API Endpoint
The system SHALL provide a server API endpoint to fetch course module content.

#### Scenario: Fetch module content
- **WHEN** client requests GET `/api/course/[module]`
- **THEN** return markdown content of the specified module file
- **AND** return 404 if module file does not exist

#### Scenario: List available modules
- **WHEN** client requests GET `/api/course`
- **THEN** return array of module metadata (filename, title, level, focus)
- **AND** modules are sorted by filename

### Requirement: Course Checkpoint Questions in Quiz
The system SHALL include checkpoint questions from course modules in the quiz question bank.

#### Scenario: Quiz includes course questions
- **WHEN** quiz questions are loaded
- **THEN** include questions from course checkpoint sections
- **AND** questions are organized by course level domains: `course-beginner`, `course-intermediate`, `course-advanced`

#### Scenario: Course question format
- **WHEN** a course checkpoint question is defined
- **THEN** it has question text extracted from module markdown
- **AND** it has answer options (for multiple choice) or expected answer text (for open-ended converted to single choice)
- **AND** it has explanation from the `<details>` answer section
- **AND** it references the source module

#### Scenario: Quiz domain labels include course domains
- **WHEN** user views quiz domain breakdown
- **THEN** display "Course: Beginner" for `course-beginner` domain
- **AND** display "Course: Intermediate" for `course-intermediate` domain
- **AND** display "Course: Advanced" for `course-advanced` domain

## MODIFIED Requirements

### Requirement: Quiz Question Bank
The system SHALL provide a question bank with 5-10 questions per CPQ domain, 15-20 questions about concept relationships, and additional questions from course checkpoint sections.

#### Scenario: Question bank coverage
- **WHEN** quiz questions are loaded
- **THEN** include questions for all glossary groups: Meta, Product, Category, Attribute, Pricing, Currency, Quote, Customer, Contract, Tax, Rules, Discount, Guided Selling
- **AND** include questions about relationships between concepts
- **AND** include checkpoint questions from course modules organized by level

#### Scenario: Question format
- **WHEN** a question is defined
- **THEN** it has question text, type (single or multiple), 2-4 answer options, correct answer(s), and explanation text
