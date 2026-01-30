## Why

CPQ currently uses default Nuxt UI styling with generic Tailwind colors. For eventual integration into GetAccept's app.site as a module, the UI needs to align with GetAccept's visual identity. This creates a cohesive user experience and reduces friction when CPQ becomes part of the main product.

## What Changes

- **Add GetAccept design tokens**: Replicate fried-tofu's color palette (base-blue, gray scale, semantic colors), typography (Inter font), spacing scale (4/8/12/16/24/32px), border radii (4/8/20px), and box shadows
- **Configure Nuxt UI theme**: Map design tokens to Nuxt UI's semantic color system via `app.config.ts` and CSS variables in `main.css`
- **Update all Vue components**: Replace generic Tailwind utilities (e.g., `text-gray-500`) with GetAccept equivalents across 73 components
- **Update all pages**: Apply consistent theming to 60 pages
- **Add Inter font**: Load Inter font family for body text
- **Polish component behaviors**: Add loading states, transitions, and micro-interactions that match GetAccept's component library

## Capabilities

### New Capabilities

- `design-system`: Defines the GetAccept-inspired design tokens, Nuxt UI theme configuration, and styling conventions used throughout the application

### Modified Capabilities

None - this change affects visual presentation only, not functional requirements of existing capabilities.

## Impact

- **CSS/Styling**: New `@theme static` block in `main.css`, new `app.config.ts` for Nuxt UI configuration
- **All Vue files**: 136 files need utility class updates (73 components, 60 pages, 3 layouts)
- **Dependencies**: Inter font (Google Fonts or self-hosted)
- **No API changes**: Backend unaffected
- **No breaking changes**: Visual refresh only, same functionality
