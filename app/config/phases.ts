/**
 * CPQ Release Phase Configuration
 *
 * This file defines the release phases for the CPQ POC and maps entities,
 * navigation items, and specs to their respective phases.
 *
 * Used to display phase badges throughout the UI and on the roadmap page.
 */

export interface Phase {
  number: number;
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  // Extended fields for roadmap visualization
  details?: string;
  goals?: string[];
  keyDeliverables?: string[];
  upcomingChanges?: string;
}

export interface EntityMapping {
  entity: string;
  phase: number;
  gaEntity?: string;
  relationship?: string;
  extensibilityNotes?: string;
}

export interface NavItemMapping {
  path: string;
  phase: number;
}

// Phase definitions with styling and detailed content
export const phases: Phase[] = [
  {
    number: 1,
    id: "mvp",
    name: "Core Quoting",
    description:
      "Minimum viable quoting - create products, set prices, build quotes",
    color: "text-emerald-700 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    borderColor: "border-emerald-300 dark:border-emerald-700",
    details:
      "The foundation of CPQ functionality. This phase establishes the core data models and workflows needed for basic quote generation. Products are created with simple pricing, organized into price books, and assembled into quotes for customers.",
    goals: [
      "Establish core entity relationships",
      "Enable basic quote creation workflow",
      "Define extensible data model patterns",
      "Create foundation for GA integration",
    ],
    keyDeliverables: [
      "Product and Category management",
      "Price Book with list pricing",
      "Quote builder with line items",
      "Customer association",
      "Currency support (base currency)",
    ],
  },
  {
    number: 2,
    id: "pricing",
    name: "Enhanced Pricing",
    description: "Pricing flexibility - tiers, bundles, discounts",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-300 dark:border-blue-700",
    details:
      "Advanced pricing capabilities that enable complex deal structures. This phase introduces tiered pricing models, product bundles with features and options, discount management, and unit of measure conversions.",
    goals: [
      "Support volume-based pricing strategies",
      "Enable product bundling",
      "Provide flexible discount mechanisms",
      "Handle unit conversions",
    ],
    keyDeliverables: [
      "Price tiers (volume, graduated, flat)",
      "Product bundles with features/options",
      "Discount rules (line, quote, category)",
      "Applied discount tracking",
      "Unit of measure with conversions",
    ],
  },
  {
    number: 3,
    id: "subscriptions",
    name: "Subscriptions & Contracts",
    description: "Recurring revenue and customer agreements",
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-300 dark:border-purple-700",
    details:
      "Recurring revenue management and contractual agreements. This phase handles subscription billing terms, contract-specific pricing, multi-currency support, and tax calculations. Integrates with GetAccept's document lifecycle.",
    goals: [
      "Support subscription-based products",
      "Enable contract pricing agreements",
      "Multi-currency quoting",
      "Tax calculation framework",
    ],
    keyDeliverables: [
      "Contract management with pricing overrides",
      "Contract price entries",
      "Tax rate configuration",
      "Exchange rate management",
      "GA Document integration for contracts",
    ],
    upcomingChanges:
      "GetAccept is evolving its Contract Management feature throughout 2025. The CPQ Contract entity will reference GA Documents, with CPQ owning pricing (MRR/ARR/TCV) while GA owns document lifecycle (signing, expiration, notifications).",
  },
  {
    number: 4,
    id: "configuration",
    name: "Product Configuration",
    description: "Attributes and rules engine",
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    borderColor: "border-orange-300 dark:border-orange-700",
    details:
      "Product configurability through attributes and business rules. This phase enables dynamic product customization, attribute inheritance from categories, and a rules engine for validation and automation.",
    goals: [
      "Enable product customization",
      "Support attribute inheritance",
      "Build flexible rules engine",
      "Integrate with GA ProductProperty",
    ],
    keyDeliverables: [
      "Attribute definitions (text, number, select, etc.)",
      "Attribute groups for organization",
      "Product-level attribute values",
      "Category-level attribute inheritance",
      "Rules engine for validation/automation",
    ],
  },
  {
    number: 5,
    id: "guided-selling",
    name: "Guided Selling",
    description: "Recommendations and optimization",
    color: "text-pink-700 dark:text-pink-400",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    borderColor: "border-pink-300 dark:border-pink-700",
    details:
      "Intelligence layer for sales optimization. This phase introduces guided selling questionnaires, product recommendations based on customer needs, cross-sell/upsell suggestions, and customizable quote templates.",
    goals: [
      "Guide users to optimal products",
      "Increase deal value through recommendations",
      "Enable A/B testing of selling flows",
      "Provide analytics for optimization",
    ],
    keyDeliverables: [
      "Questionnaire builder with branching",
      "Question-to-product mappings",
      "Product affinity rules (cross-sell, upsell)",
      "Recommendation logging for analytics",
      "Quote layout templates",
    ],
  },
];

