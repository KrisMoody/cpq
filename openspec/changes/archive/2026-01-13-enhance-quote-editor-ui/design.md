# Design: Enhanced Quote Editor UI

## Architecture Overview

The enhanced quote editor follows a panel-based layout with contextual sections that appear based on quote state. All enhancements integrate with existing composables and APIs.

```
┌─────────────────────────────────────────────────────────────────┐
│ Quote Header (name, status, customer info)                       │
├─────────────────────────────────────────────────────────────────┤
│                                              │                   │
│  Line Items Card                             │  Customer Card    │
│  ┌─────────────────────────────────────┐    │  ┌─────────────┐  │
│  │ Product | Qty | Price | Disc | Net  │    │  │ Name        │  │
│  │ [Edit qty inline] [Applied disc]    │    │  │ Company     │  │
│  │ ...                                 │    │  │ Price Book  │  │
│  └─────────────────────────────────────┘    │  │ [Change]    │  │
│                                              │  └─────────────┘  │
│  Actions Row                                 │                   │
│  [Add Product] [Apply Discount]              │  Discounts Card   │
│                                              │  ┌─────────────┐  │
│                                              │  │ Applied:    │  │
│                                              │  │ - Discount1 │  │
│                                              │  │ - Discount2 │  │
│                                              │  │ [+ Add]     │  │
│                                              │  └─────────────┘  │
│                                              │                   │
│                                              │  Pricing Summary  │
│                                              │  ┌─────────────┐  │
│                                              │  │ Subtotal    │  │
│                                              │  │ Discounts   │  │
│                                              │  │ Total       │  │
│                                              │  └─────────────┘  │
│                                              │                   │
│                                              │  Rules Panel      │
│                                              │  ┌─────────────┐  │
│                                              │  │ ⚠ Warnings  │  │
│                                              │  │ ✓ Applied   │  │
│                                              │  └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Design

### 1. QuoteCustomerCard
**Purpose**: Display and edit customer association

**Props**:
- `quote: QuoteWithLineItems`
- `editable: boolean`

**Features**:
- Shows customer name, company, email if assigned
- Shows "No customer selected" prompt if unassigned
- "Change Customer" button opens CustomerSelector
- When customer changes, updates quote and potentially price book
- Link to customer detail page

**Behavior**:
- On customer change: Call `updateQuote(id, { customerId })`
- If new customer has different price book: Prompt to recalculate

### 2. QuoteDiscountsCard
**Purpose**: Show applied discounts and allow adding new ones

**Props**:
- `quote: QuoteWithLineItems`
- `editable: boolean`

**Features**:
- Lists all applied discounts (quote-level and aggregated line-level)
- Each discount shows: name, type badge, value, calculated amount
- "Apply Discount" button opens discount selector modal
- Remove button for each applied discount (with confirmation)
- "Add Manual Discount" option for custom discounts with reason

**Slots**:
- Header with count badge
- Empty state for no discounts

### 3. ApplyDiscountModal
**Purpose**: Select and apply discounts to quote or line items

**Props**:
- `open: boolean`
- `quoteId: string`
- `lineItemId?: string` (if applying to specific line)

**Features**:
- Tabs: "Quote Discounts" | "Line Item Discounts"
- Searchable list of available discounts
- Filter by: scope, type, active status
- Shows discount details: name, description, value, validity
- Preview of discount impact before applying
- Apply button with loading state

**Behavior**:
- Fetches discounts filtered by scope (QUOTE or LINE_ITEM)
- On apply: POST to `/api/quotes/:id/discounts`
- Emits `applied` event to refresh quote data

### 4. ManualDiscountModal
**Purpose**: Add a custom discount with reason

**Props**:
- `open: boolean`
- `quoteId: string`
- `lineItemId?: string`

**Features**:
- Type selector: Percentage or Fixed Amount
- Value input with validation
- Required reason textarea (for audit)
- Preview calculation

**Behavior**:
- Creates AppliedDiscount record without discountId
- Requires reason field populated

### 5. QuoteRulesPanel
**Purpose**: Show rule evaluation results

**Props**:
- `quote: QuoteWithLineItems`
- `evaluationResult?: EvaluationResult`

**Features**:
- Collapsible panel (expanded when warnings exist)
- Sections:
  - Warnings (amber): Rules that flagged but allowed
  - Errors (red): Rules that blocked actions
  - Applied actions (green): Discounts/changes applied by rules
- Each rule shows: name, message, action type
- "Why?" tooltip explaining rule condition

**Behavior**:
- Populated after quote calculation
- Updates on recalculate

### 6. QuoteLineItemEditable
**Purpose**: Enhanced line item with inline editing

**Props**:
- `lineItem: QuoteLineItem`
- `editable: boolean`

**Features**:
- Inline quantity edit (number input, visible on hover/focus)
- Applied discounts shown as pills below price
- Expand/collapse for child items (bundles)
- Remove button with confirmation
- "Apply Discount" quick action per line

**Behavior**:
- Quantity change: Debounced API call to update + recalculate
- Shows loading indicator during update

### 7. QuoteApprovalBanner
**Purpose**: Show approval status and actions

**Props**:
- `quote: QuoteWithLineItems`

**Features**:
- Visible when status is PENDING_APPROVAL or requiresApproval
- Shows reason for approval requirement
- Approve/Reject buttons for authorized users
- Reject requires reason input

**Behavior**:
- Approve: POST to `/api/quotes/:id/approve`
- Reject: POST to `/api/quotes/:id/reject` with reason

## Data Flow

### Quote Loading
```
1. Load quote with lineItems, customer, appliedDiscounts
2. If customer has priceBook, use that for pricing
3. Load available discounts in background
4. If quote has pending calculation, show recalculate prompt
```

### Discount Application Flow
```
1. User clicks "Apply Discount"
2. Modal loads available discounts filtered by scope
3. User selects discount
4. System validates applicability (min quantity, date range, etc.)
5. Create AppliedDiscount record
6. Recalculate quote totals
7. Update UI with new totals and discount breakdown
```

### Customer Change Flow
```
1. User clicks "Change Customer"
2. CustomerSelector modal opens
3. User selects new customer
4. System checks if customer has different price book
5. If different: Prompt "Customer uses Enterprise Price Book. Recalculate prices?"
6. Update quote customerId
7. If confirmed: Recalculate with new price book
8. Update UI
```

### Rule Evaluation Flow
```
1. User triggers action (add product, change quantity, save)
2. System evaluates applicable rules
3. Store warnings/errors/applied actions
4. Display in Rules Panel
5. If REQUIRE_APPROVAL action: Set requiresApproval flag
```

## API Enhancements Needed

### New Endpoints
- `POST /api/quotes/:id/discounts` - Apply discount to quote
- `DELETE /api/quotes/:id/discounts/:appliedDiscountId` - Remove applied discount
- `PUT /api/quotes/:id/lines/:lineId` - Update line item (quantity)

### Enhanced Responses
- `GET /api/quotes/:id` should include:
  - Full customer object (not just customerName)
  - Applied discounts with discount definition details
  - Rule evaluation results (if calculated)

## State Management

### Local Component State
- Modal open/close states
- Form values
- Loading states per operation

### Composable State (useQuotes)
- Quote data with line items and discounts
- Calculation results including rule evaluation

### Derived State
- `totalDiscountAmount`: Sum of all applied discount amounts
- `lineItemDiscounts`: Map of lineItemId -> discount[]
- `quoteDiscounts`: Discounts where lineItemId is null
- `hasApprovalWarnings`: Boolean for showing approval banner

## Error Handling

| Error | User Message | Recovery |
|-------|--------------|----------|
| Discount not applicable | "This discount doesn't apply to this quote" | Show eligibility requirements |
| Customer not found | "Customer no longer exists" | Clear selection, prompt to choose another |
| Calculation failed | "Unable to calculate. Check line items." | Show which items have issues |
| Approval failed | "Could not approve quote" | Show reason, retry option |

## Accessibility

- All modals trap focus
- Keyboard navigation for discount selection
- Screen reader announcements for:
  - Discount applied/removed
  - Total changes
  - Approval status changes
- ARIA labels on interactive elements
