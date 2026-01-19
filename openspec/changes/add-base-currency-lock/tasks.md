# Tasks: Lock Base Currency After First Transaction

## 1. Backend Validation
- [ ] 1.1 Add helper function to check if transactions exist
- [ ] 1.2 Update currency PUT endpoint with base currency lock validation
- [ ] 1.3 Add clear error message when base currency change is blocked

## 2. Frontend UI
- [ ] 2.1 Display warning on currency edit page when base currency is locked
- [ ] 2.2 Disable base currency toggle when transactions exist
- [ ] 2.3 Show informational message explaining why change is blocked

## 3. Validation
- [ ] 3.1 Verify base currency can be set when no quotes exist
- [ ] 3.2 Verify base currency change is blocked when quotes exist
- [ ] 3.3 Verify error message is user-friendly
