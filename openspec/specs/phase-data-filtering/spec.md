# phase-data-filtering Specification

## Purpose
TBD - created by archiving change add-phase-selector. Update Purpose after archive.

## Requirements

### Requirement: Phase Column on Database Models
The system SHALL include an `introducedInPhase` integer column on core database models to indicate which phase the record belongs to.

#### Scenario: Column exists on root entities
- **WHEN** the database schema is inspected
- **THEN** the following tables have an `introducedInPhase` column: Product, Customer, Quote, PriceBook, Discount, Contract, TaxRate, UnitOfMeasure, Attribute, AttributeGroup, Rule, ProductAffinity, Questionnaire, QuoteLayout
- **AND** the column has a default value of 1
- **AND** the column is indexed for query performance

#### Scenario: Existing data remains visible
- **WHEN** the migration is applied to a database with existing data
- **THEN** all existing records have `introducedInPhase` set to 1 (default)
- **AND** all existing records are visible in Phase 5 (and all other phases)

### Requirement: Phase-Filtered API Queries
The system SHALL filter database queries based on the currently selected phase, returning only records with `introducedInPhase` less than or equal to the current phase.

#### Scenario: Listing products in Phase 2
- **WHEN** Phase 2 is selected and user requests GET /api/products
- **THEN** only products with `introducedInPhase <= 2` are returned
- **AND** products with `introducedInPhase = 3, 4, or 5` are NOT returned

#### Scenario: Fetching a single record within phase
- **WHEN** Phase 3 is selected and user requests GET /api/products/[id] for a Phase 2 product
- **THEN** the product is returned successfully

#### Scenario: Fetching a single record outside phase
- **WHEN** Phase 2 is selected and user requests GET /api/products/[id] for a Phase 4 product
- **THEN** a 404 response is returned

#### Scenario: Creating a record assigns current phase
- **WHEN** Phase 3 is selected and user creates a new product via POST /api/products
- **THEN** the new product has `introducedInPhase` set to 3

### Requirement: Phase-Filtered Relationship Includes
The system SHALL conditionally include related entities based on the current phase when fetching records with relationships.

#### Scenario: Product includes in Phase 2
- **WHEN** Phase 2 is selected and products are fetched with includes
- **THEN** `priceBookEntries` and `priceTiers` are included (Phase 1-2)
- **AND** `attributes` are NOT included (Phase 4)
- **AND** `affinities` are NOT included (Phase 5)

#### Scenario: Quote includes in Phase 3
- **WHEN** Phase 3 is selected and quotes are fetched with includes
- **THEN** `lineItems` and `appliedDiscounts` are included
- **AND** `recommendationLogs` are NOT included (Phase 5)

### Requirement: Phase Query Utilities
The system SHALL provide utility functions for consistently applying phase filters to database queries.

#### Scenario: Using phaseWhere utility
- **WHEN** an API route uses `phaseWhere(phase)` utility
- **THEN** it returns `{ introducedInPhase: { lte: phase } }`
- **AND** this can be spread into Prisma where clauses

#### Scenario: Using withPhaseFilter utility
- **WHEN** an API route uses `withPhaseFilter(args, phase)` utility
- **THEN** it returns the args with phase filter added to the where clause
- **AND** existing where conditions are preserved

### Requirement: Phase-Aware Seed Data
The system SHALL include seed data tagged with appropriate phase values to enable realistic demos at each phase level.

#### Scenario: Phase 1 demo data
- **WHEN** database is seeded
- **THEN** basic products (STANDALONE type, ONE_TIME billing) have `introducedInPhase = 1`
- **AND** sample customers, quotes, and price books have `introducedInPhase = 1`

#### Scenario: Phase 2 demo data
- **WHEN** database is seeded
- **THEN** bundle products have `introducedInPhase = 2`
- **AND** sample discounts and units of measure have `introducedInPhase = 2`

#### Scenario: Phase 3 demo data
- **WHEN** database is seeded
- **THEN** subscription products (MONTHLY billing) have `introducedInPhase = 3`
- **AND** sample contracts and tax rates have `introducedInPhase = 3`

#### Scenario: Phase 4 and 5 demo data
- **WHEN** database is seeded
- **THEN** products with attributes have `introducedInPhase = 4`
- **AND** sample questionnaires and affinities have `introducedInPhase = 5`

