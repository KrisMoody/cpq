## ADDED Requirements

### Requirement: Quote Document Preview
The system SHALL provide a professional document-style preview of quotes that reflects what end-users/customers will see.

#### Scenario: View quote as document
- **WHEN** user clicks "Preview" on a quote
- **THEN** the system displays the quote in a clean, document-style layout
- **AND** the layout includes header with company branding area
- **AND** the layout includes quote metadata (quote number, date, validity period)
- **AND** the layout includes customer information section
- **AND** the layout includes itemized line items table
- **AND** the layout includes pricing summary (subtotal, discounts, total)

#### Scenario: Bundle line items display
- **WHEN** quote contains bundle products with child options
- **THEN** child line items are visually nested under their parent bundle
- **AND** option pricing is clearly shown as part of the bundle

#### Scenario: Discount display
- **WHEN** quote has applied discounts
- **THEN** discounts are itemized in the pricing summary
- **AND** both discount name and amount are shown

### Requirement: Quote Preview Navigation
The system SHALL provide easy access to the quote preview from the quote editor.

#### Scenario: Preview from editor
- **WHEN** user is editing a quote
- **THEN** a "Preview" button is visible in the editor toolbar
- **AND** clicking it opens the preview in a new page or modal

#### Scenario: Return to editor
- **WHEN** user is viewing quote preview
- **THEN** user can navigate back to the quote editor

### Requirement: Print-Friendly Quote Preview
The system SHALL ensure the quote preview is suitable for printing or saving as PDF.

#### Scenario: Print styling
- **WHEN** user prints the quote preview page
- **THEN** navigation elements are hidden
- **AND** the document fits standard paper sizes
- **AND** page breaks occur at logical boundaries (not mid-line-item)

### Requirement: Terms and Conditions
The system SHALL display terms and conditions on the quote preview.

#### Scenario: Default terms display
- **WHEN** quote preview is rendered
- **THEN** a terms and conditions section appears at the bottom
- **AND** placeholder text is shown for customizable terms
