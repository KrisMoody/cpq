## ADDED Requirements

### Requirement: Form Input Width Standards
The system SHALL apply consistent width constraints to form input fields based on their content type to create a unified visual appearance across all forms.

#### Scenario: Full-width inputs for text content
- **WHEN** a form field is for name, title, description, email, or address content
- **THEN** the input SHALL expand to fill its container width (no explicit width class)
- **AND** the visual width is controlled by the form container's max-width

#### Scenario: Medium-width inputs for constrained content
- **WHEN** a form field is for SKU, code, phone, or standard dropdown content
- **THEN** the input SHALL use `w-64` (16rem / 256px) width constraint
- **AND** the input does not expand beyond this width on larger screens

#### Scenario: Small-width inputs for numeric/short content
- **WHEN** a form field is for percentage, priority, sort order, quantity, or short codes (3-4 chars)
- **THEN** the input SHALL use `w-32` (8rem / 128px) width constraint

#### Scenario: Price input width
- **WHEN** a form field is for price or monetary amount
- **THEN** the input SHALL use `w-40` (10rem / 160px) width constraint to accommodate currency symbols

### Requirement: Form Page Container Widths
The system SHALL use consistent maximum widths for form page containers based on page type.

#### Scenario: New entity page container
- **WHEN** user views a "new entity" page (e.g., /products/new, /customers/new)
- **THEN** the page content container SHALL use `max-w-2xl` (42rem / 672px)
- **AND** the container is horizontally centered with `mx-auto`

#### Scenario: Detail page container
- **WHEN** user views an entity detail page with edit mode (e.g., /products/[id], /quotes/[id])
- **THEN** the page content container SHALL use `max-w-4xl` (56rem / 896px) or wider
- **AND** the wider width accommodates displaying data alongside edit forms

### Requirement: Form Grid Layouts
The system SHALL use responsive grid layouts for organizing form fields.

#### Scenario: Two related short fields
- **WHEN** two form fields are semantically related and short (e.g., min/max, from/to dates)
- **THEN** display them in a two-column grid on tablet and desktop (`grid grid-cols-1 sm:grid-cols-2 gap-4`)
- **AND** stack them vertically on mobile (single column)

#### Scenario: Three related short fields
- **WHEN** three form fields are tightly related (e.g., condition field/operator/value)
- **THEN** display them in a three-column grid on desktop (`grid grid-cols-3 gap-4`)
- **AND** may adjust for smaller viewports

### Requirement: Modal Form Widths
The system SHALL apply consistent width constraints to modal dialogs containing forms.

#### Scenario: Standard form modal
- **WHEN** a modal contains a standard form (3-6 fields)
- **THEN** the modal content SHALL have minimum width of 400-450px
- **AND** the modal does not collapse below readable width

#### Scenario: Complex form modal
- **WHEN** a modal contains a complex form with tables or many fields
- **THEN** the modal content SHALL have minimum width of 500-600px

### Requirement: Form Section Spacing
The system SHALL use consistent vertical spacing within forms.

#### Scenario: Spacing between form sections
- **WHEN** a form has multiple logical sections (e.g., "Basic Info", "Address", "Pricing")
- **THEN** use `space-y-6` (1.5rem / 24px) gap between sections

#### Scenario: Spacing within form sections
- **WHEN** form fields are within the same logical section
- **THEN** use `space-y-4` (1rem / 16px) gap between fields
