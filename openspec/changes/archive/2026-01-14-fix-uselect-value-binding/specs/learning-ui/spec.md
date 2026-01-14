## ADDED Requirements

### Requirement: USelect Value Binding Pattern
All USelect components using object-based items SHALL include the `value-key` prop to ensure correct model binding.

#### Scenario: USelect with object items
- **WHEN** a USelect component uses items in `{ label: string, value: any }` format
- **THEN** the component MUST include `value-key="value"`
- **AND** the v-model will bind only the `value` property, not the entire object

#### Scenario: USelect with primitive items
- **WHEN** a USelect component uses items as primitive strings or numbers
- **THEN** the `value-key` prop is not required
- **AND** the v-model binds the primitive value directly

#### Scenario: Optional/nullable select field
- **WHEN** a select field allows "no selection" or "use default"
- **THEN** include a first option with an empty value: `{ label: 'None' | 'Use default', value: null | '' }`
- **AND** the form handles `null` or empty string appropriately on submission
