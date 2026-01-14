## ADDED Requirements

### Requirement: Customer Entity
The system SHALL store customers with the following attributes:
- Unique identifier (CUID)
- Name (required)
- Email (optional)
- Phone (optional)
- Company name (optional)
- Address fields: street, city, state, postalCode, country (all optional)
- Reference to assigned PriceBook (optional, for customer-specific pricing)
- Active status (boolean, default true)
- Creation and update timestamps

#### Scenario: Create customer with basic info
- **WHEN** a customer is created with name and email
- **THEN** the customer is stored with provided attributes
- **AND** isActive defaults to true

#### Scenario: Assign customer-specific price book
- **WHEN** a customer is created with a priceBookId
- **THEN** quotes for this customer SHALL use the assigned price book by default
- **AND** the price book reference is validated to exist

#### Scenario: Customer without price book uses default
- **WHEN** a customer has no assigned price book
- **THEN** quotes for this customer SHALL use the system default price book

### Requirement: Customer API
The system SHALL provide REST API endpoints for customer management:
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update customer attributes
- `DELETE /api/customers/:id` - Soft delete (set isActive=false)

#### Scenario: List customers
- **WHEN** GET /api/customers is called
- **THEN** return array of all active customers with basic attributes
- **AND** support optional query param `includeInactive=true` to include inactive

#### Scenario: Get customer with quote history
- **WHEN** GET /api/customers/:id is called
- **THEN** return customer details with recent quotes summary

#### Scenario: Create customer
- **WHEN** POST /api/customers is called with valid data
- **THEN** create and return the new customer record

#### Scenario: Update customer
- **WHEN** PUT /api/customers/:id is called
- **THEN** update the specified fields and return updated customer

#### Scenario: Soft delete customer
- **WHEN** DELETE /api/customers/:id is called
- **THEN** set isActive=false (do not hard delete for audit trail)
- **AND** existing quotes remain linked to the customer

### Requirement: Customers List Page
The system SHALL provide a customers list page at `/customers` displaying all customers in a sortable, filterable table.

#### Scenario: View customers table
- **WHEN** user navigates to /customers
- **THEN** display a table with columns: Name, Company, Email, Quote Count, Status
- **AND** table supports sorting and filtering

#### Scenario: Filter active/inactive customers
- **WHEN** user toggles the active filter
- **THEN** table shows only customers matching the filter

### Requirement: Customer Detail Page
The system SHALL provide a customer detail page at `/customers/[id]` showing customer information and quote history.

#### Scenario: View customer details
- **WHEN** user navigates to /customers/:id
- **THEN** display customer contact information
- **AND** display assigned price book (if any)
- **AND** display list of quotes for this customer

#### Scenario: Edit customer from detail page
- **WHEN** user clicks Edit on customer detail page
- **THEN** display editable form for customer attributes

### Requirement: Create Customer Page
The system SHALL provide a page at `/customers/new` to create a new customer.

#### Scenario: Create new customer
- **WHEN** user navigates to /customers/new
- **THEN** display form with customer fields: name, email, phone, company, address
- **AND** optional price book selection dropdown
- **AND** on submit, create customer and redirect to customer detail page
