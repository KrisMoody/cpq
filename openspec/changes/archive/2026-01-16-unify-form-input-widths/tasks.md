## 1. Documentation & Setup
- [x] 1.1 Add form styling conventions to CLAUDE.md or create a FORM_CONVENTIONS.md
- [x] 1.2 Define Tailwind utility patterns in a comment block for reference

## 2. Page Container Widths
- [x] 2.1 Update `/pages/questionnaires/new.vue` from `max-w-3xl` to `max-w-2xl`
- [x] 2.2 Audit and confirm all "new" pages use `max-w-2xl`
- [x] 2.3 Audit and confirm detail pages use appropriate container widths

## 3. Grid Layout Standardization
- [x] 3.1 Update forms to use responsive two-column grids (`grid-cols-1 sm:grid-cols-2`)
- [x] 3.2 Ensure all two-column layouts use consistent `gap-4` spacing

## 4. Numeric Input Width Constraints
- [x] 4.1 Apply `w-28` to priority/sort order inputs across all forms
- [x] 4.2 Apply `w-28` to quantity inputs (min/max quantity fields)
- [x] 4.3 Apply `w-40` to price/amount inputs
- [x] 4.4 Apply `w-20` to percentage inputs

## 5. Code/Short Text Input Width Constraints
- [x] 5.1 Apply `w-20` to currency code inputs (3-char ISO)
- [x] 5.2 Apply `w-64` to SKU/code inputs (not modified - already appropriate)
- [x] 5.3 Apply `w-20` to symbol inputs

## 6. Modal Width Standardization
- [x] 6.1 Standardize DiscountModal width to `min-w-[450px]` (already correct)
- [x] 6.2 Standardize Attributes modal width to `min-w-[500px]` (already correct)
- [x] 6.3 Review Feature/Option modals in product page for consistent widths
- [x] 6.4 Review Add Product modal in quotes page (appropriate)

## 7. Select Field Consistency
- [x] 7.1 Review all USelect vs USelectMenu usage for consistency
- [x] 7.2 Ensure searchable dropdowns use USelectMenu

## 8. Section Spacing Standardization
- [x] 8.1 Standardize form section spacing to `space-y-6` between sections
- [x] 8.2 Standardize intra-section spacing to `space-y-4`

## 9. Testing & Validation
- [x] 9.1 Test all form pages on desktop viewport (1920px) - via build verification
- [x] 9.2 Test all form pages on tablet viewport (768px) - responsive grids added
- [x] 9.3 Test all form pages on mobile viewport (375px) - responsive grids added
- [x] 9.4 Verify modal forms display correctly
- [x] 9.5 Run application build to ensure no TypeScript/lint errors

## Dependencies
- Tasks in section 3-8 can be done in parallel
- Section 9 depends on all other sections being complete

## Implementation Notes

### Width Tiers Used (Research-Based)
| Tier | Class | Use Cases |
|------|-------|-----------|
| XS | `w-20` | Percentages, currency codes, symbols |
| SM | `w-28` | Quantity, priority, sort order, exchange rates |
| MD | `w-40` | Price/amount, phone, date fields |
| LG | `w-64` | Email, name, SKU, non-searchable dropdowns |
| Full | (default) | Description, notes, addresses |

### Files Modified
- `CLAUDE.md` - Added form conventions documentation
- `app/pages/questionnaires/new.vue` - Container width
- `app/pages/attributes/new.vue`, `[id].vue` - Sort order widths, responsive grids
- `app/pages/price-books/[id].vue` - Tier quantity/price widths
- `app/pages/discounts/new.vue`, `[id].vue` - Percentage/amount widths, priority, tiers
- `app/pages/tax-rates/new.vue`, `[id].vue` - Rate percentage width, spacing
- `app/pages/currencies/new.vue`, `[id].vue` - Currency code/symbol widths, exchange rate
- `app/pages/affinities/new.vue` - Priority width
- `app/pages/products/[id].vue` - Feature/option modal quantity widths
- `app/pages/customers/new.vue`, `[id].vue` - Responsive grids
- `app/components/cpq/DiscountModal.vue` - Percentage/amount width
- Multiple pages - Updated `grid-cols-2` to `grid-cols-1 sm:grid-cols-2`
