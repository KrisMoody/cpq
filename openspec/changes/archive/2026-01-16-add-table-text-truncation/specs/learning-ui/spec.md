# learning-ui Spec Delta

## ADDED Requirements

### Requirement: Table Cell Text Truncation
The system SHALL truncate long text content in table cells to maintain consistent column widths and prevent horizontal table overflow, while providing access to full content on hover.

#### Scenario: View truncated text in table cell
- **WHEN** a table cell contains text longer than its maximum width
- **THEN** the text is clipped with an ellipsis (...)
- **AND** the cell displays a native browser tooltip with the full text on hover
- **AND** the truncation does not affect the cell's vertical alignment

#### Scenario: Truncation applies to text-heavy columns
- **WHEN** viewing any data table (Products, Customers, Quotes, Discounts, Price Books, Rules, Tax Rates, Units, Currencies, Quote Lines)
- **THEN** text-heavy columns (name, description, company, email) apply truncation
- **AND** short-form columns (status badges, numeric values, action buttons) do not truncate
- **AND** the maximum width varies by content type (names: max-w-xs, descriptions: max-w-xs, emails: max-w-sm)

#### Scenario: Truncation does not affect mobile card views
- **WHEN** viewing tables on mobile devices (card layout)
- **THEN** text content wraps naturally within cards
- **AND** truncation CSS classes do not affect mobile card rendering
