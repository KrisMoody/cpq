# Change: Unify and Normalize Form Input Widths

## Why
Form input fields across the application have inconsistent widths. Some use explicit pixel widths (`w-32`, `w-28`), others use `flex-1`, and many have no width constraint at all. This creates a visually inconsistent and unprofessional user experience, especially on larger screens where inputs expand to fill their containers randomly.

## What Changes
- Define a unified form width system with standardized size classes
- Create a consistent approach for different input field types
- Establish layout patterns for form sections (grid columns, max-widths)
- Document form styling conventions for future development
- Update all existing forms to follow the new conventions

## Impact
- Affected specs: `learning-ui` (for form-related UI requirements)
- Affected code: All form pages and modal forms across the application
  - `/pages/**/new.vue` (15 files)
  - `/pages/**/[id].vue` (16 files with edit modes)
  - `/components/cpq/DiscountModal.vue`
  - `/components/cpq/CustomerSelector.vue`
  - `/components/layout-builder/*.vue`
  - Modal forms within detail pages

## Research Findings

### Current Width Patterns Observed

**Page Container Widths:**
- Most "new" pages use `max-w-2xl` (42rem / 672px)
- Questionnaire new page uses `max-w-3xl` (48rem / 768px) - inconsistent
- Detail pages use `max-w-4xl` (56rem / 896px) or `max-w-5xl` (64rem / 1024px)

**Grid Patterns:**
- Two-column grids: `grid grid-cols-2 gap-4` - used correctly
- Three-column grids: `grid grid-cols-3 gap-4` - used for condition builders in rules
- Single inputs: Full width within their container (no explicit class)

**Explicit Width Classes Found:**
- `w-32` (8rem) - used for sort order fields in attributes
- `w-28` (7rem) - used for price inputs in price book
- `w-24` (6rem) - used for tier min/max quantity fields
- `w-48` (12rem) - used for filters on products index
- `min-w-[500px]` - used for attributes modal
- `min-w-[450px]` - used for discount modal
- `class="flex-1"` - used for dynamic width distribution

**Issues Identified:**

1. **Inconsistent Container Widths**: New entity pages use different max-widths
   - Products, Customers, Currencies, Tax Rates, Price Books, Rules, Discounts, Categories, Contracts, Units, Attributes: `max-w-2xl`
   - Questionnaires: `max-w-3xl` (why different?)

2. **Random Numeric Input Widths**: Price/quantity inputs use arbitrary widths
   - `w-28` for list price inputs
   - `w-24` for tier quantity inputs
   - `w-32` for sort order inputs
   - No consistency in approach

3. **Modal Widths Vary**:
   - Discount modal: `min-w-[450px]`
   - Attributes modal: `min-w-[500px]`
   - Feature/Option modals: No explicit width

4. **Missing Width Constraints**: Many inputs expand to fill container
   - Works fine in narrow containers but looks odd on wider screens
   - Inputs like currency code (3 chars max) still expand to full width

5. **Inconsistent Select Field Widths**:
   - Some USelect/USelectMenu components have no width constraints
   - Mixed usage of USelect vs USelectMenu

### Nuxt UI v4 Component Patterns

The project uses Nuxt UI v4 (`@nuxt/ui@next`). Key components:
- `UInput` - text inputs
- `USelect` / `USelectMenu` - dropdowns (USelectMenu for searchable)
- `UTextarea` - multiline text
- `UFormField` - wrapper with label/hint
- `UCheckbox` - boolean toggles

These components inherit width from their container by default.

---

## Industry Best Practices Research

### Core Principle: Match Width to Expected Input Length

The fundamental UX principle from multiple sources (Baymard Institute, Nielsen Norman Group, Apple HIG) is that **input field width should communicate the expected input length**. When users see a field's width, they subconsciously gauge how much information to provide.

