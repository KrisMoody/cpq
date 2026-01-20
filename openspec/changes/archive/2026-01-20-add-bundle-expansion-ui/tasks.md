# Tasks: Add Bundle Expansion UI

## 1. Quote Line Item Component Updates
- [x] 1.1 Add `isExpanded` prop and `toggle` emit to CpqQuoteLineItem component
- [x] 1.2 Add expand/collapse chevron icon for bundle line items (only when childLines exist)
- [x] 1.3 Render child line items when expanded using recursive component pattern
- [x] 1.4 Style child items with indentation and subtle background differentiation
- [x] 1.5 Add ARIA attributes for accessibility (aria-expanded, aria-controls)

## 2. Quote Editor Page Updates
- [x] 2.1 Add `expandedBundles` reactive Set to track expanded bundle IDs
- [x] 2.2 Pass expansion state and toggle handler to CpqQuoteLineItem components
- [x] 2.3 Add "Show/Hide All Bundle Contents" toggle button in line items header
- [x] 2.4 Implement expand-all and collapse-all functionality

## 3. Visual Polish
- [x] 3.1 Add smooth expand/collapse animation (CSS transition or Vue Transition)
- [x] 3.2 Show bundle component count badge on collapsed bundles (e.g., "3 items")
- [x] 3.3 Ensure consistent spacing and alignment between parent and child rows

## 4. Edge Cases
- [x] 4.1 Handle bundles with no child products gracefully (no expand icon)
- [x] 4.2 Preserve expansion state when line items are updated (quantity change, discount)
- [x] 4.3 Auto-expand newly added bundles so user sees the configuration
