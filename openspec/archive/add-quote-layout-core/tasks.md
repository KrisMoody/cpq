## 1. Data Model & Types

- [x] 1.1 Create TypeScript types in `app/types/quote-layout.ts`
- [x] 1.2 Add QuoteLayout model to Prisma schema (JSON columns for sections, summaryConfig, theme)
- [x] 1.3 Run Prisma migration
- [x] 1.4 Create Zod validation schemas for API input

## 2. API Endpoints

- [x] 2.1 Create `GET /api/quote-layouts` - list layouts with optional template filter
- [x] 2.2 Create `GET /api/quote-layouts/:id` - get single layout
- [x] 2.3 Create `POST /api/quote-layouts` - create new layout
- [x] 2.4 Create `PUT /api/quote-layouts/:id` - update layout
- [x] 2.5 Create `DELETE /api/quote-layouts/:id` - delete layout
- [x] 2.6 Create `POST /api/quote-layouts/:id/clone` - clone layout

## 3. QuoteRenderer Component

- [x] 3.1 Create `QuoteRenderer.vue` component structure
- [x] 3.2 Implement section rendering with column configuration
- [x] 3.3 Implement section filtering (assign line items to sections)
- [x] 3.4 Implement summary section rendering
- [x] 3.5 Implement theme application (colors, fonts, styling)
- [x] 3.6 Ensure print-friendly styling

## 4. Composable & State

- [x] 4.1 Create `useQuoteLayout` composable for CRUD operations
- [x] 4.2 Add layout resolution logic (find applicable layout for quote)

## 5. Default Layouts

- [x] 5.1 Create seed data for default "Simple" layout template
- [x] 5.2 Create seed data for default "Detailed" layout template
- [x] 5.3 Create seed data for "Sectioned" layout template (products/services split)

## 6. Integration

- [x] 6.1 Add layout selector to quote editor page
- [x] 6.2 Update quote preview to use QuoteRenderer with selected layout
- [x] 6.3 Add "Manage Layouts" link to quotes section

## 7. Testing & Documentation

- [ ] 7.1 Add unit tests for section filtering logic
- [ ] 7.2 Add component tests for QuoteRenderer
- [ ] 7.3 Update Learn page with QuoteLayout documentation
