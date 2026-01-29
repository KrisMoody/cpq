## ADDED Requirements

### Requirement: GetAccept color palette

The system SHALL define a custom color scale (`ga-gray`) with shades 50-950 that replicate GetAccept's fried-tofu gray palette, using base-blue (#2c3b4e) as the darkest shade.

#### Scenario: Gray scale available in Tailwind

- **WHEN** a developer uses `text-ga-gray-950` or `bg-ga-gray-200` classes
- **THEN** the elements render with the corresponding GetAccept gray colors

#### Scenario: Color tokens defined in CSS

- **WHEN** the application loads
- **THEN** CSS variables `--color-ga-gray-50` through `--color-ga-gray-950` are available in the `:root` scope

### Requirement: Semantic color mapping

The system SHALL map Nuxt UI's semantic colors to GetAccept equivalents: primary (navy), secondary (blue), success (green), error (red), warning (yellow), neutral (gray).

#### Scenario: Primary buttons use navy

- **WHEN** a `<UButton>` component renders with default/primary variant
- **THEN** the button background is navy (#2c3b4e) with light text

#### Scenario: Error states use GetAccept red

- **WHEN** a component displays an error state (e.g., `<UAlert color="error">`)
- **THEN** the component uses GetAccept's red-42 (#cb2e0b) for dark elements and red-95 (#feebe7) for light backgrounds

### Requirement: Inter font family

The system SHALL load and apply the Inter font family as the default body font throughout the application.

#### Scenario: Inter font loads on page load

- **WHEN** the application loads
- **THEN** the Inter font is loaded from Google Fonts CDN

#### Scenario: Body text uses Inter

- **WHEN** text renders in the application
- **THEN** the font-family is Inter with system fonts as fallback

### Requirement: GetAccept spacing scale

The system SHALL use GetAccept's spacing scale (4/8/12/16/24/32px) mapped to Tailwind's spacing utilities.

#### Scenario: Spacing tokens available

- **WHEN** a developer uses spacing classes like `p-4` or `gap-6`
- **THEN** the spacing aligns with GetAccept's scale (--spacing-100 = 16px, --spacing-150 = 24px)

### Requirement: GetAccept border radius

The system SHALL override Tailwind's border radius scale with GetAccept values: small (4px), medium (8px), large (20px).

#### Scenario: Cards use medium radius

- **WHEN** a `<UCard>` component renders
- **THEN** the border radius is 8px (--radius-md)

#### Scenario: Buttons use medium radius

- **WHEN** a `<UButton>` component renders
- **THEN** the border radius is 8px (--radius-md)

### Requirement: GetAccept shadow system

The system SHALL use GetAccept's shadow system with base-blue tinted shadows at 20% opacity.

#### Scenario: Shadow utilities use GetAccept values

- **WHEN** a developer applies `shadow-sm`, `shadow-md`, or `shadow-lg` classes
- **THEN** the shadow color uses rgb(44 59 78 / 20%) instead of neutral black

#### Scenario: Cards have subtle shadow

- **WHEN** a `<UCard>` component renders
- **THEN** the shadow matches GetAccept's shadow-1 (0 1px 4px)

### Requirement: Consistent component styling

All Vue components and pages SHALL use GetAccept design tokens instead of generic Tailwind utilities.

#### Scenario: Text uses GetAccept gray scale

- **WHEN** muted or secondary text renders in any component
- **THEN** the color is from the ga-gray scale (e.g., ga-gray-700 for muted text) not Tailwind's default gray

#### Scenario: Backgrounds use GetAccept colors

- **WHEN** components render with muted backgrounds
- **THEN** the background uses ga-gray-100 or ga-gray-200, not Tailwind slate/gray defaults

#### Scenario: Borders use GetAccept colors

- **WHEN** components render with visible borders
- **THEN** the border color is from the ga-gray scale (e.g., ga-gray-400)

### Requirement: Button loading states

Buttons SHALL display a spinner when in loading state, consistent with GetAccept's button behavior.

#### Scenario: Loading button shows spinner

- **WHEN** a `<UButton>` has `loading="true"`
- **THEN** the button displays a spinner and the text is visually hidden but accessible

#### Scenario: Loading button is disabled

- **WHEN** a `<UButton>` has `loading="true"`
- **THEN** the button is not clickable
