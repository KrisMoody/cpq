# Tasks: Fix CPQ Glossary Validation Issues

## 1. Add SKU Glossary Term

- [x] 1.1 Add SKU term to glossaryTerms array in app/pages/learn.vue
- [x] 1.2 Place after Product term in product group
- [x] 1.3 Include definition, example, relatedTerms, confusedWith, and distinction

## 2. Add Naming Conventions Quick Tip

- [x] 2.1 Add new Quick Tip in app/pages/learn.vue Quick Tips section
- [x] 2.2 Explain Prisma enum naming (SCREAMING_CASE) vs JavaScript field naming (camelCase)
- [x] 2.3 Use code-bracket icon to indicate technical content

## 3. Update Learning UI Spec

- [x] 3.1 Create delta spec for learning-ui capability
- [x] 3.2 Add SKU to Glossary Terms requirement under Product Group

## 4. Expand customerName Migration Task

- [x] 4.1 Update add-cpq-features/tasks.md task 8.1 with detailed subtasks
- [x] 4.2 List all API endpoints that need updating
- [x] 4.3 List all frontend files that need updating
- [x] 4.4 Include Prisma migration step

## 5. Validation

- [x] 5.1 Run openspec validate fix-glossary-validation-issues --strict
- [x] 5.2 Verify no validation errors
