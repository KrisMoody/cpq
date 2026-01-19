## Context

The CPQ application has grown organically with form pages added over time. Each developer (or AI) implemented inputs with slightly different width approaches, leading to visual inconsistency. The project uses Nuxt UI v4 components which inherit width from their parent container by default.

**Stakeholders:** End users creating quotes, products, customers, etc.
**Constraints:** Must work with existing Nuxt UI v4 components and Tailwind CSS.

## Goals / Non-Goals

**Goals:**
- Establish a consistent form width system documented for future development
- Update all existing forms to follow the new conventions
- Create a visually cohesive form experience across all entity pages
- Ensure forms remain responsive and usable on mobile devices

**Non-Goals:**
- Creating custom form components (use existing Nuxt UI components)
- Adding complex responsive breakpoints (keep simple approach)
- Changing the underlying form validation logic
- Modifying the form submission behavior

## Research-Backed Principles

Based on industry research (see proposal.md for full details):

1. **Width communicates expected input** — Users subconsciously gauge how much to enter based on field width (Baymard Institute, Nielsen Norman Group)
2. **Match width to character count** — Field width should accommodate expected content with ~20% breathing room
3. **Three categories of input** — Fixed length, variable-with-normal-average, and outliers (Baymard)
4. **Single column preferred** — Multi-column layouts acceptable only for tightly related fields
5. **Responsive stacking** — Side-by-side on desktop, stacked on mobile

## Decisions

### Decision 1: Standardize Page Container Widths

**All "new" and simple edit pages:** `max-w-2xl` (672px / 42rem)
- Consistent narrow width for focused form entry
- Matches industry standard of ~60-70 characters per line for readability
- Applies to: Products, Customers, Quotes, Discounts, Rules, Categories, Currencies, Tax Rates, Units, Attributes, Price Books, Contracts, Questionnaires, Affinities

**Detail pages with tables/complex layouts:** `max-w-4xl` (896px / 56rem)
- More space for displaying data alongside edit forms
- Applies to: Product detail, Quote detail, Price Book detail, Contract detail, Category detail, Currency detail, Questionnaire detail

**Alternatives considered:**
- Using responsive max-widths: Rejected - adds complexity without clear benefit
- Different widths per entity type: Rejected - inconsistent and harder to maintain

### Decision 2: Input Field Width System (Research-Based)

Define five width tiers based on expected character count:

| Tier | Tailwind Class | Rem/Px | Character Fit | Use Cases |
|------|---------------|--------|---------------|-----------|
| **XS** | `w-20` | 5rem / 80px | 6-8 chars | Percentages, CVV, short codes |
| **SM** | `w-28` | 7rem / 112px | 10-12 chars | Quantity, ZIP, priority, sort order |
| **MD** | `w-40` | 10rem / 160px | 15-18 chars | Price, phone, date |
| **LG** | `w-64` | 16rem / 256px | 25-30 chars | Email, name, SKU, dropdowns |
| **Full** | (default) | 100% container | 35+ chars | Description, address, notes |

**Rationale (research-backed):**
- **XS (w-20)**: Percentages (0-100.00 = 6 chars max), fits research recommendation of 6-8 chars
- **SM (w-28)**: ZIP codes (5-10 chars), quantities (1-999999 = 7 chars max), matches Baymard "fixed length" category
- **MD (w-40)**: Prices with currency symbol ($999,999.99 = 12 chars), phone numbers (15 chars formatted)
- **LG (w-64)**: Emails average 25 chars (range 18-33), names average 15-20 chars
- **Full**: Descriptions, notes, addresses (35-46 chars per line)

**Key change from original proposal:** Added XS tier and refined SM tier based on research showing the importance of matching field width to exact character requirements.

**Alternatives considered:**
- Using `ch` units: Rejected - less predictable with proportional fonts, harder to maintain consistency
- Using percentage widths: Rejected - less predictable across containers
- Creating Tailwind component classes: Rejected - over-engineering for this scope

### Decision 3: Grid Layout Patterns

**Two-column rows for related short fields:**
```html
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <UFormField label="Field 1">...</UFormField>
  <UFormField label="Field 2">...</UFormField>
</div>
```

**Single column for full-width fields:**
```html
<UFormField label="Name">
  <UInput v-model="form.name" />
</UFormField>
```

**Inline short fields (rare, for tightly coupled values):**
```html
<div class="flex gap-4">
  <UFormField label="Min" class="w-32">...</UFormField>
  <UFormField label="Max" class="w-32">...</UFormField>
</div>
```

### Decision 4: Modal Widths

Standardize modal content widths:
- **Small modals** (simple forms): No min-width, let UCard determine
- **Medium modals** (standard forms): `min-w-[400px]` or `class="w-[450px]"`
- **Large modals** (complex forms with tables): `min-w-[600px]`

### Decision 5: Specific Field Type Guidelines (Revised)

Based on the width tier system and research on character counts:

| Field Type | Tier | Class | Rationale |
|------------|------|-------|-----------|
| **Name/Title** | Full | (default) | Variable, but container already constrained |
| **Description/Notes** | Full | (default) | Long-form text, UTextarea |
| **Email** | LG | `w-64` | Avg 25 chars (range 18-33) |
| **Code/SKU** | LG | `w-64` | Typically 6-15 chars + breathing room |
| **Currency Code** | XS | `w-20` | ISO 4217 = 3 chars |
| **Symbol** | XS | `w-20` | 1-4 chars ($, €, £) |
| **Phone** | MD | `w-40` | 10-15 chars formatted |
| **Percentage** | XS | `w-20` | 0-100.00 = 6 chars max |
| **Priority/Sort Order** | SM | `w-28` | 1-9999 = 4 chars + label space |
| **Quantity** | SM | `w-28` | 1-999999 = 7 chars |
| **Price/Amount** | MD | `w-40` | $999,999.99 = 12 chars |
| **Exchange Rate** | SM | `w-28` | 0.0001-9999 = 8 chars |
| **Date** | MD | `w-40` | MM/DD/YYYY = 10 chars |
| **Select/Dropdown** | LG | `w-64` | Room for option text |
| **Searchable Select** | Full | (default) | Needs search input space |

**Special cases:**
- Two related short fields (Min/Max, Start/End): Use `flex gap-4` with individual widths
- Related dropdowns (Type + Value): Use responsive grid `grid-cols-1 sm:grid-cols-2`

## Risks / Trade-offs

**Risk:** Breaking existing responsive behavior
- **Mitigation:** Use responsive prefixes (`sm:grid-cols-2`) and test on mobile

**Risk:** Visual changes may surprise users
- **Mitigation:** Changes are improvements toward consistency; no functional changes

**Trade-off:** Some forms may appear more "empty" with constrained widths on large screens
- **Acceptance:** Consistent appearance is more professional than filled-but-random widths

## Migration Plan

1. Update page container widths first (low risk, high impact)
2. Update grid layouts to use responsive two-column pattern
3. Apply width constraints to numeric/code inputs
4. Standardize modal widths
5. Test all forms on desktop and mobile viewports

**Rollback:** Revert to previous file versions if issues arise (git revert)

## Open Questions

1. Should we create a custom CSS class or Tailwind plugin for commonly used widths?
   - Recommendation: No, use raw Tailwind classes for transparency

2. Should form sections use consistent spacing patterns?
   - Current: Mix of `space-y-4` and `space-y-6`
   - Recommendation: Standardize on `space-y-6` between sections, `space-y-4` within sections
