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

#### Scenario: Product search with full-text matching
- **WHEN** the AI calls `searchProducts` with a natural language query
- **THEN** the search uses PostgreSQL full-text search with stemming
- **AND** plural forms match singular (e.g., "laptops" matches "Laptop")
- **AND** results are ranked by relevance (name matches > description matches > sku matches)

#### Scenario: Product search fallback
- **WHEN** full-text search returns no results
- **THEN** the search falls back to substring matching (ILIKE)
- **AND** the fallback uses case-insensitive partial matching

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

### Requirement: Quote Generation API
The system SHALL provide an API endpoint to generate quotes from natural language descriptions.

#### Scenario: Generate quote from description
- **WHEN** a POST request is made to `/api/ai/generate-quote` with a natural language description
- **THEN** the AI analyzes the description and creates a quote structure
- **AND** returns the generated quote with appropriate customer, products, and quantities

#### Scenario: Ambiguous generation request
- **WHEN** the natural language description lacks required information
- **THEN** the response includes clarifying questions or reasonable defaults
- **AND** indicates which assumptions were made

### Requirement: Quote Optimization API
The system SHALL provide an API endpoint to analyze and optimize existing quotes.

#### Scenario: Optimize existing quote
- **WHEN** a POST request is made to `/api/ai/optimize-quote` with a quote ID
- **THEN** the AI analyzes the quote using available tools
- **AND** returns an overall score (0-100), recommendations, and analysis

#### Scenario: Optimization response structure
- **WHEN** optimization completes successfully
- **THEN** the response includes:
  - `overallScore`: number (0-100)
  - `recommendations`: array of typed suggestions with priority and impact
  - `analysis`: object with strengths, weaknesses, and opportunities

#### Scenario: Quote not found
- **WHEN** the specified quote ID does not exist
- **THEN** the API returns a 404 error with appropriate message

### Requirement: AI Recommendations API
The system SHALL provide an API endpoint for AI-enhanced product recommendations.

#### Scenario: Get recommendations for quote context
- **WHEN** a POST request is made to `/api/ai/recommendations` with quote context
- **THEN** the AI analyzes the context using affinity and history tools
- **AND** returns prioritized product recommendations with reasoning

#### Scenario: Recommendation types
- **WHEN** recommendations are generated
- **THEN** they include cross-sell, upsell, and bundle suggestions
- **AND** each recommendation includes expected impact on deal

### Requirement: Conversational Chat API
The system SHALL provide a streaming chat endpoint for conversational quote manipulation.

#### Scenario: Start chat conversation
- **WHEN** a POST request is made to `/api/ai/chat` with initial message and quote context
- **THEN** the AI responds with a streaming text response
- **AND** can execute tools to answer questions or make changes

#### Scenario: Continue conversation
- **WHEN** a POST request includes conversation history
- **THEN** the AI maintains context from previous messages
- **AND** provides coherent, contextual responses

#### Scenario: Tool execution in chat
- **WHEN** the AI determines a tool call is needed during chat
- **THEN** the tool is executed and results are incorporated into the response
- **AND** the user sees the outcome of the action

### Requirement: AI Quote Panel
The system SHALL provide a collapsible AI panel on the quote detail page with multiple interaction modes.

#### Scenario: Open AI panel
- **WHEN** user clicks "Optimize with AI" button in quote header
- **THEN** the AI panel expands showing tabbed interface
- **AND** defaults to the Optimize tab

#### Scenario: Panel tabs
- **WHEN** the AI panel is open
- **THEN** user can switch between Optimize, Chat, and Generate tabs
- **AND** each tab maintains its state when switching

### Requirement: Quote Optimization Display
The system SHALL display AI optimization results with actionable suggestions.

#### Scenario: Display optimization score
- **WHEN** optimization completes
- **THEN** the panel shows the overall score (0-100) with visual indicator
- **AND** displays analysis summary (strengths, weaknesses, opportunities)

#### Scenario: Display recommendation cards
- **WHEN** optimization returns recommendations
- **THEN** each recommendation displays as a card with:
  - Recommendation type badge (ADD_PRODUCT, APPLY_DISCOUNT, etc.)
  - Priority indicator (HIGH, MEDIUM, LOW)
  - Title and description
  - Impact metrics (revenue/margin changes)
  - "Apply" action button

#### Scenario: Apply recommendation
- **WHEN** user clicks "Apply" on a recommendation
- **THEN** the suggested action is executed on the quote
- **AND** the quote view updates to reflect changes
- **AND** the recommendation card shows applied state

### Requirement: AI Chat Interface
The system SHALL provide a conversational interface for quote-related discussions.

#### Scenario: Send chat message
- **WHEN** user types a message and sends
- **THEN** the message appears in the chat history
- **AND** AI response streams in real-time below

#### Scenario: Streaming response display
- **WHEN** AI is generating a response
- **THEN** text appears progressively as it's generated
- **AND** a loading indicator shows AI is working

#### Scenario: Tool execution feedback
- **WHEN** AI executes a tool during conversation
- **THEN** the chat shows an indicator of the action being taken
- **AND** results are incorporated into the AI's response

### Requirement: Natural Language Quote Generation
The system SHALL allow users to generate quotes from natural language descriptions.

#### Scenario: Enter quote description
- **WHEN** user is on the Generate tab
- **THEN** they see a textarea for entering a natural language description
- **AND** example prompts are shown for guidance

#### Scenario: Generate and preview quote
- **WHEN** user submits a description
- **THEN** the AI generates a quote structure
- **AND** a preview is shown before creating the actual quote

#### Scenario: Create generated quote
- **WHEN** user confirms the generated quote preview
- **THEN** a new quote is created with the generated details
- **AND** user is navigated to the new quote

### Requirement: AI Action Confirmation Settings
The system SHALL allow users to configure how AI actions are confirmed.

#### Scenario: Always confirm mode
- **WHEN** user has `confirmActions` set to "always"
- **THEN** all AI-suggested actions require explicit user confirmation

#### Scenario: Destructive only mode
- **WHEN** user has `confirmActions` set to "destructive_only"
- **THEN** additions auto-apply without confirmation
- **AND** removals and discount changes require confirmation

#### Scenario: Never confirm mode
- **WHEN** user has `confirmActions` set to "never"
- **THEN** AI executes actions directly without confirmation prompts

