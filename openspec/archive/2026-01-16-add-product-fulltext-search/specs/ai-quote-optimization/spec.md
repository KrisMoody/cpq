# ai-quote-optimization Spec Delta

## MODIFIED Requirements

### Requirement: Data Lookup Tools
The AI service SHALL provide tools for looking up CPQ data to inform recommendations.

#### Scenario: Product search with full-text matching
- **WHEN** the AI calls `searchProducts` with a natural language query
- **THEN** the search uses PostgreSQL full-text search with stemming
- **AND** plural forms match singular (e.g., "laptops" matches "Laptop")
- **AND** results are ranked by relevance (name matches > description matches > sku matches)

#### Scenario: Product search fallback
- **WHEN** full-text search returns no results
- **THEN** the search falls back to substring matching (ILIKE)
- **AND** the fallback uses case-insensitive partial matching
