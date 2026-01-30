# price-books Specification Delta

## MODIFIED Requirements

### Requirement: Price Book Management UI
The system SHALL provide a user interface for managing price books:
- List view showing all price books with key attributes
- Detail view for viewing and editing a price book and its entries
- Create form for adding new price books
- Inline editing for price book entry prices
- **Tier type selection at entry level, not per-tier**

#### Scenario: Edit price tiers with entry-level type selector
- **WHEN** user edits tiers for a price book entry
- **THEN** display a single tier type selector above the tier list
- **AND** the selected type applies to all tiers for that entry
- **AND** each tier row shows only: Min Qty, Max Qty, and Price (or Discount % for VOLUME_DISCOUNT_PERCENT type)
- **AND** changing the tier type updates the input field type for all tiers

#### Scenario: View price tiers
- **WHEN** user views tiers for a price book entry (not editing)
- **THEN** display the tier type once (e.g., as a badge above the tier table)
- **AND** display tiers in a simple table with: Quantity Range, Price/Discount value
