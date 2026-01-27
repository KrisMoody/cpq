# quotes Specification Delta

## ADDED Requirements

### Requirement: Bundle-Aware Quote Recalculation
The system SHALL handle bundle products correctly when recalculating quote totals, preserving the parent-child relationship and applying appropriate pricing rules for bundle parents and their components.

#### Scenario: Recalculate quote with bundle preserves structure
- **GIVEN** a quote contains a bundle product with child line items
- **WHEN** POST /api/quotes/:id/calculate is called
- **THEN** bundle parent line item maintains netPrice = 0
- **AND** bundle child line items (parentLineId !== null) maintain their parent relationship
- **AND** bundle child line items have their prices recalculated from the price book
- **AND** quote subtotal includes bundle children netPrices but not bundle parent netPrice

#### Scenario: Recalculate standalone products unaffected
- **GIVEN** a quote contains standalone products (parentLineId === null, type !== BUNDLE)
- **WHEN** POST /api/quotes/:id/calculate is called
- **THEN** standalone product line items have prices recalculated normally
- **AND** standalone product netPrice = (listPrice × quantity) - discount

#### Scenario: Recalculate mixed quote with bundles and standalone products
- **GIVEN** a quote contains both bundle products and standalone products
- **WHEN** POST /api/quotes/:id/calculate is called
- **THEN** bundle parents have netPrice = 0
- **AND** bundle children maintain parentLineId and get recalculated prices
- **AND** standalone products get recalculated prices normally
- **AND** quote subtotal = sum of (standalone netPrices + bundle children netPrices)
