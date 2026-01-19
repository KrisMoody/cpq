# learning-ui Specification Delta

## ADDED Requirements

### Requirement: Course Route Structure
The system SHALL provide dedicated routes for the CPQ course section with breadcrumb support.

#### Scenario: Navigate to course hub
- **WHEN** user navigates to `/learn/course`
- **THEN** display the course module list
- **AND** breadcrumbs display "Learn > Course"
- **AND** "Learn" links to `/learn`
- **AND** "Course" is not a link (current page)

#### Scenario: Navigate to course module
- **WHEN** user navigates to `/learn/course/[moduleId]`
- **THEN** display the module content
- **AND** breadcrumbs display "Learn > Course > [Module Title]"
- **AND** "Learn" links to `/learn`
- **AND** "Course" links to `/learn/course`
- **AND** "[Module Title]" is not a link (current page)

#### Scenario: Direct URL access to module
- **WHEN** user navigates directly to `/learn/course/01-cpq-foundations`
- **THEN** display the "CPQ Foundations" module content
- **AND** module progress tracking works correctly
- **AND** breadcrumbs show "Learn > Course > CPQ Foundations"

### Requirement: Course Navigation in Sidebar
The system SHALL display the Course section as a navigation item under the Learn area.

#### Scenario: View Learn section in navigation
- **WHEN** user views the sidebar navigation
- **THEN** Learn appears as a standalone item or section
- **AND** Course is accessible from the Learn page

### Requirement: Course Module URL Persistence
The system SHALL maintain URL state when navigating between course modules.

#### Scenario: Navigate to next module
- **WHEN** user clicks "Next" on a module page
- **THEN** URL updates to `/learn/course/[nextModuleId]`
- **AND** breadcrumb updates to show the new module title
- **AND** browser history is updated for back navigation

#### Scenario: Navigate to previous module
- **WHEN** user clicks "Previous" on a module page
- **THEN** URL updates to `/learn/course/[previousModuleId]`
- **AND** breadcrumb updates to show the new module title

#### Scenario: Browser back navigation
- **WHEN** user presses browser back button from a module page
- **THEN** navigate to the previous page in history
- **AND** if returning to course list, display the course list

## MODIFIED Requirements

### Requirement: Learn Page
The system SHALL provide a learning hub page at `/learn` with sections for CPQ course, glossary, diagrams, and interactive tools.

#### Scenario: View learn page
- **WHEN** user navigates to `/learn`
- **THEN** display the Learn hub with collapsible sections
- **AND** the Course section shows a summary/link to the course hub at `/learn/course`
- **AND** display remaining sections: Workflow, Data Model, Business Logic, Formulas, Example, Glossary, Enums, Relationships, Quiz, Tips

#### Scenario: Access course from learn page
- **WHEN** user clicks on the Course section or "View Course" link
- **THEN** navigate to `/learn/course`
- **AND** display the full course module list
