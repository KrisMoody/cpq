## Context

CPQ uses Nuxt UI v4 with Tailwind CSS v4 for styling. The current theme uses default colors (green primary, slate neutral) which don't match GetAccept's visual identity.

GetAccept's design system (fried-tofu) uses:
- **Colors**: Base blue (#2c3b4e), gray scale (gray-23 to gray-99), brand orange gradient, semantic colors
- **Typography**: Inter for body, DM Sans for branding headings
- **Spacing**: 4/8/12/16/24/32px scale (--spacing-25 to --spacing-200)
- **Border radius**: 4px (small), 8px (medium), 20px (large)
- **Shadows**: Soft shadows using base-blue at 20% opacity

fried-tofu is a private package and cannot be imported directly. We must replicate its design tokens within Nuxt UI's theming system.

## Goals / Non-Goals

**Goals:**
- Replicate GetAccept's visual identity using Nuxt UI v4's theming capabilities
- Create a maintainable design token system that can evolve with GetAccept's design
- Update all existing components and pages to use the new theme consistently
- Match key component behaviors (button states, input styling, card shadows)

**Non-Goals:**
- Dark mode support (GetAccept app is light-mode only)
- Pixel-perfect match with fried-tofu (aim for visual consistency, not exact replication)
- Importing or bundling fried-tofu package
- Creating custom Vue components to replace Nuxt UI components

## Decisions

### 1. Design Token Architecture

**Decision**: Use Tailwind CSS v4's `@theme static` directive in `main.css` to define custom color scales, then map to Nuxt UI semantic colors in `app.config.ts`.

**Rationale**: This is Nuxt UI v4's recommended approach. Keeps tokens in CSS (inspectable, standard) while allowing Nuxt UI components to use semantic names.

**Alternatives considered**:
- CSS custom properties only → Wouldn't integrate with Nuxt UI's color system
- JavaScript theme config → Less standard, harder to inspect/debug

### 2. Color Scale Mapping

**Decision**: Create a `ga-gray` color scale (50-950) mapped from fried-tofu's gray values:

| Tailwind | fried-tofu | Hex |
|----------|------------|-----|
| 50 | gray-99 | #fbfcfd |
| 100 | gray-98 | #f8fafc |
| 200 | gray-96 | #f1f4f9 |
| 300 | gray-94 | #ebeff5 |
| 400 | gray-92 | #e4eaf1 |
| 500 | gray-80 | #bccadc |
| 600 | gray-60 | #8195b0 |
| 700 | gray-49 | #617998 |
| 800 | gray-39 | #4b607c |
| 900 | gray-30 | #374a62 |
| 950 | base-blue | #2c3b4e |

**Rationale**: Maps fried-tofu's semantic naming (gray-XX where XX is lightness) to Tailwind's 50-950 scale that Nuxt UI expects.

### 3. Semantic Color Assignment

**Decision**: Map semantic colors as follows:
- `primary` → `ga-gray` (navy buttons, primary actions)
- `secondary` → `ga-blue` (links, secondary actions)
- `neutral` → `ga-gray` (borders, backgrounds)
- `error` → `ga-red` (from red-42, red-95)
- `success` → `ga-green` (from green-25, green-95)
- `warning` → `ga-yellow` (from yellow-66, yellow-95)

**Rationale**: GetAccept uses dark navy for primary buttons (not brand orange), matching the fried-tofu `ga-primary` button type.

### 4. Font Loading

**Decision**: Load Inter via Google Fonts CDN in `nuxt.config.ts` using the `@nuxtjs/google-fonts` module or direct link injection.

**Rationale**: Simpler than self-hosting, good performance via Google's CDN. Inter is the standard body font for GetAccept.

**Alternatives considered**:
- Self-hosted fonts → More setup, marginal benefit for internal tool
- DM Sans for headings → Adds complexity, Inter-only is sufficient for CPQ

### 5. Component Utility Class Migration

**Decision**: Replace Tailwind gray utilities systematically:
- `text-gray-900` → `text-ga-gray-950`
- `text-gray-500` → `text-ga-gray-700`
- `bg-gray-50` → `bg-ga-gray-100`
- `border-gray-200` → `border-ga-gray-400`
- etc.

Use semantic classes where possible: `text-muted`, `bg-muted` which pick up theme values.

**Rationale**: Systematic replacement ensures consistency. Semantic classes reduce future migration effort.

### 6. Shadow System

**Decision**: Override Tailwind's shadow scale with GetAccept values:
```css
--shadow-sm: 0 1px 4px rgb(44 59 78 / 20%);   /* shadow-1 */
--shadow-md: 0 3px 12px rgb(44 59 78 / 20%);  /* shadow-3 */
--shadow-lg: 0 5px 20px rgb(44 59 78 / 20%);  /* shadow-5 */
```

**Rationale**: GetAccept shadows use base-blue tint (rgb(44 59 78)) rather than neutral black, giving a warmer feel.

### 7. Border Radius

**Decision**: Override Tailwind radius scale:
```css
--radius-sm: 4px;   /* GA small */
--radius-md: 8px;   /* GA medium */
--radius-lg: 20px;  /* GA large */
```

**Rationale**: Direct mapping from fried-tofu's radius tokens.

## Risks / Trade-offs

**[Risk] Large file count (136 files) increases chance of inconsistency**
→ Mitigation: Process files systematically by directory. Create a utility class mapping reference. Review in batches.

**[Risk] Nuxt UI component internals may not respect all theme overrides**
→ Mitigation: Test critical components (Button, Input, Card, Modal) early. Use `app.config.ts` component overrides for any gaps.

**[Risk] Future fried-tofu updates may drift from our tokens**
→ Mitigation: Document token sources clearly. This is acceptable since CPQ will eventually integrate into app.site where fried-tofu is used directly.

**[Trade-off] No dark mode**
→ Acceptable: GetAccept app is light-only. Simplifies implementation. Can add later if needed.

**[Trade-off] Inter only (no DM Sans for headings)**
→ Acceptable: Reduces font loading. GetAccept branding headings are less critical for CPQ admin UI.
