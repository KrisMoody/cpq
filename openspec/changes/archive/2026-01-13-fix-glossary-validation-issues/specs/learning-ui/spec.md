# learning-ui Spec Delta

## MODIFIED Requirements

### Requirement: Glossary Terms
The system SHALL display definitions and examples for the following CPQ terms, organized into logical groups:

**Product Group:**
- Product
- SKU
- Bundle
- Product Feature
- Product Option

**Pricing Group:**
- Price Book
- Price Book Entry
- List Price
- Price Adjustment
- Price Tier

**Quote Group:**
- Quote
- Quote Line Item
- Configuration

**Customer Group:**
- Customer

**Rules Group:**
- Rule
- Rule Type
- Rule Trigger

**Discount Group:**
- Discount
- Discount Type
- Discount Scope
- Discount Tier
- Applied Discount

**Meta:**
- CPQ (Configure, Price, Quote)

Each definition SHALL:
- Start with a one-sentence summary of what the term IS
- Explain how it differs from similar terms (e.g., Feature vs Option, SKU vs Product)
- Use consistent terminology across all definitions

Each example SHALL:
- Use the same domain scenario (laptop bundle configuration) for traceability
- Show concrete values (names, prices, quantities, SKUs)
- Demonstrate the term's relationship to related terms

#### Scenario: View glossary term
- **WHEN** user views a glossary term
- **THEN** display term name, definition, and example
- **AND** optionally show related terms
- **AND** the definition clearly distinguishes the term from similar concepts

### Requirement: Quick Tips
The system SHALL display quick tips to help users understand CPQ concepts and conventions.

#### Scenario: View naming conventions tip
- **WHEN** user views the Quick Tips section
- **THEN** display a tip explaining naming conventions
- **AND** explain that Prisma enums use SCREAMING_CASE (e.g., QUOTE, LINE_ITEM)
- **AND** explain that JavaScript fields use camelCase (e.g., quoteTotal, lineTotal)
- **AND** note that UI labels may be the same even when underlying values differ
