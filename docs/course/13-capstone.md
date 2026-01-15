# Capstone Project: End-to-End CPQ Implementation

## Overview

Apply everything you've learned by building a complete CPQ configuration for a fictional company. This project tests your understanding of all CPQ concepts.

---

## The Scenario

You're configuring CPQ for **TechStart Solutions**, a B2B SaaS company that sells:
- A cloud platform with multiple modules
- Professional services (implementation, training)
- Hardware accessories for on-premise deployments
- Support and maintenance plans

---

## Requirements

### Part 1: Product Catalog (Module 02)

Create the following products:

**Standalone Products:**

| Name | SKU | Type | Billing | Taxable |
|------|-----|------|---------|---------|
| Platform Core | PLAT-CORE | STANDALONE | MONTHLY | Yes |
| CRM Module | MOD-CRM | STANDALONE | MONTHLY | Yes |
| HR Module | MOD-HR | STANDALONE | MONTHLY | Yes |
| Analytics Module | MOD-ANALYTICS | STANDALONE | MONTHLY | Yes |
| Implementation Services | SVC-IMPL | STANDALONE | ONE_TIME | No |
| Training (per day) | SVC-TRAIN | STANDALONE | ONE_TIME | No |
| Hardware Appliance | HW-APPLIANCE | STANDALONE | ONE_TIME | Yes |
| Appliance Rack Mount | HW-RACK | STANDALONE | ONE_TIME | Yes |
| Standard Support | SUPP-STD | STANDALONE | ANNUAL | No |
| Premium Support | SUPP-PREM | STANDALONE | ANNUAL | No |

**Bundle Products:**

| Name | SKU | Features |
|------|-----|----------|
| Starter Package | PKG-STARTER | Platform (required), 1 Module (required) |
| Professional Package | PKG-PRO | Platform (required), 2-3 Modules (required), Support (optional) |
| Enterprise Package | PKG-ENT | Platform (required), All Modules (optional), Support (required) |

---

### Part 2: Categories (Module 02)

Create this hierarchy:

```
All Products
├── Software
│   ├── Platform
│   └── Modules
├── Services
│   ├── Professional Services
│   └── Support Plans
└── Hardware
    └── Appliances
```

Assign products to appropriate categories.

---

### Part 3: Attributes (Module 03)

Create these attributes:

**Software Attributes:**
- "Max Users" (NUMBER, min: 10, max: 10000)
- "Deployment Type" (SELECT: Cloud, Hybrid, On-Premise)
- "Data Residency" (SELECT: US, EU, APAC)

**Hardware Attributes:**
- "Power Consumption (W)" (NUMBER)
- "Rack Units" (NUMBER)

**Services Attributes:**
- "Delivery Method" (SELECT: Remote, On-Site)

---

### Part 4: Price Books (Module 04)

Create three price books:

**1. Retail 2024 (Default)**

| Product | List Price | Cost |
|---------|------------|------|
| Platform Core | $500/mo | $100 |
| CRM Module | $200/mo | $40 |
| HR Module | $200/mo | $40 |
| Analytics Module | $300/mo | $60 |
| Implementation | $10,000 | $5,000 |
| Training | $2,000/day | $1,000 |
| Hardware Appliance | $15,000 | $8,000 |
| Rack Mount | $500 | $200 |
| Standard Support | $6,000/year | $1,000 |
| Premium Support | $12,000/year | $2,000 |

**2. Partner 2024 (20% off)**

Same products at 80% of Retail prices.

**3. Enterprise 2024**

Same products at 70% of Retail prices, plus:
- Volume tiers on modules:
  - 1-9 users: List price
  - 10-49 users: 10% off
  - 50+ users: 20% off

---

### Part 5: Customers & Contracts (Module 05)

Create these customers:

| Customer | Type | Price Book | Tax Exempt |
|----------|------|------------|------------|
| Acme Corp | Enterprise | Enterprise | No |
| Beta Consulting | Partner | Partner | No |
| State Hospital | Government | Retail | Yes |
| University of Tech | Education | Retail | Yes |

Create contract for Acme Corp:
- **Term:** 3 years
- **Blanket Discount:** 10%
- **Fixed Prices:**
  - Platform Core: $400/mo
  - Premium Support: $9,000/year

---

### Part 6: Discounts (Module 07)

Create these discounts:

| Name | Type | Scope | Value | Conditions |
|------|------|-------|-------|------------|
| New Customer | PERCENTAGE | QUOTE | 15% | First purchase |
| Annual Commitment | PERCENTAGE | LINE_ITEM | 10% | Annual billing |
| Bundle Bonus | PERCENTAGE | QUOTE | 5% | 3+ modules |
| Volume Services | PERCENTAGE | LINE_ITEM | 20% | Training 5+ days |

Configure stacking:
- "New Customer" - stackable: true, priority: 100
- "Annual Commitment" - stackable: true, priority: 50
- "Bundle Bonus" - stackable: false, priority: 75
- "Volume Services" - stackable: true, priority: 60

