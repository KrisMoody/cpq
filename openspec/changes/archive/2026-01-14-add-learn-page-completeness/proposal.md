# Change: Complete Learn Page with Auto-Generated ERD and Missing Feature Documentation

## Why
The learn page documents CPQ concepts but is missing documentation for several implemented features (Tax Rates, Contracts, Units of Measure, Product Attributes, Multi-Currency, Subscriptions/Recurring Revenue). Additionally, the current ER diagram is manually maintained and may drift from the actual schema. Auto-generating the ERD from Prisma schema ensures accuracy and reduces maintenance burden.

## What Changes
1. **Review existing content** - Audit all current glossary terms, diagrams, and quick tips against the actual codebase to ensure accuracy
2. **Add prisma-erd-generator** - Install and configure `prisma-erd-generator` to auto-generate an SVG diagram on each `prisma generate`
3. **Display auto-generated ERD** - Add a new visualization tab on the learn page showing the auto-generated Prisma ERD
4. **Add missing glossary terms** - Document all implemented features:
   - Tax Management (Tax Rate, Tax Exemption)
   - Contracts (Contract, Contract Price Entry, Contract Status)
   - Units of Measure (Unit of Measure, Unit Conversion)
   - Product Attributes (Attribute, Attribute Group, Attribute Type)
   - Multi-Currency (Currency, Exchange Rate, Base Currency)
   - Subscriptions/Recurring (Billing Frequency, MRR, ARR, TCV, Proration)
5. **Add missing quick tips** - Tips for tax management, contracts, subscriptions, and attributes
6. **Fix any outdated content** - Update or remove any glossary terms, examples, or diagrams that no longer match the implementation

## Impact
- Affected specs: `learning-ui`, `tooling`
- Affected code:
  - `prisma/schema.prisma` (add generator)
  - `package.json` (add dependencies)
  - `app/pages/learn.vue` (add ERD tab, new glossary terms)
  - `app/components/learn/` (new PrismaERD component)
