# Proposal: enhance-workflow-helpers

## Summary
Add subtle helper indicators to the CPQ Workflow diagram showing optional tools available at each step (Guided Selling, Quote Preview, Contract Pricing).

## Motivation
The CPQ Workflow diagram shows the core quote lifecycle but doesn't hint at the helper features available during each phase. Adding small, non-intrusive indicators helps users discover these tools exist without cluttering the main flow.

## Scope
- Modify `CPQFlowDiagram.vue` to show helper badges on relevant steps
- Keep the main flow unchanged - helpers are supplementary information
- Use tooltips to explain each helper without adding visual clutter

## Approach
Add an optional `helpers` array to the Step interface containing small icon badges that appear below the step description. Each helper shows:
- A small icon (e.g., sparkles for Guided Selling)
- A tooltip explaining the feature

### Step-to-Helper Mapping
| Step | Helpers |
|------|---------|
| Create Quote | Contract pricing (if customer has contract) |
| Add Products | Guided Selling (questionnaires, affinities) |
| Apply Pricing | Multi-currency conversion |
| Submit | Quote Preview |

## Out of Scope
- Changes to the approval branching section
- Adding new steps to the workflow
- Linking to actual features (this is documentation only)