---

### Part 7: Rules (Module 08)

Create these business rules:

**Configuration Rules:**

1. "Platform Required"
   - Trigger: ON_PRODUCT_ADD
   - Condition: Any module added
   - Action: Require Platform Core

2. "Hardware Needs Support"
   - Trigger: ON_PRODUCT_ADD
   - Condition: Hardware Appliance added
   - Action: Warning - "Consider adding support plan"

**Pricing Rules:**

3. "Large Deal Approval"
   - Trigger: ON_QUOTE_SAVE
   - Condition: quote.total > 100000
   - Action: Require approval

4. "Margin Protection"
   - Trigger: ON_FINALIZE
   - Condition: margin < 25%
   - Action: Require approval

---

### Part 8: Tax Configuration (Module 09)

Create tax rates:

| Name | Country | State | Rate |
|------|---------|-------|------|
| CA Tax | US | CA | 8.25% |
| NY Tax | US | NY | 8.00% |
| TX Tax | US | TX | 6.25% |
| UK VAT | GB | - | 20.00% |
| Software (US) | US | - | 0.00% (category: Software) |

---

### Part 9: Currencies (Module 10)

Configure:
- USD (base)
- EUR (rate: 0.92)
- GBP (rate: 0.79)

Create "EMEA 2024" price book in EUR.

---

### Part 10: Guided Selling (Module 11)

Create affinities:
- Platform Core → All Modules (CROSS_SELL)
- Standard Support → Premium Support (UPSELL)
- Hardware Appliance → Rack Mount (ACCESSORY)
- Any Module → Training (SUBSCRIPTION_ADDON)

Create questionnaire "Find Your Solution":
1. Company size? (1-50, 51-200, 201+)
2. Primary needs? (CRM, HR, Analytics)
3. Deployment preference? (Cloud, On-Premise, Hybrid)
4. Implementation timeline? (Immediate, 1-3 months, 3+ months)

---

## Deliverables

### Deliverable 1: Configuration Documentation

Document all your configurations in a table format:
- Products created
- Price book entries
- Discounts configured
- Rules created

### Deliverable 2: Sample Quotes

Create three quotes demonstrating different scenarios:

**Quote 1: SMB Customer**
- Customer: New (no contract)
- Products: Starter Package with CRM
- Discounts: New Customer 15%
- Expected: Show base pricing with discount

**Quote 2: Enterprise Customer**
- Customer: Acme Corp (with contract)
- Products: Enterprise Package with all modules, Hardware, Premium Support
- Expected: Show contract pricing, approval trigger (>$100K)

**Quote 3: International Partner**
- Customer: European partner
- Currency: EUR
- Products: Professional Package
- Expected: Show EUR pricing, base amount in USD

### Deliverable 3: Integration Design

Document how you would integrate this CPQ with:
1. A CRM system (data flows, triggers)
2. A billing system (subscription handling)
3. An ERP system (order fulfillment)

---

## Evaluation Criteria

| Area | Points | Criteria |
|------|--------|----------|
| Product Catalog | 20 | All products created correctly |
| Pricing | 20 | Price books, tiers, contracts work |
| Discounts & Rules | 20 | Correct application and stacking |
| Tax & Currency | 15 | Proper calculations |
| Guided Selling | 10 | Recommendations working |
| Documentation | 15 | Clear, complete deliverables |

**Total: 100 points**

---

## Tips for Success

1. **Work incrementally** - Create products first, then pricing, then rules
2. **Test as you go** - Create test quotes after each configuration step
3. **Use the PoC UI** - All configurations can be done through the interface
4. **Verify calculations** - Manually calculate expected totals
5. **Document edge cases** - Note any unexpected behavior

---

## Completion Checklist

- [ ] 10+ standalone products created
- [ ] 3 bundle products configured
- [ ] Category hierarchy established
- [ ] 6+ attributes defined
- [ ] 3 price books with entries
- [ ] 2+ customers with contracts
- [ ] 4+ discounts with stacking rules
- [ ] 4+ business rules
- [ ] Tax rates configured
- [ ] Multi-currency enabled
- [ ] Product affinities created
- [ ] Questionnaire built
- [ ] 3 sample quotes completed
- [ ] Integration design documented

---

## Congratulations!

Completing this capstone project means you understand:
- CPQ data model architecture
- Product and pricing configuration
- Business rule implementation
- Tax and currency handling
- Guided selling setup
- Integration planning

You're now ready to apply these concepts to your real-world CPQ implementation!

---

## What's Next?

1. **Review the appendices** for quick reference
2. **Explore the source code** to understand implementation details
3. **Plan your integration** with app-site and other systems
4. **Extend the PoC** with your specific requirements

**Appendices:**
- [Data Models Reference](appendix-data-models.md)
- [CPQ Glossary](appendix-glossary.md)
