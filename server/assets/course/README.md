# CPQ Interactive Course

Learn Configure, Price, Quote (CPQ) from fundamentals to advanced concepts using this hands-on course. Each module combines industry theory, data model deep-dives, and practical exercises using the CPQ PoC application.

## Prerequisites

- Basic understanding of relational databases
- Familiarity with web applications
- The CPQ PoC app running locally (`npm run dev`)

## Course Structure

| Module | Title | Level | Focus |
|--------|-------|-------|-------|
| [00](00-introduction.md) | Introduction to CPQ | Beginner | Industry context |
| [01](01-cpq-foundations.md) | CPQ Foundations | Beginner | Core workflow |
| [02](02-product-catalog.md) | Product Catalog | Beginner | Products & bundles |
| [03](03-attribute-system.md) | Attribute System | Beginner-Intermediate | Flexible metadata |
| [04](04-price-books.md) | Price Books | Intermediate | Pricing architecture |
| [05](05-customers-contracts.md) | Customers & Contracts | Intermediate | B2B relationships |
| [06](06-quote-building.md) | Quote Building | Intermediate | Line items & totals |
| [07](07-discounts.md) | Discounts | Intermediate-Advanced | Promotion engine |
| [08](08-rules-engine.md) | Rules Engine | Advanced | Business logic |
| [09](09-tax-management.md) | Tax Management | Intermediate | Multi-jurisdiction |
| [10](10-multi-currency.md) | Multi-Currency | Intermediate-Advanced | Global pricing |
| [11](11-guided-selling.md) | Guided Selling | Advanced | Recommendations |
| [12](12-architecture.md) | Architecture | Advanced | Integration patterns |
| [13](13-capstone.md) | Capstone Project | Advanced | Apply all concepts |

## Appendices

- [Data Models Reference](appendix-data-models.md) - Complete entity documentation
- [CPQ Glossary](appendix-glossary.md) - Terminology definitions

## How to Use This Course

### 1. Read the Theory
Each module starts with business context explaining *why* the capability exists and how it's used in real-world CPQ implementations.

### 2. Study the Data Models
Understand the database entities, their relationships, and how they map to CPQ concepts. Mermaid diagrams visualize entity relationships.

### 3. Complete the Exercises
Step-by-step hands-on exercises using the PoC app. Have the app running alongside the documentation.

### 4. Check Your Understanding
Each module ends with checkpoint questions to verify comprehension before moving on.

## Estimated Time

- **Total course:** 40-50 hours
- **Per module:** 2-4 hours (theory + exercises)
- **Capstone:** 8-10 hours

## Getting Started

1. Ensure the PoC app is running: `npm run dev`
2. Open the app at `http://localhost:3000`
3. Start with [Module 00: Introduction to CPQ](00-introduction.md)

---

## Quick Reference

### PoC App Pages for Exercises

| Page | URL | Used In |
|------|-----|---------|
| Products | `/products` | Module 02, 03 |
| Categories | `/categories` | Module 02 |
| Attributes | `/attributes` | Module 03 |
| Price Books | `/price-books` | Module 04 |
| Customers | `/customers` | Module 05 |
| Contracts | `/contracts` | Module 05 |
| Quotes | `/quotes` | Module 01, 06 |
| Discounts | `/discounts` | Module 07 |
| Rules | `/rules` | Module 08 |
| Tax Rates | `/tax-rates` | Module 09 |
| Currencies | `/currencies` | Module 10 |
| Affinities | `/affinities` | Module 11 |
| Questionnaires | `/questionnaires` | Module 11 |
| Quote Layouts | `/quote-layouts` | Module 12 |

### Key Source Files

| File | Description |
|------|-------------|
| `prisma/schema.prisma` | All data model definitions |
| `app/composables/useQuotes.ts` | Quote management logic |
| `app/types/domain.ts` | Core domain types |
| `server/services/` | Backend business logic |
