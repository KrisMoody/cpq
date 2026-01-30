# price-books Specification

## Purpose
TBD - created by archiving change add-cpq-foundation. Update Purpose after archive.
## Requirements
### Requirement: Price Book Entity
The system SHALL store price books with the following attributes:
- Unique identifier (CUID)
- Name (required)
- Default flag (boolean, only one price book can be default)
- Active status (boolean, default true)
- Valid from date (optional)
- Valid to date (optional)

#### Scenario: Create default price book
- **WHEN** a price book is created with isDefault=true
- **THEN** the price book is stored as the default
- **AND** any existing default price book is updated to isDefault=false

#### Scenario: Price book date validity
- **WHEN** a price book has validFrom and validTo dates set
- **THEN** the price book is only available for quotes within that date range

### Requirement: Price Book Entry Entity
The system SHALL store price book entries linking products to prices:
- Unique identifier (CUID)
- Reference to PriceBook (required)
- Reference to Product (required)
- List price (decimal, required)
- Cost (decimal, optional)
- Unique constraint on (priceBookId, productId) combination

#### Scenario: Create price entry
- **WHEN** a price book entry is created
- **THEN** the product has a specific price within that price book

#### Scenario: Prevent duplicate entries
- **WHEN** attempting to create a price entry for a product already in the price book
- **THEN** the system rejects the duplicate entry

### Requirement: Price Books API
The system SHALL provide REST API endpoints for price book management:
- `GET /api/price-books` - List all price books
- `GET /api/price-books/:id` - Get single price book with details
- `POST /api/price-books` - Create a new price book
- `PUT /api/price-books/:id` - Update an existing price book
- `DELETE /api/price-books/:id` - Delete a price book (soft delete via isActive=false)
- `GET /api/price-books/:id/prices` - Get all price entries in a price book
- `POST /api/price-books/:id/entries` - Add a product entry to a price book
- `PUT /api/price-books/:id/entries/:entryId` - Update a price book entry
- `DELETE /api/price-books/:id/entries/:entryId` - Remove a price book entry

#### Scenario: List price books
- **WHEN** GET /api/price-books is called
- **THEN** return array of all price books with basic attributes

#### Scenario: Get single price book
- **WHEN** GET /api/price-books/:id is called with a valid ID
- **THEN** return the price book with all attributes and entry count

#### Scenario: Create price book
- **WHEN** POST /api/price-books is called with valid data
- **THEN** create and return the new price book
- **AND** if isDefault=true, update any existing default price book to isDefault=false

#### Scenario: Update price book
- **WHEN** PUT /api/price-books/:id is called with valid data
- **THEN** update and return the modified price book
- **AND** if isDefault=true, update any existing default price book to isDefault=false

#### Scenario: Delete price book
- **WHEN** DELETE /api/price-books/:id is called
- **THEN** set isActive=false on the price book (soft delete)

#### Scenario: Get prices in book
- **WHEN** GET /api/price-books/:id/prices is called
- **THEN** return array of all price book entries with product details

#### Scenario: Add entry to price book
- **WHEN** POST /api/price-books/:id/entries is called with productId and listPrice
- **THEN** create and return the new price book entry
- **AND** reject if product already exists in the price book

#### Scenario: Update price book entry
- **WHEN** PUT /api/price-books/:id/entries/:entryId is called with updated prices
- **THEN** update and return the modified entry

#### Scenario: Remove price book entry
- **WHEN** DELETE /api/price-books/:id/entries/:entryId is called
- **THEN** permanently delete the price book entry

### Requirement: Price Book Management UI
The system SHALL provide a user interface for managing price books:
- List view showing all price books with key attributes
- Detail view for viewing and editing a price book and its entries
- Create form for adding new price books
- Inline editing for price book entry prices
- Tier type selection at entry level, not per-tier

#### Scenario: Edit price tiers with entry-level type selector
- **WHEN** user edits tiers for a price book entry
- **THEN** display a single tier type selector above the tier list
- **AND** the selected type applies to all tiers for that entry
- **AND** each tier row shows only: Min Qty, Max Qty, and Price (or Discount % for VOLUME_DISCOUNT_PERCENT type)
- **AND** changing the tier type updates the input field type for all tiers

#### Scenario: View price tiers
- **WHEN** user views tiers for a price book entry (not editing)
- **THEN** display the tier type once (e.g., as a badge above the tier table)
- **AND** display tiers in a simple table with: Quantity Range, Price/Discount value

#### Scenario: View price books list
- **WHEN** user navigates to /price-books
- **THEN** display a table of all price books with name, default status, active status, validity dates, and entry count
- **AND** provide navigation to create new price book
- **AND** allow clicking a row to navigate to detail view

#### Scenario: View and edit price book
- **WHEN** user navigates to /price-books/:id
- **THEN** display price book details in an editable form
- **AND** display entries table with product info and prices
- **AND** allow inline editing of entry prices
- **AND** provide ability to add new product entries
- **AND** provide ability to remove entries
- **AND** provide save and delete actions for the price book

#### Scenario: Create new price book
- **WHEN** user navigates to /price-books/new
- **THEN** display a form for entering price book details
- **AND** on successful save, redirect to the detail page

