## ADDED Requirements

### Requirement: Cancel Button Behavior
The system SHALL implement consistent cancel button behavior across all forms and modals based on the context of the cancellation.

#### Scenario: Cancel from new entity form with unsaved changes
- **WHEN** user clicks Cancel on a new entity form (e.g., /customers/new, /products/new)
- **AND** the form has unsaved changes (any field differs from initial empty/default state)
- **THEN** display a confirmation dialog asking "You have unsaved changes. Are you sure you want to leave?"
- **AND** if user confirms, navigate to the entity list page
- **AND** if user cancels the dialog, remain on the form

#### Scenario: Cancel from new entity form without changes
- **WHEN** user clicks Cancel on a new entity form
- **AND** no fields have been modified
- **THEN** immediately navigate to the entity list page without confirmation

#### Scenario: Cancel from edit mode on detail page
- **WHEN** user clicks Cancel while in edit mode on an entity detail page (e.g., /customers/[id], /products/[id])
- **THEN** immediately exit edit mode
- **AND** reset all form fields to the current entity's saved values
- **AND** remain on the same page

#### Scenario: Cancel from modal
- **WHEN** user clicks Cancel in a modal dialog
- **THEN** close the modal without applying any changes
- **AND** any form state within the modal is reset when the modal reopens

#### Scenario: Cancel button disabled during save
- **WHEN** a save/submit operation is in progress (loading state)
- **THEN** the Cancel button SHALL be disabled to prevent navigation during the operation

### Requirement: Unsaved Changes Composable
The system SHALL provide a reusable composable `useUnsavedChanges` for tracking form modifications and confirming navigation away from dirty forms.

#### Scenario: Track form dirtiness
- **WHEN** a component uses `useUnsavedChanges(formRef, initialValuesRef)`
- **THEN** provide a computed `isDirty` property that returns true if formRef differs from initialValuesRef
- **AND** use deep comparison via JSON serialization for object comparison

#### Scenario: Confirm navigation away
- **WHEN** a component calls `confirmLeave()` from the composable
- **AND** the form is dirty (has unsaved changes)
- **THEN** display a browser confirmation dialog
- **AND** return true if user confirms, false if user cancels

#### Scenario: Allow navigation when clean
- **WHEN** a component calls `confirmLeave()` from the composable
- **AND** the form is not dirty (no unsaved changes)
- **THEN** return true immediately without showing any dialog
