# Tasks

## Implementation

- [x] Update `QuoteApprovalBanner.vue` to show banner for DRAFT quotes when `requiresApproval: false`
  - Add info-colored banner with "Ready to Submit" title
  - Show "Submit Quote" button that emits 'submit' event
  - Keep existing warning banner behavior when `requiresApproval: true`

## Validation

- [x] Test: DRAFT quote with `requiresApproval: false` shows blue "Ready to Submit" banner
- [x] Test: Clicking "Submit Quote" transitions quote to APPROVED status
- [x] Test: DRAFT quote with `requiresApproval: true` still shows yellow "Approval Required" banner
- [x] Test: Clicking "Submit for Approval" transitions quote to PENDING_APPROVAL status