// Entity to phase mappings with GA integration info
export const entityMappings: EntityMapping[] = [
  // Phase 1: Core Quoting (MVP)
  {
    entity: "Currency",
    phase: 1,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes:
      "Base currency only; multi-currency deferred to Phase 3",
  },
  {
    entity: "Category",
    phase: 1,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Hierarchical from start; GA has no equivalent",
  },
  {
    entity: "Product",
    phase: 1,
    gaEntity: "Product",
    relationship: "reference",
    extensibilityNotes: "STANDALONE only; type enum allows BUNDLE later",
  },
  {
    entity: "Customer",
    phase: 1,
    gaEntity: "Contacts/Companies",
    relationship: "reference",
    extensibilityNotes: "Minimal fields; metadata JSON for extension",
  },
  {
    entity: "PriceBook",
    phase: 1,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "No date validity yet; relation ready for tiers",
  },
  {
    entity: "PriceBookEntry",
    phase: 1,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "List price only; tier relation nullable",
  },
  {
    entity: "Quote",
    phase: 1,
    gaEntity: "PricingTable",
    relationship: "outputs-to",
    extensibilityNotes: "Status enum extensible; outputs to GA PricingTable",
  },
  {
    entity: "QuoteLineItem",
    phase: 1,
    gaEntity: "PricingTableRow",
    relationship: "outputs-to",
    extensibilityNotes: "parentLineId nullable for bundles",
  },

  // Phase 2: Enhanced Pricing
  {
    entity: "PriceTier",
    phase: 2,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes:
      "TierType enum: UNIT_PRICE, FLAT, GRADUATED, VOLUME_DISCOUNT",
  },
  {
    entity: "ProductFeature",
    phase: 2,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Bundle structure with min/max options",
  },
  {
    entity: "ProductOption",
    phase: 2,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Links to products; flexible quantities",
  },
  {
    entity: "Discount",
    phase: 2,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Scope enum: LINE_ITEM, QUOTE, CATEGORY",
  },
  {
    entity: "DiscountTier",
    phase: 2,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Tiered discount values",
  },
  {
    entity: "AppliedDiscount",
    phase: 2,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Tracks source, reason, appliedBy",
  },
  {
    entity: "UnitOfMeasure",
    phase: 2,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Conversion factor chain",
  },

  // Phase 3: Subscriptions & Contracts
  {
    entity: "Contract",
    phase: 3,
    gaEntity: "Document (signed)",
    relationship: "reference",
    extensibilityNotes:
      "Reference via documentId; CPQ owns pricing, GA owns lifecycle",
  },
  {
    entity: "ContractPriceEntry",
    phase: 3,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Negotiated price overrides per product",
  },
  {
    entity: "TaxRate",
    phase: 3,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Region-based; may integrate external tax service",
  },
  {
    entity: "TaxProfile",
    phase: 3,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Groups tax rates for price book fallback; used when customer address incomplete",
  },
  {
    entity: "ExchangeRate",
    phase: 3,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Time-series rates with effective dates",
  },

  // Phase 4: Product Configuration
  {
    entity: "Attribute",
    phase: 4,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Type enum: TEXT, NUMBER, BOOLEAN, SELECT, DATE",
  },
  {
    entity: "AttributeGroup",
    phase: 4,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Logical grouping with sort order",
  },
  {
    entity: "ProductAttribute",
    phase: 4,
    gaEntity: "ProductPropertyFields",
    relationship: "maps-to",
    extensibilityNotes: "JSON value for type flexibility",
  },
  {
    entity: "CategoryAttribute",
    phase: 4,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Inheritance from category to products",
  },
  {
    entity: "Rule",
    phase: 4,
    gaEntity: "Conditional Effect Service",
    relationship: "different-purpose",
    extensibilityNotes: "CPQ Rules for quotes; GA for documents",
  },

  // Phase 5: Guided Selling & Intelligence
  {
    entity: "Questionnaire",
    phase: 5,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Versioning for A/B testing",
  },
  {
    entity: "Question",
    phase: 5,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Type enum; branchLogic in JSON",
  },
  {
    entity: "QuestionProductMapping",
    phase: 5,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Score-based recommendations",
  },
  {
    entity: "ProductAffinity",
    phase: 5,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "AffinityType: CROSS_SELL, UPSELL, ACCESSORY, etc.",
  },
  {
    entity: "RecommendationLog",
    phase: 5,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "Analytics and ML training data",
  },
  {
    entity: "QuoteLayout",
    phase: 5,
    gaEntity: undefined,
    relationship: "new",
    extensibilityNotes: "JSON-based template for quote documents",
  },
];

// Navigation item to phase mappings
export const navMappings: NavItemMapping[] = [
  // Phase 1
  { path: "/products", phase: 1 },
  { path: "/categories", phase: 1 },
  { path: "/customers", phase: 1 },
  { path: "/price-books", phase: 1 },
  { path: "/quotes", phase: 1 },
  { path: "/currencies", phase: 1 },

  // Phase 2
  { path: "/discounts", phase: 2 },
  { path: "/units", phase: 2 },

  // Phase 3
  { path: "/contracts", phase: 3 },
  { path: "/tax-rates", phase: 3 },
  { path: "/tax-profiles", phase: 3 },

  // Phase 4
  { path: "/attributes", phase: 4 },
  { path: "/rules", phase: 4 },

  // Phase 5
  { path: "/questionnaires", phase: 5 },
  { path: "/affinities", phase: 5 },
  { path: "/quote-layouts", phase: 5 },
];

// Helper functions
export function getPhase(phaseNumber: number): Phase | undefined {
  return phases.find((p) => p.number === phaseNumber);
}

