# tax-profiles Specification

## Purpose
Enable grouping tax rates into profiles for regional tax management and price book association.

## ADDED Requirements

### Requirement: Tax Profile Entity
The system SHALL store tax profiles with the following attributes:
- Unique identifier (CUID)
- Name (required)
- Description (optional)
- Country (required, default jurisdiction)
- Active status (boolean, default true)
- Creation and update timestamps

#### Scenario: Create tax profile
- **WHEN** user creates a tax profile
- **THEN** it has a name and country
- **AND** it can be associated with multiple tax rates

#### Scenario: Deactivate tax profile
- **WHEN** a tax profile is deactivated
- **THEN** it is no longer available for new price books
- **AND** existing price books retain the association

### Requirement: Tax Profile Rates
The system SHALL associate tax rates with tax profiles.

#### Scenario: Assign tax rate to profile
- **WHEN** a tax rate is assigned to a profile
- **THEN** it becomes part of the profile's tax rules
- **AND** multiple rates can be assigned (e.g., state + county)

#### Scenario: Tax rate priority in profile
- **WHEN** multiple tax rates are assigned to a profile
- **THEN** rates are applied based on specificity (state > country)
- **AND** all applicable rates are summed

### Requirement: Tax Profile API
The system SHALL provide REST API endpoints for tax profile management:
- `GET /api/tax-profiles` - List all tax profiles
- `GET /api/tax-profiles/:id` - Get profile with assigned rates
- `POST /api/tax-profiles` - Create a new profile
- `PUT /api/tax-profiles/:id` - Update profile attributes
- `DELETE /api/tax-profiles/:id` - Soft delete profile
- `POST /api/tax-profiles/:id/rates` - Assign rates to profile
- `DELETE /api/tax-profiles/:id/rates/:rateId` - Remove rate from profile

#### Scenario: List tax profiles
- **WHEN** GET /api/tax-profiles is called
- **THEN** return array of profiles with rate counts

#### Scenario: Get profile with rates
- **WHEN** GET /api/tax-profiles/:id is called
- **THEN** return profile with all assigned tax rates

### Requirement: Tax Profile Management UI
The system SHALL provide UI for managing tax profiles.

#### Scenario: List tax profiles
- **WHEN** user navigates to /settings/tax-profiles
- **THEN** display table with columns: Name, Country, Rates Count, Status

#### Scenario: Edit tax profile
- **WHEN** user navigates to /settings/tax-profiles/:id
- **THEN** display profile form with name, description, country
- **AND** display assigned tax rates with add/remove capability
