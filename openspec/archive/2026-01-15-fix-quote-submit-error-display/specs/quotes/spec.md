## MODIFIED Requirements

### Requirement: Quote Submission UI

The Quote Editor page SHALL display a submission banner for quotes in DRAFT status, enabling users to submit the quote for processing.

#### Scenario: Submit quote not requiring approval
- **GIVEN** a quote is in DRAFT status
- **AND** the quote does not require approval (`requiresApproval: false`)
- **WHEN** user views the quote editor
- **THEN** display an info banner with title "Ready to Submit"
- **AND** show a "Submit Quote" button
- **AND** clicking the button submits the quote and transitions status to APPROVED

#### Scenario: Submit quote requiring approval
- **GIVEN** a quote is in DRAFT status
- **AND** the quote requires approval (`requiresApproval: true`)
- **WHEN** user views the quote editor
- **THEN** display a warning banner with title "Approval Required"
- **AND** show a "Submit for Approval" button
- **AND** clicking the button submits the quote and transitions status to PENDING_APPROVAL

#### Scenario: Display submission error
- **GIVEN** a quote is in DRAFT status
- **WHEN** user clicks the submit button
- **AND** the API returns an error (e.g., customer not assigned, validation failure)
- **THEN** display an error alert with the API error message
- **AND** the quote remains in DRAFT status
