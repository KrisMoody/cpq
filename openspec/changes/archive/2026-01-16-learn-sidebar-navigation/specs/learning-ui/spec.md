## MODIFIED Requirements

### Requirement: Learn Page
The system SHALL provide a learning page at `/learn` with navigation to all learning sections via dedicated routes.

#### Scenario: View learn page (MODIFIED)
- **WHEN** user navigates to /learn
- **THEN** display learning overview with links to all sections
- **AND** sections are accessible via sidebar navigation under Learn section

#### Scenario: Access learning section from sidebar
- **WHEN** user clicks a learning section (e.g., Glossary) in the sidebar
- **THEN** navigate to the dedicated section route (e.g., `/learn/glossary`)
- **AND** highlight the section as active in the sidebar

## ADDED Requirements

### Requirement: Learning Section Routes
The system SHALL provide dedicated routes for each learning section to enable proper navigation and breadcrumb support.

#### Scenario: Navigate to workflow section
- **WHEN** user navigates to `/learn/workflow`
- **THEN** display the CPQ workflow diagram section
- **AND** breadcrumbs show "Learn > Workflow"

#### Scenario: Navigate to data model section
- **WHEN** user navigates to `/learn/data-model`
- **THEN** display the data model / ER diagram section
- **AND** breadcrumbs show "Learn > Data Model"

#### Scenario: Navigate to glossary section
- **WHEN** user navigates to `/learn/glossary`
- **THEN** display the glossary terms section
- **AND** breadcrumbs show "Learn > Glossary"

#### Scenario: Navigate to quiz section
- **WHEN** user navigates to `/learn/quiz`
- **THEN** display the quiz section
- **AND** breadcrumbs show "Learn > Quiz"

## REMOVED Requirements

### Requirement: Floating Table of Contents
The system used to provide a floating table of contents for section navigation within the Learn page. This is no longer needed as sections are now accessible via sidebar navigation.

#### Scenario: Floating TOC removed
- **WHEN** user views a learning page
- **THEN** there is no floating table of contents component
- **AND** navigation is handled by the main sidebar
