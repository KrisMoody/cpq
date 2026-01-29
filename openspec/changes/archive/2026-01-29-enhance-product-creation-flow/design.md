# Design: Enhanced Product Creation Flow

## Context

The CPQ system has well-defined entities for categories, attributes, attribute groups, bundle features, options, and products with proper relationships in the database schema. However, the product creation UI only captures basic product information. Users must navigate to separate pages to:
1. Assign products to categories (only possible from the category detail page)
2. Set attribute values (only possible from the product detail page after creation)
3. Configure bundle features and options (only possible from product detail page in edit mode)

This fragmented workflow:
- Increases incomplete product data
- Requires users to navigate multiple pages for full product setup
- Doesn't leverage the category-attribute relationship
- Forces an extra save cycle for bundle products before features can be added

## Goals / Non-Goals

### Goals
- Enable category selection during product creation
- Enable attribute value entry during product creation
- Enable bundle feature/option configuration during product creation
- Show category-suggested attributes prominently
- Maintain backward compatibility (all new fields remain optional)
- Add category management to product detail page

### Non-Goals
- Creating new categories from the product form (use existing categories page)
- Creating new attributes from the product form (use existing attributes page)
- Creating new option products from the bundle editor (use existing products)
- Mandatory category/attribute assignment (keep optional for quick product creation)
- Changing existing attribute group/category management flows

## Decisions

### 1. Single Page Form vs Multi-Step Wizard

**Decision:** Keep single-page form with expandable/collapsible sections

**Rationale:**
- Consistent with existing create forms (quote, category, attribute)
- Allows quick product creation by skipping optional sections
- Categories, attributes, and features are additive, not blocking steps
- Multi-step wizards can feel heavy for simple standalone products

**Alternatives Considered:**
- *Multi-step wizard*: More guided but adds friction for power users and simple products
- *Tabbed interface*: Hides information and adds navigation overhead

### 2. Category Selection Component

**Decision:** Use a multi-select dropdown with hierarchical display

**Implementation:**
- Display categories with indentation showing hierarchy
- Allow selecting multiple categories
- Show selected categories as chips/badges
- Fetch categories on component mount using existing `useCategories` composable

**Rationale:**
- Products can belong to multiple categories (existing schema supports this)
- Hierarchical display helps users understand category structure
- Consistent with category parent selector pattern already in codebase

### 3. Attribute Section Behavior

**Decision:** Dynamic attribute section that responds to category selection

**Behavior:**
1. Initially collapsed or shows "No categories selected - select categories to see suggested attributes"
2. When categories selected, shows:
   - "Suggested Attributes" subsection with attributes from selected categories
   - "All Attributes" expandable section for remaining attributes
3. Suggested attributes have visual indicator (badge/icon)
4. All attribute inputs use existing `CpqAttributeInput` component

**Rationale:**
- Leverages existing CategoryAttribute relationship
- Guides users to fill relevant attributes without hiding others
- Non-blocking - users can skip attributes entirely

### 4. Bundle Features Section

**Decision:** Inline feature/option editor shown conditionally when type=BUNDLE

**Implementation:**
- Section appears when user selects BUNDLE type
- Uses same UI patterns as product detail page editor but in create context
- Features can be added/edited/deleted before product save
- Options can be added to features, selecting from existing standalone products
- Drag-and-drop reordering supported (stored in local state until save)
- All features/options saved atomically with product creation

**Behavior:**
```
[+ Add Feature] button

Feature 1: "Storage Options"
├── Min: 1, Max: 1
├── Options:
│   ├── SSD 256GB [Default] [x delete]
│   ├── SSD 512GB [x delete]
│   └── [+ Add Option]
├── [Edit] [Delete]
└── [Drag handle for reorder]

Feature 2: "Memory"
├── ...
```

**Rationale:**
- Bundle products are incomplete without features
- Current flow requires save → navigate → enter edit mode → add features
- Inline editor provides immediate configuration ability
- Consistent UI with the edit mode version

### 5. Section Order in Create Form

**Decision:**
1. Basic Information (name, SKU, description)
2. Product Type (STANDALONE/BUNDLE)
3. Bundle Features (conditional - only if type=BUNDLE)
4. Categories
5. Attributes (contextual to categories)
6. Billing & Pricing

**Rationale:**
- Type selection must come early as it determines if features section shows
- Features are core to bundle identity, should come right after type
- Categories influence which attributes are suggested, so must come before attributes
- Billing/pricing is about commerce, separate from catalog metadata

### 6. API Changes

**Decision:** Extend POST /api/products to accept all associations