export function getPhaseByEntity(entityName: string): Phase | undefined {
  const mapping = entityMappings.find(
    (m) => m.entity.toLowerCase() === entityName.toLowerCase(),
  );
  if (!mapping) return undefined;
  return getPhase(mapping.phase);
}

export function getPhaseByPath(path: string): Phase | undefined {
  // Normalize path - remove trailing slash and get base path
  const basePath = "/" + path.split("/").filter(Boolean)[0];
  const mapping = navMappings.find((m) => m.path === basePath);
  if (!mapping) return undefined;
  return getPhase(mapping.phase);
}

export function getEntityMapping(
  entityName: string,
): EntityMapping | undefined {
  return entityMappings.find(
    (m) => m.entity.toLowerCase() === entityName.toLowerCase(),
  );
}

export function getEntitiesForPhase(phaseNumber: number): EntityMapping[] {
  return entityMappings.filter((m) => m.phase === phaseNumber);
}

export function getNavItemsForPhase(phaseNumber: number): NavItemMapping[] {
  return navMappings.filter((m) => m.phase === phaseNumber);
}

// GA Entity mapping summary for roadmap display
export const gaEntityMappings = [
  {
    cpqEntity: "Product",
    gaEntity: "Product",
    relationship: "Reference or extend",
    phase: 1,
  },
  {
    cpqEntity: "ProductAttribute",
    gaEntity: "ProductProperty + ProductPropertyFields",
    relationship: "Maps well - similar concept",
    phase: 4,
  },
  {
    cpqEntity: "Quote",
    gaEntity: "(none)",
    relationship: "CPQ Quote is upstream; outputs to PricingTable",
    phase: 1,
  },
  {
    cpqEntity: "QuoteLineItem",
    gaEntity: "PricingTableRow",
    relationship: "Line items become rows in document",
    phase: 1,
  },
  {
    cpqEntity: "Contract",
    gaEntity: "Document (signed)",
    relationship:
      "Reference via documentId; CPQ owns pricing, GA owns lifecycle",
    phase: 3,
  },
  {
    cpqEntity: "Subscription",
    gaEntity: "(new)",
    relationship: "GA Subscription is for Chargebee billing, not product subs",
    phase: 3,
  },
  {
    cpqEntity: "Customer",
    gaEntity: "Contacts/Companies",
    relationship: "May reference existing CRM",
    phase: 1,
  },
  {
    cpqEntity: "Rule",
    gaEntity: "Conditional Effect Service",
    relationship: "Different purpose but similar structure",
    phase: 4,
  },
];

// Integration strategy options for roadmap display
export const integrationStrategies = [
  {
    id: "extend",
    name: "Option A: Extend Existing GA Entities",
    description:
      "Add CPQ fields directly to GA Products, ProductProperties, etc.",
    pros: ["Single source of truth", "No sync needed", "Simpler queries"],
    cons: [
      "Tight coupling to GA schema",
      "Migration complexity",
      "May bloat existing models",
      "Breaking changes affect GA",
    ],
  },
  {
    id: "reference",
    name: "Option B: New CPQ Entities with References",
    description:
      "CPQ has own models that reference GA entities via foreign key.",
    pros: [
      "Clean separation",
      "CPQ can evolve independently",
      "No risk to existing GA",
      "Easier to test in isolation",
    ],
    cons: ["Data duplication risk", "Sync complexity", "More complex queries"],
  },
  {
    id: "hybrid",
    name: "Option C: Hybrid Approach",
    description:
      "Reference GA entities (Product, Customer), new CPQ entities (Quote, PriceBook, Discount, Rule), extend carefully (ProductProperty).",
    pros: [
      "Balanced coupling",
      "Leverages existing data",
      "CPQ-specific features are isolated",
    ],
    cons: ["Complexity in deciding boundaries", "Some sync still needed"],
    recommended: true,
  },
];

// Extensibility patterns for documentation
export const extensibilityPatterns = [
  {
    name: "Multi-tenancy via entityId",
    description: "All entities include entityId for tenant isolation",
    example: `model Product {
  entityId String  // GetAccept entity ID
  // ...
}`,
  },
  {
    name: "Enum-based typing",
    description: "Use enums for extensible categorization",
    example: `enum ProductType { STANDALONE, BUNDLE }  // Future: SERVICE, SUBSCRIPTION_ADDON
enum DiscountScope { LINE_ITEM, QUOTE, PRODUCT_CATEGORY }  // Future: CUSTOMER_SEGMENT`,
  },
  {
    name: "JSON metadata fields",
    description:
      "Include metadata Json? on key entities for custom data without migrations",
    example: `model Quote {
  metadata Json?  // Custom fields per entity/use case
}
model Rule {
  condition Json  // Flexible rule logic
  action Json
}`,
  },
  {
    name: "Nullable foreign keys",
    description: "Design schemas with optional relations for future features",
    example: `model QuoteLineItem {
  parentLineId String?  // Ready for bundles in Phase 2
}
model Product {
  unitOfMeasureId String?  // Ready for UoM in Phase 2
}`,
  },
  {
    name: "Interface-based services",
    description: "Pricing, tax, and discount calculations use interfaces",
    example: `interface PricingStrategy {
  calculate(entry: PriceBookEntry, quantity: number): Decimal
}
// Implementations: UnitPriceStrategy, FlatPriceStrategy, GraduatedStrategy`,
  },
  {
    name: "Event hooks for integration",
    description: "Key operations emit events for future GA integration",
    example: `// Quote status changes → trigger document generation
// Quote finalized → output to PricingTable
// Contract created → sync to GA Contract Management`,
  },
];

