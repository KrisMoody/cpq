# Design: Learn Sidebar Navigation

## Navigation Structure

The sidebar will have Learn as a top-level section with all learning content as children:

```
Dashboard
─────────────────
Sales
  Quotes
  Customers
  Contracts
─────────────────
Admin
  Catalog ▾
    Products
    Categories
    ...
  Configuration ▾
    Rules
    ...
─────────────────
Learn
  Course
  Workflow
  Data Model
  Business Logic
  Formulas
  Example
  Glossary
  Enums
  Relationships
  Quiz
  Tips
```

## Route Structure

| Route | Purpose |
|-------|---------|
| `/learn` | Learn overview/redirect |
| `/learn/course` | Course module list |
| `/learn/course/[moduleId]` | Individual module view |
| `/learn/workflow` | Workflow diagram section |
| `/learn/data-model` | Data model / ER diagrams |
| `/learn/business-logic` | Business logic section |
| `/learn/formulas` | Formula reference |
| `/learn/example` | Worked example |
| `/learn/glossary` | Glossary terms |
| `/learn/enums` | Enum reference |
| `/learn/relationships` | Relationship cards |
| `/learn/quiz` | Quiz section |
| `/learn/tips` | Quick tips |

## Breadcrumb Enhancement

To show module titles in breadcrumbs, extend the breadcrumb system to read custom labels from route meta:

```typescript
// In [moduleId].vue
definePageMeta({
  breadcrumbLabel: () => {
    // Dynamic label from module data
  }
})

// In useBreadcrumbs.ts
// Check route.meta.breadcrumbLabel for custom labels
```

Alternative: Use `useState` to set a breadcrumb override that the composable reads.

## Section Page Architecture

Each section route (`/learn/[section]`) renders the appropriate component:

```vue
<!-- app/pages/learn/[section].vue -->
<template>
  <component :is="sectionComponent" />
</template>

<script setup>
const route = useRoute()
const sectionComponents = {
  'workflow': resolveComponent('LearnCPQFlowDiagram'),
  'data-model': resolveComponent('LearnDataModel'),
  'glossary': resolveComponent('LearnGlossary'),
  // ...
}
const sectionComponent = computed(() =>
  sectionComponents[route.params.section]
)
</script>
```

## Migration Strategy

1. **Keep existing components**: LearnCPQFlowDiagram, LearnERDiagram, LearnGlossary, etc. remain unchanged
2. **Extract section content**: Move glossary data and section-specific logic from learn/index.vue into dedicated components or pages
3. **Simplify index**: The main learn page becomes a landing/overview that redirects to Course or shows a summary
