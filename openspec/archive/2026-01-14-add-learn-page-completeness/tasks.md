## 1. Review Existing Learn Page Content
- [x] 1.1 Audit existing glossary terms against Prisma schema - verify all field names, relationships, and enum values are accurate
- [x] 1.2 Review CPQ Flow Diagram - verify quote status workflow matches `QuoteStatus` enum (DRAFT, PENDING, PENDING_APPROVAL, APPROVED, REJECTED, ACCEPTED, FINALIZED, CANCELLED)
- [x] 1.3 Review Entity Relationship Diagram - verify all entities shown exist and relationships are correct
- [x] 1.4 Review Entity Hierarchy Tree - verify parent-child relationships match actual schema
- [x] 1.5 Review Quick Tips - verify advice is still accurate with current implementation
- [x] 1.6 Review glossary examples - verify concrete values (prices, names, SKUs) are consistent and realistic
- [x] 1.7 Fix any inaccuracies found during audit

## 2. Prisma ERD Generator Setup
- [x] 2.1 Install dependencies: `prisma-erd-generator`, `@mermaid-js/mermaid-cli`
- [x] 2.2 Add ERD generator block to `prisma/schema.prisma` with output to `public/prisma-erd.svg`
- [x] 2.3 Run `prisma generate` and verify SVG is created
- [x] 2.4 Add `.gitignore` entry for generated ERD (optional - or commit it)

## 3. Learn Page ERD Visualization
- [x] 3.1 Create `app/components/learn/PrismaERD.vue` component to display the generated SVG
- [x] 3.2 Add "Database Schema" tab to the Data Model section on learn page
- [x] 3.3 Verify ERD displays correctly and is responsive

## 4. Tax Management Glossary Terms
- [x] 4.1 Add "Tax Terms" group to glossary
- [x] 4.2 Add Tax Rate term with definition and example
- [x] 4.3 Add Tax Exemption term explaining customer exemptions

## 5. Contract Glossary Terms
- [x] 5.1 Add "Contract Terms" group to glossary
- [x] 5.2 Add Contract term with status workflow explanation
- [x] 5.3 Add Contract Price Entry term explaining fixed pricing
- [x] 5.4 Add Contract Status term (DRAFT, ACTIVE, EXPIRED)

## 6. Unit of Measure Glossary Terms
- [x] 6.1 Add Unit of Measure term to Product Terms group
- [x] 6.2 Add Unit Conversion term explaining base units and conversion factors

## 7. Product Attributes Glossary Terms
- [x] 7.1 Add "Attribute Terms" group to glossary
- [x] 7.2 Add Attribute term with type explanations (TEXT, NUMBER, BOOLEAN, SELECT, DATE)
- [x] 7.3 Add Attribute Group term for organization
- [x] 7.4 Add Product Attribute term explaining the junction

## 8. Multi-Currency Glossary Terms
- [x] 8.1 Add "Currency Terms" group to glossary
- [x] 8.2 Add Currency term explaining ISO codes and symbols
- [x] 8.3 Add Exchange Rate term with effective date concept
- [x] 8.4 Add Base Currency term for reporting

## 9. Subscription/Recurring Revenue Glossary Terms
- [x] 9.1 Add Billing Frequency term to Pricing Terms group
- [x] 9.2 Add MRR (Monthly Recurring Revenue) term to Quote Terms group
- [x] 9.3 Add ARR (Annual Recurring Revenue) term to Quote Terms group
- [x] 9.4 Add TCV (Total Contract Value) term to Quote Terms group
- [x] 9.5 Add Proration term explaining mid-period starts

## 10. Quick Tips Updates
- [x] 10.1 Add tax management quick tip
- [x] 10.2 Add contract pricing quick tip
- [x] 10.3 Add multi-currency quick tip
- [x] 10.4 Add subscription/recurring revenue quick tip

## 11. Validation
- [x] 11.1 Verify all new terms appear in glossary with proper grouping
- [x] 11.2 Verify ERD tab displays auto-generated diagram
- [x] 11.3 Verify search works with new terms
- [x] 11.4 Verify comparison mode works with new terms
- [x] 11.5 Verify all existing content still renders correctly after changes
