# Change: Add Visual QuoteLayout Builder

## Why

Creating QuoteLayouts via API or JSON editing is not user-friendly. A visual builder allows users to:
- Drag-and-drop to configure sections and columns
- See live preview with sample data
- Customize themes without CSS knowledge
- Create professional quote presentations without technical skills

This is the user-facing UI that sits on top of the QuoteLayout core system.

## What Changes

- **NEW**: `QuoteLayoutBuilder.vue` - Main builder component with section management
- **NEW**: `LayoutSectionEditor.vue` - Configure individual sections (columns, filters)
- **NEW**: `LayoutColumnPicker.vue` - Select and order columns for a section
- **NEW**: `LayoutThemeEditor.vue` - Visual theme configuration panel
- **NEW**: `LayoutPreview.vue` - Live preview with sample quote data
- **NEW**: Layout management page at `/layouts`
- **NEW**: Sample quote data generator for previews

## Impact

- Affected specs: MODIFIED `quote-layout` capability (adds builder requirements)
- Affected code:
  - `app/components/quote/builder/` - Builder UI components
  - `app/pages/layouts/` - Layout management pages
  - `app/composables/useLayoutBuilder.ts` - Builder state management
  - `app/utils/sample-quote-data.ts` - Sample data generator

## Dependencies

- Requires `add-quote-layout-core` to be implemented first (types, API, QuoteRenderer)
