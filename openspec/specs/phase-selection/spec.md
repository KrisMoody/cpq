# phase-selection Specification

## Purpose
TBD - created by archiving change add-phase-selector. Update Purpose after archive.

## Requirements

### Requirement: Phase Selector Component
The system SHALL provide a phase selector dropdown in the sidebar header that allows users to switch between release phases 1-5.

#### Scenario: Phase selector displays current phase
- **WHEN** user views the sidebar
- **THEN** a dropdown is displayed below the logo/brand area
- **AND** the dropdown shows the currently selected phase name and number
- **AND** the dropdown uses the phase's color for visual indication

#### Scenario: Phase selector lists all phases
- **WHEN** user opens the phase selector dropdown
- **THEN** all 5 phases are listed as options
- **AND** each option shows the phase number, name, and brief description
- **AND** options are color-coded to match phase colors defined in `phases.ts`

#### Scenario: Selecting a different phase
- **WHEN** user selects a different phase from the dropdown
- **THEN** the selected phase is stored in a cookie named `cpq-phase`
- **AND** the page reloads or reactively updates to reflect the new phase
- **AND** the dropdown closes and shows the newly selected phase

### Requirement: Session-Level Phase State
The system SHALL store the selected phase in a session-level cookie accessible by both client and server.

#### Scenario: Default phase on first visit
- **WHEN** user visits the application without an existing `cpq-phase` cookie
- **THEN** the system defaults to Phase 5 (full experience)
- **AND** the phase selector shows Phase 5 as selected

#### Scenario: Phase persists across page navigation
- **WHEN** user selects Phase 2 and navigates to different pages
- **THEN** the selected phase remains Phase 2 on all pages
- **AND** the phase selector continues to show Phase 2

#### Scenario: Phase resets on browser close
- **WHEN** user closes the browser and reopens the application
- **THEN** the phase selection resets to Phase 5 (default)

### Requirement: Phase Context Composable
The system SHALL provide a `usePhaseContext()` composable that exposes the current phase state and helper functions.

#### Scenario: Accessing current phase in components
- **WHEN** a component calls `usePhaseContext()`
- **THEN** it receives a reactive `currentPhase` value (number 1-5)
- **AND** it receives a `setPhase(n)` function to change the phase
- **AND** it receives an `isPhaseVisible(n)` helper that returns true if n <= currentPhase

#### Scenario: Server-side phase access
- **WHEN** an API route or server middleware needs the current phase
- **THEN** it can read the phase from `event.context.phase`
- **AND** the phase is extracted from the `cpq-phase` cookie by server middleware

### Requirement: Route Protection by Phase
The system SHALL block access to routes that belong to phases higher than the currently selected phase.

#### Scenario: Accessing a page within current phase
- **WHEN** Phase 2 is selected and user navigates to `/discounts` (Phase 2)
- **THEN** the page loads normally

#### Scenario: Accessing a page above current phase
- **WHEN** Phase 2 is selected and user navigates to `/contracts` (Phase 3)
- **THEN** the user is redirected to the dashboard
- **AND** optionally a toast notification indicates the page is not available in the current phase

#### Scenario: Direct URL access to blocked page
- **WHEN** Phase 1 is selected and user enters `/attributes` (Phase 4) directly in the URL
- **THEN** the user is redirected to the dashboard

