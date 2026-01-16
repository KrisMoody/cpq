## Context

The QuoteLayoutBuilder provides a visual interface for creating and editing QuoteLayouts. It builds on the core QuoteLayout system and uses the QuoteRenderer for live preview.

## Goals / Non-Goals

**Goals:**
- Intuitive drag-and-drop section and column configuration
- Live preview showing how the quote will look
- Theme customization with color pickers and presets
- Support creating layouts from scratch or editing existing ones

**Non-Goals:**
- WYSIWYG inline editing (too complex for POC)
- Custom CSS injection (use structured theme instead)
- Undo/redo history (nice-to-have, not MVP)

## Decisions

### Decision: Panel-based builder layout
Builder uses a side-by-side layout: configuration panel on left, live preview on right. This allows seeing changes immediately.

```
┌─────────────────────────────────────────────────────────────┐
│ Layout Builder                              [Save] [Cancel] │
├─────────────────────┬───────────────────────────────────────┤
│ ▼ Section: Products │                                       │
│   [Columns] [Filter]│     ┌─────────────────────────┐       │
│                     │     │   QUOTE PREVIEW         │       │
│ ▼ Section: Services │     │   ─────────────────     │       │
│   [Columns] [Filter]│     │   Products              │       │
│                     │     │   ┌───┬───┬───┬───┐    │       │
│ [+ Add Section]     │     │   │   │   │   │   │    │       │
│                     │     │   └───┴───┴───┴───┘    │       │
│ ─────────────────── │     │                         │       │
│ Theme               │     │   Summary               │       │
│ [Colors] [Fonts]    │     │   Total: $X,XXX         │       │
│                     │     └─────────────────────────┘       │
│ Summary Config      │                                       │
│ [✓] Subtotal        │                                       │
│ [✓] Discounts       │                                       │
└─────────────────────┴───────────────────────────────────────┘
```

### Decision: Inline section editing
Sections expand inline to show column picker and filter configuration. No modal dialogs for simple edits.

### Decision: Preset themes with customization
Provide 3-4 preset themes (Professional, Modern, Minimal, Classic) that users can select and then customize. This gives a good starting point.

### Decision: Sample data for preview
Generate realistic sample quote data for preview. Include various product types, bundles, discounts to show all layout features.

## Component Architecture

```
QuoteLayoutBuilder.vue (main container)
├── LayoutHeader.vue (name, description, save/cancel)
├── LayoutSectionsPanel.vue
│   ├── LayoutSectionEditor.vue (per section)
│   │   ├── LayoutColumnPicker.vue
│   │   └── LayoutFilterConfig.vue
│   └── AddSectionButton.vue
├── LayoutThemeEditor.vue
│   ├── ThemePresets.vue
│   └── ThemeCustomizer.vue (colors, fonts)
├── LayoutSummaryConfig.vue
└── LayoutPreview.vue
    └── QuoteRenderer.vue (from core)
```

## State Management

```typescript
// useLayoutBuilder composable
interface LayoutBuilderState {
  layout: QuoteLayout          // Current layout being edited
  originalLayout: QuoteLayout  // For dirty checking
  isDirty: boolean
  previewQuote: Quote          // Sample data for preview
  activeSection: string | null // Currently expanded section
}

// Actions
- addSection()
- removeSection(sectionId)
- updateSection(sectionId, updates)
- reorderSections(fromIndex, toIndex)
- updateTheme(themeUpdates)
- updateSummaryConfig(configUpdates)
- save()
- reset()
```

## Drag-and-Drop

Use native HTML5 drag-and-drop for:
- Reordering sections (drag section headers)
- Reordering columns within a section (drag column chips)

Keep it simple - no external DnD library needed for this scope.

## Risks / Trade-offs

- **Risk**: Preview performance with complex layouts
  - Mitigation: Debounce preview updates, only re-render on blur or explicit action

- **Trade-off**: Flexibility vs simplicity
  - Limited to structured options (no custom CSS) to keep builder simple
  - Can extend later with advanced mode if needed

## Open Questions

- Should we support column width drag-to-resize in preview? Defer to future.
- Should themes support logo upload? Defer - out of scope for POC.
