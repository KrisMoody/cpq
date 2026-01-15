# ai-quote-optimization Specification

## Purpose
TBD - created by archiving change add-ai-quote-service. Update Purpose after archive.
## Requirements
### Requirement: AI Service Configuration
The system SHALL support AI-powered quote optimization using Anthropic's Claude model via the AI SDK.

#### Scenario: Service initialization
- **WHEN** the server starts
- **THEN** the AI service initializes with the configured Anthropic API key
- **AND** the service is available for quote optimization requests

#### Scenario: Missing API key
- **WHEN** the Anthropic API key is not configured
- **THEN** AI features are disabled gracefully without crashing the application

### Requirement: Data Lookup Tools
The AI service SHALL provide tools for looking up CPQ data to inform recommendations.

#### Scenario: Customer lookup
- **WHEN** the AI calls `lookupCustomer` with a customer ID
- **THEN** it receives customer profile, active contracts, and purchase history

#### Scenario: Product search
- **WHEN** the AI calls `searchProducts` with search criteria
- **THEN** it receives matching products with their attributes and pricing info

#### Scenario: Pricing lookup
- **WHEN** the AI calls `getPricing` for a product and customer
- **THEN** it receives pricing tiers, volume discounts, and contract-specific rates

#### Scenario: Quote history lookup
- **WHEN** the AI calls `getQuoteHistory` for a customer
- **THEN** it receives historical quotes with statuses, products, and discount patterns

#### Scenario: Product affinity lookup
- **WHEN** the AI calls `getAffinities` for products in a quote
- **THEN** it receives cross-sell and upsell recommendations based on purchase patterns

#### Scenario: Discount availability lookup
- **WHEN** the AI calls `getAvailableDiscounts` for a quote context
- **THEN** it receives applicable discounts with eligibility criteria

### Requirement: Action Tools
The AI service SHALL provide tools for modifying quotes based on recommendations.

#### Scenario: Add product to quote
- **WHEN** the AI calls `addToQuote` with product and quantity
- **THEN** the product is added to the quote line items
- **AND** quote totals are recalculated

#### Scenario: Apply discount
- **WHEN** the AI calls `applyDiscount` with discount details
- **THEN** the discount is applied to the specified quote or line item
- **AND** quote totals are recalculated

#### Scenario: Calculate metrics
- **WHEN** the AI calls `calculateMetrics` for a quote
- **THEN** it receives calculated totals, margins, and revenue metrics

### Requirement: Output Schema Validation
The AI service SHALL validate all AI responses against defined schemas before returning them.

#### Scenario: Valid optimization response
- **WHEN** the AI generates an optimization response
- **THEN** it is validated against the Zod schema
- **AND** includes overall score, recommendations array, and analysis object

#### Scenario: Invalid AI response
- **WHEN** the AI generates a response that doesn't match the schema
- **THEN** the service returns an appropriate error
- **AND** logs the validation failure for debugging