// Mermaid diagram definitions for visualization
export const mermaidDiagrams = {
  // Data model ER diagrams per phase
  dataModel: {
    1: `erDiagram
    Product ||--o{ PriceBookEntry : "has prices"
    PriceBook ||--o{ PriceBookEntry : contains
    Category ||--o{ Product : contains
    Customer ||--o{ Quote : places
    Quote ||--o{ QuoteLineItem : contains
    QuoteLineItem }o--|| Product : references
    Quote }o--|| PriceBook : "uses pricing from"
    Quote }o--|| Customer : "belongs to"
    Currency ||--o{ PriceBook : "denominated in"`,
    2: `erDiagram
    PriceBookEntry ||--o{ PriceTier : "has tiers"
    Product ||--o{ ProductFeature : "has features"
    ProductFeature ||--o{ ProductOption : "has options"
    ProductOption }o--|| Product : "links to"
    Discount ||--o{ DiscountTier : "has tiers"
    Quote ||--o{ AppliedDiscount : "has discounts"
    QuoteLineItem ||--o{ AppliedDiscount : "has discounts"
    UnitOfMeasure ||--o{ Product : "measured in"`,
    3: `erDiagram
    Contract ||--o{ ContractPriceEntry : "has pricing"
    Contract }o--|| Customer : "with"
    ContractPriceEntry }o--|| Product : "for"
    Quote }o--o| Contract : "under"
    TaxRate ||--o{ QuoteLineItem : "applied to"
    ExchangeRate ||--o{ Quote : "converted via"`,
    4: `erDiagram
    Attribute ||--o{ ProductAttribute : "values"
    AttributeGroup ||--o{ Attribute : contains
    Product ||--o{ ProductAttribute : "has"
    Category ||--o{ CategoryAttribute : "has"
    CategoryAttribute }o--|| Attribute : "defines"
    Rule ||--o{ Product : "applies to"`,
    5: `erDiagram
    Questionnaire ||--o{ Question : contains
    Question ||--o{ QuestionProductMapping : "maps to"
    QuestionProductMapping }o--|| Product : recommends
    Product ||--o{ ProductAffinity : "has affinities"
    ProductAffinity }o--|| Product : "related to"
    QuoteLayout ||--o{ Quote : "formats"
    RecommendationLog }o--|| Quote : "tracks"`,
    all: `erDiagram
    Product ||--o{ PriceBookEntry : "prices"
    Product ||--o{ QuoteLineItem : "in quotes"
    Product ||--o{ ProductFeature : "bundles"
    Product ||--o{ ProductAttribute : "attributes"
    Quote ||--o{ QuoteLineItem : "lines"
    Quote }o--|| Customer : "for"
    Contract ||--o{ ContractPriceEntry : "pricing"
    Rule ||--o{ Product : "validates"`,
  },

  // Domain flow diagrams per phase
  domainFlow: {
    1: `flowchart LR
    A[Product Catalog] --> B[Price Books]
    B --> C[Quote Creation]
    C --> D[Add Line Items]
    D --> E[Calculate Totals]
    E --> F[Review & Finalize]`,
    2: `flowchart LR
    A[Configure Bundle] --> B[Select Options]
    B --> C[Apply Tier Pricing]
    C --> D[Add Discounts]
    D --> E[Calculate Net Price]`,
    3: `flowchart LR
    A[Create Contract] --> B[Set Pricing Terms]
    B --> C[Generate Quote]
    C --> D[Apply Tax]
    D --> E[Convert Currency]
    E --> F[Link to GA Document]`,
    4: `flowchart LR
    A[Define Attributes] --> B[Set Product Values]
    B --> C[Apply Rules]
    C --> D[Validate Config]
    D --> E[Generate Price]`,
    5: `flowchart LR
    A[Start Questionnaire] --> B[Answer Questions]
    B --> C[Score Products]
    C --> D[Show Recommendations]
    D --> E[Add to Quote]
    E --> F[Apply Layout]`,
  },

  // GA integration diagram (global)
  gaIntegration: `flowchart TB
    subgraph CPQ["CPQ System"]
        Product_CPQ[Product]
        Quote[Quote]
        QuoteLineItem[QuoteLineItem]
        Contract_CPQ[Contract]
        ProductAttribute[ProductAttribute]
    end
    subgraph GA["GetAccept"]
        Product_GA[GA Product]
        PricingTable[PricingTable]
        PricingTableRow[PricingTableRow]
        Document[Document]
        ProductProperty[ProductProperty]
    end
    Product_CPQ -.->|references| Product_GA
    Quote -->|outputs to| PricingTable
    QuoteLineItem -->|becomes| PricingTableRow
    Contract_CPQ -.->|references| Document
    ProductAttribute -.->|maps to| ProductProperty`,
};

