## ADDED Requirements

### Requirement: Prisma ERD Generator
The system SHALL auto-generate an Entity Relationship Diagram from the Prisma schema on each `prisma generate` run.

#### Scenario: ERD generator configured
- **WHEN** the Prisma schema generator blocks are inspected
- **THEN** a generator with provider `prisma-erd-generator` is configured
- **AND** the output path is set to `public/prisma-erd.svg`

#### Scenario: ERD generated on prisma generate
- **WHEN** `npx prisma generate` runs
- **THEN** an SVG file is created at `public/prisma-erd.svg`
- **AND** the SVG contains all entities from the Prisma schema
- **AND** relationships between entities are shown with cardinality labels

#### Scenario: ERD dependencies installed
- **WHEN** inspecting package.json devDependencies
- **THEN** `prisma-erd-generator` is listed
- **AND** `@mermaid-js/mermaid-cli` is listed (required for SVG generation)