**Request shape addition:**
```typescript
{
  // existing fields...
  categoryIds?: string[]           // Array of category IDs
  attributes?: Array<{
    attributeId: string
    value: AttributeValue
  }>
  features?: Array<{               // Only for BUNDLE type
    name: string
    minOptions?: number
    maxOptions?: number
    sortOrder?: number
    options?: Array<{
      optionProductId: string
      isRequired?: boolean
      isDefault?: boolean
      minQty?: number
      maxQty?: number
      sortOrder?: number
    }>
  }>
}
```

**Server Implementation:**
- Validate that features are only provided for BUNDLE type
- Validate that option products exist and are STANDALONE
- Create product, then categories, attributes, features, and options in transaction
- Return full product with all associations

**Rationale:**
- Single atomic operation creates product with all associations
- Backward compatible - existing clients work without changes
- Reduces roundtrips compared to create-then-update pattern

### 7. Product Detail Page Changes

**Decision:** Add Categories section similar to existing Attributes section

**Implementation:**
- Add "Categories" card showing assigned categories with hierarchy path
- Add "Edit Categories" button opening modal with category selector
- Reuse `CpqCategorySelector` component from create flow
- API: Add PUT /api/products/:id/categories endpoint

## Risks / Trade-offs

### Risk: Form becomes too long
**Mitigation:**
- All new sections are collapsible
- Bundle features section only shows for BUNDLE type
- Sections show compact state when empty
- Progressive disclosure pattern throughout

### Risk: Performance with many categories/attributes
**Mitigation:**
- Categories already loaded efficiently with hierarchy
- Attributes already loaded with groups
- Products for option selection already loaded by useProducts
- Consider virtualization if lists exceed 100+ items (unlikely in POC)

### Risk: Complex bundle configuration before save
**Mitigation:**
- Local state management for features/options before save
- Clear validation feedback if configuration invalid
- Features/options are optional - can save bundle without and add later

### Trade-off: Optional vs Required Categories
**Decision:** Keep optional
**Trade-off:** Some products may lack categorization, but forcing it would slow down quick product creation. Business rules can enforce this via validation if needed later.

### Trade-off: Feature editor complexity in create form
**Decision:** Include full editor
**Trade-off:** Creates larger form, but benefits outweigh cost:
- Bundle products need features to be useful
- Single-flow creation is significantly better UX
- Same component can be reused from detail page

## Component Structure

```
products/new.vue
├── Basic Info Section
├── Product Type Section
├── Bundle Features Section (NEW, conditional)
│   └── CpqBundleFeaturesEditor (NEW - inline editor)
│       ├── Feature list with CRUD
│       └── Option list per feature with CRUD
├── Categories Section (NEW)
│   └── CpqCategorySelector (NEW - multi-select with hierarchy)
├── Attributes Section (NEW)
│   ├── Suggested Attributes (from categories)
│   │   └── CpqAttributeInput (existing)
│   └── All Attributes (expandable)
│       └── CpqAttributeInput (existing)
└── Billing & Pricing Section

products/[id].vue
├── ... existing sections ...
├── Categories Section (NEW)
│   └── CpqCategorySelector (reused)
├── Attributes Section (existing, enhanced)
│   └── Now shows category-suggested attributes prominently
└── Bundle Features Section (existing)
    └── Could share CpqBundleFeaturesEditor component
```

## New Components

### CpqCategorySelector
- Props: `modelValue: string[]` (selected category IDs), `placeholder`
- Emits: `update:modelValue`
- Features:
  - Fetches categories tree
  - Displays hierarchical multi-select
  - Shows selected as removable chips
  - Emits array of selected category IDs

### CpqBundleFeaturesEditor
- Props: `modelValue: Feature[]` (local feature state)
- Emits: `update:modelValue`
- Features:
  - Add/edit/delete features inline
  - Add/edit/delete options per feature
  - Drag-and-drop reordering
  - Product selector for options (filters to active STANDALONE products)
  - Works with local state (no API calls until parent form submits)

## Open Questions

1. **Should category-suggested attributes be pre-expanded?**
   Recommendation: Yes, if categories are selected, show suggested attributes expanded

2. **Should we show attribute count per category in selector?**
   Recommendation: Nice-to-have, not required for initial implementation

3. **Should removing a category clear its suggested attribute values?**
   Recommendation: No, preserve entered values. User explicitly set them.

4. **Should bundle features be collapsible by default?**
   Recommendation: Expanded by default since user chose BUNDLE type intentionally

5. **Maximum features/options limit in create flow?**
   Recommendation: No artificial limit, but show warning if > 10 features
