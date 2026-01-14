## MODIFIED Requirements

### Requirement: CPQ Flow Diagram
The system SHALL display a workflow diagram showing the complete CPQ process flow including the approval workflow.

The diagram SHALL show:
1. **Setup Phase**: Create Quote with Customer and Price Book selection
2. **Configuration Phase**: Add Products and Configure Bundle Options
3. **Pricing Phase**: Apply Pricing Rules and Discounts
4. **Submission Phase**: Submit for Evaluation (rules check)
5. **Approval Phase**: Either auto-approve or enter approval workflow
6. **Completion Phase**: Accept and Finalize quote

The diagram SHALL visually distinguish:
- The main "happy path" flow (auto-approve)
- The approval-required path (PENDING_APPROVAL → APPROVED/REJECTED)
- Terminal states (FINALIZED, REJECTED)

#### Scenario: View flow diagram
- **WHEN** user views the CPQ flow diagram
- **THEN** display the complete workflow with phases: Setup Quote → Add Products → Configure → Apply Pricing → Submit → Approve → Accept → Finalize
- **AND** show branching for approval-required quotes (PENDING_APPROVAL path)
- **AND** indicate where rules evaluation occurs

#### Scenario: Understand approval branching
- **WHEN** user views the approval section of the flow diagram
- **THEN** display that quotes may auto-approve (if no rules trigger approval)
- **OR** enter PENDING_APPROVAL status requiring manual approval
- **AND** show REJECTED as a terminal state alongside FINALIZED
