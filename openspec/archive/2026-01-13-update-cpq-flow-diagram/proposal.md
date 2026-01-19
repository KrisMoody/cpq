# Change: Update CPQ Flow Diagram to Reflect Expanded Application

## Why
The dashboard's CPQ workflow diagram shows a simplified 5-step linear flow that no longer accurately represents the application's capabilities. The app now includes customer management, rules engine, discounts, and a multi-status approval workflow (7 statuses) that are not visible in the current diagram.

## What Changes
- **MODIFIED** CPQ Flow Diagram requirement to show expanded workflow steps
- Update the `CPQFlowDiagram.vue` component to include:
  - Customer/quote setup step
  - Rules evaluation indicator
  - Approval workflow branching (PENDING_APPROVAL path)
  - All terminal states (FINALIZED, REJECTED)
- Add visual distinction between happy path and approval-required path

## Impact
- Affected specs: `learning-ui`
- Affected code: `app/components/learn/CPQFlowDiagram.vue`, `app/pages/index.vue`
- User benefit: New users will understand the full CPQ workflow including approval gates

## Current vs Proposed

**Current (5 steps):**
```
Browse Products → Configure Bundle → Add to Quote → Review Pricing → Finalize Quote
```

**Proposed (expanded):**
```
Main Flow:
Setup Quote (Customer + Price Book) → Add Products → Configure Options → Apply Pricing/Discounts → Submit

Then branches:
├─ Auto-Approve Path: → Approved → Accept → Finalized
└─ Approval Path: → Pending Approval → {Approved | Rejected}
                                         └─→ Accept → Finalized
```
