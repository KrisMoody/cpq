## Prerequisites

- [ ] 0.1 Ensure `add-quote-layout-core` is implemented (types, API, QuoteRenderer)

## 1. Builder Foundation

- [ ] 1.1 Create `useLayoutBuilder` composable with state management
- [ ] 1.2 Create sample quote data generator utility
- [ ] 1.3 Create `QuoteLayoutBuilder.vue` main container component
- [ ] 1.4 Create `LayoutHeader.vue` (name input, description, action buttons)

## 2. Section Management

- [ ] 2.1 Create `LayoutSectionsPanel.vue` container for sections
- [ ] 2.2 Create `LayoutSectionEditor.vue` with expand/collapse
- [ ] 2.3 Create `LayoutColumnPicker.vue` with available columns list
- [ ] 2.4 Create `LayoutFilterConfig.vue` for section filtering rules
- [ ] 2.5 Implement section drag-and-drop reordering
- [ ] 2.6 Implement add/remove section functionality

## 3. Theme Editor

- [ ] 3.1 Create `LayoutThemeEditor.vue` container
- [ ] 3.2 Create theme presets (Professional, Modern, Minimal, Classic)
- [ ] 3.3 Add color pickers for primary/secondary colors
- [ ] 3.4 Add font family selector
- [ ] 3.5 Add table styling toggles (borders, alternate rows)

## 4. Summary Configuration

- [ ] 4.1 Create `LayoutSummaryConfig.vue` with checkboxes
- [ ] 4.2 Wire up summary options to layout state

## 5. Live Preview

- [ ] 5.1 Create `LayoutPreview.vue` wrapper component
- [ ] 5.2 Integrate QuoteRenderer with builder state
- [ ] 5.3 Add debounced preview updates
- [ ] 5.4 Add preview scale/zoom control

## 6. Pages & Navigation

- [ ] 6.1 Create `/layouts` index page listing all layouts
- [ ] 6.2 Create `/layouts/new` page for creating layouts
- [ ] 6.3 Create `/layouts/[id]` page for editing layouts
- [ ] 6.4 Add layouts link to main navigation
- [ ] 6.5 Add "Create Layout" action to layouts list

## 7. Integration & Polish

- [ ] 7.1 Add unsaved changes warning on navigation
- [ ] 7.2 Add loading states and error handling
- [ ] 7.3 Add success toast on save
- [ ] 7.4 Ensure responsive layout for smaller screens

## 8. Testing

- [ ] 8.1 Add component tests for section editor
- [ ] 8.2 Add component tests for column picker
- [ ] 8.3 Test drag-and-drop functionality
- [ ] 8.4 Test save/load round-trip
