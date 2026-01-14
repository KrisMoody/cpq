## ADDED Requirements

### Requirement: Product Recommendations
The system SHALL suggest relevant products based on quote context.

#### Scenario: Cross-sell recommendations
- **WHEN** product is added to quote
- **THEN** system suggests complementary products
- **AND** suggestions are based on defined product affinities

#### Scenario: Upsell recommendations
- **WHEN** product is added to quote
- **THEN** system may suggest higher-tier alternatives
- **AND** shows price difference and value proposition

#### Scenario: Subscription cross-sell recommendations
- **WHEN** recurring product is added to quote
- **THEN** system suggests complementary one-time products (e.g., implementation, training)
- **AND** suggestions consider the subscription term for relevance

#### Scenario: One-time to subscription upsell
- **WHEN** one-time product is added
- **AND** a subscription alternative exists
- **THEN** system may suggest the subscription option
- **AND** shows MRR comparison and total cost over time

#### Scenario: Contract-aware recommendations
- **WHEN** quote has a customer with an active contract
- **THEN** recommendations prioritize products covered by the contract
- **AND** contract pricing is indicated when applicable

#### Scenario: Recommendations pricing display
- **WHEN** displaying recommendation with price
- **THEN** price reflects quote's price book and any applicable contract pricing
- **AND** price is formatted in quote's currency

#### Scenario: Recommendations display
- **WHEN** recommendations are available
- **THEN** they appear in a non-intrusive panel on quote editor
- **AND** each recommendation shows product, reason, and add action

### Requirement: Product Affinity Rules
The system SHALL support defining relationships between products for recommendations.

#### Scenario: Define product affinity
- **WHEN** creating an affinity rule
- **THEN** specify source product(s) and recommended product(s)
- **AND** specify affinity type (CROSS_SELL, UPSELL, ACCESSORY, REQUIRED)
- **AND** specify recommendation strength/priority

#### Scenario: Category-based affinity
- **WHEN** affinity is defined at category level
- **THEN** all products in source category trigger recommendations
- **AND** from target category

#### Scenario: Affinity conditions
- **WHEN** affinity has conditions (e.g., quantity > 5)
- **THEN** recommendation only appears when conditions are met

#### Scenario: Billing frequency affinity
- **WHEN** defining affinity for recurring products
- **THEN** can specify source/target billing frequencies
- **AND** e.g., recommend monthly add-ons for annual subscriptions

### Requirement: Guided Selling Questionnaire
The system SHALL support needs-based product discovery through questionnaires.

#### Scenario: Create questionnaire
- **WHEN** user creates a guided selling flow
- **THEN** define a series of questions
- **AND** map answers to product recommendations

#### Scenario: Question types
- **WHEN** defining questions
- **THEN** support: single choice, multiple choice, range/slider, yes/no
- **AND** questions can branch based on previous answers

#### Scenario: Start guided selling
- **WHEN** user starts guided selling from quote
- **THEN** questionnaire wizard is displayed
- **AND** answers progressively filter/score products

#### Scenario: Questionnaire results
- **WHEN** questionnaire is completed
- **THEN** recommended products are shown with relevance scores
- **AND** user can add selected products to quote

### Requirement: Recommendation Feedback
The system SHALL track recommendation effectiveness.

#### Scenario: Accept recommendation
- **WHEN** user adds recommended product to quote
- **THEN** acceptance is recorded for analytics
- **AND** recommendation source is tracked

#### Scenario: Dismiss recommendation
- **WHEN** user dismisses a recommendation
- **THEN** dismissal is recorded
- **AND** recommendation doesn't appear again for that quote

### Requirement: AI Integration Preparation
The system SHALL be designed to support future AI-driven recommendations.

#### Scenario: Recommendation data model
- **WHEN** recommendation is generated
- **THEN** source type is recorded (RULE_BASED, AI_GENERATED, MANUAL)
- **AND** confidence score can be stored

#### Scenario: Product embeddings support
- **WHEN** products are created/updated
- **THEN** system can store vector embeddings (nullable field)
- **AND** embeddings can be used for similarity search

#### Scenario: Recommendation API extensibility
- **WHEN** fetching recommendations
- **THEN** API supports pluggable recommendation providers
- **AND** can blend rule-based and AI recommendations

### Requirement: Recommendation Management UI
The system SHALL provide interfaces for managing recommendation rules.

#### Scenario: List affinity rules
- **WHEN** user navigates to recommendation settings
- **THEN** all affinity rules are listed
- **AND** showing source products, targets, and type

#### Scenario: Create affinity rule
- **WHEN** user creates an affinity rule
- **THEN** select source product(s) or category
- **AND** select target product(s) or category
- **AND** set type and priority

#### Scenario: Questionnaire builder
- **WHEN** user creates guided selling questionnaire
- **THEN** visual builder for adding/ordering questions
- **AND** mapping questions to product filters