> "Text fields should be about the same size as the expected input since it's extremely error prone when users can't see their full entry." — [Nielsen Norman Group](https://www.nngroup.com/articles/web-form-design/)

> "The size of the input communicates the length of the content needed. An arbitrary length confuses the user on what is required." — [UXPin](https://www.uxpin.com/studio/blog/form-input-design-best-practices/)

### Three Categories of Input Length (Baymard Institute)

[Baymard Institute research](https://baymard.com/blog/form-field-usability-matching-user-expectations) identifies three input categories:

| Category | Description | Approach |
|----------|-------------|----------|
| **Fixed Length** | Known exact length (ZIP code, birth year, CVV) | Match width exactly to character count |
| **Variable with Normal Average** | Variable but predictable range (name, email, city) | Use consistent "comfortable" width |
| **Outliers** | Unusually short or long expected input | Custom width based on specific needs |

### Recommended Character Widths by Field Type

Based on research from multiple sources:

| Field Type | Expected Characters | Recommended Width |
|------------|---------------------|-------------------|
| **Email** | ~25 chars average (18-33 range) | 30-35 characters |
| **Name (first/last)** | ~15-20 chars | 25-30 characters |
| **Full Name** | ~25-30 chars | 35 characters |
| **City** | 3-22 chars (99.9% ≤19) | 20-25 characters |
| **Address Line** | 30-46 chars (varies by carrier) | 35-40 characters |
| **ZIP/Postal Code** | 5-10 chars | 10-12 characters |
| **Phone** | 10-15 chars (with formatting) | 15-18 characters |
| **SKU/Product Code** | 6-15 chars typically | 15-20 characters |
| **Currency Code** | 3 chars (ISO) | 4-5 characters |
| **Percentage** | 1-6 chars (0-100.00) | 6-8 characters |
| **Price/Amount** | 6-12 chars (with decimals) | 12-15 characters |
| **Description** | Variable, long | Full width |

### CSS `ch` Unit for Character-Based Sizing

The CSS `ch` unit represents the width of the "0" character in the current font:

```css
/* Example: 25-character email field */
input[type="email"] { width: 30ch; }

/* Practical rule: Add ~20% for breathing room */
input.zip-code { width: 12ch; } /* For 5-10 char ZIP codes */
```

**Caveat**: The `ch` unit works best with monospace fonts. For proportional fonts (like most UI fonts), the actual character capacity varies. A common guideline: aim for ~60ch to get 80 characters of capacity with proportional fonts.

### Tailwind CSS Width Equivalents

Mapping character widths to Tailwind classes (assuming ~16px base font):

| Characters | Approx. rem | Tailwind Class | Use Case |
|------------|-------------|----------------|----------|
| 4-6 chars | 4rem | `w-16` | Short codes, percentages |
| 8-10 chars | 6rem | `w-24` | ZIP code, quantity |
| 12-15 chars | 8rem | `w-32` | Phone, small numeric |
| 18-22 chars | 12rem | `w-48` | SKU, medium text |
| 25-30 chars | 16rem | `w-64` | Email, name |
| 35-40 chars | 20rem | `w-80` | Address, long text |
| Full | 100% | `w-full` | Description, notes |

### Design System Approaches

**Bootstrap 5**: Uses three height sizes (sm, default, lg) with width controlled by grid or utilities (`w-25`, `w-50`, `w-75`, `w-100`).

**Material Design**: Specifies heights (56dp standard, dense for crowded forms) but leaves width to context. Recommends full-width for "in-depth tasks."

**Ant Design**: Default InputNumber is 80px; recommends explicit `style={{ width: X }}` for custom sizing.

**Shopify Polaris**: Acknowledges full-width defaults are problematic for short inputs; auto-size option available but limited width control.

**Apple HIG**: "Match the size of a text field to the quantity of anticipated text. Stack multiple text fields vertically when possible, and use consistent widths."

### Form Layout Best Practices

1. **Single Column Preferred**: "Inputs should be arranged into a single column so users can read the form in a straight line down the page." — [Andrew Coyle](https://coyleandrew.medium.com/design-better-input-fields-3d02985a8e24)

2. **Avoid Excessive Multi-Column**: Baymard found 16% of sites use extensive multi-column forms, causing abandonment due to field confusion.

3. **Group Related Fields**: Two-column layouts acceptable for tightly related fields (First Name / Last Name, Start Date / End Date).

4. **Responsive Stacking**: Use `grid-cols-1 sm:grid-cols-2` to stack on mobile, side-by-side on larger screens.

### Modal Form Sizing

Common practices for modal widths:
- **Narrow (simple forms)**: 400-450px
- **Medium (standard forms)**: 500-550px
- **Wide (complex forms/tables)**: 600-700px

### Key Takeaways for This Project

1. **Don't use arbitrary widths** — every width should map to expected character count
2. **Be slightly generous** — better to have a bit more room than too little
3. **Maintain visual consistency** — use a small set of standard widths
4. **Full width is the exception** — only for truly variable-length content (descriptions, notes)
5. **Use responsive patterns** — stack on mobile, side-by-side where appropriate on desktop
