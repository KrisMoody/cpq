# Change: Add Quote Preview (Digital Document)

## Why
CPQ systems must provide a professional, customer-facing view of quotes. Currently quotes can only be viewed in the editor UI. Users need to preview how the quote will appear to customers before sharing, and customers need a clean, branded document view.

## What Changes
- Add new `QuotePreview` component displaying quote as a professional document
- Include company branding placeholder, quote metadata, line items table, pricing summary
- Add terms & conditions section
- Add "Preview" button to quote editor
- Create dedicated `/quotes/[id]/preview` page for full-screen preview
- Support print-friendly styling

## Impact
- Affected specs: `quotes` (minor), `quote-preview` (new)
- Affected code:
  - `app/components/cpq/QuotePreview.vue` (new)
  - `app/pages/quotes/[id]/preview.vue` (new)
  - `app/pages/quotes/[id].vue` (add preview button)
