## ADDED Requirements

### Requirement: Learn Section in Sidebar Navigation
The system SHALL display Learn as a top-level section in the sidebar navigation, with all learning content pages as children.

#### Scenario: Learn section structure
- **WHEN** user views the sidebar navigation
- **THEN** Learn appears as a section header (alongside Sales and Admin)
- **AND** Course, Workflow, Data Model, Business Logic, Formulas, Example, Glossary, Enums, Relationships, Quiz, and Tips appear as child items under Learn

#### Scenario: Learn hub page
- **WHEN** user navigates to `/learn`
- **THEN** the page displays an overview of available learning content
- **AND** each section links to its dedicated route

### Requirement: Learn Section Breadcrumbs with Module Titles
The system SHALL display module-specific titles in breadcrumbs when viewing course modules.

#### Scenario: Course module breadcrumb with title
- **WHEN** user is viewing `/learn/course/04-price-books`
- **THEN** breadcrumbs display "Learn > Course > Price Books"
- **AND** "Learn" links to `/learn`
- **AND** "Course" links to `/learn/course`
- **AND** "Price Books" is not a link (current page)

#### Scenario: Course list breadcrumb
- **WHEN** user is on `/learn/course`
- **THEN** breadcrumbs display "Learn > Course"
- **AND** "Learn" links to `/learn`
- **AND** "Course" is not a link (current page)

#### Scenario: Learning section breadcrumb
- **WHEN** user is on `/learn/glossary`
- **THEN** breadcrumbs display "Learn > Glossary"
- **AND** "Learn" links to `/learn`
- **AND** "Glossary" is not a link (current page)
