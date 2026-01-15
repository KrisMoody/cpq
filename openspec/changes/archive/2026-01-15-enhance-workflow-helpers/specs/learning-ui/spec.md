# learning-ui Spec Delta

## MODIFIED Requirements

### Requirement: CPQ Flow Diagram
The system SHALL display a workflow diagram showing the complete CPQ process flow including the approval workflow, with helper indicators showing optional tools available at each step.

The diagram SHALL show helper badges for:
1. **Create Quote step**: Contract pricing indicator (when customer has active contract)
2. **Add Products step**: Guided Selling indicator (questionnaires, product affinities)
3. **Apply Pricing step**: Multi-currency indicator (currency conversion)
4. **Submit step**: Quote Preview indicator (document preview)

#### Scenario: View helper indicators on workflow steps
- **WHEN** user views the CPQ flow diagram
- **THEN** relevant steps display small helper badges below the description
- **AND** each badge shows an icon representing the helper feature
- **AND** hovering over a badge displays a tooltip explaining the feature

#### Scenario: Helper badges are non-intrusive
- **WHEN** user views the CPQ flow diagram
- **THEN** helper badges use muted colors and small icons
- **AND** the main workflow flow remains visually dominant
- **AND** helpers do not interfere with understanding the core quote lifecycle
