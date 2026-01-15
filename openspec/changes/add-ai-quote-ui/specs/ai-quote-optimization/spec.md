## ADDED Requirements

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