// Entity extension example for strategy visualization
export interface EntityExtensionExample {
  gaEntity: string;
  description: string;
  currentSchema: string;
  extendedSchema: string;
  implications: string[];
}

// Strategy-specific content for interactive filtering
export interface StrategyContent {
  id: "extend" | "reference" | "hybrid";
  extensibilityPatterns: typeof extensibilityPatterns;
  decisions: { phase: number; question: string; options: string[] }[];
  entityNotes: Record<string, string>;
  entityExtensions: EntityExtensionExample[];
  implications: {
    positive: string[];
    negative: string[];
    considerations: string[];
  };
}

export const strategyContent: Record<string, StrategyContent> = {
  extend: {
    id: "extend",
    extensibilityPatterns: [
      {
        name: "Direct schema extension",
        description:
          "Add CPQ fields directly to existing GA tables via Prisma migrations",
        example: `// Extend GA Product table
model Product {
  // Existing GA fields...
  cpqCategory   String?    // CPQ extension
  cpqBundleType String?    // CPQ extension
}`,
      },
      {
        name: "Shared enums",
        description: "Use GA enum types where possible, extend with CPQ values",
        example: `// Add to existing GA ProductType enum
enum ProductType {
  PHYSICAL   // GA
  DIGITAL    // GA
  BUNDLE     // CPQ extension
  SERVICE    // CPQ extension
}`,
      },
    ],
    decisions: [
      {
        phase: 1,
        question: "Which GA tables need CPQ field additions?",
        options: [
          "Product (add category, bundle fields)",
          "ProductProperty (add CPQ-specific types)",
          "All pricing-related tables",
        ],
      },
      {
        phase: 3,
        question: "How to extend Document for contract pricing?",
        options: [
          "Add pricing fields to Document",
          "Create ContractPricing view",
          "Use Document metadata JSON",
        ],
      },
    ],
    entityNotes: {
      Product: "Add CPQ fields directly to GA Product table",
      Quote: "New table, but references GA Product directly",
      Contract: "Extend GA Document with pricing fields",
      ProductAttribute: "Extend GA ProductProperty with new types",
    },
    entityExtensions: [
      {
        gaEntity: "Product",
        description:
          "Extend GA Product with CPQ-specific fields for bundling and categorization",
        currentSchema: `model Product {
  id          String   @id
  entityId    String
  name        String
  description String?
  sku         String?
  isActive    Boolean  @default(true)
  // ... other GA fields
}`,
        extendedSchema: `model Product {
  id          String   @id
  entityId    String
  name        String
  description String?
  sku         String?
  isActive    Boolean  @default(true)
  // ... other GA fields

  // CPQ Extensions
  cpqType         ProductType?  // STANDALONE, BUNDLE, SERVICE
  cpqCategoryId   String?
  cpqCategory     Category?     @relation(fields: [cpqCategoryId])
  cpqUnitOfMeasureId String?
  cpqIsQuotable   Boolean       @default(true)
  cpqMetadata     Json?         // Flexible extension point
}`,
        implications: [
          "GA Product table grows with CPQ fields - may affect GA queries",
          "Single source of truth - no sync needed",
          "CPQ migrations affect GA schema directly",
          "Rollback requires careful field removal",
        ],
      },
      {
        gaEntity: "ProductProperty",
        description:
          "Extend GA ProductProperty to support CPQ attribute types and validation",
        currentSchema: `model ProductProperty {
  id        String  @id
  entityId  String
  productId String
  name      String
  value     String?
  type      String  // text, number, etc.
}`,
        extendedSchema: `model ProductProperty {
  id        String  @id
  entityId  String
  productId String
  name      String
  value     String?
  type      String

  // CPQ Extensions
  cpqAttributeId    String?
  cpqAttribute      Attribute?  @relation(fields: [cpqAttributeId])
  cpqIsRequired     Boolean     @default(false)
  cpqValidation     Json?       // min/max, regex, etc.
  cpqDisplayOrder   Int?
  cpqGroupId        String?
}`,
        implications: [
          "ProductProperty becomes dual-purpose (GA + CPQ)",
          "GA forms may show CPQ fields unless filtered",
          "Attribute inheritance from categories needs custom logic",
          "Type system shared between GA and CPQ",
        ],
      },
      {
        gaEntity: "Document",
        description:
          "Extend GA Document with contract pricing and subscription fields",
        currentSchema: `model Document {
  id            String    @id
  entityId      String
  name          String
  status        String
  signedAt      DateTime?
  expiresAt     DateTime?
  value         Decimal?
  // ... other GA fields
}`,
        extendedSchema: `model Document {
  id            String    @id
  entityId      String
  name          String
  status        String
  signedAt      DateTime?
  expiresAt     DateTime?
  value         Decimal?
  // ... other GA fields

  // CPQ Contract Extensions
  cpqContractType   ContractType?  // STANDARD, SUBSCRIPTION, FRAMEWORK
  cpqMrr            Decimal?       // Monthly recurring revenue
  cpqArr            Decimal?       // Annual recurring revenue
  cpqTcv            Decimal?       // Total contract value
  cpqBillingCycle   String?        // MONTHLY, QUARTERLY, ANNUAL
  cpqRenewalType    String?        // AUTO, MANUAL, NONE
  cpqPriceEntries   ContractPriceEntry[]
}`,
        implications: [
          "Document becomes contract-aware",
          "GA Document list shows CPQ pricing columns",
          "Contract lifecycle split: GA owns signing, CPQ owns pricing",
          "Reporting queries span both GA and CPQ concerns",
        ],
      },
    ],
    implications: {
      positive: [
        "Single source of truth for all product/customer data",
        "No synchronization complexity or drift",
        "Simpler queries - no joins across systems",
        "GA features (search, export) work with CPQ data automatically",
      ],
      negative: [
        "Tight coupling - CPQ changes may break GA",
        "Schema migrations are higher risk",
        "GA codebase must handle CPQ nullability",
        "Harder to remove CPQ if needed",
      ],
      considerations: [
        "Requires coordination with GA team for all schema changes",
        "Need nullable fields for gradual rollout",
        "Consider database views for separation of concerns",
        "Document clear ownership boundaries per field",
      ],
    },
  },
  reference: {
    id: "reference",
    extensibilityPatterns: [
      {
        name: "Foreign key references",
        description: "CPQ entities hold references to GA entities via ID",
        example: `model CpqProduct {
  id            String @id
  gaProductId   String  // Reference to GA
  // CPQ-specific fields
  bundleType    String?
  category      String?
}`,
      },
      {
        name: "Sync service pattern",
        description: "Background service keeps CPQ data in sync with GA",
        example: `// Sync service
async function syncProduct(gaProductId: string) {
  const gaProduct = await ga.getProduct(gaProductId)
  await cpq.upsertProduct({
    gaProductId,
    name: gaProduct.name,
    // Map other fields
  })
}`,
      },
    ],
    decisions: [
      {
        phase: 1,
        question: "How to handle GA Product updates?",
        options: [
          "Real-time webhooks",
          "Periodic sync jobs",
          "On-demand refresh",
        ],
      },
      {
        phase: 3,
        question: "Contract-Document relationship?",
        options: [
          "CPQ Contract references Document ID",
          "Bidirectional references",
          "Event-based linking",
        ],
      },
    ],
    entityNotes: {
      Product: "CpqProduct table with gaProductId foreign key, sync on changes",
      Quote: "Fully isolated CPQ entity, references CpqProduct",
      Contract: "CPQ Contract with documentId reference, no GA schema changes",
      ProductAttribute: "CpqAttribute table, maps to ProductProperty on sync",
    },
    entityExtensions: [
      {
        gaEntity: "Product (Referenced)",
        description:
          "GA Product unchanged - CPQ creates separate CpqProduct that references it",
        currentSchema: `// GA Product - UNCHANGED
model Product {
  id          String   @id
  entityId    String
  name        String
  description String?
  sku         String?
  isActive    Boolean
}`,
        extendedSchema: `// GA Product - UNCHANGED
model Product {
  id          String   @id
  entityId    String
  name        String
  description String?
  sku         String?
  isActive    Boolean
}

// NEW: CPQ Product (separate table)
model CpqProduct {
  id              String   @id @default(cuid())
  entityId        String
  gaProductId     String   // Reference to GA

  // CPQ-specific fields
  type            ProductType  @default(STANDALONE)
  categoryId      String?
  category        CpqCategory? @relation(fields: [categoryId])
  unitOfMeasureId String?
  isQuotable      Boolean      @default(true)
  metadata        Json?

  // Cached GA fields (for performance)
  cachedName      String
  cachedSku       String?
  lastSyncAt      DateTime     @default(now())
}`,
        implications: [
          "GA schema completely untouched - zero risk to GA",
          "Data duplication for cached fields",
          "Sync service required to keep CpqProduct updated",
          "Queries need joins or denormalization",
        ],
      },
      {
        gaEntity: "Document (Referenced)",
        description:
          "GA Document unchanged - CPQ Contract references via documentId",
        currentSchema: `// GA Document - UNCHANGED
model Document {
  id            String    @id
  entityId      String
  name          String
  status        String
  signedAt      DateTime?
  expiresAt     DateTime?
  value         Decimal?
}`,
        extendedSchema: `// GA Document - UNCHANGED
model Document {
  id            String    @id
  entityId      String
  name          String
  status        String
  signedAt      DateTime?
  expiresAt     DateTime?
  value         Decimal?
}

// NEW: CPQ Contract (separate table)
model CpqContract {
  id              String    @id @default(cuid())
  entityId        String
  gaDocumentId    String?   // Reference to GA Document

  // CPQ owns all pricing
  name            String
  customerId      String
  type            ContractType  @default(STANDARD)
  status          ContractStatus
  mrr             Decimal?
  arr             Decimal?
  tcv             Decimal?
  billingCycle    BillingCycle?
  renewalType     RenewalType   @default(MANUAL)

  startDate       DateTime
  endDate         DateTime?

  priceEntries    CpqContractPriceEntry[]
}`,
        implications: [
          "Complete separation of concerns",
          "CPQ Contract can exist before GA Document is signed",
          "Need event-based linking when document is signed",
          "Two sources for contract data - clear ownership needed",
        ],
      },
      {
        gaEntity: "ProductProperty (Referenced)",
        description:
          "GA ProductProperty unchanged - CPQ creates parallel attribute system",
        currentSchema: `// GA ProductProperty - UNCHANGED
model ProductProperty {
  id        String  @id
  entityId  String
  productId String
  name      String
  value     String?
  type      String
}`,
        extendedSchema: `// GA ProductProperty - UNCHANGED
model ProductProperty {
  id        String  @id
  entityId  String
  productId String
  name      String
  value     String?
  type      String
}

// NEW: CPQ Attribute system
model CpqAttribute {
  id            String   @id @default(cuid())
  entityId      String
  name          String
  type          AttributeType
  isRequired    Boolean  @default(false)
  validation    Json?
  defaultValue  String?
  options       Json?    // For SELECT type

  groupId       String?
  group         CpqAttributeGroup? @relation(fields: [groupId])

  // Optional mapping to GA
  gaPropertyName String?  // Maps to ProductProperty.name
}

model CpqProductAttribute {
  id            String   @id @default(cuid())
  productId     String   // CpqProduct.id
  attributeId   String
  attribute     CpqAttribute @relation(fields: [attributeId])
  value         Json
}`,
        implications: [
          "Full control over attribute schema and behavior",
          "Can implement inheritance, validation, grouping freely",
          "Sync to GA ProductProperty is optional/one-way",
          "Two attribute systems to maintain",
        ],
      },
    ],
    implications: {
      positive: [
        "Zero risk to GA - CPQ is fully isolated",
        "Independent release cycles",
        "Easy to test CPQ in isolation",
        "Can remove CPQ without affecting GA",
        "Full control over CPQ schema design",
      ],
      negative: [
        "Data duplication and potential drift",
        "Sync services add complexity and failure points",
        "More complex queries spanning both systems",
        "Higher storage costs for duplicated data",
      ],
      considerations: [
        "Define clear sync triggers (webhook, polling, on-demand)",
        "Handle sync failures gracefully",
        "Consider eventual consistency implications",
        "Document which system is source of truth per field",
      ],
    },
  },
  hybrid: {
    id: "hybrid",
    extensibilityPatterns: [
      {
        name: "Reference core, extend properties",
        description:
          "Reference GA Product/Customer, extend ProductProperty, new CPQ tables for the rest",
        example: `// Reference GA Product
model Quote {
  gaProductId String  // Direct reference
}
// Extend ProductProperty
model ProductProperty {
  cpqAttributeType String?  // Extension
}
// New CPQ table
model PriceBook {
  // Fully CPQ-owned
}`,
      },
      {
        name: "Selective sync",
        description: "Only sync what's needed, keep CPQ-specific data isolated",
        example: `// Cache GA data needed for quotes
model GaProductCache {
  gaProductId String @id
  name        String
  lastSync    DateTime
}
// CPQ-specific pricing is separate
model PriceBookEntry {
  productId String  // References cache
  price     Decimal
}`,
      },
    ],
    decisions: [
      {
        phase: 1,
        question: "Which entities to reference vs. create new?",
        options: [
          "Reference: Product, Customer. New: Quote, PriceBook",
          "Reference: Product only. New: everything else",
          "Reference: Product, Customer, Document. New: Quote, Contract pricing",
        ],
      },
      {
        phase: 4,
        question: "Attribute handling approach?",
        options: [
          "Extend ProductProperty with CPQ types",
          "CpqAttribute that maps to ProductProperty",
          "Fully separate attribute system",
        ],
      },
    ],
    entityNotes: {
      Product: "Reference GA Product via gaProductId, cache key fields",
      Quote: "New CPQ entity, fully owned, outputs to GA PricingTable",
      Contract: "New CPQ entity, references GA Document ID for lifecycle",
      ProductAttribute: "Extend GA ProductProperty with CPQ attribute types",
      Customer: "Reference GA Contact/Company via gaCustomerId",
    },
    entityExtensions: [
      {
        gaEntity: "Product (Referenced + Cached)",
        description:
          "Reference GA Product, cache essential fields, add CPQ-only tables for pricing",
        currentSchema: `// GA Product - UNCHANGED
model Product {
  id          String   @id
  entityId    String
  name        String
  description String?
  sku         String?
  isActive    Boolean
}`,
        extendedSchema: `// GA Product - UNCHANGED
model Product {
  id          String   @id
  entityId    String
  name        String
  description String?
  sku         String?
  isActive    Boolean
}

// NEW: Lightweight cache for CPQ queries
model GaProductCache {
  gaProductId   String   @id
  entityId      String
  name          String
  sku           String?
  isActive      Boolean
  lastSyncAt    DateTime @default(now())
}

// NEW: CPQ-specific pricing (fully owned)
model PriceBookEntry {
  id            String   @id @default(cuid())
  priceBookId   String
  gaProductId   String   // References GA Product
  listPrice     Decimal
  // ... CPQ pricing logic
}`,
        implications: [
          "Minimal data duplication (only cached fields)",
          "GA Product is source of truth for core data",
          "CPQ owns all pricing without touching GA",
          "Lightweight sync for cache updates",
        ],
      },
      {
        gaEntity: "ProductProperty (Extended)",
        description:
          "Extend GA ProductProperty with CPQ attribute capabilities",
        currentSchema: `// GA ProductProperty
model ProductProperty {
  id        String  @id
  entityId  String
  productId String
  name      String
  value     String?
  type      String
}`,
        extendedSchema: `// GA ProductProperty - EXTENDED
model ProductProperty {
  id        String  @id
  entityId  String
  productId String
  name      String
  value     String?
  type      String

  // CPQ Attribute Extensions
  cpqAttributeId    String?
  cpqAttribute      CpqAttribute? @relation(fields: [cpqAttributeId])
  cpqIsRequired     Boolean       @default(false)
  cpqValidation     Json?
  cpqInheritedFrom  String?       // Category inheritance tracking
}

// NEW: CPQ Attribute definitions (separate)
model CpqAttribute {
  id            String   @id @default(cuid())
  entityId      String
  name          String
  type          AttributeType
  groupId       String?
  validation    Json?
  options       Json?

  // Links to GA properties
  productProperties ProductProperty[]
}`,
        implications: [
          "GA ProductProperty gains CPQ capabilities",
          "Attribute definitions owned by CPQ",
          "Values stored in GA, metadata in CPQ",
          "Inheritance logic lives in CPQ layer",
        ],
      },
      {
        gaEntity: "Document + Contract (Split)",
        description: "GA Document for lifecycle, new CPQ Contract for pricing",
        currentSchema: `// GA Document
model Document {
  id            String    @id
  entityId      String
  name          String
  status        String
  signedAt      DateTime?
  expiresAt     DateTime?
  value         Decimal?
}`,
        extendedSchema: `// GA Document - UNCHANGED
model Document {
  id            String    @id
  entityId      String
  name          String
  status        String
  signedAt      DateTime?
  expiresAt     DateTime?
  value         Decimal?  // May be synced from CPQ
}

// NEW: CPQ Contract (references Document)
model CpqContract {
  id              String    @id @default(cuid())
  entityId        String
  gaDocumentId    String?   // Link after signing
  customerId      String

  // CPQ owns pricing
  mrr             Decimal?
  arr             Decimal?
  tcv             Decimal?
  billingCycle    BillingCycle?

  // Lifecycle events sync
  status          ContractStatus
  startDate       DateTime
  endDate         DateTime?
}

// Sync: CPQ tcv → GA Document.value
// Sync: GA Document.signedAt → CpqContract.status`,
        implications: [
          "Clear ownership: GA=lifecycle, CPQ=pricing",
          "Bidirectional sync for key fields only",
          "Contract can be created before document",
          "Single Document.value synced from CPQ tcv",
        ],
      },
      {
        gaEntity: "Customer (Referenced)",
        description:
          "Reference GA Contact/Company directly without duplication",
        currentSchema: `// GA Contact/Company
model Contact {
  id        String  @id
  entityId  String
  name      String
  email     String?
  companyId String?
}`,
        extendedSchema: `// GA Contact/Company - UNCHANGED
model Contact {
  id        String  @id
  entityId  String
  name      String
  email     String?
  companyId String?
}

// CPQ Quote references GA directly
model Quote {
  id              String   @id @default(cuid())
  entityId        String
  gaCustomerId    String   // Direct reference to GA Contact/Company
  priceBookId     String
  status          QuoteStatus
  // ... no customer cache needed
}`,
        implications: [
          "No customer data duplication",
          "Always uses latest GA customer data",
          "Requires GA API call or join for customer details",
          "Simple approach for read-heavy use cases",
        ],
      },
    ],
    implications: {
      positive: [
        "Balanced approach - extend where beneficial, isolate where needed",
        "Minimal duplication while maintaining flexibility",
        "Clear ownership boundaries per entity",
        "Leverages GA for stable entities (Customer, Document lifecycle)",
        "Full control over CPQ-specific domains (Pricing, Quotes)",
      ],
      negative: [
        "More complex to reason about - different patterns per entity",
        "Some sync still required for cached/extended data",
        "Team needs to understand which pattern applies where",
        "Schema changes require case-by-case analysis",
      ],
      considerations: [
        "Document the pattern choice for each entity clearly",
        "Use consistent naming: cpq* prefix for extensions",
        "Create helper functions to abstract the complexity",
        "Consider a decision matrix: stable vs volatile entities",
        "Review boundaries quarterly as requirements evolve",
      ],
    },
  },
};

// Decisions grouped by phase for default display
export const decisionsByPhase = [
  {
    phase: 1,
    title: "Phase 1 Decisions",
    decisions: [
      "How does CPQ Product relate to GA Product? (Reference, Copy/sync, Extend)",
      "How does Quote output to PricingTable? (Auto-generate, Manual export, Live sync)",
      "Where does CPQ live? (New package, Extend cpq-service, Separate repo)",
    ],
  },
  {
    phase: 3,
    title: "Phase 3 Decisions",
    decisions: [
      "How does CPQ Contract relate to GA Document?",
      "Who owns contract pricing? (CPQ, GA, Both)",
      "When does GA Document get created?",
      "How to handle renewals?",
    ],
  },
  {
    phase: 4,
    title: "Phase 4 Decisions",
    decisions: [
      "Does CPQ Attribute replace or extend GA ProductProperty?",
      "How do calculated fields work? (GA expression, CPQ rules, Both)",
    ],
  },
];
