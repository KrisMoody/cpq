## ADDED Requirements

### Requirement: Seed Data Product Diversity
The seed data SHALL include a diverse set of products to demonstrate CPQ capabilities across different product types and billing models.

#### Scenario: Standalone products across categories
- **WHEN** the database is seeded
- **THEN** standalone products exist in multiple categories with subcategory depth:
  - Hardware (Processors, Memory, Storage)
  - Networking (Routers, Switches, Wireless)
  - Accessories (Input Devices, Audio/Video, Docking & Connectivity)
  - Security (Security Software, Security Hardware)

#### Scenario: Subscription products with different billing frequencies
- **WHEN** the database is seeded
- **THEN** subscription products exist with various billing models:
  - Monthly per-seat subscriptions (e.g., DevTools, Security Platform)
  - Annual per-seat subscriptions (e.g., Enterprise tiers)
  - Monthly platform subscriptions (e.g., Cloud Hosting, Analytics)

#### Scenario: Tiered subscription products
- **WHEN** the database is seeded
- **THEN** at least 2 product lines have tiered offerings:
  - Basic/Starter tier
  - Professional/Business tier
  - Enterprise tier

#### Scenario: Professional services products
- **WHEN** the database is seeded
- **THEN** professional services exist with different billing:
  - Hourly services (implementation, consulting)
  - Project-based services (assessments, migrations)
  - Recurring services (managed services, QBRs)

#### Scenario: Bundle products with different configurations
- **WHEN** the database is seeded
- **THEN** multiple bundle types exist:
  - Static bundles (fixed contents)
  - Configurable bundles with required options
  - Configurable bundles with optional add-ons

#### Scenario: Price book coverage
- **WHEN** the database is seeded
- **THEN** all products have entries in both Standard and Enterprise price books
- **AND** enterprise prices reflect appropriate volume/relationship discounts
