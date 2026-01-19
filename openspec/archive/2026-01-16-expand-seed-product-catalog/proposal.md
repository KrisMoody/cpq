# Proposal: Expand Seed Product Catalog

## Summary
Add more diverse product types to the seed data to better demonstrate CPQ capabilities: additional standalone products, new configurable bundles, subscription tiers, usage-based products, and professional services.

## Motivation
The current seed data focuses on a narrow domain (developer workstations + DevTools software). Expanding the product catalog will:
1. Better demonstrate the variety of product types CPQ systems handle
2. Provide more realistic test scenarios for pricing, configuration, and quoting
3. Showcase different billing models (one-time, subscription, usage-based)
4. Create opportunities to test guided selling and cross-sell/upsell scenarios

## Research: Common CPQ Product Types

Based on industry research from [Salesforce CPQ](https://milomassimo.com/Salesforce-CPQ-Types-of-Products.html), [Oracle CPQ](https://cpq-integrations.com/cpq/oracle-cpq/), and [B2B SaaS pricing models](https://www.marketermilk.com/blog/saas-pricing-models):

### Product Types to Add

1. **Standalone Products** (one-time purchase)
   - Networking equipment, peripherals, office equipment
   - Consumables/supplies

2. **Subscription Products** (recurring)
   - Tiered SaaS offerings (Basic/Pro/Enterprise)
   - Per-seat licensing
   - Platform fees

3. **Usage-Based Products**
   - API calls, storage, compute hours
   - Metered services with overage pricing

4. **Bundles**
   - Static bundles (fixed contents)
   - Configurable bundles (user selects options)
   - Service + product bundles

5. **Professional Services**
   - Consulting, implementation, training
   - Managed services (recurring)

## Proposed Product Additions

### New Categories (with subcategory depth)

```
Networking (new)
├── Routers
├── Switches
└── Wireless

Security (new)
├── Security Software
└── Security Hardware

Data & Analytics (new)
├── Analytics Platforms
└── Data Services

Professional Services (new)
├── Consulting
├── Managed Services
└── Training & Enablement

Accessories (existing - add subcategories)
├── Input Devices (keyboards, mice)
├── Audio/Video (webcams, headsets)
└── Docking & Connectivity (existing: USB hubs, stands)
```

### New Standalone Products (~15 products)
- Networking: Enterprise Router, Managed Switch, Wireless Access Point
- Peripherals: Mechanical Keyboard, Ergonomic Mouse, Webcam
- Security: Hardware Security Key (2-pack)

### New Subscription Products (~10 products)
- **Security Platform** - Basic/Pro/Enterprise tiers (monthly/annual)
- **Data Analytics Suite** - Starter/Business/Enterprise (per-seat)
- **API Gateway** - Usage tiers with included calls + overage

### New Bundles (~3 bundles)
1. **Remote Worker Kit** - Static bundle (laptop stand, webcam, keyboard, mouse)
2. **Security Starter Pack** - Bundle of security products + 1yr support
3. **Enterprise Platform Bundle** - Configurable bundle of software licenses

### New Services (~5 products)
- Security Assessment (one-time)
- Managed Security Service (monthly)
- Data Migration Services (hourly)
- Custom Integration Development (project-based)
- Quarterly Business Review (recurring)

## Scope
- **In scope**: Seed data changes only (prisma/seed.ts)
- **Out of scope**: Schema changes, API changes, UI changes

## Risks
- Seed file grows larger (mitigated: well-organized sections)
- Seeding takes longer (acceptable for POC)

## Success Criteria
- Seed runs successfully with no errors
- Products appear correctly in the product list
- Bundles are configurable
- Subscriptions show correct billing frequencies
- Price books have entries for all new products
